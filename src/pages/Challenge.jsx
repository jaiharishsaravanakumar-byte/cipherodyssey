import React, { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { useAppStore } from '../store/useAppStore';
import ChallengeCard from '../components/ChallengeCard.jsx';
import HintBox from '../components/HintBox.jsx';
import ScorePopup from '../components/ScorePopup.jsx';
import { Flame, Trophy, FastForward } from 'lucide-react';

export default function Challenge() {
  const {
    score,
    streak,
    difficulty,
    currentChallenge,
    startChallenge,
    nextChallenge,
    isSolved,
  } = useGameStore();

  const { masterCipher } = useAppStore();

  useEffect(() => {
    if (!currentChallenge) {
      startChallenge('easy');
    }
  }, [currentChallenge, startChallenge]);

  useEffect(() => {
    if (isSolved && currentChallenge) {
      masterCipher(currentChallenge.cipherType);
    }
  }, [isSolved, currentChallenge, masterCipher]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <ScorePopup />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-panel/90 border border-ink-dim/20 shadow-lg">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-signal-amber" />
            <div>
              <div className="text-[10px] font-mono text-ink-dim uppercase">Total Score</div>
              <div className="text-xl font-mono font-bold text-signal-amber drop-shadow-[0_0_8px_rgba(232,163,61,0.3)]">
                {score}
              </div>
            </div>
          </div>

          <div className="h-8 border-r border-ink-dim/20" />

          <div className="flex items-center gap-2">
            <Flame className={`w-5 h-5 ${streak > 0 ? 'text-signal-cyan animate-pulse' : 'text-ink-dim'}`} />
            <div>
              <div className="text-[10px] font-mono text-ink-dim uppercase">Streak</div>
              <div className="text-xl font-mono font-bold text-ink-primary">
                {streak} {streak > 2 && '🔥'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-void p-1 rounded border border-ink-dim/25 font-mono text-xs">
            {(['easy', 'medium', 'hard']).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => startChallenge(d)}
                className={`px-3 py-1 rounded uppercase tracking-wider micro-transition cursor-pointer ${
                  difficulty === d
                    ? 'bg-signal-amber text-bg-void font-bold shadow-[0_0_8px_rgba(232,163,61,0.3)]'
                    : 'text-ink-dim hover:text-ink-primary'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={nextChallenge}
            className="p-2 rounded bg-void border border-ink-dim/30 text-ink-dim hover:text-signal-cyan hover:border-signal-cyan/50 micro-transition cursor-pointer"
            title="Skip to next transmission"
          >
            <FastForward className="w-4 h-4" />
          </button>
        </div>
      </div>

      <section>
        <ChallengeCard />
      </section>

      <section>
        <HintBox />
      </section>
    </div>
  );
}
