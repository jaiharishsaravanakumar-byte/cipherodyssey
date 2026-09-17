import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

const HEADLINE_TEXT = 'AN ODYSSEY THROUGH THE WORLD OF CLASSICAL CIPHERS.';

export default function TypingHeadline({ onNavigate }) {
  const { hasPlayedIntro, setHasPlayedIntro } = useAppStore();
  const shouldReduceMotion = useReducedMotion();

  const skipAnimation = hasPlayedIntro || shouldReduceMotion;

  const [displayedHeadline, setDisplayedHeadline] = useState(
    skipAnimation ? HEADLINE_TEXT : ''
  );
  const [headlineComplete, setHeadlineComplete] = useState(skipAnimation);
  const [showSubtext, setShowSubtext] = useState(skipAnimation);
  const [showCTAs, setShowCTAs] = useState(skipAnimation);

  useEffect(() => {
    if (skipAnimation) {
      if (!hasPlayedIntro) setHasPlayedIntro(true);
      return;
    }

    let subtextTimer;
    let ctaTimer;
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex += 1;
      setDisplayedHeadline(HEADLINE_TEXT.slice(0, currentIndex));

      if (currentIndex >= HEADLINE_TEXT.length) {
        clearInterval(interval);
        setHeadlineComplete(true);

        subtextTimer = setTimeout(() => {
          setShowSubtext(true);

          ctaTimer = setTimeout(() => {
            setShowCTAs(true);
            setHasPlayedIntro(true);
          }, 240);
        }, 160);
      }
    }, 32);

    return () => {
      clearInterval(interval);
      if (subtextTimer) clearTimeout(subtextTimer);
      if (ctaTimer) clearTimeout(ctaTimer);
    };
  }, [skipAnimation, hasPlayedIntro, setHasPlayedIntro]);

  return (
    <div className="w-full max-w-3xl flex flex-col items-center text-center">
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-bold tracking-tight text-ink-primary min-h-[4rem] sm:min-h-[7rem] flex items-center justify-center">
        <span>
          {displayedHeadline}
          {!headlineComplete && !skipAnimation && (
            <span className="inline-block w-[3px] h-[1em] bg-signal-amber align-middle ml-1 animate-pulse" />
          )}
        </span>
      </h1>

      <div
        className={`mt-6 text-base sm:text-lg text-ink-dim font-sans max-w-xl leading-relaxed micro-transition ${
          showSubtext ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        Walk from ancient ciphers to the early 1900s. Get your hands dirty with substitution, transposition, and frequency analysis in an interactive lab built for curiosity, not exams.
      </div>

      <div
        className={`mt-10 flex flex-col sm:flex-row items-center gap-4 micro-transition ${
          showCTAs ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        <button
          type="button"
          onClick={() => onNavigate?.('challenge')}
          className="w-full sm:w-auto px-7 py-3 rounded bg-signal-amber text-bg-void font-mono font-semibold text-xs tracking-wider uppercase micro-transition hover-glow-amber focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-amber focus-visible:ring-offset-2 focus-visible:ring-offset-bg-void cursor-pointer"
        >
          START DECODING
        </button>

        <button
          type="button"
          onClick={() => onNavigate?.('ciphers')}
          className="w-full sm:w-auto px-7 py-3 rounded bg-void border border-ink-dim/30 text-ink-primary font-mono text-xs tracking-wider uppercase micro-transition hover:border-signal-amber hover:text-signal-amber hover-glow-amber focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-amber focus-visible:ring-offset-2 focus-visible:ring-offset-bg-void cursor-pointer"
        >
          LEARN CIPHERS
        </button>
      </div>
    </div>
  );
}
