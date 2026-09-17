import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import LetterMap from '../LetterMap.jsx';
import { stepContainerVariant, stepItemVariant } from '../../utils/animationVariants';
import { CIPHER_LESSONS } from '../../data/cipherLessons';
import { KeyRound, ArrowDown } from 'lucide-react';

const DEFAULT_CAESAR_STEPS = [
  { from: 'C', to: 'F', op: '+3', note: '2 + 3 = 5 (F)' },
  { from: 'A', to: 'D', op: '+3', note: '0 + 3 = 3 (D)' },
  { from: 'E', to: 'H', op: '+3', note: '4 + 3 = 7 (H)' },
  { from: 'S', to: 'V', op: '+3', note: '18 + 3 = 21 (V)' },
  { from: 'A', to: 'D', op: '+3', note: '0 + 3 = 3 (D)' },
  { from: 'R', to: 'U', op: '+3', note: '17 + 3 = 20 (U)' },
];

export default function EncryptionSection({ cipherId = 'caesar', lesson }) {
  const shouldReduceMotion = useReducedMotion();
  const encData = lesson?.encryption || (cipherId && CIPHER_LESSONS[cipherId]?.encryption) || {
    plaintext: 'CAESAR',
    keyDisplay: 'k = 3',
    steps: DEFAULT_CAESAR_STEPS,
    ciphertext: 'FDHVDU',
  };

  const isSpatial = encData.steps.some((s) => s.from.length > 2);

  return (
    <div className="border border-ink-dim/20 bg-panel/80 p-6 sm:p-8 rounded-lg space-y-6">
      <div className="border-b border-ink-dim/15 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-signal-amber uppercase tracking-wider">
          <KeyRound className="w-3.5 h-3.5" />
          <span>Walkthrough</span>
        </div>
        <h2 className="text-2xl font-sans font-bold text-ink-primary mt-1">
          Step-by-Step Encipherment
        </h2>
        <p className="text-ink-dim text-sm mt-1 font-sans">
          Converting plaintext <code className="text-ink-primary font-mono font-semibold">{encData.plaintext}</code> into ciphertext with <code className="text-signal-amber font-mono font-semibold">{encData.keyDisplay}</code>.
        </p>
      </div>

      <div className="flex items-center gap-3 p-3.5 rounded bg-void border border-ink-dim/20 font-mono text-xs">
        <span className="text-ink-dim uppercase">Plaintext:</span>
        <span className="text-ink-primary font-bold text-sm tracking-widest">{encData.plaintext.split('').join(' ')}</span>
        <span className="text-ink-dim ml-auto">{encData.keyDisplay}</span>
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
        {encData.steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {!isSpatial ? (
              <LetterMap
                fromLetter={step.from}
                toLetter={step.to}
                operation={step.op}
                index={idx + 1}
                direction="encode"
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
                  <span className="text-signal-amber text-[11px]">→ {step.to}</span>
                </div>
                <div className="text-[10px] text-signal-cyan px-2 py-0.5 rounded bg-void border border-signal-cyan/30">
                  {step.op}
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </motion.div>

      <div className="mt-4 p-4 rounded bg-void border border-signal-amber/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="font-mono text-xs text-ink-dim">
          <span>EMITTED CIPHERTEXT:</span>
        </div>
        <div className="font-mono text-lg font-bold text-signal-amber tracking-widest shadow-sm">
          {encData.ciphertext}
        </div>
      </div>
    </div>
  );
}
