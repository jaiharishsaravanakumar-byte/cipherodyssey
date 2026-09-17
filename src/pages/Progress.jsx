import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore.js';
import { useGameStore } from '../store/useGameStore.js';
import { ACHIEVEMENTS } from '../utils/achievements.js';
import { fetchScoreSummary, fetchAchievements } from '../api/scores.js';
import ProgressBar from '../components/ProgressBar.jsx';
import { AchievementShelfCard, AchievementUnlockModal } from '../components/Achievement.jsx';
import { Trophy, Target, Flame, Award, Shield, CheckCircle, RotateCcw } from 'lucide-react';

export default function Progress() {
  const { stats, unlockedAchievements, resetProgress } = useAppStore();
  const { score: localScore, streak: localStreak } = useGameStore();

  const [isLoading, setIsLoading] = useState(true);
  const [serverSummary, setServerSummary] = useState(null);
  const [serverAchievements, setServerAchievements] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTelemetry() {
      try {
        const [summary, achievements] = await Promise.all([
          fetchScoreSummary().catch(() => null),
          fetchAchievements().catch(() => null),
        ]);

        if (isMounted) {
          if (summary) setServerSummary(summary);
          if (achievements) setServerAchievements(achievements);
          setIsLoading(false);
        }
      } catch {
        if (isMounted) setIsLoading(false);
      }
    }

    loadTelemetry();

    return () => {
      isMounted = false;
    };
  }, []);

  const displayScore =
    serverSummary && serverSummary.totalScore !== undefined
      ? Math.max(serverSummary.totalScore, localScore)
      : localScore;

  const totalSolved =
    serverSummary && serverSummary.totalSolved !== undefined
      ? serverSummary.totalSolved
      : stats.totalSolved || 0;

  const totalAttempts =
    serverSummary && serverSummary.totalAttempts !== undefined
      ? serverSummary.totalAttempts
      : stats.totalAttempts || 0;

  const accuracy =
    serverSummary && serverSummary.accuracy !== undefined
      ? serverSummary.accuracy
      : totalAttempts > 0
      ? Math.round((totalSolved / totalAttempts) * 100)
      : 100;

  const currentStreak =
    serverSummary && serverSummary.currentStreak !== undefined
      ? serverSummary.currentStreak
      : localStreak;

  const bestStreak =
    serverSummary && serverSummary.bestStreak !== undefined
      ? serverSummary.bestStreak
      : stats.bestStreak || localStreak;

  const activeUnlockedIds = new Set([
    ...unlockedAchievements,
    ...(serverAchievements ? serverAchievements.filter((a) => a.unlocked).map((a) => a.id) : []),
  ]);

  const rank =
    totalSolved >= 15
      ? 'Chief Cryptanalyst (Grade IV)'
      : totalSolved >= 10
      ? 'Senior Field Operator (Grade III)'
      : totalSolved >= 3
      ? 'Cipher Technician (Grade II)'
      : 'Novice Interceptor (Grade I)';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <AchievementUnlockModal />

      <div className="border-b border-ink-dim/20 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-signal-amber uppercase tracking-widest mb-1.5">
            <Shield className="w-4 h-4" />
            <span>Log of your voyage</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-sans font-bold text-ink-primary tracking-tight">
            The Course You've Charted
          </h1>
          <p className="text-ink-dim text-sm max-w-xl mt-2 font-sans">
            How you've been holding the wheel, what's actually stuck, and where this takes you next.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (window.confirm('Reset all course progress and restart from the beginning?')) {
              resetProgress();
            }
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-ink-dim hover:text-signal-red border border-ink-dim/20 hover:border-signal-red/40 rounded bg-void micro-transition cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Progress</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded bg-panel border border-ink-dim/20 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-ink-dim">
            <span>TOTAL SCORE</span>
            <Trophy className="w-4 h-4 text-signal-amber" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-signal-amber drop-shadow-[0_0_8px_rgba(232,163,61,0.25)]">
            {displayScore}
          </div>
          <p className="text-[11px] text-ink-dim font-sans pt-1">
            Authoritative verified points
          </p>
        </div>

        <div className="p-5 rounded bg-panel border border-ink-dim/20 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-ink-dim">
            <span>TRANSMISSIONS</span>
            <CheckCircle className="w-4 h-4 text-signal-cyan" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-ink-primary">
            {totalSolved}
            <span className="text-xs font-normal text-ink-dim ml-1">/ {totalAttempts} att.</span>
          </div>
          <p className="text-[11px] text-ink-dim font-sans pt-1">
            Successfully deciphered
          </p>
        </div>

        <div className="p-5 rounded bg-panel border border-ink-dim/20 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-ink-dim">
            <span>ACCURACY RATE</span>
            <Target className="w-4 h-4 text-signal-cyan" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-signal-cyan">
            {accuracy}%
          </div>
          <p className="text-[11px] text-ink-dim font-sans pt-1">
            Interception precision
          </p>
        </div>

        <div className="p-5 rounded bg-panel border border-ink-dim/20 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-ink-dim">
            <span>STREAK RECORD</span>
            <Flame className="w-4 h-4 text-signal-amber" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-ink-primary">
            {currentStreak}
            <span className="text-xs font-normal text-ink-dim ml-1.5">(Best: {bestStreak})</span>
          </div>
          <p className="text-[11px] text-ink-dim font-sans pt-1">
            Consecutive valid decryptions
          </p>
        </div>
      </div>

      <section>
        <ProgressBar
          isLoading={isLoading}
          serverMastery={serverSummary?.cipherMastery}
          serverSolves={serverSummary?.cipherSolves}
        />
      </section>

      <section className="border border-ink-dim/20 bg-panel/80 p-6 sm:p-8 rounded-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ink-dim/15 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-signal-amber" />
              <span className="font-mono text-xs text-signal-amber uppercase tracking-wider font-semibold">
                HONORS
              </span>
            </div>
            <h2 className="text-xl font-sans font-bold text-ink-primary mt-1">
              Marks the Road Left on You
            </h2>
          </div>

          <div className="font-mono text-xs text-ink-dim">
            <span className="text-signal-amber font-bold">{activeUnlockedIds.size}</span>
            <span> / {ACHIEVEMENTS.length} Unlocked</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = activeUnlockedIds.has(achievement.id);
            return (
              <AchievementShelfCard
                key={achievement.id}
                achievement={achievement}
                isUnlocked={isUnlocked}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
