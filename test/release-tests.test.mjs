import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runTests } from '../scripts/release-tests.mjs';

test('installed dependency suites execute and failures reach the build', () => {
  const root = mkdtempSync(join(tmpdir(), 'blog-release-test-'));
  const directory = join(root, 'node_modules', 'guard', 'test');
  mkdirSync(directory, { recursive: true });
  try {
    assert.throws(() => runTests(directory), /No release tests/);
    const marker = join(root, 'executed');
    writeFileSync(join(directory, 'first.test.mjs'), `import {writeFileSync} from 'node:fs'; writeFileSync(${JSON.stringify(marker)}, 'yes');`);
    writeFileSync(join(directory, 'second.test.mjs'), 'import test from "node:test"; test("second suite", () => {});');
    assert.equal(runTests(directory), 0);
    writeFileSync(join(directory, 'second.test.mjs'), 'throw new Error("regression failure must block publication");');
    assert.notEqual(runTests(directory), 0);
    // The first suite must run even when another suite fails.
    assert.equal(readFileSync(marker, 'utf8'), 'yes');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
