import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import LetterMap from '../LetterMap.jsx';
import { stepContainerVariant, stepItemVariant } from '../../utils/animationVariants';
import { CIPHER_LESSONS } from '../../data/cipherLessons';
import { Unlock, ArrowDown } from 'lucide-react';

const DEFAULT_CAESAR_DECRYPT_STEPS = [
  { from: 'F', to: 'C', op: '-3', note: '5 - 3 = 2 (C)' },
  { from: 'D', to: 'A', op: '-3', note: '3 - 3 = 0 (A)' },
  { from: 'H', to: 'E', op: '-3', note: '7 - 3 = 4 (E)' },
  { from: 'V', to: 'S', op: '-3', note: '21 - 3 = 18 (S)' },
  { from: 'D', to: 'A', op: '-3', note: '3 - 3 = 0 (A)' },
  { from: 'U', to: 'R', op: '-3', note: '20 - 3 = 17 (R)' },
];

export default function DecryptionSection({ cipherId = 'caesar', lesson }) {
  const shouldReduceMotion = useReducedMotion();
  const decData = lesson?.decryption || (cipherId && CIPHER_LESSONS[cipherId]?.decryption) || {
    ciphertext: 'FDHVDU',
    keyDisplay: 'k = 3',
    steps: DEFAULT_CAESAR_DECRYPT_STEPS,
    plaintext: 'CAESAR',
  };

  const isSpatial = decData.steps.some((s) => s.from.length > 2);

  return (
    <div className="border border-ink-dim/20 bg-panel/80 p-6 sm:p-8 rounded-lg space-y-6">
      <div className="border-b border-ink-dim/15 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-signal-cyan uppercase tracking-wider">
          <Unlock className="w-3.5 h-3.5" />
          <span>Walkthrough</span>
        </div>
        <h2 className="text-2xl font-sans font-bold text-ink-primary mt-1">
          Step-by-Step Decipherment
        </h2>
        <p className="text-ink-dim text-sm mt-1 font-sans">
          Reversing ciphertext <code className="text-signal-amber font-mono font-semibold">{decData.ciphertext}</code> with <code className="text-signal-cyan font-mono font-semibold">{decData.keyDisplay}</code>.
        </p>
      </div>

      <div className="flex items-center gap-3 p-3.5 rounded bg-void border border-ink-dim/20 font-mono text-xs">
        <span className="text-ink-dim uppercase">Received Ciphertext:</span>
        <span className="text-signal-amber font-bold text-sm tracking-widest">{decData.ciphertext.split('').join(' ')}</span>
        <span className="text-ink-dim ml-auto">{decData.keyDisplay}</span>
      </div>

      <div className="flex justify-center text-ink-dim/50 my-1">
        <ArrowDown className="w-4 h-4 animate-pulse" />
      </div>

      <motion.div
        variants={shouldReduceMotion ? {} : stepContainerVariant}
        initial={shouldReduceMotion ? 'visible' : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className={isSpatial ? 'space-y-2' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'}
      >
        {decData.steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {!isSpatial ? (
              <LetterMap
                fromLetter={step.from}
                toLetter={step.to}
                operation={step.op}
                index={idx + 1}
                direction="decode"
                className="w-full"
              />
            ) : (
              <motion.div
                variants={shouldReduceMotion ? {} : stepItemVariant}
                className="w-full p-3 rounded bg-panel border border-ink-dim/20 flex items-center justify-between font-mono text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-ink-dim/70">#{idx + 1}</span>
                  <span className="text-ink-primary font-bold">{step.from}</span>
                  <span className="text-signal-cyan text-[11px]">→ {step.to}</span>
                </div>
                <div className="text-[10px] text-signal-cyan px-2 py-0.5 rounded bg-void border border-signal-cyan/30">
                  {step.op}
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </motion.div>

      <div className="mt-4 p-4 rounded bg-void border border-signal-cyan/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="font-mono text-xs text-ink-dim">
          <span>RECOVERED PLAINTEXT:</span>
        </div>
        <div className="font-mono text-lg font-bold text-ink-primary tracking-widest shadow-sm">
          {decData.plaintext}
        </div>
      </div>
    </div>
  );
}
