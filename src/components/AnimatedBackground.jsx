import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const CIPHER_SYMBOLS = ['0', '1', 'Σ', 'λ', '⊕', '⊗', '§', '0x', '∆', 'Ω', 'ψ', '⌗', 'α', 'β', 'π', 'µ', 'k', 'mod26'];

export default function AnimatedBackground() {
  const shouldReduceMotion = useReducedMotion();

  const particles = useMemo(() => {
    return Array.from({ length: 42 }).map((_, i) => {
      const seed1 = ((i * 9301 + 49297) % 233280) / 233280;
      const seed2 = (((i + 13) * 9301 + 49297) % 233280) / 233280;
      const seed3 = (((i + 37) * 9301 + 49297) % 233280) / 233280;
      const seed4 = (((i + 71) * 9301 + 49297) % 233280) / 233280;

      return {
        id: i,
        symbol: CIPHER_SYMBOLS[i % CIPHER_SYMBOLS.length],
        left: `${(seed1 * 92 + 4).toFixed(1)}%`,
        top: `${(seed2 * 88 + 6).toFixed(1)}%`,
        dx: (seed3 * 50 - 25).toFixed(1),
        dy: -(seed4 * 60 + 30).toFixed(1),
        duration: (10 + seed1 * 20).toFixed(1),
        delay: (seed2 * 4).toFixed(1),
        fontSize: seed3 > 0.6 ? '15px' : '12px',
        colorClass:
          i % 4 === 0
            ? 'text-signal-amber'
            : i % 5 === 0
            ? 'text-signal-cyan'
            : 'text-ink-dim',
        baseOpacity: 0.45 + seed4 * 0.14,
        peakOpacity: 0.45 + seed3 * 0.28,
      };
    });
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-void select-none"
      aria-hidden="true"
    >

      
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 85% 75% at 50% 45%, transparent 75%, rgba(10, 14, 20, 0.85) 100%)',
        }}
      />

      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-signal-amber/[0.15] rounded-full blur-[240px]" />

      

      <div className="absolute inset-0">
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className={`absolute font-mono select-none ${p.colorClass}`}
            style={{
              left: p.left,
              top: p.top,
              fontSize: p.fontSize,
              willChange: 'transform, opacity',
            }}
            initial={{
              x: 0,
              y: 0,
              opacity: p.baseOpacity,
            }}
            animate={
              shouldReduceMotion
                ? {
                    opacity: [p.baseOpacity, p.peakOpacity * 0.8, p.baseOpacity],
                  }
                : {
                    x: [0, Number(p.dx), 0],
                    y: [0, Number(p.dy), 0],
                    opacity: [p.baseOpacity, p.peakOpacity, p.baseOpacity],
                  }
            }
            transition={{
              duration: Number(p.duration),
              delay: Number(p.delay),
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {p.symbol}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
