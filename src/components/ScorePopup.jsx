import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';

function SinglePopupItem({ popup, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(popup.id);
    }, 1400); 
    return () => clearTimeout(timer);
  }, [popup.id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -28, scale: 0.9 }}
      transition={{ duration: 0.32, ease: 'easeOut' }}
      className={`px-3.5 py-1.5 rounded font-mono font-bold text-xs shadow-lg border backdrop-blur-md flex items-center gap-1.5 select-none ${
        popup.isPositive
          ? 'bg-panel/95 text-signal-amber border-signal-amber/60 shadow-[0_0_12px_rgba(232,163,61,0.25)]'
          : 'bg-panel/95 text-signal-red border-signal-red/60 shadow-[0_0_12px_rgba(229,72,77,0.25)]'
      }`}
    >
      <span>{popup.text}</span>
    </motion.div>
  );
}

export default function ScorePopup() {
  const { scorePopups, removeScorePopup } = useGameStore();

  return (
    <div
      className="fixed top-20 right-6 sm:right-12 z-50 pointer-events-none flex flex-col gap-2 items-end"
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout">
        {scorePopups.map((popup) => (
          <SinglePopupItem
            key={popup.id}
            popup={popup}
            onDismiss={removeScorePopup}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
