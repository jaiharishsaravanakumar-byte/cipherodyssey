import { CIPHERS_CONFIG } from '../data/ciphersConfig.js';
import { runCipherPipeline } from './cipherPipeline.js';

const BASE_SCORES = {
  reverse: 18,
  atbash: 22,
  rot13: 28,
  caesar: 30,
  bacon: 40,
  affine: 45,
  'rail-fence': 55,
  columnar: 65,
  vigenere: 72,
  playfair: 85,
};

const SCORE_FACTORS = {
  reverse: [
    'No key — trivially reversible',
    'Pattern analysis reveals structure immediately',
    'Offers no substitution — order-only transformation',
  ],
  atbash: [
    'Fixed key — only one possible transformation',
    'Symmetrical: ciphertext reveals alphabet structure',
    'Single monoalphabetic substitution alphabet',
  ],
  rot13: [
    'Fixed shift of 13 — self-reciprocal',
    'Subtype of Caesar with zero key space',
    'Frequency analysis defeats it trivially',
  ],
  caesar: [
    'Only 25 possible keys — brute force in seconds',
    'Preserves letter frequency distribution',
    'Vulnerable to frequency and pattern analysis',
  ],
  bacon: [
    'Output is dramatically longer than input',
    'Binary pattern is visually obvious',
    'No key dependency — deterministic mapping',
  ],
  affine: [
    'Limited coprime key space (~312 combinations)',
    'Still monoalphabetic — frequency analysis applies',
    'Mathematical structure constrains key selection',
  ],
  'rail-fence': [
    'Rail count is a small numeric key space',
    'Transposition preserves original letter frequencies',
    'Pattern analysis can reveal rail structure',
  ],
  columnar: [
    'Keyword determines column ordering',
    'Larger key space than simple rail-fence',
    'Transposition makes frequency analysis harder',
  ],
  vigenere: [
    'Uses a repeating keyword across positions',
    'Multiple substitution alphabets resist simple frequency analysis',
    'Vulnerable to Kasiski examination for short keys',
  ],
  playfair: [
    'Operates on digraphs — breaks single-letter frequency analysis',
    'Keyed 5×5 matrix creates complex substitution',
    'Strongest classical substitution cipher implemented here',
  ],
};

const SCORE_NOTES = {
  reverse: 'Trivially reversed — used here purely as a pattern foundation.',
  atbash: 'Fixed-key monoalphabetic substitution with no real key space.',
  rot13: 'A special case of Caesar with no configurable key.',
  caesar: 'Shift cipher with 25 possible keys — educational entry point.',
  bacon: 'Steganographic encoding; obscurity rather than key strength.',
  affine: 'Extends Caesar with modular arithmetic, but key space stays small.',
  'rail-fence': 'Transposition that resists substitution attacks but not structure analysis.',
  columnar: 'Keyed transposition offering moderate structural complexity.',
  vigenere: 'Polyalphabetic substitution — a significant step up from monoalphabetic ciphers.',
  playfair: 'Digraphic substitution — the most complex cipher in this collection.',
};

export function calculateResistanceScore(cipherId) {
  const score = BASE_SCORES[cipherId] ?? 30;
  const config = CIPHERS_CONFIG.find((c) => c.id === cipherId || c.slug === cipherId);
  const difficulty = config?.difficultyTier ?? 'Beginner';

  let tier;
  if (score < 30) tier = 'Low';
  else if (score < 61) tier = 'Moderate';
  else if (score < 81) tier = 'High';
  else tier = 'Very High';

  return {
    score,
    tier,
    difficulty,
    factors: SCORE_FACTORS[cipherId] ?? ['Classical cipher'],
    note: SCORE_NOTES[cipherId] ?? '',
    disclaimer: 'Educational heuristic — not a real cryptographic security probability.',
  };
}

export function calculatePipelineResistanceScore(stages) {
  if (!stages || stages.length !== 3) return { score: 0, tier: 'Low', factors: [], note: '' };

  const scores = stages.map((s) => BASE_SCORES[s.cipherId] ?? 30);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const score = Math.min(100, Math.round(avg * 1.15));

  let tier;
  if (score < 30) tier = 'Low';
  else if (score < 61) tier = 'Moderate';
  else if (score < 81) tier = 'High';
  else tier = 'Very High';

  return {
    score,
    tier,
    difficulty: 'Pipeline',
    factors: [
      'Combines three separate transformation layers',
      'Output of each cipher becomes input for the next',
      'Chaining increases structural complexity',
    ],
    note: 'Composed score based on the average resistance of the three selected ciphers, boosted by layering.',
    disclaimer: 'Educational heuristic — not a real cryptographic security probability.',
  };
}

export function compareAllCiphers(input, pipelineStages, includePipeline) {
  const results = CIPHERS_CONFIG.map((config) => {
    const { score, tier, difficulty, factors, note, disclaimer } = calculateResistanceScore(config.id);

    let output = '';
    try {
      const r = runCipherPipeline(input, [{ cipherId: config.id, params: config.defaultParams }]);
      output = r.stages[0]?.output ?? '';
    } catch {
      output = '—';
    }

    return {
      id: config.id,
      name: config.name,
      score,
      tier,
      difficulty,
      output,
      factors,
      note,
      disclaimer,
      isPipeline: false,
    };
  });

  if (includePipeline && pipelineStages && pipelineStages.every((s) => s.cipherId)) {
    const pipelineResult = runCipherPipeline(input, pipelineStages);
    const { score, tier, factors, note, disclaimer } = calculatePipelineResistanceScore(pipelineStages);
    const pipelineLabel = pipelineStages.map((s) => {
      const names = { caesar: 'Caesar', atbash: 'Atbash', reverse: 'Reverse', rot13: 'ROT13', affine: 'Affine', vigenere: 'Vigenère', columnar: 'Columnar', 'rail-fence': 'Rail Fence', playfair: 'Playfair', bacon: "Bacon's" };
      return names[s.cipherId] ?? s.cipherId;
    }).join(' → ');

    results.push({
      id: 'pipeline',
      name: pipelineLabel,
      score,
      tier,
      difficulty: 'Pipeline',
      output: pipelineResult.finalOutput || '—',
      factors,
      note,
      disclaimer,
      isPipeline: true,
    });
  }

  results.sort((a, b) => b.score - a.score);
  return results;
}
