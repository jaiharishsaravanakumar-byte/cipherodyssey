import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { stepItemVariant } from '../utils/animationVariants';

export default function LetterMap({
  fromLetter = 'A',
  toLetter = 'D',
  operation = '+3',
  index,
  highlight = false,
  direction = 'encode',
  className = '',
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={shouldReduceMotion ? {} : stepItemVariant}
      className={`inline-flex items-center gap-2 p-2.5 rounded border bg-panel micro-transition ${
        highlight
          ? 'border-signal-amber/70 shadow-[0_0_12px_rgba(232,163,61,0.2)]'
          : 'border-ink-dim/20'
      } ${className}`}
    >
      {index !== undefined && (
        <span className="font-mono text-[10px] text-ink-dim/70 px-1 border-r border-ink-dim/20 pr-1.5">
          #{index}
        </span>
      )}

      <div className="w-8 h-8 rounded bg-void border border-ink-dim/30 flex items-center justify-center font-mono font-bold text-sm text-ink-primary select-none">
        {fromLetter}
      </div>

      <div className="flex flex-col items-center justify-center px-1">
        <span className="font-mono text-[9px] text-signal-cyan leading-none mb-0.5">
          {operation}
        </span>
        {direction === 'decode' ? (
          <ArrowLeft className="w-3.5 h-3.5 text-signal-cyan/80" />
        ) : (
          <ArrowRight className="w-3.5 h-3.5 text-signal-amber/80" />
        )}
      </div>

      <div className="w-8 h-8 rounded bg-void border border-signal-amber/50 flex items-center justify-center font-mono font-bold text-sm text-signal-amber shadow-[0_0_8px_rgba(232,163,61,0.15)] select-none">
        {toLetter}
      </div>
    </motion.div>
  );
}
