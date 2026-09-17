import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { atbashEncode } from '../../utils/cipherHelpers';
import { FlipHorizontal } from 'lucide-react';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const MIRROR_ALPHABET = 'ZYXWVUTSRQPONMLKJIHGFEDCBA'.split('');
const EXAMPLE_WORDS = ['HELLO', 'SECRET', 'LAB', 'WISDOM', 'SHADOW'];

export default function AtbashMirror() {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [customWord, setCustomWord] = useState('');

  const currentWord = customWord.trim()
    ? customWord.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 10)
    : EXAMPLE_WORDS[exampleIndex];

  const encodedWord = atbashEncode(currentWord);
  const activePlainLetters = new Set(currentWord.split(''));
  const activeCipherLetters = new Set(encodedWord.split(''));

  return (
    <div className="border border-ink-dim/20 bg-panel/90 p-6 sm:p-8 rounded-lg space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink-dim/15 pb-4">
        <div>
          <span className="font-mono text-xs text-signal-cyan uppercase tracking-wider">
            Symmetric Inversion
          </span>
          <h2 className="text-xl font-sans font-bold text-ink-primary mt-1">
            Atbash Mirror Plane
          </h2>
          <p className="text-ink-dim text-xs mt-1">
            No key needed: the alphabet reflects directly through a central symmetry axis (A↔Z, B↔Y).
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-void border border-signal-cyan/40 font-mono text-xs text-signal-cyan">
          <FlipHorizontal className="w-4 h-4" />
          <span>Reciprocal (E = D)</span>
        </div>
      </div>

      <div className="space-y-3 overflow-x-auto pb-2">
        <div className="min-w-[620px] space-y-2 select-none font-mono">
          <div className="flex items-center gap-2">
            <span className="w-16 text-[10px] uppercase text-ink-dim shrink-0 font-sans font-semibold">
              Plain (A→Z):
            </span>
            <div className="flex-1 grid grid-cols-26 gap-1">
              {ALPHABET.map((char, idx) => {
                const isLit = activePlainLetters.has(char);
                return (
                  <div
                    key={`plain-${char}`}
                    className={`h-7 rounded flex items-center justify-center text-xs font-bold micro-transition ${
                      isLit
                        ? 'bg-signal-cyan/25 text-signal-cyan border border-signal-cyan/70 shadow-[0_0_8px_rgba(79,209,197,0.3)]'
                        : 'bg-void text-ink-primary border border-ink-dim/20'
                    }`}
                  >
                    {char}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative flex items-center py-1">
            <div className="w-16 shrink-0" />
            <div className="flex-1 relative flex items-center justify-center">
              <div className="w-full border-t border-dashed border-signal-cyan/40" />
              <span className="absolute bg-panel px-2 text-[9px] font-mono text-signal-cyan uppercase tracking-widest">
                Mirror Axis (M ↔ N)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-16 text-[10px] uppercase text-signal-amber shrink-0 font-sans font-semibold">
              Cipher (Z→A):
            </span>
            <div className="flex-1 grid grid-cols-26 gap-1">
              {MIRROR_ALPHABET.map((char, idx) => {
                const isLit = activeCipherLetters.has(char);
                return (
                  <div
                    key={`cipher-${char}`}
                    className={`h-7 rounded flex items-center justify-center text-xs font-bold micro-transition ${
                      isLit
                        ? 'bg-signal-amber/25 text-signal-amber border border-signal-amber/70 shadow-[0_0_8px_rgba(232,163,61,0.3)]'
                        : 'bg-void text-signal-amber/80 border border-signal-amber/25'
                    }`}
                  >
                    {char}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded bg-void p-5 border border-ink-dim/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-signal-cyan font-bold uppercase tracking-wider">
              Reflection Terminal:
            </span>
            <span className="font-mono text-xs text-ink-dim">
              [Symmetric 25 - index]
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
            return (
              <div
                key={`${char}-${index}`}
                className="flex flex-col items-center p-2.5 rounded bg-panel/70 border border-ink-dim/20 min-w-[3.5rem]"
              >
                <span className="font-mono text-xs text-ink-dim mb-1">
                  P:{char}
                </span>

                <div className="w-10 h-10 rounded bg-void border border-signal-amber/60 flex items-center justify-center font-mono text-lg font-bold text-signal-amber shadow-[0_0_10px_rgba(232,163,61,0.2)]">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={`${cipherChar}-${currentWord}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                    >
                      {cipherChar}
                    </motion.span>
                  </AnimatePresence>
                </div>

                <span className="font-mono text-[9px] text-signal-cyan mt-1.5">
                  25-{char.charCodeAt(0) - 65}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
