
export const ACHIEVEMENTS = [
  {
    id: 'first_decryption',
    title: 'First Decryption',
    badge: 'STAGE 01',
    description: 'Intercept and successfully decode your first transmission.',
    iconName: 'Terminal',
    rarity: 'Common',
    check: (stats) => stats.totalSolved >= 1,
  },
  {
    id: 'code_breaker',
    title: 'Code Breaker',
    badge: 'DECIPHER 10',
    description: 'Solve 10 cryptographic challenges across any difficulty.',
    iconName: 'ShieldCheck',
    rarity: 'Rare',
    check: (stats) => stats.totalSolved >= 10,
  },
  {
    id: 'caesar_master',
    title: 'Caesar Master',
    badge: 'LEGION',
    description: 'Master the Caesar shift cipher with at least 3 verified field decryptions.',
    iconName: 'Crown',
    rarity: 'Uncommon',
    check: (stats) => (stats.cipherSolves?.caesar || 0) >= 3,
  },
  {
    id: 'no_hint',
    title: 'Pure Analysis',
    badge: 'ZERO HINTS',
    description: 'Solve 5 challenges without using any signal intelligence hints.',
    iconName: 'Zap',
    rarity: 'Rare',
    check: (stats) => stats.hintFreeSolves >= 5,
  },
  {
    id: 'cryptologist',
    title: 'Cryptologist',
    badge: 'PRECISION',
    description: 'Maintain an interception accuracy rate of 90% or higher (minimum 5 attempts).',
    iconName: 'Award',
    rarity: 'Legendary',
    check: (stats) => stats.totalAttempts >= 5 && (stats.totalSolved / stats.totalAttempts) >= 0.9,
  },
];

export function evaluateNewAchievements(stats, alreadyUnlocked = []) {
  const newlyUnlocked = [];
  for (const ach of ACHIEVEMENTS) {
    if (!alreadyUnlocked.includes(ach.id)) {
      if (ach.check(stats)) {
        newlyUnlocked.push(ach);
      }
    }
  }
  return newlyUnlocked;
}
