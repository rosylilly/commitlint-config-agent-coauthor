# AGENTS.md

The mechanical rules — formatting, Conventional Commits, and (in agent commits) the co-author trailer — are enforced by local git hooks. CI re-checks formatting and Conventional Commits and tests the trailer rule itself, but the runner has no agent environment, so a *missing trailer is caught locally, not in CI* — getting it right is on you at commit time. The wiring lives in `package.json`, `biome.json`, and `.github/workflows/`. This file is for what those *can't* enforce: the judgment expected of anyone, human or agent, working here.

This package exists to enforce honest AI attribution. Whatever you change, that integrity is the point.

## Red means stop

- Work isn't done until `pnpm test`, `pnpm typecheck`, and `pnpm check` pass locally. Run them — don't outsource catching problems to CI or to a reviewer.
- Never push, merge, or hand off past a failing test, type error, or lint finding. Fix the cause.
- Don't silence the signal to get green: no `--no-verify`, no deleting or skipping a failing test, no `biome-ignore` or disabled rule just to make red disappear. If a rule is genuinely wrong, change it on purpose and explain why in the commit.
- `commitlint latest` is allowed to fail in CI, but a failure is an early warning that an upstream commitlint release affects us. Investigate it; it is not noise.
- Green means "the checks ran", not "this is correct". When you touch CI, releases, or publishing, verify the real outcome (the run, the published version) instead of assuming.

## Don't route around the guardrails

- Hooks and branch protection are the floor, not an obstacle. If a guard is in your way, it's usually the work that needs rethinking, not the guard.
- Don't trade away the supply-chain posture for convenience: keep tokenless (OIDC) publishing with provenance, keep `main` protected, and keep secrets out of the repo.

## Change with care

- **Keep zero runtime dependencies.** Adding one is a deliberate, reviewed decision — exhaust the alternatives first.
- A behavior change needs a test that would catch its regression. Don't ship logic on trust.
- The package's exports are a public contract; breaking them is a major-version event. We are pre-1.0 — be deliberate about what earns 1.0.0.
- Don't hand-edit the `version`, `CHANGELOG.md`, or the release manifest — release-please derives them from your Conventional Commits. To cut a specific version (e.g. graduating to 1.0.0), land a commit with a `Release-As: 1.0.0` footer and let release-please open the Release PR.
- Prefer the smallest change that does the job, one logical change per PR, and commit messages that explain *why*, not just *what*.

## The trailer is the product

You enforce it on everyone else, so hold yourself to it: when you commit as an agent, actually credit yourself with the `Co-authored-by` trailer. Never strip or fake it just to get a commit through — that defeats the reason this project exists.
