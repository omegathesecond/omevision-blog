import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Node excludes relative node_modules paths during test discovery. Resolve the
// installed suites explicitly, retaining automatic discovery of new guard tests.
export function runTests(directory) {
  const files = readdirSync(directory).filter(name => name.endsWith('.test.mjs'));
  if (!files.length) throw new Error(`No release tests found in ${directory}`);
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  const result = spawnSync(process.execPath, ['--test', ...files.sort().map(name => resolve(directory, name))], { stdio: 'inherit', env });
  if (result.error) throw result.error;
  return result.status ?? 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = runTests('node_modules/@omevision/release-guard/test');
}
