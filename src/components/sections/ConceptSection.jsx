import React from 'react';
import { BookOpen, ShieldAlert, Cpu } from 'lucide-react';
import { CIPHER_LESSONS } from '../../data/cipherLessons';

export default function ConceptSection({ cipher, lesson }) {
  const lessonData = lesson || CIPHER_LESSONS[cipher?.slug || cipher?.id] || CIPHER_LESSONS.caesar;
  const concept = lessonData.concept;
  const title = lessonData.title || `${cipher?.name || 'Cipher'} Concept`;

  return (
    <div className="border border-ink-dim/20 bg-panel/80 p-6 sm:p-8 rounded-lg space-y-8">
      <div className="border-b border-ink-dim/15 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-signal-cyan uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Concept</span>
        </div>
        <h2 className="text-2xl font-sans font-bold text-ink-primary mt-1">
          {title}
        </h2>
        <p className="text-ink-dim text-sm mt-1 max-w-2xl font-sans">
          {concept.summary}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-5 rounded bg-void border border-ink-dim/20 space-y-3">
          <div className="flex items-center gap-2 font-mono text-xs text-signal-amber font-semibold">
            <Cpu className="w-4 h-4" />
            <span>Mathematical Model</span>
          </div>

          <p className="text-xs text-ink-dim leading-relaxed font-sans">
            Formal mathematical representation of the transformation function:
          </p>

          <div className="p-3 rounded bg-panel border border-ink-dim/30 font-mono text-xs space-y-2">
            <div>
              <span className="text-ink-dim">Encryption: </span>
              <span className="text-signal-amber font-bold">{concept.mathModel.encryption}</span>
            </div>
            <div>
              <span className="text-ink-dim">Decryption: </span>
              <span className="text-signal-cyan font-bold">{concept.mathModel.decryption}</span>
            </div>
          </div>

          <p className="text-[11px] text-ink-dim/80 font-sans">
            {concept.mathModel.notation}
          </p>
        </div>

        <div className="p-5 rounded bg-void border border-ink-dim/20 space-y-3">
          <div className="flex items-center gap-2 font-mono text-xs text-signal-red font-semibold">
            <ShieldAlert className="w-4 h-4" />
            <span>{concept.vulnerability.title}</span>
          </div>

          <p className="text-xs text-ink-dim leading-relaxed font-sans">
            {concept.vulnerability.details}
          </p>

          <div className="p-3 rounded bg-panel border border-signal-red/30 font-mono text-xs text-ink-dim space-y-1">
            <div className="text-signal-red font-semibold">Vulnerability Vector:</div>
            {concept.vulnerability.points.map((pt, i) => (
              <div key={i}>• {pt}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
