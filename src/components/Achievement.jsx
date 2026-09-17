import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore.js';
import {
  Terminal,
  ShieldCheck,
  Crown,
  Zap,
  Award,
  Lock,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

const ICON_MAP = {
  Terminal,
  ShieldCheck,
  Crown,
  Zap,
  Award,
};


function ParticleBurst() {
  const particles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => {
      const angle = (i / 18) * 2 * Math.PI;
      const distance = 55 + (i % 3) * 22;
      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        size: i % 2 === 0 ? 5 : 3,
        color: i % 3 === 0 ? '#E8A33D' : i % 3 === 1 ? '#4FD1C5' : '#E8ECF1',
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 6px ${p.color}`,
          }}
        />
      ))}
    </div>
  );
}

export function AchievementUnlockModal() {
  const { pendingAchievement, dismissPendingAchievement } = useAppStore();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (pendingAchievement) {
      const timer = setTimeout(() => {
        dismissPendingAchievement();
      }, 2600);
      return () => clearTimeout(timer);
    }
  }, [pendingAchievement, dismissPendingAchievement]);

  if (!pendingAchievement) return null;

  const IconComponent = ICON_MAP[pendingAchievement.iconName] || Award;

  return (
    <AnimatePresence>
      <div
        onClick={dismissPendingAchievement}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/75 backdrop-blur-sm cursor-pointer select-none"
      >
        <div className="relative">
          {!shouldReduceMotion && <ParticleBurst />}

          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 15 }}
            animate={{ scale: [0.7, 1.06, 1], opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="p-6 sm:p-8 rounded-xl bg-panel border-2 border-signal-amber shadow-[0_0_35px_rgba(232,163,61,0.4)] text-center max-w-sm w-full space-y-4 relative"
          >
            <div className="flex items-center justify-center gap-1.5 font-mono text-[10px] text-signal-amber uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ACHIEVEMENT UNLOCKED</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>

            <div className="w-16 h-16 rounded-full bg-void border border-signal-amber flex items-center justify-center mx-auto text-signal-amber shadow-[0_0_15px_rgba(232,163,61,0.3)]">
              <IconComponent className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-sans font-bold text-ink-primary">
                {pendingAchievement.title}
              </h3>
              <span className="inline-block mt-1 font-mono text-[11px] text-signal-cyan px-2 py-0.5 rounded bg-void border border-signal-cyan/30">
                {pendingAchievement.badge}
              </span>
              <p className="text-xs text-ink-dim mt-2 font-sans leading-relaxed">
                {pendingAchievement.description}
              </p>
            </div>

            <div className="text-[10px] font-mono text-ink-dim/60 pt-1">
              [Click anywhere or auto-dismiss in 2.5s]
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}


export function AchievementShelfCard({ achievement, isUnlocked }) {
  const IconComponent = ICON_MAP[achievement.iconName] || Award;

  return (
    <div
      className={`p-4 rounded border flex flex-col justify-between micro-transition ${
        isUnlocked
          ? 'bg-panel border-signal-amber/40 shadow-[0_0_12px_rgba(232,163,61,0.12)]'
          : 'bg-panel/40 border-ink-dim/15 opacity-40 grayscale select-none'
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div
            className={`w-9 h-9 rounded bg-void border flex items-center justify-center ${
              isUnlocked ? 'border-signal-amber/60 text-signal-amber' : 'border-ink-dim/30 text-ink-dim'
            }`}
          >
            <IconComponent className="w-5 h-5" />
          </div>

          <span
            className={`font-mono text-[10px] px-2 py-0.5 rounded uppercase font-semibold ${
              isUnlocked
                ? 'bg-signal-amber/15 text-signal-amber border border-signal-amber/30'
                : 'bg-void text-ink-dim border border-ink-dim/20'
            }`}
          >
            {achievement.rarity}
          </span>
        </div>

        <div>
          <h4
            className={`font-sans font-bold text-sm leading-tight ${
              isUnlocked ? 'text-ink-primary' : 'text-ink-dim'
            }`}
          >
            {achievement.title}
          </h4>
          <p className="text-xs text-ink-dim mt-1.5 font-sans leading-relaxed">
            {achievement.description}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-2.5 border-t border-ink-dim/15 flex items-center justify-between text-[11px] font-mono">
        <span className="text-ink-dim">{achievement.badge}</span>
        {isUnlocked ? (
          <span className="flex items-center gap-1 text-signal-amber font-semibold">
            <CheckCircle2 className="w-3 h-3" /> Unlocked
          </span>
        ) : (
          <span className="flex items-center gap-1 text-ink-dim">
            <Lock className="w-3 h-3" /> Locked
          </span>
        )}
      </div>
    </div>
  );
}

export default function Achievement() {
  return <AchievementUnlockModal />;
}
