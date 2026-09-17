import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Lock, CheckCircle2 } from 'lucide-react';


function CaesarVisual({ reduced }) {
  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <motion.div
        className="w-14 h-14 rounded-full border border-dashed border-signal-amber/40 flex items-center justify-center"
        animate={reduced ? {} : { rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      >
        <span className="absolute -top-1.5 text-[10px] font-mono text-signal-amber">A</span>
        <span className="absolute -right-1.5 text-[10px] font-mono text-ink-dim">G</span>
        <span className="absolute -bottom-1.5 text-[10px] font-mono text-signal-amber">N</span>
        <span className="absolute -left-1.5 text-[10px] font-mono text-ink-dim">T</span>
      </motion.div>
      <div className="absolute font-mono text-[10px] font-bold text-signal-amber">+3</div>
    </div>
  );
}

function AtbashVisual({ reduced }) {
  return (
    <div className="w-16 h-16 flex items-center justify-center gap-2 font-mono text-xs">
      <motion.span
        className="text-ink-primary font-bold"
        animate={reduced ? {} : { opacity: [1, 0.4, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        A
      </motion.span>
      <div className="h-8 border-r border-dotted border-signal-cyan/50" />
      <motion.span
        className="text-signal-cyan font-bold"
        animate={reduced ? {} : { opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        Z
      </motion.span>
    </div>
  );
}

function ReverseVisual({ reduced }) {
  return (
    <div className="w-16 h-16 flex flex-col items-center justify-center font-mono text-[11px] gap-1">
      <div className="text-ink-dim tracking-widest">L A B</div>
      <motion.div
        className="text-signal-amber tracking-widest font-semibold"
        animate={reduced ? {} : { x: [-3, 3, -3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        B A L
      </motion.div>
      <div className="text-[9px] text-ink-dim">← rev</div>
    </div>
  );
}

function Rot13Visual({ reduced }) {
  return (
    <div className="relative w-16 h-16 flex items-center justify-center font-mono">
      <motion.div
        className="w-12 h-12 rounded-full border border-signal-cyan/40 border-t-signal-amber flex items-center justify-center"
        animate={reduced ? {} : { rotate: [0, 180, 180, 360] }}
        transition={{ duration: 4, repeat: Infinity, times: [0, 0.4, 0.6, 1], ease: 'easeInOut' }}
      >
        <span className="text-[10px] text-signal-amber font-bold">13</span>
      </motion.div>
    </div>
  );
}

function AffineVisual({ reduced }) {
  return (
    <div className="w-16 h-16 flex flex-col items-center justify-center font-mono text-[10px] space-y-1">
      <span className="text-ink-dim text-[9px]">ax + b</span>
      <div className="flex items-center gap-1">
        <span className="text-ink-primary">5x</span>
        <span className="text-ink-dim">+</span>
        <motion.span
          className="text-signal-amber font-bold"
          animate={reduced ? {} : { opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          8
        </motion.span>
      </div>
      <span className="text-[9px] text-signal-cyan">mod 26</span>
    </div>
  );
}

function VigenereVisual({ reduced }) {
  return (
    <div className="w-16 h-16 flex flex-col items-center justify-center font-mono text-[10px] gap-1">
      <div className="flex gap-1 text-ink-dim">
        <span>K</span>
        <span>E</span>
        <span>Y</span>
      </div>
      <motion.div
        className="w-12 h-[2px] bg-signal-cyan"
        animate={reduced ? {} : { scaleX: [0.3, 1, 0.3] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="flex gap-1 text-signal-amber font-bold">
        <span>C</span>
        <span>I</span>
        <span>P</span>
      </div>
    </div>
  );
}

function RailFenceVisual({ reduced }) {
  return (
    <div className="w-16 h-16 flex items-center justify-center">
      <svg width="48" height="32" viewBox="0 0 48 32" className="overflow-visible">
        <line x1="0" y1="4" x2="48" y2="4" stroke="#5C6B7A" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.4" />
        <line x1="0" y1="16" x2="48" y2="16" stroke="#5C6B7A" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.4" />
        <line x1="0" y1="28" x2="48" y2="28" stroke="#5C6B7A" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.4" />

        <path
          d="M 2 4 L 14 16 L 24 28 L 34 16 L 46 4"
          fill="none"
          stroke="#4FD1C5"
          strokeWidth="1.2"
          opacity="0.7"
        />

        <motion.circle
          r="2.5"
          fill="#E8A33D"
          animate={
            reduced
              ? { cx: 24, cy: 28 }
              : {
                  cx: [2, 14, 24, 34, 46, 34, 24, 14, 2],
                  cy: [4, 16, 28, 16, 4, 16, 28, 16, 4],
                }
          }
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  );
}

function ColumnarVisual({ reduced }) {
  return (
    <div className="w-16 h-16 flex items-center justify-center gap-1 font-mono text-[9px]">
      <motion.div
        className="flex flex-col items-center bg-void px-1 py-0.5 rounded border border-ink-dim/20"
        animate={reduced ? {} : { y: [0, -3, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-signal-cyan font-bold">2</span>
        <span className="text-ink-dim">A</span>
        <span className="text-ink-dim">D</span>
      </motion.div>
      <motion.div
        className="flex flex-col items-center bg-void px-1 py-0.5 rounded border border-signal-amber/30"
        animate={reduced ? {} : { y: [0, 3, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
      >
        <span className="text-signal-amber font-bold">1</span>
        <span className="text-ink-primary">B</span>
        <span className="text-ink-primary">E</span>
      </motion.div>
      <div className="flex flex-col items-center bg-void px-1 py-0.5 rounded border border-ink-dim/20">
        <span className="text-ink-dim font-bold">3</span>
        <span className="text-ink-dim">C</span>
        <span className="text-ink-dim">F</span>
      </div>
    </div>
  );
}

function PlayfairVisual({ reduced }) {
  return (
    <div className="w-16 h-16 flex items-center justify-center">
      <div className="grid grid-cols-2 gap-1.5 p-2 rounded bg-void border border-ink-dim/20 font-mono text-[10px]">
        <motion.span
          className="w-4 h-4 flex items-center justify-center rounded text-signal-amber font-bold"
          animate={reduced ? {} : { scale: [1, 1.15, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          M
        </motion.span>
        <span className="w-4 h-4 flex items-center justify-center rounded text-ink-dim">O</span>
        <span className="w-4 h-4 flex items-center justify-center rounded text-ink-dim">N</span>
        <motion.span
          className="w-4 h-4 flex items-center justify-center rounded text-signal-cyan font-bold"
          animate={reduced ? {} : { scale: [1.15, 1, 1.15] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          A
        </motion.span>
      </div>
    </div>
  );
}

function BaconVisual({ reduced }) {
  return (
    <div className="w-16 h-16 flex flex-col items-center justify-center font-mono text-[10px]">
      <span className="text-ink-primary font-bold text-xs mb-0.5">B</span>
      <motion.div
        className="flex gap-0.5 text-[8px]"
        animate={reduced ? {} : { opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      >
        <span className="text-signal-cyan">A</span>
        <span className="text-signal-cyan">A</span>
        <span className="text-signal-cyan">A</span>
        <span className="text-signal-cyan">A</span>
        <span className="text-signal-amber font-bold">B</span>
      </motion.div>
    </div>
  );
}

const VISUAL_MAP = {
  caesar: CaesarVisual,
  atbash: AtbashVisual,
  reverse: ReverseVisual,
  rot13: Rot13Visual,
  affine: AffineVisual,
  vigenere: VigenereVisual,
  'rail-fence': RailFenceVisual,
  columnar: ColumnarVisual,
  playfair: PlayfairVisual,
  bacon: BaconVisual,
};


export default function CipherCard({ cipher, isUnlocked, isMastered, onSelect }) {
  const shouldReduceMotion = useReducedMotion();
  const VisualComponent = VISUAL_MAP[cipher.slug] || CaesarVisual;

  const cardContent = (
    <div
      className={`relative h-full p-5 rounded border flex flex-col justify-between micro-transition ${
        isUnlocked
          ? 'bg-panel border-ink-dim/20 hover:border-signal-amber/50 cursor-pointer group'
          : 'bg-panel/40 border-ink-dim/10 opacity-60 cursor-not-allowed select-none'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-ink-dim uppercase tracking-wider">
              {cipher.category}
            </span>
            {isMastered && (
              <span className="flex items-center gap-1 text-[11px] font-mono text-signal-amber">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mastered</span>
              </span>
            )}
          </div>
          <h3
            className={`font-sans font-bold text-lg leading-tight ${
              isUnlocked ? 'text-ink-primary group-hover:text-signal-amber' : 'text-ink-dim'
            } micro-transition`}
          >
            {cipher.name}
          </h3>
        </div>

        <div className="shrink-0 rounded bg-void/80 border border-ink-dim/15 p-1">
          <VisualComponent reduced={shouldReduceMotion || !isUnlocked} />
        </div>
      </div>

      <p className="font-sans text-xs text-ink-dim mt-4 leading-relaxed line-clamp-2">
        {cipher.shortDescription}
      </p>

      <div className="mt-5 pt-3 border-t border-ink-dim/15 flex items-center justify-between text-xs font-mono">
        <span className="text-ink-dim text-[11px]">{cipher.era}</span>

        {isUnlocked ? (
          <span className="text-signal-cyan group-hover:text-signal-amber micro-transition">
            Enter Lab
          </span>
        ) : (
          <span className="flex items-center gap-1 text-ink-dim/80 text-[11px]">
            <Lock className="w-3 h-3" />
          </span>
        )}
      </div>
    </div>
  );

  if (!isUnlocked) {
    return <div className="h-full">{cardContent}</div>;
  }

  return (
    <button
      type="button"
      onClick={() => onSelect?.(cipher.slug)}
      className="block w-full text-left h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-amber rounded cursor-pointer"
    >
      {cardContent}
    </button>
  );
}
