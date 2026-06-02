# Changelog

## [1.0.0](https://github.com/rosylilly/commitlint-config-agent-coauthor/compare/v0.1.1...v1.0.0) (2026-06-02)


### ⚠ BREAKING CHANGES

* the individual agent exports `claude`, `codex`, `gemini`, and `cursor` are removed. Use `agents.claude` / `agents.cursor` for a single built-in, or `defaultAgents` for the whole default registry.

### Features

* add appliesTo option to forbid agent trailers repo-wide ([90be904](https://github.com/rosylilly/commitlint-config-agent-coauthor/commit/90be904527981c8ed0cfebc8a0630551181cea22))
* detect Cursor CLI and require its co-author trailer ([ad504f1](https://github.com/rosylilly/commitlint-config-agent-coauthor/commit/ad504f1b140509961212388eb175c160c32e2013))
* group built-in agents under a single `agents` export ([1044d02](https://github.com/rosylilly/commitlint-config-agent-coauthor/commit/1044d02630894324ce2ce57ec4eb969677549549))

## [0.1.1](https://github.com/rosylilly/commitlint-config-agent-coauthor/compare/v0.1.0...v0.1.1) (2026-06-02)


### Documentation

* link to the changelog from the README ([439db2f](https://github.com/rosylilly/commitlint-config-agent-coauthor/commit/439db2f86f918eb875d2142cea3855ee76fd0532))

## 0.1.0 (2026-06-02)


### Features

* implement agent-coauthor commitlint config in TypeScript ([2206c8d](https://github.com/rosylilly/commitlint-config-agent-coauthor/commit/2206c8d7a52c83a36c872bf315f0551fe8822a3a))


### Miscellaneous Chores

* target 0.1.0 for the initial release ([a6ba35f](https://github.com/rosylilly/commitlint-config-agent-coauthor/commit/a6ba35f7cfad4ba5688b80c0839e0fdaba727c39))


### Continuous Integration

* automate releases and changelog with release-please ([2b24f35](https://github.com/rosylilly/commitlint-config-agent-coauthor/commit/2b24f354a3ff3785cc4deb4a16635051dee3e5e5))
