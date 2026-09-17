import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { columnarEncode } from '../../utils/cipherHelpers';
import { Grid3X3, Play, RotateCcw } from 'lucide-react';

const PRESET_PHRASES = ['DEFENDTHEWALL', 'SECRETARCHIVE', 'ATTACKATDAWN'];
const PRESET_KEYS = ['ZEBRA', 'SECRET', 'BRAVO', 'ALPHA'];

export default function ColumnarGrid() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [customPhrase, setCustomPhrase] = useState('');
  const [keyWord, setKeyWord] = useState('ZEBRA');
  const [activeReadCol, setActiveReadCol] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const phrase = (customPhrase.trim() || PRESET_PHRASES[phraseIndex])
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 18);

  const cleanKey = keyWord.toUpperCase().replace(/[^A-Z]/g, '') || 'ZEBRA';

  const keyChars = cleanKey.split('').map((char, index) => ({ char, index }));
  const sortedKeyChars = [...keyChars].sort((a, b) => {
    if (a.char < b.char) return -1;
    if (a.char > b.char) return 1;
    return a.index - b.index;
  });

  const orderMap = {};
  sortedKeyChars.forEach((item, rank) => {
    orderMap[item.index] = rank + 1;
  });

  const numCols = cleanKey.length;
  const numRows = Math.ceil(phrase.length / numCols);
  const ciphertext = columnarEncode(phrase, cleanKey);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      let step = 0;
      const interval = setInterval(() => {
        if (step < sortedKeyChars.length) {
          setActiveReadCol(sortedKeyChars[step].index);
          step++;
        } else {
          setActiveReadCol(null);
          setIsPlaying(false);
          clearInterval(interval);
        }
      }, 700);
      return () => clearInterval(interval);
    }
  }, [isPlaying, sortedKeyChars]);

  const handleStartReadout = () => {
    setIsPlaying(true);
  };

  return (
    <div className="border border-ink-dim/20 bg-panel/90 p-6 sm:p-8 rounded-lg space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink-dim/15 pb-4">
        <div>
          <span className="font-mono text-xs text-signal-amber uppercase tracking-wider">
            Rectangular Matrix
          </span>
          <h2 className="text-xl font-sans font-bold text-ink-primary mt-1">
            Columnar Key Grid
          </h2>
          <p className="text-ink-dim text-xs mt-1">
            Plaintext fills row-by-row into a grid. Columns are then read out in the alphabetical ranking order of the secret keyword.
          </p>
        </div>

        <button
          type="button"
          disabled={isPlaying}
          onClick={handleStartReadout}
          className="flex items-center gap-2 px-4 py-2 rounded bg-signal-amber text-bg-void font-mono font-bold text-xs uppercase tracking-wider micro-transition hover-glow-amber disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          <Play className="w-3.5 h-3.5" />
          <span>{isPlaying ? 'Reading Columns...' : 'Animate Column Readout'}</span>
        </button>
      </div>

      <div className="p-4 rounded bg-void border border-ink-dim/20 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-mono text-ink-dim uppercase">Columnar Keyword:</span>
          <div className="flex gap-1">
            {PRESET_KEYS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKeyWord(k)}
                className={`px-2 py-0.5 rounded font-mono text-xs micro-transition cursor-pointer ${
                  cleanKey === k
                    ? 'bg-signal-amber text-bg-void font-bold'
                    : 'bg-panel text-ink-dim hover:text-ink-primary'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        <input
          type="text"
          maxLength={8}
          value={keyWord}
          onChange={(e) => setKeyWord(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
          className="w-full px-4 py-2 rounded bg-panel font-mono text-base font-bold text-signal-amber tracking-widest border border-ink-dim/40 focus:outline-none focus:border-signal-amber"
        />
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="min-w-[480px] p-6 rounded bg-void border border-ink-dim/30 space-y-4 font-mono select-none">
          <div className="text-xs text-ink-dim flex items-center justify-between border-b border-ink-dim/15 pb-2">
            <span>Grid Matrix: {numRows} rows × {numCols} columns</span>
            <span className="text-signal-cyan">
              {activeReadCol !== null
                ? `Currently Reading Column #${orderMap[activeReadCol]} ('${cleanKey[activeReadCol]}')`
                : 'Click "Animate Column Readout" to view extraction'}
            </span>
          </div>

          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))` }}
          >
            {cleanKey.split('').map((char, colIdx) => {
              const rank = orderMap[colIdx];
              const isColActive = activeReadCol === colIdx;

              return (
                <div
                  key={`header-${colIdx}`}
                  className={`p-2 rounded text-center border micro-transition ${
                    isColActive
                      ? 'bg-signal-amber/30 border-signal-amber shadow-[0_0_12px_rgba(232,163,61,0.4)]'
                      : 'bg-panel border-ink-dim/30'
                  }`}
                >
                  <div className="text-xs text-ink-dim">Order #{rank}</div>
                  <div className="text-lg font-bold text-signal-amber">{char}</div>
                </div>
              );
            })}
          </div>

          <div className="space-y-2">
            {Array.from({ length: numRows }).map((_, rowIdx) => (
              <div
                key={`row-${rowIdx}`}
                className="grid gap-2"
                style={{ gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))` }}
              >
                {Array.from({ length: numCols }).map((_, colIdx) => {
                  const charIdx = rowIdx * numCols + colIdx;
                  const char = phrase[charIdx] || '·';
                  const isColActive = activeReadCol === colIdx;

                  return (
                    <div
                      key={`cell-${rowIdx}-${colIdx}`}
                      className={`h-12 rounded flex items-center justify-center text-base font-bold border micro-transition ${
                        char === '·'
                          ? 'bg-void text-ink-dim/30 border-ink-dim/10'
                          : isColActive
                          ? 'bg-signal-amber/25 text-signal-amber border-signal-amber font-bold shadow-[0_0_8px_rgba(232,163,61,0.2)]'
                          : 'bg-panel text-ink-primary border-ink-dim/20'
                      }`}
                    >
                      {char}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded bg-void p-5 border border-ink-dim/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="font-mono text-xs text-signal-cyan font-bold uppercase tracking-wider">
            Plaintext Grid Content:
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
              maxLength={18}
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
            <span className="text-signal-amber font-bold">{ciphertext}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
