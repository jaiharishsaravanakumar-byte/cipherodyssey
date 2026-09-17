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
} from './cipherHelpers.js';
import { getPhraseForDifficulty, MASTER_PHRASE_POOL } from './wordBank.js';

const PHRASE_POOL = MASTER_PHRASE_POOL;

const CIPHER_POOLS = {
  easy: ['caesar', 'atbash', 'reverse', 'rot13'],
  medium: ['affine', 'vigenere', 'rail-fence', 'columnar'],
  hard: ['caesar', 'atbash', 'affine', 'vigenere', 'rail-fence', 'columnar', 'playfair', 'bacon'],
};

const CIPHER_NAMES = {
  caesar: 'Caesar Cipher',
  atbash: 'Atbash Cipher',
  reverse: 'Reverse Cipher',
  rot13: 'ROT13',
  affine: 'Affine Cipher',
  vigenere: 'Vigenère Cipher',
  'rail-fence': 'Rail Fence Cipher',
  columnar: 'Columnar Transposition',
  playfair: 'Playfair Cipher',
  bacon: "Bacon's Cipher",
};

export function generateChallenge(difficulty = 'easy') {
  const pool = CIPHER_POOLS[difficulty] || CIPHER_POOLS.easy;
  const cipherType = pool[Math.floor(Math.random() * pool.length)];
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
        'To decrypt, simply run the reciprocal inversion on each character again.',
      ];
      break;
    }

    case 'reverse': {
      ciphertext = reverseEncode(plaintext);
      hints = [
        'Pure linear transposition: all letters are preserved without substitution.',
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
        `Formula keys: a = ${a}, b = ${b}. Mod inverse is used to decrypt.`,
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
        'Transposition cipher: letters are written along a zigzag path.',
        `The zigzag travels across ${rails} horizontal rail tracks.`,
        `Reconstruct the grid with ${rails} rails to read the original text.`,
      ];
      break;
    }

    case 'columnar': {
      const keys = ['ZEBRA', 'DELTA', 'BRAVO', 'ALPHA'];
      const key = keys[Math.floor(Math.random() * keys.length)];
      params = { key };
      ciphertext = columnarEncode(plaintext, key);
      hints = [
        'Transposition cipher: text is arranged into rectangular columns.',
        `Columns are re-ordered by alphabetical ranking of a ${key.length}-letter word.`,
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
        'The matrix omits the letter J (combining with I).',
        `The matrix key is '${key}'. Swap rectangular corners to decrypt.`,
      ];
      break;
    }

    case 'bacon': {
      ciphertext = baconEncode(plaintext);
      hints = [
        'Steganographic binary cipher: each letter represents 5 bits.',
        "Uses 5-character permutations of 'A' and 'B'.",
        "Tokens like 'AAAAA' = A, 'AAAAB' = B. Spaces separate letters.",
      ];
      break;
    }

    default: {
      ciphertext = caesarEncode(plaintext, 3);
      params = { shift: 3 };
      hints = ['Shift cipher with standard +3 shift.'];
    }
  }

  const revealCipher = difficulty !== 'hard';

  return {
    id: `chal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    cipherType,
    cipherName: CIPHER_NAMES[cipherType] || 'Unknown Cipher',
    difficulty,
    plaintext,
    ciphertext,
    revealCipher,
    params,
    hints,
    createdAt: Date.now(),
  };
}
