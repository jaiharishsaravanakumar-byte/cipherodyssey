import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, ChevronDown, ChevronUp, GitBranch } from 'lucide-react';
import { usePipelineStore } from '../store/usePipelineStore.js';
import { compareAllCiphers } from '../utils/cipherStrength.js';
import { PIPELINE_CIPHER_LABELS } from '../utils/cipherPipeline.js';

const TIER_COLOR = {
  'Very High': 'text-signal-amber',
  High: 'text-signal-cyan',
  Moderate: 'text-ink-primary',
  Low: 'text-signal-red',
};

const DIFFICULTY_BORDER = {
  Beginner: 'border-signal-cyan/40',
  Intermediate: 'border-signal-amber/40',
  Advanced: 'border-signal-red/40',
  Pipeline: 'border-signal-amber/60',
};

const DIFFICULTY_TEXT = {
  Beginner: 'text-signal-cyan',
  Intermediate: 'text-signal-amber',
  Advanced: 'text-signal-red',
  Pipeline: 'text-signal-amber',
};

function ResistanceBar({ score, animate }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-void rounded-full overflow-hidden border border-ink-dim/20">
        <motion.div
          className="h-full bg-signal-amber rounded-full"
          initial={{ width: 0 }}
          animate={{ width: animate ? `${score}%` : 0 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
        />
      </div>
      <span className="font-mono text-sm font-bold text-ink-primary w-8 text-right">{score}</span>
    </div>
  );
}

function CipherComparisonCard({ entry, rank, animate, isExpanded, onToggleExpand }) {
  const diffBorder = DIFFICULTY_BORDER[entry.difficulty] ?? 'border-ink-dim/30';
  const diffText = DIFFICULTY_TEXT[entry.difficulty] ?? 'text-ink-dim';
  const tierColor = TIER_COLOR[entry.tier] ?? 'text-ink-primary';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: rank * 0.06, ease: 'easeOut' }}
      className={`rounded border bg-panel overflow-hidden w-full ${
        entry.isPipeline ? 'border-signal-amber/40' : 'border-ink-dim/20'
      }`}
    >
      <div className="p-4 sm:p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              {entry.isPipeline && <GitBranch className="w-3.5 h-3.5 text-signal-amber shrink-0" />}
              <p className="font-mono text-base font-bold text-ink-primary leading-tight">
                {entry.isPipeline ? 'Pipeline' : entry.name.replace(' Cipher', '')}
              </p>
            </div>
            {entry.isPipeline && (
              <p className="font-mono text-[10px] text-signal-amber/80 leading-snug">{entry.name}</p>
            )}
          </div>
          <span
            className={`shrink-0 font-mono text-[10px] px-1.5 py-0.5 rounded border uppercase ${diffText} ${diffBorder}`}
          >
            {entry.difficulty}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
          <div className="bg-void rounded p-2.5 border border-ink-dim/20">
            <p className="font-mono text-[10px] text-ink-dim uppercase tracking-wider mb-1">Encoded Output</p>
            <p className="font-mono text-xs text-ink-primary break-all leading-relaxed">
              {entry.output || '—'}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[11px] text-ink-dim uppercase tracking-wider">
                Resistance Score
              </p>
              <span className={`font-mono text-[11px] font-bold uppercase ${tierColor}`}>
                {entry.tier}
              </span>
            </div>
            <ResistanceBar score={entry.score} animate={animate} />
            <p className="font-mono text-[10px] text-ink-dim text-right">{entry.score} / 100</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleExpand}
          className="flex items-center gap-1.5 text-ink-dim hover:text-signal-amber font-mono text-[11px] uppercase tracking-wide transition-colors cursor-pointer w-full text-left pt-1"
          aria-expanded={isExpanded}
          aria-label={`Why this score for ${entry.isPipeline ? 'Pipeline' : entry.name}`}
        >
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          Why this score?
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="expand"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-ink-dim/20 p-4 space-y-3 bg-void/50">
              <div>
                <p className="font-mono text-[11px] text-ink-dim uppercase tracking-wider mb-2">
                  Contributing Factors
                </p>
                <ul className="space-y-1">
                  {entry.factors.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 font-mono text-xs text-ink-primary">
                      <span className="text-signal-cyan shrink-0 mt-px">•</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              {entry.note && (
                <p className="font-mono text-xs text-ink-dim leading-relaxed">{entry.note}</p>
              )}
              <p className="font-mono text-[10px] text-ink-dim/60 italic border-t border-ink-dim/20 pt-2">
                {entry.disclaimer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CipherComparison() {
  const { stages } = usePipelineStore();
  const [comparisonInput, setComparisonInput] = useState('');
  const [includePipeline, setIncludePipeline] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [animateBars, setAnimateBars] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const pipelineReady = stages.every((s) => s.cipherId);
  const pipelineLabel = stages
    .map((s) => PIPELINE_CIPHER_LABELS[s.cipherId] ?? s.cipherId)
    .join(' → ');

  const handleCompare = () => {
    setError('');
    if (!comparisonInput.trim()) {
      setError('Enter a message to compare.');
      return;
    }
    setResults(null);
    setExpandedId(null);
    setAnimateBars(false);
    setIsRunning(true);

    setTimeout(() => {
      const res = compareAllCiphers(comparisonInput, stages, includePipeline && pipelineReady);
      setResults(res);
      setIsRunning(false);
      setTimeout(() => setAnimateBars(true), 80);
    }, 80);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-ink-dim/20 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-4 h-4 text-signal-cyan" />
          <span className="font-mono text-xs uppercase tracking-wider text-signal-cyan">
            Analysis Initialized
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-mono text-ink-primary tracking-tight">
          Cipher Strength Comparison
        </h2>
        <p className="text-ink-dim text-sm max-w-2xl mt-1 leading-relaxed font-sans">
          Enter a message and compare how each of the ten classical ciphers transforms it. Scores are educational resistance estimates, not real-world security metrics.
        </p>
      </div>

      <div className="bg-panel border border-ink-dim/20 rounded p-4 space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="compare-input"
            className="block font-mono text-[11px] text-ink-dim uppercase tracking-wider"
          >
            Message to Compare
          </label>
          <input
            id="compare-input"
            type="text"
            value={comparisonInput}
            onChange={(e) => { setComparisonInput(e.target.value); setError(''); }}
            placeholder="ENTER WORD / MESSAGE"
            className="w-full bg-void border border-ink-dim/30 text-ink-primary font-mono text-sm px-3 py-2 rounded focus:outline-none focus:border-signal-cyan transition-colors placeholder:text-ink-dim/40"
            aria-label="Message to compare across all ciphers"
            onKeyDown={(e) => e.key === 'Enter' && handleCompare()}
          />
          {error && (
            <p className="font-mono text-[11px] text-signal-red">{error}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={includePipeline}
              onClick={() => setIncludePipeline((v) => !v)}
              aria-label="Toggle pipeline inclusion in comparison"
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-amber ${
                includePipeline ? 'bg-signal-amber border-signal-amber' : 'bg-void border-ink-dim/40'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 translate-y-px rounded-full bg-bg-void shadow ring-0 transition-transform ${
                  includePipeline ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </button>
            <div>
              <p className="font-mono text-xs text-ink-primary">Include Pipeline</p>
              {includePipeline && pipelineReady && (
                <p className="font-mono text-[10px] text-signal-amber/80">{pipelineLabel}</p>
              )}
              {includePipeline && !pipelineReady && (
                <p className="font-mono text-[10px] text-signal-red">Configure pipeline above first</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleCompare}
            disabled={isRunning}
            className="flex items-center gap-2 px-5 py-2.5 bg-signal-cyan/10 border border-signal-cyan/40 text-signal-cyan font-mono text-xs font-bold uppercase rounded hover-glow-cyan micro-transition cursor-pointer disabled:opacity-60 sm:ml-auto"
            aria-label="Compare all ciphers"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            {isRunning ? 'Analyzing…' : 'Compare Ciphers'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {results && (
          <motion.div
            key="compare-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-signal-cyan animate-pulse" />
                <span className="font-mono text-[11px] text-signal-cyan uppercase tracking-wider">
                  Analysis Complete · {results.length} entries
                </span>
              </div>
              <span className="font-mono text-[11px] text-ink-dim uppercase tracking-wider">
                Sorted by Resistance Score ↓
              </span>
            </div>

            <p className="font-mono text-[10px] text-ink-dim/60 italic">
              Educational heuristic — not a real cryptographic security probability.
            </p>

            <div className="flex flex-col gap-3">
              {results.map((entry, idx) => (
                <CipherComparisonCard
                  key={entry.id}
                  entry={entry}
                  rank={idx}
                  animate={animateBars}
                  isExpanded={expandedId === entry.id}
                  onToggleExpand={() =>
                    setExpandedId((prev) => (prev === entry.id ? null : entry.id))
                  }
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
