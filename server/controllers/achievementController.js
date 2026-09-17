import Score from '../models/Score.js';

const ACHIEVEMENTS_SPEC = [
  {
    id: 'first_decryption',
    title: 'First Decryption',
    badge: 'STAGE 01',
    description: 'Intercept and successfully decode your first transmission.',
    check: (stats) => stats.totalSolved >= 1,
  },
  {
    id: 'code_breaker',
    title: 'Code Breaker',
    badge: 'DECIPHER 10',
    description: 'Solve 10 cryptographic challenges across any difficulty.',
    check: (stats) => stats.totalSolved >= 10,
  },
  {
    id: 'caesar_master',
    title: 'Caesar Master',
    badge: 'LEGION',
    description: 'Master the Caesar shift cipher with at least 3 verified field decryptions.',
    check: (stats) => (stats.cipherSolves?.caesar || 0) >= 3,
  },
  {
    id: 'no_hint',
    title: 'Pure Analysis',
    badge: 'ZERO HINTS',
    description: 'Solve 5 challenges without using any signal intelligence hints.',
    check: (stats) => stats.hintFreeSolves >= 5,
  },
  {
    id: 'cryptologist',
    title: 'Cryptologist',
    badge: 'PRECISION',
    description: 'Maintain an interception accuracy rate of 90% or higher (minimum 5 attempts).',
    check: (stats) => stats.totalAttempts >= 5 && stats.totalSolved / stats.totalAttempts >= 0.9,
  },
];

export async function getUserAchievements(req, res) {
  try {
    const userId = req.query.userId || 'guest_agent';
    const scores = await Score.find({ userId });

    const totalAttempts = scores.length;
    const totalSolved = scores.filter((s) => s.correct).length;
    const hintFreeSolves = scores.filter((s) => s.correct && s.hintsUsed === 0).length;

    const cipherSolves = {};
    for (const s of scores) {
      if (s.correct) {
        cipherSolves[s.cipherType] = (cipherSolves[s.cipherType] || 0) + 1;
      }
    }

    const stats = {
      totalAttempts,
      totalSolved,
      hintFreeSolves,
      cipherSolves,
    };

    const evaluated = ACHIEVEMENTS_SPEC.map((ach) => ({
      id: ach.id,
      title: ach.title,
      badge: ach.badge,
      description: ach.description,
      unlocked: ach.check(stats),
    }));

    return res.json({
      success: true,
      userId,
      achievements: evaluated,
      unlockedCount: evaluated.filter((a) => a.unlocked).length,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
