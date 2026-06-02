# commitlint-config-agent-coauthor

[![npm](https://img.shields.io/npm/v/commitlint-config-agent-coauthor)](https://www.npmjs.com/package/commitlint-config-agent-coauthor)
[![CI](https://github.com/rosylilly/commitlint-config-agent-coauthor/actions/workflows/ci.yml/badge.svg)](https://github.com/rosylilly/commitlint-config-agent-coauthor/actions/workflows/ci.yml)
[![Dependabot](https://img.shields.io/badge/Dependabot-enabled-025E8C?logo=dependabot&logoColor=white)](./.github/dependabot.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

A shareable [commitlint](https://commitlint.js.org/) config that **requires a `Co-authored-by` trailer for AI agents**. When a commit is made from inside an agent's environment (Claude Code, OpenAI Codex, Gemini CLI, …), the agent must be credited as a co-author — otherwise the commit is rejected.

Detection is driven entirely by environment variables, so the rule is a **no-op for human commits** and only kicks in when an agent is actually running.

Ships as TypeScript-built JavaScript with type declarations and **no `dependencies`**. The declarations reference `@commitlint/types`, declared as an *optional* `peerDependency` — it's already in your tree via commitlint, so nothing extra is installed (it only matters when you type-check against these declarations).

## How it works

| Agent | Detected via | Required trailer |
| --- | --- | --- |
| Claude Code | `CLAUDECODE` | `Co-authored-by: Claude <noreply@anthropic.com>` |
| OpenAI Codex | `CODEX_THREAD_ID` | `Co-authored-by: Codex <noreply@openai.com>` |
| Gemini CLI | `GEMINI_CLI` | `Co-authored-by: Gemini <gemini-code-assist@google.com>` |
| Cursor CLI | `CURSOR_AGENT` | `Co-authored-by: Cursor <cursoragent@cursor.com>` |

Matching is by **email** by default — display names drift between releases (`Claude`, `Claude Opus 4.8`, …) but the address is stable.

## Install

```sh
pnpm add -D commitlint-config-agent-coauthor
```

## Usage

Compose it with your base config (e.g. `@commitlint/config-conventional`):

```js
// commitlint.config.js
export default {
  extends: ['@commitlint/config-conventional', 'commitlint-config-agent-coauthor'],
};
```

Then wire commitlint into a git hook with [husky](https://typicode.github.io/husky/):

```sh
# .husky/commit-msg
pnpm exec commitlint --edit "$1"
```

## Configuration

The rule is registered as `agent-coauthor` and accepts an options object as its third value:

```js
export default {
  extends: ['@commitlint/config-conventional', 'commitlint-config-agent-coauthor'],
  rules: {
    'agent-coauthor': [
      2,        // 0 = off, 1 = warning, 2 = error
      'always', // 'always' = require the trailer; 'never' = forbid it
      {
        match: 'email',           // 'email' | 'name' | 'either' | 'both'
        trailerName: 'Co-authored-by',
        // Override or extend the agent registry:
        agents: [
          {
            id: 'my-bot',
            name: 'My Bot',
            env: ['MY_BOT'],        // active when MY_BOT is set & non-empty
            // or: detect: (env) => Boolean(env.CI_AGENT),
            coAuthor: { name: 'My Bot', email: 'bot@example.com' },
          },
        ],
      },
    ],
  },
};
```

| Option | Default | Description |
| --- | --- | --- |
| `agents` | built-in registry | Agents to check. Each has `id`, optional `name`, `env`/`detect`, and a `coAuthor`. |
| `env` | `process.env` | Environment to read (handy for tests). |
| `trailerName` | `"Co-authored-by"` | Trailer token to look for. |
| `match` | `"email"` | `email`, `name` (substring), `either`, or `both`. |

### Programmatic exports

```js
import config, {
  agentCoauthor,   // the raw rule function
  plugin,          // { rules: { 'agent-coauthor': agentCoauthor } }
  defaultAgents,
  claude, codex, gemini, cursor,
} from 'commitlint-config-agent-coauthor';
```

Types (`AgentDefinition`, `AgentCoauthorOptions`, `CoAuthor`, `MatchStrategy`, `ParsedCommit`, `RuleCondition`, `RuleOutcome`) are exported too.

## Development

Source is TypeScript in `src/`, run directly via Node's native type stripping — no build step needed for local work:

```sh
pnpm test        # node --test (runs the .ts tests as-is)
pnpm typecheck   # tsc --noEmit over src + test
pnpm build       # emit dist/ (JS + .d.ts) for publishing
```

`pnpm build` compiles with `tsc` and rewrites the `.ts` import specifiers in the emitted declarations to `.js`. Publishing runs it automatically via `prepack`.

## Changelog

See [`CHANGELOG.md`](./CHANGELOG.md) or the [GitHub releases](https://github.com/rosylilly/commitlint-config-agent-coauthor/releases).

## License

MIT © Sho KUSANO
