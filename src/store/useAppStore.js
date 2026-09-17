import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CIPHERS_CONFIG } from '../data/ciphersConfig.js';
import { ACHIEVEMENTS, evaluateNewAchievements } from '../utils/achievements.js';

const memoryStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

const getStorage = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch {}
  return memoryStorage;
};

export const useAppStore = create(
  persist(
    (set, get) => ({
  hasPlayedIntro: false,
  setHasPlayedIntro: (value = true) => set({ hasPlayedIntro: value }),

  unlockedCiphers: ['caesar', 'atbash', 'reverse', 'rot13'],
  masteredCiphers: [],

  stats: {
    totalAttempts: 0,
    totalSolved: 0,
    hintFreeSolves: 0,
    cipherSolves: {},
    bestStreak: 0,
  },

  unlockedAchievements: [],
  notifiedAchievements: [],
  pendingAchievement: null,

  isUnlocked: (slug) => {
    const { unlockedCiphers, masteredCiphers } = get();
    if (unlockedCiphers.includes(slug)) return true;

    const cipher = CIPHERS_CONFIG.find((c) => c.slug === slug);
    if (!cipher) return false;
    if (cipher.prerequisites.length === 0) return true;
    return cipher.prerequisites.every((prereq) => masteredCiphers.includes(prereq));
  },

  isMastered: (slug) => {
    return get().masteredCiphers.includes(slug);
  },

  unlockCipher: (slug) => {
    set((state) => {
      if (state.unlockedCiphers.includes(slug)) return state;
      return { unlockedCiphers: [...state.unlockedCiphers, slug] };
    });
  },

  masterCipher: (slug) => {
    set((state) => {
      const updatedMastered = state.masteredCiphers.includes(slug)
        ? state.masteredCiphers
        : [...state.masteredCiphers, slug];

      const newUnlocked = new Set([...state.unlockedCiphers, slug]);
      for (const cipher of CIPHERS_CONFIG) {
        if (
          cipher.prerequisites.length > 0 &&
          cipher.prerequisites.every((prereq) => updatedMastered.includes(prereq))
        ) {
          newUnlocked.add(cipher.slug);
        }
      }

      return {
        masteredCiphers: updatedMastered,
        unlockedCiphers: Array.from(newUnlocked),
      };
    });
  },

  getCipherMastery: (slug) => {
    const { masteredCiphers, stats } = get();
    if (masteredCiphers.includes(slug)) return 100;
    const solves = stats.cipherSolves[slug] || 0;
    return Math.min(100, solves * 33);
  },

  recordChallengeResult: ({ cipherType, isCorrect, hintsUsed, currentStreak = 0 }) => {
    set((state) => {
      const prev = state.stats;
      const totalAttempts = prev.totalAttempts + 1;
      const totalSolved = isCorrect ? prev.totalSolved + 1 : prev.totalSolved;
      const hintFreeSolves = isCorrect && hintsUsed === 0 ? prev.hintFreeSolves + 1 : prev.hintFreeSolves;
      const cipherSolves = {
        ...prev.cipherSolves,
        [cipherType]: (prev.cipherSolves[cipherType] || 0) + (isCorrect ? 1 : 0),
      };
      const bestStreak = Math.max(prev.bestStreak, currentStreak);

      const updatedStats = {
        totalAttempts,
        totalSolved,
        hintFreeSolves,
        cipherSolves,
        bestStreak,
      };

      const newlyEarned = evaluateNewAchievements(updatedStats, state.unlockedAchievements);
      let updatedUnlocked = state.unlockedAchievements;
      let nextPending = state.pendingAchievement;
      let updatedNotified = state.notifiedAchievements;

      if (newlyEarned.length > 0) {
        updatedUnlocked = [...state.unlockedAchievements, ...newlyEarned.map((a) => a.id)];

        const unnotified = newlyEarned.find((a) => !state.notifiedAchievements.includes(a.id));
        if (unnotified && !nextPending) {
          nextPending = unnotified;
          updatedNotified = [...state.notifiedAchievements, unnotified.id];
        }
      }

      let updatedMastered = state.masteredCiphers;
      if (cipherSolves[cipherType] >= 3 && !state.masteredCiphers.includes(cipherType)) {
        updatedMastered = [...state.masteredCiphers, cipherType];
      }

      return {
        stats: updatedStats,
        unlockedAchievements: updatedUnlocked,
        notifiedAchievements: updatedNotified,
        pendingAchievement: nextPending,
        masteredCiphers: updatedMastered,
      };
    });
  },

  dismissPendingAchievement: () => {
    set({ pendingAchievement: null });
  },

  resetProgress: () => {
    set({
      hasPlayedIntro: false,
      unlockedCiphers: ['caesar', 'atbash', 'reverse', 'rot13'],
      masteredCiphers: [],
      stats: {
        totalAttempts: 0,
        totalSolved: 0,
        hintFreeSolves: 0,
        cipherSolves: {},
        bestStreak: 0,
      },
      unlockedAchievements: [],
      notifiedAchievements: [],
      pendingAchievement: null,
    });
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem('cipherodyssey_app_storage');
      }
    } catch {}
  },
    }),
    {
      name: 'cipherodyssey_app_storage',
      version: 1,
      migrate: (persistedState) => {
        if (persistedState) {
          delete persistedState.hasPlayedIntro;
        }
        return persistedState;
      },
      storage: createJSONStorage(getStorage),
      partialize: (state) => ({
        unlockedCiphers: state.unlockedCiphers,
        masteredCiphers: state.masteredCiphers,
        stats: state.stats,
        unlockedAchievements: state.unlockedAchievements,
        notifiedAchievements: state.notifiedAchievements,
      }),
    }
  )
);
