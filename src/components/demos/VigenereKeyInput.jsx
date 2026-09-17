import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { vigenereEncode } from '../../utils/cipherHelpers';
import { KeyRound, Layers } from 'lucide-react';

const PRESET_PHRASES = ['ATTACKATDAWN', 'DEFENDTHEWALL', 'SECRETARCHIVE', 'KRYPTOSVAULT'];
const PRESET_KEYS = ['LEMON', 'CIPHER', 'ROMAN', 'KEY'];

export default function VigenereKeyInput() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [customPhrase, setCustomPhrase] = useState('');
  const [keyword, setKeyword] = useState('LEMON');

  const cleanPhrase = (customPhrase.trim() || PRESET_PHRASES[phraseIndex])
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 14);

  const cleanKey = keyword.toUpperCase().replace(/[^A-Z]/g, '') || 'KEY';

  const ciphertext = vigenereEncode(cleanPhrase, cleanKey);

  const repeatedKey = cleanPhrase
    .split('')
    .map((_, i) => cleanKey[i % cleanKey.length])
    .join('');

  return (
    <div className="border border-ink-dim/20 bg-panel/90 p-6 sm:p-8 rounded-lg space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink-dim/15 pb-4">
        <div>
          <span className="font-mono text-xs text-signal-cyan uppercase tracking-wider">
            Polyalphabetic Matrix
          </span>
          <h2 className="text-xl font-sans font-bold text-ink-primary mt-1">
            Vigenère Key Alignment & Tiling
          </h2>
          <p className="text-ink-dim text-xs mt-1">
            As you type a key, watch it tile periodically beneath the transmission. Each key character specifies a distinct Caesar shift.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-void border border-signal-cyan/40 font-mono text-xs text-signal-cyan">
          <Layers className="w-4 h-4" />
          <span>Period m = {cleanKey.length}</span>
        </div>
      </div>

      <div className="p-4 rounded bg-void border border-ink-dim/20 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-mono text-ink-dim uppercase flex items-center gap-2">
            <KeyRound className="w-3.5 h-3.5 text-signal-amber" />
            <span>Secret Repeating Keyword (Key):</span>
          </label>

          <div className="flex gap-1">
            {PRESET_KEYS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKeyword(k)}
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
          maxLength={10}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
          placeholder="ENTER KEYWORD..."
          className="w-full px-4 py-2.5 rounded bg-panel font-mono text-base font-bold text-signal-amber tracking-widest border border-ink-dim/40 focus:outline-none focus:border-signal-amber focus:shadow-[0_0_12px_rgba(232,163,61,0.25)]"
        />
      </div>

      <div className="space-y-2 overflow-x-auto pb-2">
        <div className="min-w-[620px] p-4 rounded bg-void border border-ink-dim/30 space-y-4 select-none font-mono">
          <div className="flex justify-between items-center text-xs text-ink-dim border-b border-ink-dim/15 pb-2">
            <span>Aligned Transmission Columns</span>
            <span className="text-signal-amber">Shift = K[i mod {cleanKey.length}] - 'A'</span>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-3 py-1">
            {cleanPhrase.split('').map((plainChar, idx) => {
              const keyChar = repeatedKey[idx] || 'A';
              const shiftVal = keyChar.charCodeAt(0) - 65;
              const cipherChar = ciphertext[idx] || '';

              return (
                <div
                  key={`${plainChar}-${idx}-${cleanKey}`}
                  className="flex flex-col items-center p-2 rounded bg-panel/80 border border-ink-dim/20 min-w-[3.2rem]"
                >
                  <span className="text-[10px] text-ink-dim font-sans">Plain</span>
                  <span className="text-base font-bold text-ink-primary my-0.5">{plainChar}</span>

                  <div className="my-1 text-[10px] font-mono text-signal-cyan px-1 rounded bg-void border border-signal-cyan/30">
                    +{shiftVal}
                  </div>

                  <span className="text-xs font-bold text-signal-amber mb-1">
                    {keyChar}
                  </span>
                  <span className="text-[9px] text-ink-dim/70 font-sans">Key[{idx % cleanKey.length}]</span>

                  <div className="w-8 h-8 rounded bg-void border border-signal-amber/70 flex items-center justify-center font-mono font-bold text-sm text-signal-amber mt-2 shadow-[0_0_8px_rgba(232,163,61,0.15)]">
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={`${cipherChar}-${cleanKey}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.12 }}
                      >
                        {cipherChar}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded bg-void p-5 border border-ink-dim/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="font-mono text-xs text-signal-cyan font-bold uppercase tracking-wider">
            Target Plaintext Vector:
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
              maxLength={14}
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
            <span className="text-ink-primary font-bold">{cleanPhrase}</span>
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
