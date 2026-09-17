import Challenge from '../models/Challenge.js';
import Score from '../models/Score.js';
import {
  caesarEncode,
  atbashEncode,
  reverseEncode,
  rot13Encode,
  affineEncode,
  vigenereEncode,
  railFenceEncode,
  columnarEncode,
  playfairEncode,
  preparePlayfairText,
  baconEncode,
} from '../utils/cipherEngine.js';
import { calculateScore } from '../utils/scoring.js';
import { getPhraseForDifficulty, MASTER_PHRASE_POOL } from '../utils/wordBank.js';

const PHRASE_POOL = MASTER_PHRASE_POOL;

const DIFFICULTY_POOLS = {
  easy: ['caesar', 'atbash', 'reverse', 'rot13'],
  medium: ['affine', 'vigenere', 'rail-fence', 'columnar'],
  hard: ['caesar', 'atbash', 'affine', 'vigenere', 'rail-fence', 'columnar', 'playfair', 'bacon'],
};

export async function getRandomChallenge(req, res) {
  try {
    const difficulty = (req.query.difficulty || 'easy').toLowerCase();
    const explicitCipher = req.query.cipher ? req.query.cipher.toLowerCase() : null;

    const pool = DIFFICULTY_POOLS[difficulty] || DIFFICULTY_POOLS.easy;
    const cipherType = explicitCipher || pool[Math.floor(Math.random() * pool.length)];
    const rawPhrase = getPhraseForDifficulty(difficulty);

    let plaintext = rawPhrase;
    let ciphertext = '';
    let params = {};
    let hints = [];

    switch (cipherType) {
      case 'caesar': {
        const shift = Math.floor(Math.random() * 5) + 2;
        params = { shift };
        ciphertext = caesarEncode(plaintext, shift);
        hints = [
          'Monoalphabetic shift: every letter moved by a fixed distance.',
          `The letter 'A' enciphers to '${caesarEncode('A', shift)}'.`,
          `The secret key is a forward shift of +${shift}.`,
        ];
        break;
      }
      case 'atbash': {
        ciphertext = atbashEncode(plaintext);
        hints = [
          'Ancient Hebrew reciprocal cipher: the alphabet is completely inverted.',
          "Symmetric pairing: 'A' mirrors to 'Z', 'B' mirrors to 'Y'.",
          'To decrypt, invert the alphabet symmetrically again.',
        ];
        break;
      }
      case 'reverse': {
        ciphertext = reverseEncode(plaintext);
        hints = [
          'Pure linear transposition: all letters preserved without substitution.',
          'The last letter of the transmission is now at the very beginning.',
          'Read the ciphertext backwards from right to left.',
        ];
        break;
      }
      case 'rot13': {
        ciphertext = rot13Encode(plaintext);
        hints = [
          'Special Caesar rotation: splits the 26-letter alphabet into equal halves.',
          'Shifting twice by this key returns the exact original plaintext.',
          'The rotation key is exactly +13.',
        ];
        break;
      }
      case 'affine': {
        const aChoices = [3, 5, 7, 9, 11];
        const a = aChoices[Math.floor(Math.random() * aChoices.length)];
        const b = Math.floor(Math.random() * 6) + 2;
        params = { a, b };
        ciphertext = affineEncode(plaintext, a, b);
        hints = [
          'Modular arithmetic: letters transformed by E(x) = (ax + b) mod 26.',
          `The linear multiplier parameter is a = ${a}.`,
          `Formula keys: a = ${a}, b = ${b}. Mod inverse decrypts.`,
        ];
        break;
      }
      case 'vigenere': {
        const keys = ['CIPHER', 'SHIELD', 'ROMAN', 'SECRET', 'KEY'];
        const key = keys[Math.floor(Math.random() * keys.length)];
        params = { key };
        ciphertext = vigenereEncode(plaintext, key);
        hints = [
          'Polyalphabetic cipher: uses a repeating keyword to vary shifts.',
          `The keyword length is ${key.length} characters long.`,
          `The secret keyword is '${key}'.`,
        ];
        break;
      }
      case 'rail-fence': {
        const rails = Math.random() > 0.5 ? 3 : 2;
        params = { rails };
        ciphertext = railFenceEncode(plaintext, rails);
        hints = [
          'Transposition cipher: letters written along a zigzag path.',
          `The zigzag travels across ${rails} horizontal rail tracks.`,
          `Reconstruct the grid with ${rails} rails.`,
        ];
        break;
      }
      case 'columnar': {
        const keys = ['ZEBRA', 'DELTA', 'BRAVO', 'ALPHA'];
        const key = keys[Math.floor(Math.random() * keys.length)];
        params = { key };
        ciphertext = columnarEncode(plaintext, key);
        hints = [
          'Transposition cipher: text arranged into rectangular columns.',
          `Columns re-ordered by alphabetical ranking of '${key}'.`,
          `The column transposition key is '${key}'.`,
        ];
        break;
      }
      case 'playfair': {
        const key = 'MONARCHY';
        params = { key };
        plaintext = preparePlayfairText(plaintext).join('');
        ciphertext = playfairEncode(plaintext, key);
        hints = [
          'Digraphic substitution: encodes pairs of letters across a 5×5 matrix.',
          'The matrix omits J (merging with I).',
          `The matrix key is '${key}'.`,
        ];
        break;
      }
      case 'bacon': {
        ciphertext = baconEncode(plaintext);
        hints = [
          'Steganographic binary cipher: each letter represents 5 bits.',
          "Uses 5-character permutations of 'A' and 'B'.",
          "Tokens like 'AAAAA' = A, 'AAAAB' = B.",
        ];
        break;
      }
      default: {
        ciphertext = caesarEncode(plaintext, 3);
        params = { shift: 3 };
        hints = ['Shift cipher with +3 shift.'];
      }
    }

    const cipherRevealed = difficulty !== 'hard';

    const doc = await Challenge.create({
      cipherType,
      plaintext,
      ciphertext,
      difficulty,
      cipherRevealed,
      params,
      points: 100,
      hints,
    });

    return res.json({
      success: true,
      challenge: {
        id: doc._id,
        cipherType: cipherRevealed ? cipherType : '???',
        cipherRevealed,
        difficulty,
        ciphertext,
        hints,
        points: doc.points,
        createdAt: doc.createdAt,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function submitChallengeAnswer(req, res) {
  try {
    const { id } = req.params;
    const { answer, cipherGuess, hintsUsed = 0, timeTakenSec = 0, userId = 'guest_agent' } = req.body;

    if (!id || typeof answer !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Missing required challenge id or answer string.',
      });
    }

    const challenge = await Challenge.findById(id);
    if (!challenge) {
      return res.status(404).json({ success: false, error: 'Challenge not found or expired.' });
    }

    const cleanInput = answer.trim().toUpperCase().replace(/[^A-Z0-9 ]/g, '');
    const cleanTarget = challenge.plaintext.trim().toUpperCase().replace(/[^A-Z0-9 ]/g, '');

    const isCorrect = cleanInput === cleanTarget;
    const wasCipherHidden = !challenge.cipherRevealed;
    const identifiedCipherCorrectly =
      wasCipherHidden && typeof cipherGuess === 'string' && cipherGuess.toLowerCase() === challenge.cipherType;

    const scoringResult = calculateScore({
      isCorrect,
      identifiedCipherCorrectly,
      wasCipherHidden,
      hintsUsed: Number(hintsUsed) || 0,
      timeTakenSec: Number(timeTakenSec) || 0,
    });

    const scoreRecord = await Score.create({
      userId,
      cipherType: challenge.cipherType,
      correct: isCorrect,
      cipherIdCorrect: identifiedCipherCorrectly,
      score: scoringResult.pointsAwarded,
      timeTakenSec: Number(timeTakenSec) || 0,
      hintsUsed: Number(hintsUsed) || 0,
    });

    return res.json({
      success: true,
      correct: isCorrect,
      cipherIdCorrect: identifiedCipherCorrectly,
      pointsAwarded: scoringResult.pointsAwarded,
      breakdown: scoringResult.breakdown,
      scoreId: scoreRecord._id,
      expected: isCorrect ? challenge.plaintext : undefined,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
