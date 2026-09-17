import express from 'express';
import rateLimit from 'express-rate-limit';
import { getAllCiphers, getCipherBySlug } from '../controllers/cipherController.js';
import {
  getRandomChallenge,
  submitChallengeAnswer,
} from '../controllers/challengeController.js';
import { createScore, getScoreSummary } from '../controllers/scoreController.js';
import { getUserAchievements } from '../controllers/achievementController.js';

const router = express.Router();

const challengeRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { success: false, error: 'Rate limit exceeded: too many challenge requests.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.get('/ciphers', getAllCiphers);
router.get('/ciphers/:slug', getCipherBySlug);

router.get('/challenges/random', challengeRateLimiter, getRandomChallenge);
router.post('/challenges/:id/submit', submitChallengeAnswer);

router.post('/scores', createScore);
router.get('/scores/summary', getScoreSummary);

router.get('/achievements', getUserAchievements);

export default router;
