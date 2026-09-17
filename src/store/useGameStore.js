import { create } from 'zustand';
import { generateChallenge } from '../utils/challengeGenerator.js';
import {
  calculateSolvedScore,
  calculateWrongAnswerPenalty,
  calculateHintPenalty,
} from '../utils/scoring.js';
import { fetchRandomChallenge, submitChallengeAnswer } from '../api/challenges.js';
import { useAppStore } from './useAppStore.js';

const MAX_HEARTS = 5;

export const useGameStore = create((set, get) => ({
  score: 0,
  streak: 0,
  hearts: MAX_HEARTS,
  difficulty: 'easy',
  currentChallenge: null,
  challengeStartTime: Date.now(),
  hintsRevealed: 0,
  identifiedCipher: null,
  isCipherRevealed: true,
  isSolved: false,
  isGameOver: false,
  scorePopups: [],

  startChallenge: async (diff) => {
    const activeDiff = diff || get().difficulty;
    try {
      const challenge = await fetchRandomChallenge({ difficulty: activeDiff });
      set({
        difficulty: activeDiff,
        currentChallenge: challenge,
        challengeStartTime: Date.now(),
        hintsRevealed: 0,
        identifiedCipher: null,
        isCipherRevealed: challenge.revealCipher,
        isSolved: false,
        isGameOver: false,
      });
    } catch {
      const fallback = generateChallenge(activeDiff);
      set({
        difficulty: activeDiff,
        currentChallenge: fallback,
        challengeStartTime: Date.now(),
        hintsRevealed: 0,
        identifiedCipher: null,
        isCipherRevealed: fallback.revealCipher,
        isSolved: false,
        isGameOver: false,
      });
    }
  },

  identifyCipherGuess: (guessedSlug) => {
    const { currentChallenge, isCipherRevealed, addScorePopup } = get();
    if (!currentChallenge || isCipherRevealed) return { correct: false };

    if (currentChallenge.cipherType === guessedSlug) {
      addScorePopup('+50 Cipher Identified', 50, true);
      set((state) => ({
        score: state.score + 50,
        identifiedCipher: guessedSlug,
        isCipherRevealed: true,
      }));
      return { correct: true };
    } else {
      addScorePopup('-10 Wrong Cipher', -10, false);
      set((state) => ({
        score: Math.max(0, state.score - 10),
      }));
      return { correct: false };
    }
  },

  submitAnswer: async (rawAnswer) => {
    const {
      currentChallenge,
      challengeStartTime,
      hintsRevealed,
      identifiedCipher,
      hearts,
      streak,
      score,
      addScorePopup,
    } = get();

    if (!currentChallenge || get().isSolved || get().isGameOver) {
      return { success: false };
    }

    const elapsedSeconds = Math.max(1, Math.round((Date.now() - challengeStartTime) / 1000));

    const optimistic = calculateSolvedScore({
      timeTakenSeconds: elapsedSeconds,
      hintsUsed: hintsRevealed,
      wasCipherHidden: !currentChallenge.revealCipher,
      identifiedCipherCorrectly: identifiedCipher === currentChallenge.cipherType,
    });
    const optimisticPoints = optimistic.totalDelta;

    const hasLocalPlaintext = typeof currentChallenge.plaintext === 'string';
    const cleanInput = rawAnswer.trim().toUpperCase().replace(/[^A-Z0-9 ]/g, '');
    const isLocallyCorrect = hasLocalPlaintext
      ? cleanInput === currentChallenge.plaintext.trim().toUpperCase().replace(/[^A-Z0-9 ]/g, '')
      : true;

    if (isLocallyCorrect) {
      addScorePopup(`+${optimisticPoints}`, optimisticPoints, true);
      const optimisticStreak = streak + 1;

      set((state) => ({
        score: state.score + optimisticPoints,
        streak: optimisticStreak,
        isSolved: true,
        isCipherRevealed: true,
      }));

      try {
        const serverRes = await submitChallengeAnswer(currentChallenge.id, {
          answer: rawAnswer,
          cipherGuess: identifiedCipher,
          hintsUsed: hintsRevealed,
          timeTakenSec: elapsedSeconds,
        });

        if (serverRes.correct) {
          const pointDiff = serverRes.pointsAwarded - optimisticPoints;
          if (pointDiff !== 0) {
            set((state) => ({ score: Math.max(0, state.score + pointDiff) }));
          }

          useAppStore.getState().recordChallengeResult({
            cipherType: currentChallenge.cipherType,
            isCorrect: true,
            hintsUsed: hintsRevealed,
            currentStreak: optimisticStreak,
          });

          return {
            success: true,
            points: serverRes.pointsAwarded,
            breakdown: serverRes.breakdown || optimistic.breakdown,
          };
        } else {
          const penalty = calculateWrongAnswerPenalty();
          const nextHearts = hearts - 1;
          const gameOver = nextHearts <= 0;

          set((state) => ({
            score: Math.max(0, state.score - optimisticPoints + penalty.delta),
            hearts: nextHearts,
            streak: gameOver ? 0 : streak,
            isSolved: false,
            isGameOver: gameOver,
          }));

          addScorePopup(penalty.label, penalty.delta, false);

          useAppStore.getState().recordChallengeResult({
            cipherType: currentChallenge.cipherType,
            isCorrect: false,
            hintsUsed: hintsRevealed,
            currentStreak: gameOver ? 0 : streak,
          });

          return { success: false, heartsRemaining: nextHearts, gameOver };
        }
      } catch {
        useAppStore.getState().recordChallengeResult({
          cipherType: currentChallenge.cipherType,
          isCorrect: true,
          hintsUsed: hintsRevealed,
          currentStreak: optimisticStreak,
        });

        return {
          success: true,
          points: optimisticPoints,
          breakdown: optimistic.breakdown,
        };
      }
    } else {
      const penalty = calculateWrongAnswerPenalty();
      addScorePopup(penalty.label, penalty.delta, false);
      const nextHearts = hearts - 1;
      const gameOver = nextHearts <= 0;

      set((state) => ({
        score: Math.max(0, state.score + penalty.delta),
        hearts: nextHearts,
        streak: gameOver ? 0 : streak,
        isGameOver: gameOver,
      }));

      useAppStore.getState().recordChallengeResult({
        cipherType: currentChallenge.cipherType,
        isCorrect: false,
        hintsUsed: hintsRevealed,
        currentStreak: gameOver ? 0 : streak,
      });

      return { success: false, heartsRemaining: nextHearts, gameOver };
    }
  },

  useHint: () => {
    const { currentChallenge, hintsRevealed, addScorePopup } = get();
    if (!currentChallenge || hintsRevealed >= currentChallenge.hints.length) return;

    const penalty = calculateHintPenalty();
    addScorePopup(penalty.label, penalty.delta, false);

    set((state) => ({
      hintsRevealed: state.hintsRevealed + 1,
      score: Math.max(0, state.score + penalty.delta),
    }));
  },

  nextChallenge: async () => {
    const { difficulty } = get();
    try {
      const challenge = await fetchRandomChallenge({ difficulty });
      set({
        currentChallenge: challenge,
        challengeStartTime: Date.now(),
        hintsRevealed: 0,
        identifiedCipher: null,
        isCipherRevealed: challenge.revealCipher,
        isSolved: false,
        isGameOver: false,
      });
    } catch {
      const fallback = generateChallenge(difficulty);
      set({
        currentChallenge: fallback,
        challengeStartTime: Date.now(),
        hintsRevealed: 0,
        identifiedCipher: null,
        isCipherRevealed: fallback.revealCipher,
        isSolved: false,
        isGameOver: false,
      });
    }
  },

  resetGame: async () => {
    const { difficulty } = get();
    try {
      const challenge = await fetchRandomChallenge({ difficulty });
      set({
        score: 0,
        streak: 0,
        hearts: MAX_HEARTS,
        currentChallenge: challenge,
        challengeStartTime: Date.now(),
        hintsRevealed: 0,
        identifiedCipher: null,
        isCipherRevealed: challenge.revealCipher,
        isSolved: false,
        isGameOver: false,
        scorePopups: [],
      });
    } catch {
      const fallback = generateChallenge(difficulty);
      set({
        score: 0,
        streak: 0,
        hearts: MAX_HEARTS,
        currentChallenge: fallback,
        challengeStartTime: Date.now(),
        hintsRevealed: 0,
        identifiedCipher: null,
        isCipherRevealed: fallback.revealCipher,
        isSolved: false,
        isGameOver: false,
        scorePopups: [],
      });
    }
  },

  addScorePopup: (text, points, isPositive) => {
    const id = `popup_${Date.now()}_${Math.random()}`;
    set((state) => ({
      scorePopups: [...state.scorePopups.slice(-4), { id, text, points, isPositive }],
    }));
  },

  removeScorePopup: (id) => {
    set((state) => ({
      scorePopups: state.scorePopups.filter((p) => p.id !== id),
    }));
  },
}));
