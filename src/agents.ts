import type { AgentDefinition } from './types.ts';

/**
 * Claude Code sets `CLAUDECODE=1` and credits commits as
 * `Co-Authored-By: Claude <noreply@anthropic.com>`. The display name varies by
 * model ("Claude Opus 4.8", …) but the email is stable.
 */
export const claude: AgentDefinition = {
  id: 'claude',
  name: 'Claude Code',
  env: ['CLAUDECODE'],
  coAuthor: { name: 'Claude', email: 'noreply@anthropic.com' },
};

/**
 * OpenAI Codex sets `CODEX_THREAD_ID` and (with commit attribution enabled)
 * credits `Co-authored-by: Codex <noreply@openai.com>`.
 */
export const codex: AgentDefinition = {
  id: 'codex',
  name: 'OpenAI Codex',
  env: ['CODEX_THREAD_ID'],
  coAuthor: { name: 'Codex', email: 'noreply@openai.com' },
};

/**
 * Gemini CLI sets `GEMINI_CLI=1`; the suggested attribution is
 * `Co-Authored-By: Gemini <gemini-code-assist@google.com>`.
 */
export const gemini: AgentDefinition = {
  id: 'gemini',
  name: 'Gemini CLI',
  env: ['GEMINI_CLI'],
  coAuthor: { name: 'Gemini', email: 'gemini-code-assist@google.com' },
};

/** Built-in agents checked by default. Override via the rule's `agents` option. */
export const defaultAgents: AgentDefinition[] = [claude, codex, gemini];
