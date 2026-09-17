import React from 'react';
import { CIPHERS_CONFIG, DIFFICULTY_TIERS } from '../data/ciphersConfig';
import { useAppStore } from '../store/useAppStore';
import CipherCard from '../components/CipherCard.jsx';
import CipherLearningMap from '../components/CipherLearningMap.jsx';

export default function Learn({ onSelectCipher }) {
  const { isUnlocked, isMastered } = useAppStore();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="border-b border-ink-dim/20 pb-6">
        <div className="font-mono text-xs uppercase tracking-wider mb-2 text-signal-amber">
          The Cipher Deck
        </div>
        <h2 className="text-3xl sm:text-4xl font-mono text-ink-primary tracking-tight">
          Cipher Library & Progress Map
        </h2>
        <p className="text-ink-dim text-sm max-w-2xl mt-2 leading-relaxed font-sans">
          Study the mechanics, mathematical models, and historical vulnerabilities of 10 classical ciphers.
          Progress through substitution, transposition, and polyalphabetic techniques. Click any unlocked cipher to open it in the Laboratory.
        </p>
      </div>

      <section>
        <CipherLearningMap onSelectCipher={onSelectCipher} />
      </section>

      <div className="space-y-12 pt-2">
        {DIFFICULTY_TIERS.map((tierInfo) => {
          const tierCiphers = CIPHERS_CONFIG.filter(
            (c) => c.difficultyTier === tierInfo.tier
          );
          const unlockedCount = tierCiphers.filter((c) => isUnlocked(c.slug)).length;

          return (
            <section key={tierInfo.tier} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-ink-dim/15 pb-2.5 gap-2">
                <div>
                  <h3 className="text-lg font-sans font-semibold text-ink-primary flex items-center gap-2.5">
                    <span className={`font-mono text-xs px-2 py-0.5 rounded border ${tierInfo.tagClass}`}>
                      {tierInfo.tier}
                    </span>
                  </h3>
                  <p className="text-ink-dim text-xs mt-1 font-sans">
                    {tierInfo.description}
                  </p>
                </div>
                <div className="font-mono text-xs text-ink-dim shrink-0">
                  <span className="text-ink-primary font-bold">{unlockedCount}</span>
                  <span> / {tierCiphers.length} Unlocked</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tierCiphers.map((cipher) => (
                  <CipherCard
                    key={cipher.slug}
                    cipher={cipher}
                    isUnlocked={isUnlocked(cipher.slug)}
                    isMastered={isMastered(cipher.slug)}
                    onSelect={onSelectCipher}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
