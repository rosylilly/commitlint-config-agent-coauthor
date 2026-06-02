import type { UserConfig } from '@commitlint/types';
import { agents, defaultAgents } from './agents.ts';
import { agentCoauthor } from './rule.ts';

/** Name the rule is registered and referenced under. */
export const RULE_NAME = 'agent-coauthor' as const;

/** commitlint plugin exposing the `agent-coauthor` rule. */
export const plugin = {
  rules: {
    [RULE_NAME]: agentCoauthor,
  },
};

/**
 * Shareable commitlint config. Registers the plugin and enables the rule at
 * error level. Compose it with a base config such as
 * `@commitlint/config-conventional`:
 *
 * ```js
 * export default {
 *   extends: ['@commitlint/config-conventional', 'commitlint-config-agent-coauthor'],
 * };
 * ```
 */
const config = {
  plugins: [plugin],
  rules: {
    [RULE_NAME]: [2, 'always'],
  },
} satisfies UserConfig;

export default config;
export type {
  AgentCoauthorOptions,
  AgentDefinition,
  CoAuthor,
  MatchStrategy,
} from './types.ts';
export { agentCoauthor, agents, defaultAgents };
