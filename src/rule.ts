import type { SyncRule } from '@commitlint/types';

import { defaultAgents } from './agents.ts';
import { type ParsedTrailer, parseCoauthorTrailers } from './parse-trailers.ts';
import type {
  AgentCoauthorOptions,
  AgentDefinition,
  CoAuthor,
  MatchStrategy,
} from './types.ts';

const DEFAULT_TRAILER = 'Co-authored-by';

function isActive(
  agent: AgentDefinition,
  env: Record<string, string | undefined>,
): boolean {
  if (typeof agent.detect === 'function') return Boolean(agent.detect(env));
  return (agent.env ?? []).some((key) => {
    const value = env[key];
    return typeof value === 'string' ? value.trim().length > 0 : value != null;
  });
}

function identityMatches(
  coAuthor: CoAuthor,
  trailer: ParsedTrailer,
  strategy: MatchStrategy,
): boolean {
  const emailEq = Boolean(
    coAuthor.email &&
      trailer.email &&
      coAuthor.email.toLowerCase() === trailer.email.toLowerCase(),
  );
  const nameEq = Boolean(
    coAuthor.name &&
      trailer.name?.toLowerCase().includes(coAuthor.name.toLowerCase()),
  );
  switch (strategy) {
    case 'name':
      return nameEq;
    case 'either':
      return emailEq || nameEq;
    case 'both':
      return emailEq && nameEq;
    default:
      // 'email' — the default strategy
      return emailEq;
  }
}

function formatIdentity(coAuthor: CoAuthor): string {
  return coAuthor.email
    ? `${coAuthor.name} <${coAuthor.email}>`
    : coAuthor.name;
}

/**
 * commitlint rule: when an AI agent is detected via environment variables, the
 * commit message must credit that agent with a co-author trailer.
 *
 * - `always` (default): every active agent must be credited.
 * - `never`: no active agent may be credited.
 *
 * Returns `[true]` when no agent is active, so the rule is a no-op for humans.
 */
export const agentCoauthor: SyncRule<AgentCoauthorOptions> = (
  parsed,
  when = 'always',
  value = {},
) => {
  const env = value.env ?? process.env;
  const agents = value.agents ?? defaultAgents;
  const trailerName = value.trailerName ?? DEFAULT_TRAILER;
  const strategy = value.match ?? 'email';
  const negated = when === 'never';

  const active = agents.filter((agent) => isActive(agent, env));
  if (active.length === 0) return [true];

  const trailers = parseCoauthorTrailers(parsed.raw ?? '', trailerName);
  const credited = active.filter((agent) =>
    trailers.some((trailer) =>
      identityMatches(agent.coAuthor, trailer, strategy),
    ),
  );

  if (!negated) {
    const missing = active.filter((agent) => !credited.includes(agent));
    if (missing.length === 0) return [true];
    const who = missing.map((agent) => agent.name ?? agent.id).join(', ');
    const expected = missing
      .map((agent) => `  ${trailerName}: ${formatIdentity(agent.coAuthor)}`)
      .join('\n');
    return [
      false,
      `AI agent detected (${who}) — add the required co-author trailer to your commit message:\n${expected}`,
    ];
  }

  if (credited.length === 0) return [true];
  const who = credited.map((agent) => agent.name ?? agent.id).join(', ');
  return [false, `co-author trailer for ${who} must not be present`];
};
