import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { railFenceEncode } from '../../utils/cipherHelpers';
import { Activity, Play, ChevronLeft, ChevronRight } from 'lucide-react';

const PRESET_PHRASES = ['DEFENDTHEWALL', 'WEAREDISCOVERED', 'ATTACKATDAWN'];

export default function RailFenceZigzag() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [customPhrase, setCustomPhrase] = useState('');
  const [rails, setRails] = useState(3);
  const [activeReadRail, setActiveReadRail] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const phrase = (customPhrase.trim() || PRESET_PHRASES[phraseIndex])
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 16);

  const r = Math.max(2, Math.min(5, rails));
  const ciphertext = railFenceEncode(phrase, r);

  
  const charPositions = [];
  let currentRail = 0;
  let direction = 1;
  for (let i = 0; i < phrase.length; i++) {
    charPositions.push({ char: phrase[i], rail: currentRail, col: i });
    currentRail += direction;
    if (currentRail === r - 1 || currentRail === 0) {
      direction = -direction;
    }
  }

 
  useEffect(() => {
    let timer;
    if (isPlaying) {
      let step = 0;
      const interval = setInterval(() => {
        if (step < r) {
          setActiveReadRail(step);
          step++;
        } else {
          setActiveReadRail(null);
          setIsPlaying(false);
          clearInterval(interval);
        }
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isPlaying, r]);

  return (
    <div className="border border-ink-dim/20 bg-panel/90 p-6 sm:p-8 rounded-lg space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink-dim/15 pb-4">
        <div>
          <span className="font-mono text-xs text-signal-cyan uppercase tracking-wider">
            Zigzag Wave
          </span>
          <h2 className="text-xl font-sans font-bold text-ink-primary mt-1">
            Rail Fence Zigzag Generator
          </h2>
          <p className="text-ink-dim text-xs mt-1">
            Plaintext oscillates diagonally across <code className="text-signal-cyan font-mono">{r} horizontal rails</code> before being collected line by line.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded bg-void border border-ink-dim/30">
            <button
              type="button"
              disabled={r <= 2}
              onClick={() => setRails((v) => Math.max(2, v - 1))}
              className="p-1 rounded bg-panel text-ink-dim hover:text-ink-primary disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 font-mono text-xs font-bold text-signal-cyan">
              {r} Rails
            </span>
            <button
              type="button"
              disabled={r >= 5}
              onClick={() => setRails((v) => Math.min(5, v + 1))}
              className="p-1 rounded bg-panel text-ink-dim hover:text-ink-primary disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            disabled={isPlaying}
            onClick={() => setIsPlaying(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-signal-cyan text-bg-void font-mono font-bold text-xs uppercase tracking-wider micro-transition hover:opacity-90 disabled:opacity-40 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isPlaying ? 'Reading...' : 'Read Rails'}</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="min-w-[600px] p-6 rounded bg-void border border-ink-dim/30 space-y-3 font-mono select-none">
          <div className="flex justify-between items-center text-xs text-ink-dim border-b border-ink-dim/15 pb-2">
            <span>Zigzag Wave Path across {phrase.length} columns</span>
            <span className="text-signal-cyan">
              {activeReadRail !== null ? `Reading Rail #${activeReadRail}` : 'Cycle length = ' + (2 * (r - 1))}
            </span>
          </div>

          {Array.from({ length: r }).map((_, railIdx) => {
            const isThisRailActive = activeReadRail === railIdx;
            return (
              <div
                key={`rail-${railIdx}`}
                className={`flex items-center gap-2 p-2 rounded micro-transition ${
                  isThisRailActive
                    ? 'bg-signal-cyan/15 border border-signal-cyan/50 shadow-[0_0_12px_rgba(79,209,197,0.2)]'
                    : 'border border-transparent'
                }`}
              >
                <div className="w-16 shrink-0 text-xs font-mono text-ink-dim flex items-center gap-1">
                  <span>Rail {railIdx}</span>
                </div>

                <div className="flex-1 flex gap-1.5 justify-start">
                  {charPositions.map((pos, colIdx) => {
                    const isHere = pos.rail === railIdx;
                    return (
                      <div
                        key={`cell-${railIdx}-${colIdx}`}
                        className={`w-8 h-8 rounded flex items-center justify-center font-mono text-xs font-bold micro-transition ${
                          isHere
                            ? isThisRailActive
                              ? 'bg-signal-cyan text-bg-void shadow-[0_0_8px_rgba(79,209,197,0.4)]'
                              : 'bg-panel border border-signal-cyan/60 text-signal-cyan'
                            : 'bg-void text-ink-dim/15 border border-ink-dim/5'
                        }`}
                      >
                        {isHere ? pos.char : '·'}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded bg-void p-5 border border-ink-dim/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="font-mono text-xs text-signal-cyan font-bold uppercase tracking-wider">
            Target Wave Vector:
          </span>

          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {PRESET_PHRASES.map((p, idx) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setCustomPhrase('');
                    setPhraseIndex(idx);
                  }}
                  className={`px-2 py-0.5 rounded font-mono text-xs micro-transition cursor-pointer ${
                    !customPhrase && phraseIndex === idx
                      ? 'bg-signal-cyan/20 text-signal-cyan border border-signal-cyan/50'
                      : 'text-ink-dim hover:text-ink-primary'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <input
              type="text"
              maxLength={16}
              placeholder="Custom..."
              value={customPhrase}
              onChange={(e) => setCustomPhrase(e.target.value.toUpperCase())}
              className="w-24 px-2 py-0.5 text-xs font-mono rounded bg-panel border border-ink-dim/30 text-ink-primary focus:outline-none focus:border-signal-cyan"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded bg-panel border border-ink-dim/20 font-mono text-xs">
          <div>
            <span className="text-ink-dim">Plaintext: </span>
            <span className="text-ink-primary font-bold">{phrase}</span>
          </div>
          <div>
            <span className="text-ink-dim">Ciphertext: </span>
            <span className="text-signal-cyan font-bold">{ciphertext}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
