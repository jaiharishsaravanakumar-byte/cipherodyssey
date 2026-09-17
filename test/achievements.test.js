import test from 'node:test';
import assert from 'node:assert/strict';

import { ACHIEVEMENTS, evaluateNewAchievements } from '../src/utils/achievements.js';
import { useAppStore } from '../src/store/useAppStore.js';

test('1. Achievements evaluate correctly against stats', () => {
  const stats0 = {
    totalAttempts: 0,
    totalSolved: 0,
    hintFreeSolves: 0,
    cipherSolves: {},
    bestStreak: 0,
  };
  assert.equal(evaluateNewAchievements(stats0, []).length, 0);

  const stats1 = { ...stats0, totalAttempts: 1, totalSolved: 1, hintFreeSolves: 1, cipherSolves: { caesar: 1 } };
  const newAch1 = evaluateNewAchievements(stats1, []);
  assert.ok(newAch1.some((a) => a.id === 'first_decryption'));

  const stats10 = { ...stats0, totalAttempts: 10, totalSolved: 10, hintFreeSolves: 4, cipherSolves: { caesar: 2 } };
  const newAch10 = evaluateNewAchievements(stats10, ['first_decryption']);
  assert.ok(newAch10.some((a) => a.id === 'code_breaker'));

  const statsCaesar = { ...stats0, totalAttempts: 3, totalSolved: 3, cipherSolves: { caesar: 3 } };
  const newCaesar = evaluateNewAchievements(statsCaesar, []);
  assert.ok(newCaesar.some((a) => a.id === 'caesar_master'));

  const statsNoHint = { ...stats0, totalAttempts: 5, totalSolved: 5, hintFreeSolves: 5 };
  const newNoHint = evaluateNewAchievements(statsNoHint, []);
  assert.ok(newNoHint.some((a) => a.id === 'no_hint'));

  const statsCrypto = { ...stats0, totalAttempts: 10, totalSolved: 9 };
  const newCrypto = evaluateNewAchievements(statsCrypto, []);
  assert.ok(newCrypto.some((a) => a.id === 'cryptologist'));
});

test('2. useAppStore celebration animation fires once and never re-triggers', () => {
  const store = useAppStore.getState();

  useAppStore.getState().recordChallengeResult({
    cipherType: 'caesar',
    isCorrect: true,
    hintsUsed: 0,
    currentStreak: 1,
  });

  const stateAfter = useAppStore.getState();
  assert.ok(stateAfter.unlockedAchievements.includes('first_decryption'), 'First Decryption should be unlocked');
  assert.equal(stateAfter.pendingAchievement?.id, 'first_decryption', 'Pending celebration should be set');
  assert.ok(stateAfter.notifiedAchievements.includes('first_decryption'), 'Should be added to notifiedAchievements');

  useAppStore.getState().dismissPendingAchievement();
  assert.equal(useAppStore.getState().pendingAchievement, null, 'Pending achievement dismissed');

  useAppStore.getState().recordChallengeResult({
    cipherType: 'caesar',
    isCorrect: true,
    hintsUsed: 0,
    currentStreak: 2,
  });

  assert.equal(
    useAppStore.getState().pendingAchievement,
    null,
    'Celebration must not re-trigger on subsequent updates or re-renders'
  );
});
