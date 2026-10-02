import test from 'node:test';
import assert from 'node:assert/strict';

import { runCipherPipeline } from '../src/utils/cipherPipeline.js';
import { calculateResistanceScore, calculatePipelineResistanceScore, compareAllCiphers } from '../src/utils/cipherStrength.js';
import { caesarEncode, vigenereEncode, railFenceEncode } from '../src/utils/cipherHelpers.js';

const PIPELINE_STAGES = [
  { cipherId: 'caesar', params: { shift: 3 } },
  { cipherId: 'vigenere', params: { key: 'CIPHER' } },
  { cipherId: 'rail-fence', params: { rails: 3 } },
];

test('11. Pipeline — three valid ciphers produce structured output', () => {
  const result = runCipherPipeline('HELLO', PIPELINE_STAGES);
  assert.equal(result.error, null);
  assert.equal(result.stages.length, 3);
  assert.ok(result.finalOutput.length > 0);
});

test('12. Pipeline — cipher 2 receives output of cipher 1', () => {
  const result = runCipherPipeline('HELLO', PIPELINE_STAGES);
  assert.equal(result.stages[1].input, result.stages[0].output);
});

test('13. Pipeline — cipher 3 receives output of cipher 2', () => {
  const result = runCipherPipeline('HELLO', PIPELINE_STAGES);
  assert.equal(result.stages[2].input, result.stages[1].output);
});

test('14. Pipeline — final output equals last stage output', () => {
  const result = runCipherPipeline('HELLO', PIPELINE_STAGES);
  assert.equal(result.finalOutput, result.stages[2].output);
});

test('15. Pipeline — deterministic output for same config', () => {
  const r1 = runCipherPipeline('HELLO WORLD', PIPELINE_STAGES);
  const r2 = runCipherPipeline('HELLO WORLD', PIPELINE_STAGES);
  assert.equal(r1.finalOutput, r2.finalOutput);
});

test('16. Pipeline — different cipher order produces different intermediate outputs', () => {
  const stagesAlt = [
    { cipherId: 'vigenere', params: { key: 'CIPHER' } },
    { cipherId: 'caesar', params: { shift: 3 } },
    { cipherId: 'rail-fence', params: { rails: 3 } },
  ];
  const r1 = runCipherPipeline('CRYPTOGRAPHY', PIPELINE_STAGES);
  const r2 = runCipherPipeline('CRYPTOGRAPHY', stagesAlt);
  assert.notEqual(r1.stages[0].output, r2.stages[0].output);
});

test('17. Pipeline — empty input returns error', () => {
  const result = runCipherPipeline('', PIPELINE_STAGES);
  assert.ok(result.error);
  assert.equal(result.stages.length, 0);
});

test('18. Pipeline — missing cipher returns error', () => {
  const broken = [{ cipherId: '' }, { cipherId: 'caesar', params: {} }, { cipherId: 'atbash', params: {} }];
  const result = runCipherPipeline('HELLO', broken);
  assert.ok(result.error);
});

test('19. Pipeline — stages fewer than 3 return error', () => {
  const result = runCipherPipeline('HELLO', [{ cipherId: 'caesar', params: { shift: 3 } }]);
  assert.ok(result.error);
});

test('20. Comparison — all 10 ciphers produce a resistance score in 0–100', () => {
  const cipherIds = ['caesar', 'atbash', 'reverse', 'rot13', 'affine', 'vigenere', 'columnar', 'rail-fence', 'playfair', 'bacon'];
  for (const id of cipherIds) {
    const { score } = calculateResistanceScore(id);
    assert.ok(score >= 0 && score <= 100, `${id} score out of range: ${score}`);
  }
});

test('21. Comparison — same cipher always returns same score', () => {
  const a = calculateResistanceScore('vigenere');
  const b = calculateResistanceScore('vigenere');
  assert.equal(a.score, b.score);
});

test('22. Comparison — pipeline score in 0–100', () => {
  const { score } = calculatePipelineResistanceScore(PIPELINE_STAGES);
  assert.ok(score >= 0 && score <= 100);
});

test('23. Comparison — compareAllCiphers returns 10 entries without pipeline', () => {
  const results = compareAllCiphers('HELLO', PIPELINE_STAGES, false);
  assert.equal(results.length, 10);
  assert.ok(results.every((r) => !r.isPipeline));
});

test('24. Comparison — compareAllCiphers returns 11 entries with pipeline', () => {
  const results = compareAllCiphers('HELLO', PIPELINE_STAGES, true);
  assert.equal(results.length, 11);
  const pEntry = results.find((r) => r.isPipeline);
  assert.ok(pEntry);
});

test('25. Comparison — pipeline entry score matches standalone calculatePipelineResistanceScore', () => {
  const results = compareAllCiphers('HELLO', PIPELINE_STAGES, true);
  const pEntry = results.find((r) => r.isPipeline);
  const standalone = calculatePipelineResistanceScore(PIPELINE_STAGES);
  assert.equal(pEntry.score, standalone.score);
});

test('26. Comparison — results sorted by score descending', () => {
  const results = compareAllCiphers('HELLO', PIPELINE_STAGES, false);
  for (let i = 0; i < results.length - 1; i++) {
    assert.ok(results[i].score >= results[i + 1].score);
  }
});

test('27. Comparison — empty input still returns 10 result objects', () => {
  const results = compareAllCiphers('', PIPELINE_STAGES, false);
  assert.equal(results.length, 10);
});
