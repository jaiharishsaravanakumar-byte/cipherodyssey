import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  caesarEncode,
  caesarDecode,
  atbashEncode,
  atbashDecode,
  reverseEncode,
  reverseDecode,
  rot13Encode,
  rot13Decode,
  affineEncode,
  affineDecode,
  vigenereEncode,
  vigenereDecode,
  railFenceEncode,
  railFenceDecode,
  columnarEncode,
  columnarDecode,
  playfairEncode,
  playfairDecode,
  baconEncode,
  baconDecode,
} from '../utils/cipherHelpers';
import { inputShakeVariant, successPopVariant } from '../utils/animationVariants';
import { useAppStore } from '../store/useAppStore';
import { CIPHER_LESSONS } from '../data/cipherLessons';
import { CheckCircle2, AlertCircle, RefreshCw, Trophy, ArrowRight } from 'lucide-react';

const DEFAULT_CHALLENGE_WORDS = ['SPARTA', 'VERITAS', 'LEGION', 'ORACLE', 'SENATE', 'EMPIRE', 'TRIUMPH'];

export default function TryItYourself({ cipherId = 'caesar' }) {
  const { masterCipher, isMastered } = useAppStore();

  const [mode, setMode] = useState('encode');
  const [shift, setShift] = useState(3);
  const [affineKeys, setAffineKeys] = useState({ a: 5, b: 8 });
  const [keyword, setKeyword] = useState('KEY');
  const [rails, setRails] = useState(3);
  const [targetWord, setTargetWord] = useState('VERITAS');
  const [userAnswer, setUserAnswer] = useState('');
  const [feedbackState, setFeedbackState] = useState('idle');
  const [streak, setStreak] = useState(0);


  const generateNewChallenge = useCallback(() => {
    const lessonConfig = CIPHER_LESSONS[cipherId]?.tryIt;
    const wordPool = lessonConfig?.words || DEFAULT_CHALLENGE_WORDS;
    const randomWord = wordPool[Math.floor(Math.random() * wordPool.length)];

    if (cipherId === 'caesar') {
      const randomShift = Math.floor(Math.random() * 5) + 2;
      setShift(randomShift);
    } else if (cipherId === 'affine') {
      const aChoices = [3, 5, 7, 9, 11];
      const a = aChoices[Math.floor(Math.random() * aChoices.length)];
      const b = Math.floor(Math.random() * 6) + 2;
      setAffineKeys({ a, b });
    } else if (cipherId === 'vigenere') {
      const keys = ['KEY', 'LEMON', 'ROMAN', 'CIPHER'];
      setKeyword(keys[Math.floor(Math.random() * keys.length)]);
    } else if (cipherId === 'rail-fence') {
      setRails(Math.random() > 0.5 ? 3 : 2);
    } else if (cipherId === 'columnar') {
      const keys = ['ZEBRA', 'SECRET', 'BRAVO'];
      setKeyword(keys[Math.floor(Math.random() * keys.length)]);
    } else if (cipherId === 'playfair') {
      setKeyword('MONARCHY');
    }

    setTargetWord(randomWord);
    setUserAnswer('');
    setFeedbackState('idle');
  }, [cipherId]);

  useEffect(() => {
    generateNewChallenge();
  }, [generateNewChallenge]);

  
  const encodeText = (text) => {
    switch (cipherId) {
      case 'caesar': return caesarEncode(text, shift);
      case 'atbash': return atbashEncode(text);
      case 'reverse': return reverseEncode(text);
      case 'rot13': return rot13Encode(text);
      case 'affine': return affineEncode(text, affineKeys.a, affineKeys.b);
      case 'vigenere': return vigenereEncode(text, keyword);
      case 'rail-fence': return railFenceEncode(text, rails);
      case 'columnar': return columnarEncode(text, keyword);
      case 'playfair': return playfairEncode(text, keyword);
      case 'bacon': return baconEncode(text);
      default: return caesarEncode(text, shift);
    }
  };

  const decodeText = (text) => {
    switch (cipherId) {
      case 'caesar': return caesarDecode(text, shift);
      case 'atbash': return atbashDecode(text);
      case 'reverse': return reverseDecode(text);
      case 'rot13': return rot13Decode(text);
      case 'affine': return affineDecode(text, affineKeys.a, affineKeys.b);
      case 'vigenere': return vigenereDecode(text, keyword);
      case 'rail-fence': return railFenceDecode(text, rails);
      case 'columnar': return columnarDecode(text, keyword);
      case 'playfair': return playfairDecode(text, keyword);
      case 'bacon': return baconDecode(text);
      default: return caesarDecode(text, shift);
    }
  };

  const encodedTarget = encodeText(targetWord);
  const promptText = mode === 'encode' ? targetWord : encodedTarget;
  const expectedAnswer = mode === 'encode' ? encodedTarget : targetWord;

  
  const getParamBadge = () => {
    switch (cipherId) {
      case 'caesar': return `Shift: +${shift}`;
      case 'atbash': return 'Symmetric A↔Z';
      case 'reverse': return 'Invert Order ←';
      case 'rot13': return 'Shift: +13 (Fixed)';
      case 'affine': return `a=${affineKeys.a}, b=${affineKeys.b}`;
      case 'vigenere': return `Key: ${keyword}`;
      case 'rail-fence': return `Rails: ${rails}`;
      case 'columnar': return `Key: ${keyword}`;
      case 'playfair': return `Matrix Key: ${keyword}`;
      case 'bacon': return '5-Bit A/B Code';
      default: return `Shift: +${shift}`;
    }
  };

  const getInstructions = () => {
    if (mode === 'encode') {
      switch (cipherId) {
        case 'caesar': return `Shift each letter forward by +${shift}.`;
        case 'atbash': return 'Reflect each letter symmetrically (A↔Z, B↔Y).';
        case 'reverse': return 'Invert character sequence backwards.';
        case 'rot13': return 'Rotate each letter forward by +13.';
        case 'affine': return `Calculate E(x) = (${affineKeys.a}·x + ${affineKeys.b}) mod 26.`;
        case 'vigenere': return `Repeat key '${keyword}' and shift each position.`;
        case 'rail-fence': return `Weave across ${rails} rails and read line by line.`;
        case 'columnar': return `Fill grid by columns in alphabetical order of '${keyword}'.`;
        case 'playfair': return `Apply 5×5 rules for digraphs with key '${keyword}'.`;
        case 'bacon': return 'Convert each letter into its 5-bit A/B binary sequence.';
        default: return `Shift each letter forward by +${shift}.`;
      }
    } else {
      return 'Recover the original plaintext transmission from the ciphertext above.';
    }
  };

  const handleVerify = (e) => {
    if (e) e.preventDefault();
    if (!userAnswer.trim()) return;

    const normalizedInput = userAnswer.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    const normalizedExpected = expectedAnswer.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');

    if (normalizedInput === normalizedExpected) {
      setFeedbackState('success');
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (!isMastered(cipherId) && nextStreak >= 1) {
        masterCipher(cipherId);
      }
    } else {
      setFeedbackState('error');
    }
  };

  return (
    <div className="border border-ink-dim/20 bg-panel/90 p-6 sm:p-8 rounded-lg space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ink-dim/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-signal-amber uppercase tracking-wider">
              Interactive Terminal
            </span>
            {isMastered(cipherId) && (
              <span className="flex items-center gap-1 text-[11px] font-mono text-signal-amber bg-signal-amber/10 px-2 py-0.5 rounded border border-signal-amber/30">
                <Trophy className="w-3 h-3" /> Mastered
              </span>
            )}
          </div>
          <h2 className="text-xl font-sans font-bold text-ink-primary mt-1">
            Try It Yourself
          </h2>
          <p className="text-ink-dim text-xs mt-1">
            Validate your manual encipherment and decipherment skills with dynamic verification.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-void p-1 rounded border border-ink-dim/20 font-mono text-xs">
          <button
            type="button"
            onClick={() => {
              setMode('encode');
              setUserAnswer('');
              setFeedbackState('idle');
            }}
            className={`px-3 py-1 rounded micro-transition cursor-pointer ${
              mode === 'encode'
                ? 'bg-signal-amber text-bg-void font-bold'
                : 'text-ink-dim hover:text-ink-primary'
            }`}
          >
            Encode
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('decode');
              setUserAnswer('');
              setFeedbackState('idle');
            }}
            className={`px-3 py-1 rounded micro-transition cursor-pointer ${
              mode === 'decode'
                ? 'bg-signal-cyan text-bg-void font-bold'
                : 'text-ink-dim hover:text-ink-primary'
            }`}
          >
            Decode
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="p-4 rounded bg-void border border-ink-dim/20 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-ink-dim">
            <span>{mode === 'encode' ? 'PLAINTEXT' : 'INTERCEPTED CIPHERTEXT'}</span>
            <span className="text-signal-amber">{getParamBadge()}</span>
          </div>
          <div className="font-mono text-xl sm:text-2xl font-bold tracking-widest text-ink-primary break-all">
            {promptText}
          </div>
          <p className="text-[11px] font-sans text-ink-dim">
            {getInstructions()}
          </p>
        </div>

        <form onSubmit={handleVerify} className="p-4 rounded bg-void border border-ink-dim/20 flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-ink-dim">
              <span>YOUR {mode === 'encode' ? 'CIPHERTEXT' : 'PLAINTEXT'}</span>
              <span>Streak: {streak}</span>
            </div>

            <motion.div
              variants={inputShakeVariant}
              animate={feedbackState === 'error' ? 'shake' : 'idle'}
              onAnimationComplete={() => {
                if (feedbackState === 'error') {
                }
              }}
            >
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => {
                  setUserAnswer(e.target.value.toUpperCase());
                  if (feedbackState !== 'idle') setFeedbackState('idle');
                }}
                placeholder={mode === 'encode' ? 'ENTER CIPHERTEXT...' : 'ENTER PLAINTEXT...'}
                className={`w-full px-3 py-2 rounded bg-panel font-mono text-sm uppercase tracking-widest border micro-transition focus:outline-none ${
                  feedbackState === 'error'
                    ? 'border-signal-red text-signal-red focus:border-signal-red'
                    : feedbackState === 'success'
                    ? 'border-signal-amber text-signal-amber'
                    : 'border-ink-dim/40 text-ink-primary focus:border-signal-cyan'
                }`}
              />
            </motion.div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={!userAnswer.trim()}
              className="flex-1 px-4 py-2 bg-signal-amber text-bg-void font-mono font-semibold text-xs tracking-wider uppercase rounded micro-transition hover-glow-amber disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Verify Transmission
            </button>

            <button
              type="button"
              onClick={() => generateNewChallenge()}
              className="p-2 rounded bg-panel border border-ink-dim/30 text-ink-dim hover:text-ink-primary hover:border-ink-dim/60 micro-transition cursor-pointer"
              title="Next challenge"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {feedbackState === 'success' && (
        <motion.div
          variants={successPopVariant}
          initial="idle"
          animate="pop"
          className="p-4 rounded bg-signal-amber/10 border border-signal-amber/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5 text-signal-amber">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div>
              <div className="font-mono text-xs font-bold uppercase">
                Verification Confirmed
              </div>
              <div className="text-xs text-ink-dim font-sans mt-0.5">
                Exact mathematical match: <code className="text-signal-amber font-mono font-bold">{expectedAnswer}</code>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => generateNewChallenge()}
            className="px-3 py-1.5 rounded bg-signal-amber text-bg-void font-mono text-xs font-bold uppercase flex items-center gap-1.5 micro-transition hover:opacity-90 self-start sm:self-auto cursor-pointer"
          >
            <span>Next Vector</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      {feedbackState === 'error' && (
        <div className="p-3.5 rounded bg-signal-red/10 border border-signal-red/40 flex items-center gap-2.5 text-signal-red text-xs font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            Mismatch detected. Check letter positions against the shift key (+{shift}) and retry.
          </span>
        </div>
      )}
    </div>
  );
}
