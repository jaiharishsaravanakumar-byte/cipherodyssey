import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { affineEncode } from '../../utils/cipherHelpers';
import { ChevronLeft, ChevronRight, Calculator, AlertTriangle } from 'lucide-react';

const COPRIMES_26 = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];
const MOD_INVERSES = {
  1: 1, 3: 9, 5: 21, 7: 15, 9: 3, 11: 19,
  15: 7, 17: 23, 19: 11, 21: 5, 23: 17, 25: 25,
};

const EXAMPLE_WORDS = ['AFFINE', 'VECTOR', 'MATRIX', 'SECRET', 'CIPHER'];

export default function AffineControls() {
  const [aIndex, setAIndex] = useState(2);
  const [b, setB] = useState(8);
  const [exampleIndex, setExampleIndex] = useState(0);
  const [customWord, setCustomWord] = useState('');

  const a = COPRIMES_26[aIndex];
  const aInv = MOD_INVERSES[a];

  const currentWord = customWord.trim()
    ? customWord.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 10)
    : EXAMPLE_WORDS[exampleIndex];

  let encodedWord = '';
  try {
    encodedWord = affineEncode(currentWord, a, b);
  } catch (err) {
    encodedWord = currentWord;
  }

  const handlePrevA = () => {
    setAIndex((idx) => (idx > 0 ? idx - 1 : COPRIMES_26.length - 1));
  };

  const handleNextA = () => {
    setAIndex((idx) => (idx < COPRIMES_26.length - 1 ? idx + 1 : 0));
  };

  return (
    <div className="border border-ink-dim/20 bg-panel/90 p-6 sm:p-8 rounded-lg space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink-dim/15 pb-4">
        <div>
          <span className="font-mono text-xs text-signal-amber uppercase tracking-wider">
            Linear Transformation
          </span>
          <h2 className="text-xl font-sans font-bold text-ink-primary mt-1">
            Affine Function Controls
          </h2>
          <p className="text-ink-dim text-xs mt-1">
            Formula: <code className="text-signal-amber font-mono font-bold">E(x) = ({a}·x + {b}) mod 26</code>. Multiplier <code className="text-ink-primary font-mono">a</code> must be coprime to 26 for invertible decryption.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-void border border-signal-amber/40 font-mono text-xs text-signal-amber">
          <Calculator className="w-4 h-4" />
          <span>a⁻¹ = {aInv} mod 26</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 rounded bg-void border border-ink-dim/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-ink-dim uppercase">Slope Multiplier (a)</span>
            <span className="text-xs font-mono text-signal-cyan">gcd({a}, 26) = 1 ✓</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrevA}
              className="p-1.5 rounded bg-panel border border-ink-dim/30 text-ink-dim hover:text-ink-primary micro-transition cursor-pointer"
              title="Previous valid coprime"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex-1 text-center py-2 rounded bg-panel border border-signal-amber/40 font-mono">
              <span className="text-xl font-bold text-signal-amber">a = {a}</span>
            </div>

            <button
              type="button"
              onClick={handleNextA}
              className="p-1.5 rounded bg-panel border border-ink-dim/30 text-ink-dim hover:text-ink-primary micro-transition cursor-pointer"
              title="Next valid coprime"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono text-ink-dim uppercase">Valid Coprimes of 26:</span>
            <div className="flex flex-wrap gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 17, 19, 21, 23, 25].map((val) => {
                const isCoprime = COPRIMES_26.includes(val);
                const isSelected = val === a;
                return (
                  <button
                    key={val}
                    type="button"
                    disabled={!isCoprime}
                    onClick={() => isCoprime && setAIndex(COPRIMES_26.indexOf(val))}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono micro-transition ${
                      isSelected
                        ? 'bg-signal-amber text-bg-void font-bold shadow-[0_0_8px_rgba(232,163,61,0.4)]'
                        : isCoprime
                        ? 'bg-panel border border-ink-dim/30 text-ink-primary hover:border-signal-amber'
                        : 'bg-void text-ink-dim/30 border border-ink-dim/10 cursor-not-allowed line-through'
                    }`}
                    title={isCoprime ? `Select a = ${val}` : `${val} shares factor with 26`}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 rounded bg-void border border-ink-dim/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-ink-dim uppercase">Additive Shift (b)</span>
            <span className="text-xs font-mono text-signal-amber">b ∈ [0..25]</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setB((v) => (v > 0 ? v - 1 : 25))}
              className="p-1.5 rounded bg-panel border border-ink-dim/30 text-ink-dim hover:text-ink-primary micro-transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex-1 text-center py-2 rounded bg-panel border border-signal-cyan/40 font-mono">
              <span className="text-xl font-bold text-signal-cyan">b = {b}</span>
            </div>

            <button
              type="button"
              onClick={() => setB((v) => (v < 25 ? v + 1 : 0))}
              className="p-1.5 rounded bg-panel border border-ink-dim/30 text-ink-dim hover:text-ink-primary micro-transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <input
            type="range"
            min={0}
            max={25}
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            className="w-full accent-signal-cyan cursor-pointer"
          />

          <div className="text-[11px] font-mono text-ink-dim flex justify-between">
            <span>Decryption:</span>
            <span className="text-signal-cyan font-bold">D(y) = {aInv}·(y - {b}) mod 26</span>
          </div>
        </div>
      </div>

      <div className="rounded bg-void p-5 border border-ink-dim/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-signal-cyan font-bold uppercase tracking-wider">
              Affine Transform Engine:
            </span>
            <span className="font-mono text-xs text-ink-dim">
              [E(x) = ({a}x + {b}) mod 26]
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {EXAMPLE_WORDS.map((w, idx) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => {
                    setCustomWord('');
                    setExampleIndex(idx);
                  }}
                  className={`px-2 py-0.5 rounded font-mono text-xs micro-transition cursor-pointer ${
                    !customWord && exampleIndex === idx
                      ? 'bg-signal-cyan/20 text-signal-cyan border border-signal-cyan/50'
                      : 'text-ink-dim hover:text-ink-primary'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>

            <input
              type="text"
              maxLength={10}
              placeholder="Custom..."
              value={customWord}
              onChange={(e) => setCustomWord(e.target.value.toUpperCase())}
              className="w-24 px-2 py-0.5 text-xs font-mono rounded bg-panel border border-ink-dim/30 text-ink-primary focus:outline-none focus:border-signal-cyan"
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 sm:gap-4 py-2 overflow-x-auto">
          {currentWord.split('').map((char, index) => {
            const cipherChar = encodedWord[index] || '';
            const xVal = char.charCodeAt(0) - 65;
            const stepVal = (a * xVal + b) % 26;
            return (
              <div
                key={`${char}-${index}`}
                className="flex flex-col items-center p-2.5 rounded bg-panel/70 border border-ink-dim/20 min-w-[3.8rem]"
              >
                <span className="font-mono text-xs text-ink-dim mb-1">
                  {char} ({xVal})
                </span>

                <div className="w-10 h-10 rounded bg-void border border-signal-amber/60 flex items-center justify-center font-mono text-lg font-bold text-signal-amber shadow-[0_0_10px_rgba(232,163,61,0.2)]">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={`${cipherChar}-${a}-${b}`}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.12 }}
                    >
                      {cipherChar}
                    </motion.span>
                  </AnimatePresence>
                </div>

                <span className="font-mono text-[9px] text-signal-cyan mt-1.5">
                  mod26: {stepVal}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
