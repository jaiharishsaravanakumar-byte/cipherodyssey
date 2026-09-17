import Score from '../models/Score.js';

export async function createScore(req, res) {
  try {
    const {
      userId = 'guest_agent',
      cipherType,
      correct,
      cipherIdCorrect = false,
      score = 0,
      timeTakenSec = 0,
      hintsUsed = 0,
    } = req.body;

    if (!cipherType || typeof correct !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'cipherType and boolean correct status are required.',
      });
    }

    const newScore = await Score.create({
      userId,
      cipherType,
      correct,
      cipherIdCorrect,
      score: Number(score) || 0,
      timeTakenSec: Number(timeTakenSec) || 0,
      hintsUsed: Number(hintsUsed) || 0,
    });

    return res.status(201).json({ success: true, data: newScore });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function getScoreSummary(req, res) {
  try {
    const userId = req.query.userId || 'guest_agent';
    const scores = await Score.find({ userId }).sort({ createdAt: 1 });

    const totalAttempts = scores.length;
    const totalSolved = scores.filter((s) => s.correct).length;
    const accuracy = totalAttempts > 0 ? Math.round((totalSolved / totalAttempts) * 100) : 100;
    const totalScore = Math.max(0, scores.reduce((acc, curr) => acc + curr.score, 0));

    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    for (const s of scores) {
      if (s.correct) {
        tempStreak++;
        if (tempStreak > bestStreak) bestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    }
    for (let i = scores.length - 1; i >= 0; i--) {
      if (scores[i].correct) {
        currentStreak++;
      } else {
        break;
      }
    }

    const cipherSolves = {};
    for (const s of scores) {
      if (s.correct) {
        cipherSolves[s.cipherType] = (cipherSolves[s.cipherType] || 0) + 1;
      }
    }

    const cipherMastery = {};
    for (const [slug, count] of Object.entries(cipherSolves)) {
      cipherMastery[slug] = Math.min(100, count * 33);
    }

    return res.json({
      success: true,
      userId,
      summary: {
        totalScore,
        totalAttempts,
        totalSolved,
        accuracy,
        currentStreak,
        bestStreak,
        cipherSolves,
        cipherMastery,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
