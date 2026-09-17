import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { Lightbulb, ChevronDown } from 'lucide-react';

export default function HintBox() {
  const { currentChallenge, hintsRevealed, useHint, isSolved, isGameOver } = useGameStore();

  if (!currentChallenge || !currentChallenge.hints || currentChallenge.hints.length === 0) {
    return null;
  }

  const maxHints = currentChallenge.hints.length;
  const canRequestHint = hintsRevealed < maxHints && !isSolved && !isGameOver;

  return (
    <div className="border border-ink-dim/20 bg-panel/70 p-5 rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className={`w-4 h-4 ${hintsRevealed > 0 ? 'text-signal-cyan' : 'text-ink-dim'}`} />
          <span className="font-mono text-xs text-ink-primary font-semibold">
            Signal Intelligence Clues
          </span>
          <span className="font-mono text-[11px] text-ink-dim">
            ({hintsRevealed}/{maxHints} revealed)
          </span>
        </div>

        {canRequestHint && (
          <button
            type="button"
            onClick={useHint}
            className="px-3 py-1 bg-void border border-signal-cyan/50 text-signal-cyan font-mono text-xs rounded micro-transition hover:bg-signal-cyan/15 active:scale-95 cursor-pointer"
          >
            Reveal Next Clue (-20 pts)
          </button>
        )}
      </div>

      <motion.div layout className="space-y-2 overflow-hidden">
        <AnimatePresence>
          {currentChallenge.hints.slice(0, hintsRevealed).map((hintText, idx) => (
            <motion.div
              key={idx}
              layout
              initial={{ opacity: 0, height: 0, y: -6 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -6 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="p-3 rounded bg-void border border-signal-cyan/30 text-xs font-mono space-y-1"
            >
              <div className="text-[10px] text-signal-cyan font-bold uppercase tracking-wider flex items-center gap-1">
                <span>INTEL LAYER 0{idx + 1}</span>
                <ChevronDown className="w-3 h-3 text-signal-cyan/70" />
              </div>
              <p className="text-ink-primary font-sans leading-relaxed">
                {hintText}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {hintsRevealed === 0 && !isSolved && (
        <p className="text-[11px] font-sans text-ink-dim italic">
          Need assistance? Requesting intelligence clues progressively unveils structural properties with a minor point penalty.
        </p>
      )}
    </div>
  );
}
