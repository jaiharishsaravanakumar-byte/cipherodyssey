import {
  caesarEncode,
  atbashEncode,
  reverseEncode,
  rot13Encode,
  affineEncode,
  vigenereEncode,
  columnarEncode,
  railFenceEncode,
  playfairEncode,
  baconEncode,
} from './cipherHelpers.js';
import { CIPHERS_CONFIG } from '../data/ciphersConfig.js';

export const PIPELINE_CIPHER_LABELS = {
  caesar: 'Caesar',
  atbash: 'Atbash',
  reverse: 'Reverse',
  rot13: 'ROT13',
  affine: 'Affine',
  vigenere: 'Vigenère',
  columnar: 'Columnar',
  'rail-fence': 'Rail Fence',
  playfair: 'Playfair',
  bacon: "Bacon's",
};

export function getDefaultParams(cipherId) {
  const config = CIPHERS_CONFIG.find((c) => c.id === cipherId || c.slug === cipherId);
  return config ? { ...config.defaultParams } : {};
}

function encodeWithCipher(text, cipherId, params = {}) {
  switch (cipherId) {
    case 'caesar':
      return caesarEncode(text, params.shift ?? 3);
    case 'atbash':
      return atbashEncode(text);
    case 'reverse':
      return reverseEncode(text);
    case 'rot13':
      return rot13Encode(text);
    case 'affine':
      return affineEncode(text, params.a ?? 5, params.b ?? 8);
    case 'vigenere':
      return vigenereEncode(text, params.key ?? 'CIPHER');
    case 'columnar':
      return columnarEncode(text, params.key ?? 'SECRET');
    case 'rail-fence':
      return railFenceEncode(text, params.rails ?? 3);
    case 'playfair':
      return playfairEncode(text, params.key ?? 'MONARCHY');
    case 'bacon':
      return baconEncode(text);
    default:
      return text;
  }
}

function buildParamLabel(cipherId, params) {
  switch (cipherId) {
    case 'caesar':
      return `Shift +${params.shift ?? 3}`;
    case 'atbash':
      return 'Mirror A↔Z';
    case 'reverse':
      return 'Reverse order';
    case 'rot13':
      return 'Shift +13';
    case 'affine':
      return `a=${params.a ?? 5}, b=${params.b ?? 8}`;
    case 'vigenere':
      return `Key: ${(params.key ?? 'CIPHER').toUpperCase()}`;
    case 'columnar':
      return `Key: ${(params.key ?? 'SECRET').toUpperCase()}`;
    case 'rail-fence':
      return `${params.rails ?? 3} rails`;
    case 'playfair':
      return `Key: ${(params.key ?? 'MONARCHY').toUpperCase()}`;
    case 'bacon':
      return '5-bit binary';
    default:
      return '';
  }
}

export function runCipherPipeline(input, stages) {
  if (!input || !input.trim()) {
    return { input, stages: [], finalOutput: '', error: 'Input is required.' };
  }
  if (!stages || stages.length !== 3) {
    return { input, stages: [], finalOutput: '', error: 'Exactly 3 ciphers required.' };
  }

  const results = [];
  let current = input;

  for (let i = 0; i < stages.length; i++) {
    const { cipherId, params = {} } = stages[i];
    if (!cipherId) {
      return { input, stages: [], finalOutput: '', error: `Stage ${i + 1} cipher not selected.` };
    }
    const stageInput = current;
    try {
      const output = encodeWithCipher(stageInput, cipherId, params);
      results.push({
        index: i,
        cipherId,
        label: PIPELINE_CIPHER_LABELS[cipherId] ?? cipherId,
        paramLabel: buildParamLabel(cipherId, params),
        input: stageInput,
        output,
      });
      current = output;
    } catch (err) {
      return {
        input,
        stages: results,
        finalOutput: '',
        error: `Stage ${i + 1} (${PIPELINE_CIPHER_LABELS[cipherId]}): ${err.message}`,
      };
    }
  }

  return { input, stages: results, finalOutput: current, error: null };
}
