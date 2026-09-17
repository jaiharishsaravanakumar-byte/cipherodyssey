import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CIPHERS_CONFIG } from '../data/ciphersConfig.js';
import { useAppStore } from '../store/useAppStore.js';
import { CheckCircle2, Lock } from 'lucide-react';

function SingleCipherBar({
  cipher,
  index,
  mastery,
  isUnlocked,
  isMastered,
  solves,
  isLoading,
}) {
  const shouldReduceMotion = useReducedMotion();


  const tierColor =
    cipher.difficultyTier === 'Beginner'
      ? 'text-signal-cyan'
      : cipher.difficultyTier === 'Intermediate'
      ? 'text-signal-amber'
      : 'text-signal-red';

  return (
    <div className="space-y-1.5 py-1">
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-ink-primary font-sans text-sm">
            {cipher.name}
          </span>
          <span className={`text-[10px] uppercase ${tierColor}`}>
            [{cipher.difficultyTier}]
          </span>
          {isMastered ? (
            <span className="flex items-center gap-1 text-[10px] text-signal-amber font-mono">
              <CheckCircle2 className="w-3 h-3" /> Mastered
            </span>
          ) : !isUnlocked ? (
            <span className="flex items-center gap-1 text-[10px] text-ink-dim/60 font-mono">
              <Lock className="w-2.5 h-2.5" /> Locked
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-2 text-[11px] text-ink-dim">
          <span>{isLoading ? '...' : `${solves} solves`}</span>
          <span>·</span>
          <span className="font-bold text-ink-primary min-w-[2.5rem] text-right">
            {isLoading ? '...' : `${mastery}%`}
          </span>
        </div>
      </div>

      
      <div className="h-2 w-full rounded bg-void border border-ink-dim/20 overflow-hidden relative">
        {isLoading ? (
          <div className="h-full w-full bg-void overflow-hidden relative">
            <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-signal-cyan/20 to-transparent animate-pulse rounded" />
          </div>
        ) : (
          <motion.div
            initial={shouldReduceMotion ? { width: `${mastery}%` } : { width: '0%' }}
            whileInView={{ width: `${mastery}%` }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: shouldReduceMotion ? 0 : index * 0.07, 
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`h-full rounded-sm ${
              mastery === 100
                ? 'bg-signal-amber shadow-[0_0_8px_rgba(232,163,61,0.5)]'
                : mastery > 0
                ? 'bg-signal-cyan/80 shadow-[0_0_6px_rgba(79,209,197,0.3)]'
                : 'bg-transparent'
            }`}
          />
        )}
      </div>
    </div>
  );
}

export default function ProgressBar({
  isLoading = false,
  serverMastery = null,
  serverSolves = null,
}) {
  const { getCipherMastery, isUnlocked, isMastered, stats } = useAppStore();

  return (
    <div className="border border-ink-dim/20 bg-panel/80 p-6 sm:p-8 rounded-lg space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ink-dim/15 pb-4">
        <div>
          <span className="font-mono text-xs text-signal-cyan uppercase tracking-wider">
            Cryptanalytic Competency Index
          </span>
          <h2 className="text-xl font-sans font-bold text-ink-primary mt-0.5">
            Per-Cipher Mastery Calibration
          </h2>
        </div>
        <div className="text-xs font-mono text-ink-dim">
          <span>{isLoading ? 'Synchronizing Telemetry...' : 'Staggered Telemetry Sweep'}</span>
        </div>
      </div>

      <div className="divide-y divide-ink-dim/10 space-y-2">
        {CIPHERS_CONFIG.map((cipher, index) => {
          const mastery =
            serverMastery && serverMastery[cipher.slug] !== undefined
              ? serverMastery[cipher.slug]
              : getCipherMastery(cipher.slug);

          const unlocked = isUnlocked(cipher.slug);
          const mastered = isMastered(cipher.slug) || mastery === 100;
          const solves =
            serverSolves && serverSolves[cipher.slug] !== undefined
              ? serverSolves[cipher.slug]
              : stats.cipherSolves[cipher.slug] || 0;

          return (
            <SingleCipherBar
              key={cipher.slug}
              cipher={cipher}
              index={index}
              mastery={mastery}
              isUnlocked={unlocked}
              isMastered={mastered}
              solves={solves}
              isLoading={isLoading}
            />
          );
        })}
      </div>
    </div>
  );
}
