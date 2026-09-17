import { request, getOrCreateUserId } from './client.js';
import { CIPHERS_CONFIG } from '../data/ciphersConfig.js';

function getCipherName(slug) {
  const found = CIPHERS_CONFIG.find((c) => c.slug === slug);
  return found ? found.name : slug.toUpperCase();
}

export async function fetchRandomChallenge({ difficulty = 'easy', cipher = '' } = {}) {
  const params = new URLSearchParams();
  if (difficulty) params.set('difficulty', difficulty);
  if (cipher) params.set('cipher', cipher);

  const query = params.toString() ? `?${params.toString()}` : '';
  const result = await request(`/challenges/random${query}`);

  if (!result.success || !result.challenge) {
    throw new Error('Invalid challenge response from server');
  }

  const { challenge } = result;

  
  return {
    id: challenge.id,
    cipherType: challenge.cipherType,
    cipherName: challenge.cipherType === '???' ? '???' : getCipherName(challenge.cipherType),
    difficulty: challenge.difficulty,
    ciphertext: challenge.ciphertext,
    revealCipher: challenge.cipherRevealed,
    hints: challenge.hints || [],
    points: challenge.points || 100,
    createdAt: challenge.createdAt,
  };
}

export async function submitChallengeAnswer(challengeId, {
  answer,
  cipherGuess,
  hintsUsed = 0,
  timeTakenSec = 0,
}) {
  const userId = getOrCreateUserId();

  return request(`/challenges/${encodeURIComponent(challengeId)}/submit`, {
    method: 'POST',
    body: JSON.stringify({
      answer,
      cipherGuess,
      hintsUsed,
      timeTakenSec,
      userId,
    }),
  });
}
