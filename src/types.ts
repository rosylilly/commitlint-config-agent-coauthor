/** How a co-author trailer is matched against an agent's identity. */
export type MatchStrategy = 'email' | 'name' | 'either' | 'both';

/**
 * Which agents the `never` condition forbids a trailer for: only those detected
 * in the environment (`'detected'`), or every configured agent regardless of
 * environment (`'configured'`).
 */
export type AppliesTo = 'detected' | 'configured';

/** The identity an agent must be credited as. */
export interface CoAuthor {
  /** Display name used in the trailer. */
  name: string;
  /** Address used for matching — the stable signal. */
  email?: string;
}

/** A single AI agent: how to detect it and how it must be credited. */
export interface AgentDefinition {
  /** Stable identifier, e.g. `"claude"`. */
  id: string;
  /** Human-readable name used in error messages. */
  name?: string;
  /** Environment variables whose presence (non-empty) marks the agent active. */
  env?: string[];
  /** Custom detector; overrides {@link AgentDefinition.env} when provided. */
  detect?: (env: Record<string, string | undefined>) => boolean;
  /** The co-author the agent must be credited as. */
  coAuthor: CoAuthor;
}

/** Options accepted as the third value of the `agent-coauthor` rule. */
export interface AgentCoauthorOptions {
  /** Agent registry to check. Defaults to the built-in {@link AgentDefinition} list. */
  agents?: AgentDefinition[];
  /** Environment to read. Defaults to `process.env`. */
  env?: Record<string, string | undefined>;
  /** Trailer token to look for. Defaults to `"Co-authored-by"`. */
  trailerName?: string;
  /** How a trailer is matched against an agent identity. Defaults to `"email"`. */
  match?: MatchStrategy;
  /**
   * For the `never` condition: forbid trailers from only the detected agents
   * (`'detected'`, the default — gated on the environment) or from every
   * configured agent regardless of environment (`'configured'`). Ignored by the
   * `always` condition.
   */
  appliesTo?: AppliesTo;
}
