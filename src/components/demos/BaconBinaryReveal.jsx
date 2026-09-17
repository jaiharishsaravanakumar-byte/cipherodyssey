import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { baconEncode } from '../../utils/cipherHelpers';
import { Binary, Eye, EyeOff } from 'lucide-react';

const BACON_MAP = {
  A: 'AAAAA', B: 'AAAAB', C: 'AAABA', D: 'AAABB', E: 'AABAA',
  F: 'AABAB', G: 'AABBA', H: 'AABBB', I: 'ABAAA', J: 'ABAAB',
  K: 'ABABA', L: 'ABABB', M: 'ABBAA', N: 'ABBAB', O: 'ABBBA',
  P: 'ABBBB', Q: 'BAAAA', R: 'BAAAB', S: 'BAABA', T: 'BAABB',
  U: 'BABAA', V: 'BABAB', W: 'BABBA', X: 'BABBB', Y: 'BBAAA',
  Z: 'BBAAB',
};

const CARRIER_SENTENCE = 'KNOWLEDGE IS POWER AND SECRECY PRESERVES FREEDOM';
const EXAMPLE_WORDS = ['VAULT', 'AGENT', 'CODE', 'SIGNAL', 'KEY'];

export default function BaconBinaryReveal() {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [customWord, setCustomWord] = useState('');
  const [showSteganography, setShowSteganography] = useState(true);

  const currentWord = customWord.trim()
    ? customWord.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6)
    : EXAMPLE_WORDS[exampleIndex];

  const bitStream = currentWord
    .split('')
    .map((c) => BACON_MAP[c] || 'AAAAA')
    .join('');

  const carrierLetters = CARRIER_SENTENCE.replace(/[^A-Z]/g, '');

  return (
    <div className="border border-ink-dim/20 bg-panel/90 p-6 sm:p-8 rounded-lg space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink-dim/15 pb-4">
        <div>
          <span className="font-mono text-xs text-signal-cyan uppercase tracking-wider">
            5-Bit Binary Mask
          </span>
          <h2 className="text-xl font-sans font-bold text-ink-primary mt-1">
            Bacon's Binary & Steganography Reveal
          </h2>
          <p className="text-ink-dim text-xs mt-1">
            Every letter translates to 5 bits (using 'A' and 'B'). These bits can be embedded in innocent text using typographic variations (Regular = A, Bold/Amber = B).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowSteganography((s) => !s)}
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-void border border-signal-cyan/40 font-mono text-xs text-signal-cyan hover:bg-signal-cyan/15 micro-transition cursor-pointer self-start sm:self-auto"
        >
          {showSteganography ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{showSteganography ? 'Hide Typographic Mask' : 'Show Typographic Mask'}</span>
        </button>
      </div>

      <div className="space-y-3">
        <div className="text-xs font-mono text-ink-dim flex justify-between">
          <span>5-Bit Binary Representation</span>
          <span className="text-signal-amber">{currentWord.length} letters = {bitStream.length} bits</span>
        </div>

        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap p-4 rounded bg-void border border-ink-dim/30">
          {currentWord.split('').map((char, idx) => {
            const token = BACON_MAP[char] || 'AAAAA';
            return (
              <div
                key={`bacon-${char}-${idx}`}
                className="flex flex-col items-center p-3 rounded bg-panel/80 border border-ink-dim/20 min-w-[5rem]"
              >
                <span className="font-mono text-xs text-ink-dim mb-1">Letter</span>
                <span className="text-xl font-mono font-bold text-signal-cyan">{char}</span>

                <div className="flex gap-0.5 mt-2">
                  {token.split('').map((bit, bitIdx) => (
                    <span
                      key={bitIdx}
                      className={`w-4 h-5 rounded text-[10px] font-mono font-bold flex items-center justify-center ${
                        bit === 'B'
                          ? 'bg-signal-amber/30 text-signal-amber border border-signal-amber/60'
                          : 'bg-void text-ink-dim border border-ink-dim/20'
                      }`}
                    >
                      {bit}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showSteganography && (
        <div className="p-5 rounded bg-void border border-signal-cyan/30 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-signal-cyan font-bold uppercase tracking-wider">
              Typographic Concealment Simulator:
            </span>
            <span className="text-ink-dim">
              [Regular font = A, Bold/Amber = B]
            </span>
          </div>

          <p className="text-xs text-ink-dim font-sans leading-relaxed">
            In 1605, Bacon demonstrated that binary bits can be transmitted within plain printed text by alternating between two typefaces. Notice how the secret word <strong className="text-signal-cyan font-mono">{currentWord}</strong> is encoded directly into this sentence:
          </p>

          <div className="p-4 rounded bg-panel/90 border border-ink-dim/30 font-serif text-lg sm:text-xl leading-relaxed tracking-wide text-ink-dim select-none">
            {carrierLetters.split('').slice(0, Math.max(30, bitStream.length + 5)).map((carrierChar, idx) => {
              const bit = bitStream[idx];
              const isSecretBit = idx < bitStream.length;
              const isB = bit === 'B';

              return (
                <span
                  key={`carrier-${idx}`}
                  className={`inline-block px-[1px] micro-transition ${
                    !isSecretBit
                      ? 'text-ink-dim/40 font-normal'
                      : isB
                      ? 'font-bold text-signal-amber scale-105'
                      : 'font-normal text-ink-primary'
                  }`}
                  title={isSecretBit ? `Bit #${idx}: ${bit}` : 'Padding'}
                >
                  {carrierChar}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded bg-void p-5 border border-ink-dim/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="font-mono text-xs text-signal-cyan font-bold uppercase tracking-wider">
            Target Word Vector:
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
              maxLength={6}
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
          <div className="text-right">
            <span className="text-ink-dim">Bacon Code: </span>
            <span className="text-signal-amber font-bold">{baconEncode(currentWord)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
