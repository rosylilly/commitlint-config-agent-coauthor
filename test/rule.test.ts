import assert from 'node:assert/strict';
import { test } from 'node:test';

import parse from '@commitlint/parse';
import type { AgentDefinition } from '../src/index.ts';
import { agentCoauthor, agents, defaultAgents } from '../src/index.ts';

const CLAUDE_ENV = { CLAUDECODE: '1' };

const parsed = (message: string) => parse(message);

test('exposes built-ins as a keyed record mirrored by defaultAgents', () => {
  assert.deepEqual(Object.keys(agents), [
    'claude',
    'codex',
    'gemini',
    'cursor',
  ]);
  assert.deepEqual(defaultAgents, Object.values(agents));
  assert.equal(agents.cursor.coAuthor.email, 'cursoragent@cursor.com');
});

test('passes when no agent environment variable is set', async () => {
  const [valid] = agentCoauthor(await parsed('feat: x'), 'always', { env: {} });
  assert.equal(valid, true);
});

test('fails when an agent is active but no co-author trailer is present', async () => {
  const [valid, message] = agentCoauthor(await parsed('feat: x'), 'always', {
    env: CLAUDE_ENV,
  });
  assert.equal(valid, false);
  assert.match(message ?? '', /noreply@anthropic\.com/);
});

test('passes when the agent email is credited even if the name differs', async () => {
  const commit =
    'feat: x\n\nCo-authored-by: Claude Opus 4.8 <noreply@anthropic.com>';
  const [valid] = agentCoauthor(await parsed(commit), 'always', {
    env: CLAUDE_ENV,
  });
  assert.equal(valid, true);
});

test('fails when the credited email does not match (default match: email)', async () => {
  const commit = 'feat: x\n\nCo-authored-by: Claude <someone@example.com>';
  const [valid] = agentCoauthor(await parsed(commit), 'always', {
    env: CLAUDE_ENV,
  });
  assert.equal(valid, false);
});

test('match "either" accepts a name-only trailer', async () => {
  const commit = 'feat: x\n\nCo-authored-by: Claude';
  const [valid] = agentCoauthor(await parsed(commit), 'always', {
    env: CLAUDE_ENV,
    match: 'either',
  });
  assert.equal(valid, true);
});

test('"never" rejects crediting an active agent', async () => {
  const commit = 'feat: x\n\nCo-authored-by: Claude <noreply@anthropic.com>';
  const [valid] = agentCoauthor(await parsed(commit), 'never', {
    env: CLAUDE_ENV,
  });
  assert.equal(valid, false);
});

test('reports only the active agents that are still uncredited', async () => {
  const env = { CLAUDECODE: '1', CODEX_THREAD_ID: 'thread_abc' };
  const commit = 'feat: x\n\nCo-authored-by: Codex <noreply@openai.com>';
  const [valid, message] = agentCoauthor(await parsed(commit), 'always', {
    env,
  });
  assert.equal(valid, false);
  assert.match(message ?? '', /anthropic/);
  assert.doesNotMatch(message ?? '', /openai/);
});

test('detects Cursor via CURSOR_AGENT and requires its trailer', async () => {
  const env = { CURSOR_AGENT: '1' };
  const [missing, message] = agentCoauthor(await parsed('feat: x'), 'always', {
    env,
  });
  assert.equal(missing, false);
  assert.match(message ?? '', /cursoragent@cursor\.com/);

  const commit = 'feat: x\n\nCo-authored-by: Cursor <cursoragent@cursor.com>';
  const [credited] = agentCoauthor(await parsed(commit), 'always', { env });
  assert.equal(credited, true);
});

test('honours a custom agent registry with detect()', async () => {
  const agents: AgentDefinition[] = [
    {
      id: 'bot',
      name: 'Bot',
      detect: (env) => env.MY_BOT === 'yes',
      coAuthor: { name: 'Bot', email: 'bot@example.com' },
    },
  ];
  const env = { MY_BOT: 'yes' };

  const [missing] = agentCoauthor(await parsed('feat: x'), 'always', {
    agents,
    env,
  });
  assert.equal(missing, false);

  const commit = 'feat: x\n\nCo-authored-by: Bot <bot@example.com>';
  const [credited] = agentCoauthor(await parsed(commit), 'always', {
    agents,
    env,
  });
  assert.equal(credited, true);
});

test('a custom trailerName is respected', async () => {
  const commit = 'feat: x\n\nAssisted-by: Claude <noreply@anthropic.com>';
  const [valid] = agentCoauthor(await parsed(commit), 'always', {
    env: CLAUDE_ENV,
    trailerName: 'Assisted-by',
  });
  assert.equal(valid, true);
});
