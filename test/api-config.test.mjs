import test from 'node:test';
import assert from 'node:assert/strict';
import { API_BASE } from '../src/companies.js';
import { AUTOBLOGGER_URL } from '../src/config.js';

test('rendered blog uses the shared current API origin', () => {
  assert.equal(API_BASE, AUTOBLOGGER_URL);
  assert.equal(new URL(API_BASE).protocol, 'https:');
  assert.notEqual(new URL(API_BASE).hostname, 'autoblogger-238692725328.europe-west1.run.app');
});
