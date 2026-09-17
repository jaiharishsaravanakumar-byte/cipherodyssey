import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { reverseEncode } from '../../utils/cipherHelpers';
import { ArrowLeftRight, RotateCcw } from 'lucide-react';

const EXAMPLE_WORDS = ['CIPHER', 'LABORATORY', 'ENIGMA', 'BEACON', 'MATRIX'];

export default function ReverseDemo() {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [customWord, setCustomWord] = useState('');
  const [isFlipped, setIsFlipped] = useState(true);

  const currentWord = customWord.trim()
    ? customWord.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 10)
    : EXAMPLE_WORDS[exampleIndex];

  const reversed = reverseEncode(currentWord);
  const len = currentWord.length;

  return (
    <div className="border border-ink-dim/20 bg-panel/90 p-6 sm:p-8 rounded-lg space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink-dim/15 pb-4">
        <div>
          <span className="font-mono text-xs text-signal-amber uppercase tracking-wider">
            Index Inversion
          </span>
          <h2 className="text-xl font-sans font-bold text-ink-primary mt-1">
            Reverse Transposition Array
          </h2>
          <p className="text-ink-dim text-xs mt-1">
            Transposition alters letter positions rather than letter identities. Character at index <code className="text-signal-cyan font-mono">i</code> moves to <code className="text-signal-amber font-mono">L - 1 - i</code>.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFlipped((f) => !f)}
          className="flex items-center gap-2 px-4 py-2 rounded bg-signal-amber/15 border border-signal-amber/50 font-mono text-xs text-signal-amber hover:bg-signal-amber/25 micro-transition cursor-pointer self-start sm:self-auto"
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>{isFlipped ? 'Show Original Indices' : 'Execute Reversal'}</span>
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-ink-dim">
          <span>Array Structure (L = {len})</span>
          <span className="text-signal-cyan">Swaps: {Math.floor(len / 2)} index pairs</span>
        </div>

        <div className="p-4 rounded bg-void border border-ink-dim/20 space-y-2">
          <div className="text-[10px] font-mono uppercase text-ink-dim tracking-wider">
            Original Memory Slots:
          </div>
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap py-2">
            {currentWord.split('').map((char, idx) => (
              <div
                key={`orig-${idx}`}
                className="flex flex-col items-center p-2 rounded bg-panel border border-ink-dim/30 min-w-[3rem]"
              >
                <span className="text-[10px] font-mono text-ink-dim">[{idx}]</span>
                <span className="text-base font-mono font-bold text-ink-primary mt-0.5">{char}</span>
                <span className="text-[9px] font-mono text-signal-cyan mt-1">→ [{len - 1 - idx}]</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded bg-void border border-signal-amber/30 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-signal-amber tracking-wider">
            <span>Reversed Transmission Slots:</span>
            <span>Order ←</span>
          </div>
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap py-2">
            <AnimatePresence mode="popLayout">
              {(isFlipped ? reversed : currentWord).split('').map((char, idx) => (
                <motion.div
                  key={`rev-${char}-${idx}-${isFlipped}`}
                  initial={{ opacity: 0, y: -6, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: idx * 0.03 }}
                  className="flex flex-col items-center p-2 rounded bg-panel border border-signal-amber/50 shadow-[0_0_8px_rgba(232,163,61,0.15)] min-w-[3rem]"
                >
                  <span className="text-[10px] font-mono text-signal-amber">[{idx}]</span>
                  <span className="text-base font-mono font-bold text-signal-amber mt-0.5">{char}</span>
                  <span className="text-[9px] font-mono text-ink-dim mt-1">
                    was [{len - 1 - idx}]
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="rounded bg-void p-5 border border-ink-dim/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="font-mono text-xs text-signal-cyan font-bold uppercase tracking-wider">
            Live Transposition Engine:
          </span>

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
              maxLength={12}
              placeholder="Custom..."
              value={customWord}
              onChange={(e) => setCustomWord(e.target.value.toUpperCase())}
              className="w-24 px-2 py-0.5 text-xs font-mono rounded bg-panel border border-ink-dim/30 text-ink-primary focus:outline-none focus:border-signal-cyan"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded bg-panel border border-ink-dim/20 font-mono text-xs">
          <div>
            <span className="text-ink-dim">Plaintext: </span>
            <span className="text-ink-primary font-bold">{currentWord}</span>
          </div>
          <div>
            <span className="text-ink-dim">Ciphertext: </span>
            <span className="text-signal-amber font-bold">{reversed}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
