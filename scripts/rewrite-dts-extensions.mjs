// tsc (with `rewriteRelativeImportExtensions`) rewrites `.ts` → `.js` in emitted
// JavaScript but leaves the `.ts` extension in declaration files, which would
// point consumers at non-existent source. Rewrite relative `.ts` specifiers to
// `.js` in dist/**/*.d.ts. ".ts" and ".js" are the same length, so the adjacent
// declaration maps stay byte-accurate.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const dir = 'dist';
const SPEC = /(\bfrom\s+['"]|\bimport\(\s*['"])(\.\.?\/[^'"]+?)\.ts(['"])/g;

const files = (await readdir(dir, { recursive: true })).filter((f) =>
  f.endsWith('.d.ts'),
);

let changed = 0;
for (const file of files) {
  const path = join(dir, file);
  const source = await readFile(path, 'utf8');
  const rewritten = source.replace(SPEC, '$1$2.js$3');
  if (rewritten !== source) {
    await writeFile(path, rewritten);
    changed += 1;
  }
}

console.log(`rewrote .ts→.js specifiers in ${changed}/${files.length} declaration file(s)`);
