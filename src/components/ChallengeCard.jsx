import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { inputShakeVariant, successPopVariant } from '../utils/animationVariants';
import { Heart, Star, Send, HelpCircle, Check, ArrowRight, RotateCcw } from 'lucide-react';
import { CIPHERS_CONFIG } from '../data/ciphersConfig';

function HeartItem({ filled, index }) {
  return (
    <div className="relative w-5 h-5 flex items-center justify-center">
      <AnimatePresence mode="wait">
        {filled ? (
          <motion.div
            key={`filled-${index}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{
              scale: [1, 1.45, 0],
              opacity: [1, 0.8, 0],
              rotate: [0, 15, -20, 0],
              transition: { duration: 0.38, ease: 'easeInOut' },
            }}
            className="text-signal-red"
          >
            <Heart className="w-4 h-4 fill-signal-red filter drop-shadow-[0_0_6px_rgba(229,72,77,0.5)]" />
          </motion.div>
        ) : (
          <motion.div
            key={`empty-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            className="text-ink-dim/40"
          >
            <Heart className="w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ChallengeCard() {
  const {
    currentChallenge,
    hearts,
    difficulty,
    isCipherRevealed,
    isSolved,
    isGameOver,
    submitAnswer,
    identifyCipherGuess,
    nextChallenge,
    resetGame,
  } = useGameStore();

  const [inputVal, setInputVal] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState('idle');
  const [guessDropdownOpen, setGuessDropdownOpen] = useState(false);
  const [lastBreakdown, setLastBreakdown] = useState(null);

  useEffect(() => {
    setInputVal('');
    setFeedbackStatus('idle');
    setGuessDropdownOpen(false);
    setLastBreakdown(null);
  }, [currentChallenge]);

  if (!currentChallenge) return null;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isSolved || isGameOver) return;

    const result = await submitAnswer(inputVal);
    if (result && result.success) {
      setFeedbackStatus('success');
      setLastBreakdown(result.breakdown);
    } else {
      setFeedbackStatus('shake');
    }
  };

  const handleCipherGuess = (slug) => {
    const res = identifyCipherGuess(slug);
    setGuessDropdownOpen(false);
    if (!res.correct) {
      setFeedbackStatus('shake');
    }
  };

  const starCount = difficulty === 'hard' ? 3 : difficulty === 'medium' ? 2 : 1;

  return (
    <div className="border border-ink-dim/20 bg-panel p-6 sm:p-8 rounded-lg space-y-6 shadow-2xl">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink-dim/15 pb-4">
       
        <div className="flex items-center gap-3">
          <div className="font-mono text-xs text-ink-dim uppercase">INTERCEPT:</div>

          {isCipherRevealed ? (
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-signal-amber px-2.5 py-0.5 rounded bg-void border border-signal-amber/40">
                {currentChallenge.cipherName}
              </span>
            </div>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setGuessDropdownOpen((o) => !o)}
                className="flex items-center gap-2 font-mono text-xs px-2.5 py-1 rounded bg-void border border-signal-cyan/50 text-signal-cyan hover:bg-signal-cyan/15 micro-transition cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span className="font-bold">??? (Click to Identify +50)</span>
              </button>

              
              {guessDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 rounded bg-panel border border-ink-dim/30 shadow-xl p-2 z-30 space-y-1 font-mono text-xs">
                  <div className="text-[10px] text-ink-dim px-2 py-1 uppercase border-b border-ink-dim/20">
                    Select suspected cipher:
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-0.5">
                    {CIPHERS_CONFIG.map((c) => (
                      <button
                        key={c.slug}
                        type="button"
                        onClick={() => handleCipherGuess(c.slug)}
                        className="w-full text-left px-2 py-1 rounded text-ink-primary hover:bg-signal-cyan/15 hover:text-signal-cyan micro-transition"
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          
          <div className="flex items-center gap-0.5 ml-2" title={`Difficulty: ${difficulty}`}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < starCount
                    ? 'text-signal-amber fill-signal-amber'
                    : 'text-ink-dim/30'
                }`}
              />
            ))}
          </div>
        </div>

        
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[11px] text-ink-dim uppercase mr-1">Integrity:</span>
          {Array.from({ length: 5 }).map((_, i) => (
            <HeartItem key={i} index={i} filled={i < hearts} />
          ))}
        </div>
      </div>

      
      <div className="rounded bg-void p-6 border border-ink-dim/20 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-ink-dim">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-signal-amber animate-pulse" />
            <span>RAW INTERCEPTED CIPHERTEXT</span>
          </span>
          <span>{currentChallenge.ciphertext.length} CHARS</span>
        </div>

        
        <div className="font-mono text-xl sm:text-2xl lg:text-3xl font-bold tracking-[0.25em] text-signal-amber py-3 break-words select-all text-center sm:text-left drop-shadow-[0_0_12px_rgba(232,163,61,0.25)]">
          {currentChallenge.ciphertext}
        </div>
      </div>

      
      {!isGameOver && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-ink-dim uppercase">
              DECODED PLAINTEXT TRANSMISSION:
            </label>

            
            <motion.div
              variants={inputShakeVariant}
              animate={feedbackStatus === 'shake' ? 'shake' : 'idle'}
            >
              <input
                type="text"
                value={inputVal}
                disabled={isSolved}
                onChange={(e) => {
                  setInputVal(e.target.value.toUpperCase());
                  if (feedbackStatus === 'shake') setFeedbackStatus('idle');
                }}
                placeholder="ENTER DECRYPTED MESSAGE..."
                className={`w-full px-4 py-3 rounded bg-void font-mono text-sm sm:text-base tracking-widest uppercase border micro-transition focus:outline-none ${
                  feedbackStatus === 'shake'
                    ? 'border-signal-red text-signal-red focus:border-signal-red'
                    : isSolved
                    ? 'border-signal-amber text-signal-amber'
                    : 'border-ink-dim/40 text-ink-primary focus:border-signal-cyan'
                }`}
              />
            </motion.div>
          </div>

          <div className="flex items-center justify-between gap-3">
            {!isSolved ? (
              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="w-full sm:w-auto px-6 py-2.5 bg-signal-amber text-bg-void font-mono font-semibold text-xs tracking-wider uppercase rounded micro-transition hover-glow-amber disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Transmit Decoded Signal</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            ) : (
              <motion.div
                variants={successPopVariant}
                initial="idle"
                animate="pop"
                className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded bg-signal-amber/10 border border-signal-amber/50"
              >
                <div className="flex items-center gap-2 text-signal-amber">
                  <Check className="w-5 h-5 shrink-0" />
                  <div>
                    <div className="font-mono text-xs font-bold uppercase">
                      Deciphered
                    </div>
                    {lastBreakdown && (
                      <div className="text-xs font-mono text-ink-dim mt-0.5 flex flex-wrap gap-2">
                        {lastBreakdown.map((b, idx) => (
                          <span key={idx} className="text-signal-amber">
                            +{b.points} ({b.label})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={nextChallenge}
                  className="px-5 py-2 rounded bg-signal-amber text-bg-void font-mono text-xs font-bold uppercase flex items-center gap-1.5 micro-transition hover:opacity-90 cursor-pointer self-end sm:self-auto"
                >
                  <span>Next Challenge</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </div>
        </form>
      )}

      
      {isGameOver && (
        <div className="p-6 rounded bg-signal-red/10 border border-signal-red/50 text-center space-y-4">
          <div className="font-mono text-xs text-signal-red uppercase font-bold tracking-widest">
            ZERO HEARTS REMAINING
          </div>
          <h3 className="text-xl font-sans font-bold text-ink-primary">
            Transmission Interception Failed
          </h3>
          <p className="text-ink-dim text-xs max-w-sm mx-auto font-sans">
            The encrypted channel closed due to too many decryption mismatches. Re-calibrate your station and retry.
          </p>
          <button
            type="button"
            onClick={resetGame}
            className="px-6 py-2.5 bg-signal-red text-bg-void font-mono font-bold text-xs uppercase rounded micro-transition hover:opacity-90 cursor-pointer inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Laboratory Station</span>
          </button>
        </div>
      )}
    </div>
  );
}
