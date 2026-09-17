import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = 'http://localhost:5000/api';

test('API: 1. Health check returns ok', async () => {
  const res = await fetch(`${BASE_URL}/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'ok');
});

test('API: 2. Ciphers catalog lists all 10 seeded ciphers', async () => {
  const res = await fetch(`${BASE_URL}/ciphers`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.count, 10);

  const slugs = data.data.map((c) => c.slug);
  const expectedSlugs = [
    'caesar', 'atbash', 'reverse', 'rot13', 'affine',
    'vigenere', 'rail-fence', 'columnar', 'playfair', 'bacon'
  ];
  for (const slug of expectedSlugs) {
    assert.ok(slugs.includes(slug), `Missing slug ${slug}`);
  }
});

test('API: 3. Single cipher detail returns data', async () => {
  const res = await fetch(`${BASE_URL}/ciphers/caesar`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.data.slug, 'caesar');
  assert.equal(data.data.name, 'Caesar Cipher');

  const notFound = await fetch(`${BASE_URL}/ciphers/nonexistent`);
  assert.equal(notFound.status, 404);
});

test('API: 4. Random challenge returns sanitized payload', async () => {
  const res = await fetch(`${BASE_URL}/challenges/random?difficulty=easy`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.challenge.id);
  assert.ok(data.challenge.ciphertext);
  assert.equal(data.challenge.plaintext, undefined, 'Plaintext MUST be omitted');
  assert.equal(data.challenge.params, undefined, 'Params MUST be omitted');

  const hardRes = await fetch(`${BASE_URL}/challenges/random?difficulty=hard`);
  const hardData = await hardRes.json();
  assert.equal(hardData.challenge.cipherType, '???', 'Hard cipherType must be ???');
  assert.equal(hardData.challenge.cipherRevealed, false);
});

test('API: 5. Submit handles wrong answer with -10 penalty', async () => {
  const chalRes = await fetch(`${BASE_URL}/challenges/random?difficulty=easy`);
  const { challenge } = await chalRes.json();

  const submitRes = await fetch(`${BASE_URL}/challenges/${challenge.id}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      answer: 'WRONG_ANSWER_VALUE',
      hintsUsed: 0,
      timeTakenSec: 5,
      userId: 'test_player',
    }),
  });
  const result = await submitRes.json();
  assert.equal(result.correct, false);
  assert.equal(result.pointsAwarded, -10);
});

test('API: 6. Score logging and summary aggregates correctly', async () => {
  const uid = `player_${Date.now()}`;
  await fetch(`${BASE_URL}/scores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: uid,
      cipherType: 'caesar',
      correct: true,
      score: 150,
      timeTakenSec: 10,
      hintsUsed: 0,
    }),
  });

  const sumRes = await fetch(`${BASE_URL}/scores/summary?userId=${uid}`);
  const sumData = await sumRes.json();
  assert.equal(sumData.summary.totalSolved, 1);
  assert.equal(sumData.summary.totalScore, 150);
  assert.equal(sumData.summary.accuracy, 100);

  const achRes = await fetch(`${BASE_URL}/achievements?userId=${uid}`);
  const achData = await achRes.json();
  const firstDec = achData.achievements.find((a) => a.id === 'first_decryption');
  assert.equal(firstDec.unlocked, true);
});
