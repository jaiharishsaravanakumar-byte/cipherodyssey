import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { caesarEncode } from '../utils/cipherHelpers';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const EXAMPLE_WORDS = ['HELLO', 'SECRET', 'LAB', 'CIPHER', 'ATTACK'];

export default function CipherAlphabet({ fixedShift = null }) {
  const isLocked = fixedShift !== null;
  const [shift, setShift] = useState(isLocked ? fixedShift : 3);
  const [exampleIndex, setExampleIndex] = useState(0);
  const [customWord, setCustomWord] = useState('');

  const currentWord = customWord.trim()
    ? customWord.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 10)
    : EXAMPLE_WORDS[exampleIndex];

  const trackRef = useRef(null);
  const [trackWidth, setTrackWidth] = useState(300);

  
  const x = useMotionValue(0);

  
  const updateTrackWidth = useCallback(() => {
    if (trackRef.current) {
      const w = trackRef.current.clientWidth - 28;
      setTrackWidth(Math.max(w, 100));
    }
  }, []);

  useEffect(() => {
    updateTrackWidth();
    window.addEventListener('resize', updateTrackWidth);
    return () => window.removeEventListener('resize', updateTrackWidth);
  }, [updateTrackWidth]);

  
  useEffect(() => {
    if (trackWidth > 0) {
      const targetX = (shift / 25) * trackWidth;
      x.set(targetX);
    }
  }, [shift, trackWidth, x]);

  
  const computedShift = useTransform(x, [0, trackWidth], [0, 25]);

  useMotionValueEvent(computedShift, 'change', (latest) => {
    if (isLocked) return;
    const clamped = Math.min(25, Math.max(0, Math.round(latest)));
    setShift((prev) => (prev !== clamped ? clamped : prev));
  });

  const handleTrackClick = (e) => {
    if (isLocked || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(e.clientX - rect.left - 14, trackWidth));
    const targetShift = Math.round((clickX / trackWidth) * 25);
    setShift(targetShift);
  };

  const encodedWord = caesarEncode(currentWord, shift);

  
  const activeLetters = new Set(currentWord.split(''));

  return (
    <div className="border border-ink-dim/20 bg-panel/90 p-6 sm:p-8 rounded-lg space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink-dim/15 pb-4">
        <div>
          <span className="font-mono text-xs text-signal-amber uppercase tracking-wider">
            {isLocked ? 'Locked Shift' : 'Alphabet Strip'}
          </span>
          <h2 className="text-xl font-sans font-bold text-ink-primary mt-1">
            {isLocked ? 'ROT13 Fixed Shift (+13)' : 'Caesar Shift Demonstration'}
          </h2>
          <p className="text-ink-dim text-xs mt-1">
            {isLocked
              ? 'ROT13 is Caesar with the shift permanently locked to +13. Half the 26-letter alphabet, making encryption and decryption completely reciprocal.'
              : 'Drag the slider or step the keys to rotate the cipher alphabet against the plaintext alphabet.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isLocked ? (
            <>
              <button
                type="button"
                onClick={() => setShift((s) => (s > 0 ? s - 1 : 25))}
                className="p-1.5 rounded bg-void border border-ink-dim/30 text-ink-dim hover:text-ink-primary hover:border-ink-dim/60 micro-transition cursor-pointer"
                title="Shift -1"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="px-4 py-1.5 rounded bg-void border border-signal-amber/40 font-mono text-center min-w-[5.5rem]">
                <span className="text-[10px] text-ink-dim block uppercase leading-none">Shift (K)</span>
                <span className="text-base font-bold text-signal-amber leading-tight">+{shift}</span>
              </div>

              <button
                type="button"
                onClick={() => setShift((s) => (s < 25 ? s + 1 : 0))}
                className="p-1.5 rounded bg-void border border-ink-dim/30 text-ink-dim hover:text-ink-primary hover:border-ink-dim/60 micro-transition cursor-pointer"
                title="Shift +1"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setShift(3)}
                className="p-1.5 rounded bg-void border border-ink-dim/30 text-ink-dim hover:text-signal-cyan hover:border-signal-cyan/60 micro-transition cursor-pointer"
                title="Reset to Caesar standard (+3)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="px-4 py-2 rounded bg-void border border-signal-amber/40 font-mono text-center min-w-[7rem]">
              <span className="text-[10px] text-ink-dim block uppercase leading-none">Shift (Locked)</span>
              <span className="text-base font-bold text-signal-amber leading-tight">+13 Fixed</span>
            </div>
          )}
        </div>
      </div>

    
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-mono text-ink-dim">
          <span>0 (Identity)</span>
          <span className="text-signal-amber font-semibold">
            {isLocked ? 'Fixed Position: +13' : `Current: +${shift}`}
          </span>
          <span>25 (Max Shift)</span>
        </div>

        <div
          ref={trackRef}
          onClick={handleTrackClick}
          className={`relative h-9 w-full bg-void rounded border border-ink-dim/30 flex items-center px-2 select-none ${
            isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          
          <div className="absolute inset-x-3 flex justify-between pointer-events-none opacity-20">
            {Array.from({ length: 26 }).map((_, i) => (
              <div
                key={i}
                className={`w-[1px] ${i % 5 === 0 ? 'h-3 bg-signal-amber opacity-80' : 'h-1.5 bg-ink-dim'}`}
              />
            ))}
          </div>

          
          <motion.div
            style={{ x }}
            drag={isLocked ? false : 'x'}
            dragConstraints={{ left: 0, right: trackWidth }}
            dragElastic={0}
            dragMomentum={false}
            className={`absolute top-1 left-2 w-7 h-7 rounded bg-signal-amber shadow-[0_0_12px_rgba(232,163,61,0.5)] flex items-center justify-center font-mono font-bold text-xs text-bg-void z-20 select-none ${
              isLocked ? 'cursor-not-allowed opacity-80' : 'cursor-grab active:cursor-grabbing'
            }`}
          >
            {shift}
          </motion.div>
        </div>
      </div>

     
      <div className="space-y-2 overflow-x-auto pb-2">
        <div className="min-w-[620px] space-y-1.5 select-none font-mono">
          
          <div className="flex items-center gap-1">
            <span className="w-14 text-[10px] uppercase text-ink-dim shrink-0 font-sans font-semibold">
              Plain:
            </span>
            <div className="flex-1 grid grid-cols-26 gap-1">
              {ALPHABET.map((letter) => {
                const isHighlighted = activeLetters.has(letter);
                return (
                  <div
                    key={`plain-${letter}`}
                    className={`h-7 rounded flex items-center justify-center text-xs font-bold micro-transition ${
                      isHighlighted
                        ? 'bg-signal-cyan/20 text-signal-cyan border border-signal-cyan/60'
                        : 'bg-void text-ink-primary border border-ink-dim/20'
                    }`}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          </div>

          
          <div className="flex items-center gap-1">
            <span className="w-14 text-[10px] uppercase text-signal-amber shrink-0 font-sans font-semibold">
              Cipher:
            </span>
            <div className="flex-1 grid grid-cols-26 gap-1">
              {ALPHABET.map((letter) => {
                const shiftedLetter = caesarEncode(letter, shift);
                const isHighlighted = activeLetters.has(letter);
                return (
                  <div
                    key={`cipher-${letter}`}
                    className={`h-7 rounded flex items-center justify-center text-xs font-bold micro-transition ${
                      isHighlighted
                        ? 'bg-signal-amber/25 text-signal-amber border border-signal-amber shadow-[0_0_8px_rgba(232,163,61,0.3)]'
                        : 'bg-void text-signal-amber/80 border border-signal-amber/25'
                    }`}
                  >
                    {shiftedLetter}
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
              Live Word Engine:
            </span>
            <span className="font-mono text-xs text-ink-dim">
              [Shift +{shift}]
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
                      key={`${cipherChar}-${shift}`}
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
                  +{shift}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
