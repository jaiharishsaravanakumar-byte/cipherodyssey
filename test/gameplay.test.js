import test from 'node:test';
import assert from 'node:assert/strict';

import { generateChallenge } from '../src/utils/challengeGenerator.js';
import {
  calculateSolvedScore,
  calculateWrongAnswerPenalty,
  calculateHintPenalty,
} from '../src/utils/scoring.js';
import { useGameStore } from '../src/store/useGameStore.js';

const originalFetch = globalThis.fetch;

test.before(() => {
  let challengeCounter = 0;
  globalThis.fetch = async (url, options = {}) => {
    const urlStr = String(url);
    if (urlStr.includes('/challenges/random')) {
      challengeCounter++;
      return {
        ok: true,
        json: async () => ({
          success: true,
          challenge: {
            id: `test_ch_${challengeCounter}`,
            cipherType: 'caesar',
            ciphertext: 'KHOOR',
            difficulty: 'easy',
            cipherRevealed: true,
            hints: ['Shift of 3'],
            points: 100,
            createdAt: new Date().toISOString(),
          },
        }),
      };
    }

    if (urlStr.includes('/submit')) {
      const body = typeof options.body === 'string' ? JSON.parse(options.body) : {};
      const isCorrect = body.answer === 'HELLO' || body.answer === 'ATTACK AT DAWN';
      return {
        ok: true,
        json: async () => ({
          success: true,
          correct: isCorrect,
          pointsAwarded: isCorrect ? 150 : 0,
          breakdown: isCorrect ? { base: 100, fastBonus: 25, noHintsBonus: 25 } : {},
        }),
      };
    }

    if (originalFetch) {
      return originalFetch(url, options);
    }
    return { ok: true, json: async () => ({}) };
  };
});

test.after(() => {
  globalThis.fetch = originalFetch;
});

test('1. Challenge generator respects difficulty and hides cipher on hard', () => {
  for (let i = 0; i < 20; i++) {
    const easy = generateChallenge('easy');
    assert.equal(easy.revealCipher, true, 'Easy should reveal cipher');
    assert.ok(['caesar', 'atbash', 'reverse', 'rot13'].includes(easy.cipherType));

    const hard = generateChallenge('hard');
    assert.equal(hard.revealCipher, false, 'Hard must hide cipher');
    assert.ok(hard.hints.length >= 3, 'Must have at least 3 hints');
  }
});

test('2. Scoring calculations match brief', () => {
  const base = calculateSolvedScore({ timeTakenSeconds: 30, hintsUsed: 1, wasCipherHidden: false });
  assert.equal(base.totalDelta, 100);

  const fastNoHints = calculateSolvedScore({ timeTakenSeconds: 10, hintsUsed: 0, wasCipherHidden: false });
  assert.equal(fastNoHints.totalDelta, 150);

  const hiddenIdentified = calculateSolvedScore({
    timeTakenSeconds: 12,
    hintsUsed: 0,
    wasCipherHidden: true,
    identifiedCipherCorrectly: true,
  });
  assert.equal(hiddenIdentified.totalDelta, 200);

  assert.equal(calculateWrongAnswerPenalty().delta, -10);
  assert.equal(calculateHintPenalty().delta, -20);
});

test('3. Simulated 10 challenges loop in useGameStore', async () => {
  const store = useGameStore.getState();
  await store.resetGame();

  let initialHearts = useGameStore.getState().hearts;
  assert.equal(initialHearts, 5);
  assert.equal(useGameStore.getState().score, 0);
  assert.equal(useGameStore.getState().streak, 0);

  for (let round = 1; round <= 10; round++) {
    const challenge = useGameStore.getState().currentChallenge;
    assert.ok(challenge, `Challenge ${round} must exist`);

    const answer = challenge.plaintext || 'ATTACK AT DAWN';
    const result = await useGameStore.getState().submitAnswer(answer);
    assert.ok(result, `Result ${round} must be returned`);
    assert.equal(useGameStore.getState().streak, round, `Streak should increment to ${round}`);
    assert.ok(useGameStore.getState().score > 0, `Score should be positive after solve`);

    await useGameStore.getState().nextChallenge();
  }

  assert.equal(useGameStore.getState().streak, 10, 'Streak should reach 10 after 10 consecutive wins');
  assert.ok(useGameStore.getState().score >= 1000, 'Score should be at least 1000 after 10 wins');
});

test('4. Wrong answer decrements hearts and applies penalty', async () => {
  const store = useGameStore.getState();
  await store.resetGame();

  const startHearts = useGameStore.getState().hearts;
  const wrongRes = await useGameStore.getState().submitAnswer('INCORRECT_ANSWER_STRING');
  assert.equal(wrongRes.success, false);
  assert.equal(useGameStore.getState().hearts, startHearts - 1, 'Hearts must decrement by 1');
  assert.equal(useGameStore.getState().scorePopups.length > 0, true, 'Score popup must be enqueued');
});
