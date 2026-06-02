// Dogfood the package on its own commits. Consumers extend it by name
// (`extends: ['commitlint-config-agent-coauthor']`), but a package can't resolve
// itself by name from its own node_modules, so we wire the local source directly.
// The .ts source runs as-is via Node's native type stripping (no build needed).
import agentCoauthor from './src/index.ts';

/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
  plugins: agentCoauthor.plugins,
  rules: agentCoauthor.rules,
};
