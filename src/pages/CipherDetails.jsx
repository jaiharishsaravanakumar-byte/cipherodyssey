import React from 'react';
import { CIPHERS_CONFIG } from '../data/ciphersConfig';
import { useAppStore } from '../store/useAppStore';
import CipherAlphabet from '../components/CipherAlphabet.jsx';
import AtbashMirror from '../components/demos/AtbashMirror.jsx';
import ReverseDemo from '../components/demos/ReverseDemo.jsx';
import AffineControls from '../components/demos/AffineControls.jsx';
import VigenereKeyInput from '../components/demos/VigenereKeyInput.jsx';
import ColumnarGrid from '../components/demos/ColumnarGrid.jsx';
import RailFenceZigzag from '../components/demos/RailFenceZigzag.jsx';
import PlayfairGrid from '../components/demos/PlayfairGrid.jsx';
import BaconBinaryReveal from '../components/demos/BaconBinaryReveal.jsx';
import ConceptSection from '../components/sections/ConceptSection.jsx';
import EncryptionSection from '../components/sections/EncryptionSection.jsx';
import DecryptionSection from '../components/sections/DecryptionSection.jsx';
import TryItYourself from '../components/TryItYourself.jsx';
import { CheckCircle2, Lock } from 'lucide-react';

export default function CipherDetails({ activeCipherId = 'caesar', onSelectCipher }) {
  const { isMastered, isUnlocked } = useAppStore();

  const currentCipher = CIPHERS_CONFIG.find(
    (c) => c.slug === activeCipherId || c.id === activeCipherId
  ) || CIPHERS_CONFIG[0];

  const mastered = isMastered(currentCipher.slug);
  const unlocked = isUnlocked(currentCipher.slug);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-ink-dim/20 pb-4">
        <div className="font-mono text-xs uppercase tracking-wider mb-2 text-signal-cyan">
          Interactive Laboratory
        </div>
        <h2 className="text-3xl sm:text-4xl font-mono text-ink-primary tracking-tight">
          Cipher Workbench
        </h2>
        <p className="text-ink-dim text-sm max-w-2xl mt-1 leading-relaxed font-sans">
          Inspect algorithms, adjust cipher variables, and practice encryption and decryption directly in the console.
        </p>

        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {CIPHERS_CONFIG.map((c) => {
            const isSelected = c.slug === currentCipher.slug;
            const itemUnlocked = isUnlocked(c.slug);
            const itemMastered = isMastered(c.slug);

            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => itemUnlocked && onSelectCipher?.(c.slug)}
                disabled={!itemUnlocked}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono whitespace-nowrap micro-transition ${
                  isSelected
                    ? 'bg-void text-signal-amber border border-signal-amber shadow-sm font-bold'
                    : itemUnlocked
                    ? 'bg-panel/80 text-ink-dim hover:text-ink-primary hover:bg-void border border-ink-dim/20 cursor-pointer'
                    : 'bg-panel/30 text-ink-dim/40 border border-ink-dim/10 cursor-not-allowed'
                }`}
              >
                {!itemUnlocked ? (
                  <Lock className="w-3 h-3 text-ink-dim/40 shrink-0" />
                ) : itemMastered ? (
                  <CheckCircle2 className="w-3 h-3 text-signal-amber shrink-0" />
                ) : null}
                <span>{c.name.replace(' Cipher', '')}</span>
              </button>
            );
          })}
        </div>
      </div>

      {!unlocked ? (
        <div className="p-8 rounded border border-ink-dim/20 bg-panel text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-void border border-ink-dim/30 flex items-center justify-center mx-auto text-ink-dim">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold font-sans text-ink-primary">
            {currentCipher.name} is Locked
          </h3>
          <p className="text-ink-dim text-sm max-w-md mx-auto font-sans">
            You must first master the required prerequisites:{' '}
            <span className="text-signal-cyan font-mono">
              {currentCipher.prerequisites.join(', ')}
            </span>
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onSelectCipher?.('caesar')}
              className="px-5 py-2.5 bg-signal-amber text-bg-void font-mono text-xs font-bold uppercase rounded micro-transition hover-glow-amber cursor-pointer"
            >
              Switch to Caesar
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-void text-signal-cyan border border-signal-cyan/40 uppercase">
                {currentCipher.difficultyTier}
              </span>
              <span className="font-mono text-xs text-ink-dim">
                {currentCipher.category}
              </span>
              <span className="font-mono text-xs text-ink-dim">·</span>
              <span className="font-mono text-xs text-ink-dim">
                {currentCipher.era}
              </span>
              {mastered && (
                <span className="flex items-center gap-1 text-xs font-mono text-signal-amber bg-signal-amber/10 px-2 py-0.5 rounded border border-signal-amber/40 ml-auto">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mastered</span>
                </span>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-sans font-bold text-ink-primary tracking-tight">
              {currentCipher.name}
            </h3>

            <p className="text-ink-dim text-sm max-w-2xl leading-relaxed font-sans">
              {currentCipher.shortDescription}
            </p>
          </div>

          <div className="space-y-12">
            <section id="cipher-demo">
              {(() => {
                switch (currentCipher.slug) {
                  case 'caesar':
                    return <CipherAlphabet />;
                  case 'rot13':
                    return <CipherAlphabet fixedShift={13} />;
                  case 'atbash':
                    return <AtbashMirror />;
                  case 'reverse':
                    return <ReverseDemo />;
                  case 'affine':
                    return <AffineControls />;
                  case 'vigenere':
                    return <VigenereKeyInput />;
                  case 'rail-fence':
                    return <RailFenceZigzag />;
                  case 'columnar':
                    return <ColumnarGrid />;
                  case 'playfair':
                    return <PlayfairGrid />;
                  case 'bacon':
                    return <BaconBinaryReveal />;
                  default:
                    return <CipherAlphabet />;
                }
              })()}
            </section>

            <section id="concepts">
              <ConceptSection cipher={currentCipher} />
            </section>

            <section id="encryption-walkthrough">
              <EncryptionSection cipherId={currentCipher.slug} />
            </section>

            <section id="decryption-walkthrough">
              <DecryptionSection cipherId={currentCipher.slug} />
            </section>

            <section id="try-it-yourself">
              <TryItYourself cipherId={currentCipher.slug} />
            </section>
          </div>
        </>
      )}
    </div>
  );
}
