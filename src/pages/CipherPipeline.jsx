import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Copy, Check, ChevronDown, GitBranch } from 'lucide-react';
import { usePipelineStore } from '../store/usePipelineStore.js';
import { runCipherPipeline, PIPELINE_CIPHER_LABELS } from '../utils/cipherPipeline.js';
import { CIPHERS_CONFIG } from '../data/ciphersConfig.js';

const CIPHER_IDS = CIPHERS_CONFIG.map((c) => c.id);

const DIFFICULTY_COLOR = {
  Beginner: 'text-signal-cyan border-signal-cyan/40',
  Intermediate: 'text-signal-amber border-signal-amber/40',
  Advanced: 'text-signal-red border-signal-red/40',
};

function CipherSelector({ index, value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={`Stage ${index + 1} cipher selector`}
        className="w-full appearance-none bg-void border border-ink-dim/30 text-ink-primary font-mono text-sm px-3 py-2 pr-8 rounded focus:outline-none focus:border-signal-amber transition-colors cursor-pointer"
      >
        {CIPHER_IDS.map((id) => (
          <option key={id} value={id}>
            {PIPELINE_CIPHER_LABELS[id]}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-dim pointer-events-none" />
    </div>
  );
}

function StageParams({ index, cipherId, params, onParamChange }) {
  if (cipherId === 'caesar') {
    return (
      <div className="mt-2">
        <label className="block font-mono text-[11px] text-ink-dim uppercase tracking-wider mb-1">
          Shift
        </label>
        <input
          type="number"
          min={1}
          max={25}
          value={params.shift ?? 3}
          onChange={(e) => onParamChange(index, 'shift', parseInt(e.target.value, 10) || 3)}
          className="w-full bg-void border border-ink-dim/30 text-ink-primary font-mono text-sm px-3 py-1.5 rounded focus:outline-none focus:border-signal-amber transition-colors"
          aria-label="Caesar shift value"
        />
      </div>
    );
  }
  if (cipherId === 'affine') {
    return (
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div>
          <label className="block font-mono text-[11px] text-ink-dim uppercase tracking-wider mb-1">a</label>
          <input
            type="number"
            min={1}
            max={25}
            value={params.a ?? 5}
            onChange={(e) => onParamChange(index, 'a', parseInt(e.target.value, 10) || 5)}
            className="w-full bg-void border border-ink-dim/30 text-ink-primary font-mono text-sm px-3 py-1.5 rounded focus:outline-none focus:border-signal-amber transition-colors"
            aria-label="Affine a value"
          />
        </div>
        <div>
          <label className="block font-mono text-[11px] text-ink-dim uppercase tracking-wider mb-1">b</label>
          <input
            type="number"
            min={0}
            max={25}
            value={params.b ?? 8}
            onChange={(e) => onParamChange(index, 'b', parseInt(e.target.value, 10) || 8)}
            className="w-full bg-void border border-ink-dim/30 text-ink-primary font-mono text-sm px-3 py-1.5 rounded focus:outline-none focus:border-signal-amber transition-colors"
            aria-label="Affine b value"
          />
        </div>
      </div>
    );
  }
  if (cipherId === 'vigenere' || cipherId === 'columnar' || cipherId === 'playfair') {
    const label = cipherId === 'vigenere' ? 'Key' : cipherId === 'columnar' ? 'Key' : 'Key';
    const def = cipherId === 'vigenere' ? 'CIPHER' : cipherId === 'columnar' ? 'SECRET' : 'MONARCHY';
    return (
      <div className="mt-2">
        <label className="block font-mono text-[11px] text-ink-dim uppercase tracking-wider mb-1">
          {label}
        </label>
        <input
          type="text"
          value={params.key ?? def}
          onChange={(e) => onParamChange(index, 'key', e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
          className="w-full bg-void border border-ink-dim/30 text-ink-primary font-mono text-sm px-3 py-1.5 rounded focus:outline-none focus:border-signal-amber transition-colors uppercase"
          placeholder={def}
          aria-label={`${label} for ${PIPELINE_CIPHER_LABELS[cipherId]}`}
        />
      </div>
    );
  }
  if (cipherId === 'rail-fence') {
    return (
      <div className="mt-2">
        <label className="block font-mono text-[11px] text-ink-dim uppercase tracking-wider mb-1">
          Rails
        </label>
        <input
          type="number"
          min={2}
          max={10}
          value={params.rails ?? 3}
          onChange={(e) => onParamChange(index, 'rails', parseInt(e.target.value, 10) || 3)}
          className="w-full bg-void border border-ink-dim/30 text-ink-primary font-mono text-sm px-3 py-1.5 rounded focus:outline-none focus:border-signal-amber transition-colors"
          aria-label="Rail fence rails"
        />
      </div>
    );
  }
  return (
    <p className="mt-2 font-mono text-[11px] text-ink-dim/60 italic">No parameters required</p>
  );
}

function ConnectorArrow({ active }) {
  return (
    <div className="flex justify-center items-center py-1">
      <motion.div
        animate={{ opacity: active ? 1 : 0.2, scaleY: active ? 1 : 0.7 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-0.5"
      >
        <div className={`w-px h-6 ${active ? 'bg-signal-amber' : 'bg-ink-dim/30'} transition-colors`} />
        <div
          className={`w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent ${
            active ? 'border-t-signal-amber' : 'border-t-ink-dim/30'
          } transition-colors`}
          style={{ borderTopWidth: 6 }}
        />
      </motion.div>
    </div>
  );
}

function StageResultCard({ stage, stageIndex, isActive }) {
  const config = CIPHERS_CONFIG.find((c) => c.id === stage.cipherId);
  const diffClass = DIFFICULTY_COLOR[config?.difficultyTier] ?? 'text-ink-dim border-ink-dim/30';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: stageIndex * 0.45, ease: 'easeOut' }}
      className={`rounded border bg-panel p-4 space-y-3 ${
        isActive ? 'border-signal-amber/50' : 'border-ink-dim/20'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] text-ink-dim uppercase tracking-widest">
          Stage {String(stageIndex + 1).padStart(2, '0')}
        </span>
        <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded border uppercase ${diffClass}`}>
          {config?.difficultyTier}
        </span>
      </div>

      <div>
        <p className="font-mono text-base font-bold text-signal-amber tracking-wide">{stage.label}</p>
        <p className="font-mono text-[11px] text-ink-dim mt-0.5">{stage.paramLabel}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-void rounded p-2.5 border border-ink-dim/20">
          <p className="font-mono text-[10px] text-ink-dim uppercase tracking-wider mb-1">Input</p>
          <p className="font-mono text-xs text-ink-primary break-all leading-relaxed">{stage.input}</p>
        </div>
        <div className="bg-void rounded p-2.5 border border-signal-cyan/20">
          <p className="font-mono text-[10px] text-signal-cyan uppercase tracking-wider mb-1">Output</p>
          <p className="font-mono text-xs text-ink-primary break-all leading-relaxed">{stage.output}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function CipherPipeline() {
  const { stages, pipelineInput, pipelineResult, setStage, setStageParam, setPipelineInput, setPipelineResult, clearPipeline } =
    usePipelineStore();
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setError('');
    if (!pipelineInput.trim()) {
      setError('Enter a message before running the pipeline.');
      return;
    }
    setIsRunning(true);
    setPipelineResult(null);

    setTimeout(() => {
      const result = runCipherPipeline(pipelineInput, stages);
      if (result.error) {
        setError(result.error);
        setPipelineResult(null);
      } else {
        setPipelineResult(result);
      }
      setIsRunning(false);
    }, 80);
  };

  const handleCopy = () => {
    if (!pipelineResult?.finalOutput) return;
    navigator.clipboard.writeText(pipelineResult.finalOutput).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleClear = () => {
    clearPipeline();
    setError('');
    setCopied(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-ink-dim/20 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <GitBranch className="w-4 h-4 text-signal-amber" />
          <span className="font-mono text-xs uppercase tracking-wider text-signal-amber">
            Pipeline Initialized
          </span>
          <span className="ml-auto flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-signal-cyan animate-pulse" />
            <span className="font-mono text-[11px] text-ink-dim">3-Stage Active</span>
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-mono text-ink-primary tracking-tight">
          Cipher Pipeline
        </h2>
        <p className="text-ink-dim text-sm max-w-2xl mt-1 leading-relaxed font-sans">
          Chain three ciphers sequentially. The output of each stage becomes the input of the next, composing a layered transformation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stages.map((stage, idx) => {
          const config = CIPHERS_CONFIG.find((c) => c.id === stage.cipherId);
          const diffClass = DIFFICULTY_COLOR[config?.difficultyTier] ?? 'text-ink-dim border-ink-dim/30';
          return (
            <div key={idx} className="bg-panel border border-ink-dim/20 rounded p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-ink-dim uppercase tracking-widest">
                  Stage {String(idx + 1).padStart(2, '0')}
                </span>
                {config && (
                  <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded border uppercase ${diffClass}`}>
                    {config.difficultyTier}
                  </span>
                )}
              </div>
              <CipherSelector
                index={idx}
                value={stage.cipherId}
                onChange={(id) => setStage(idx, id)}
              />
              <StageParams
                index={idx}
                cipherId={stage.cipherId}
                params={stage.params}
                onParamChange={setStageParam}
              />
            </div>
          );
        })}
      </div>

      <div className="space-y-3">
        <div className="bg-panel border border-ink-dim/20 rounded p-4 space-y-3">
          <label
            htmlFor="pipeline-input"
            className="block font-mono text-[11px] text-ink-dim uppercase tracking-wider"
          >
            Plaintext Message
          </label>
          <textarea
            id="pipeline-input"
            value={pipelineInput}
            onChange={(e) => { setPipelineInput(e.target.value); setError(''); }}
            placeholder="ENTER MESSAGE"
            rows={3}
            className="w-full bg-void border border-ink-dim/30 text-ink-primary font-mono text-sm px-3 py-2 rounded focus:outline-none focus:border-signal-amber transition-colors resize-none placeholder:text-ink-dim/40"
            aria-label="Plaintext input for pipeline"
          />
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-ink-dim">
              {pipelineInput.length} characters
            </span>

            <AnimatePresence mode="wait">
              {error && (
                <motion.p
                  key="err"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="font-mono text-[11px] text-signal-red"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-2 px-5 py-2.5 bg-signal-amber text-bg-void font-mono text-xs font-bold uppercase rounded hover-glow-amber micro-transition cursor-pointer disabled:opacity-60"
            aria-label="Run pipeline"
          >
            <Play className="w-3.5 h-3.5" />
            {isRunning ? 'Processing…' : 'Run Pipeline'}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2.5 bg-void border border-ink-dim/30 text-ink-dim font-mono text-xs uppercase rounded hover:text-ink-primary hover:border-ink-dim transition-colors cursor-pointer"
            aria-label="Clear pipeline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>

      <AnimatePresence>
        {pipelineResult && (
          <motion.div
            key="pipeline-result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-1"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-signal-amber animate-pulse" />
              <span className="font-mono text-[11px] text-signal-amber uppercase tracking-wider">
                Transformation Complete
              </span>
            </div>

            <div className="space-y-1">
              <div className="bg-panel border border-ink-dim/20 rounded p-3">
                <p className="font-mono text-[10px] text-ink-dim uppercase tracking-wider mb-1">Input</p>
                <p className="font-mono text-sm text-ink-primary break-all">{pipelineResult.input}</p>
              </div>

              {pipelineResult.stages.map((stage, idx) => (
                <React.Fragment key={idx}>
                  <ConnectorArrow active />
                  <StageResultCard stage={stage} stageIndex={idx} isActive />
                  {idx < pipelineResult.stages.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.45 + 0.4 }}
                      className="font-mono text-[11px] text-signal-cyan text-center py-0.5 uppercase tracking-widest"
                    >
                      Output Transferred →
                    </motion.div>
                  )}
                </React.Fragment>
              ))}

              <ConnectorArrow active />

              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: pipelineResult.stages.length * 0.45 + 0.1, duration: 0.4 }}
                className="rounded border border-signal-amber/50 bg-void p-5 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-signal-amber" />
                  <p className="font-mono text-[11px] text-signal-amber uppercase tracking-widest">
                    Final Ciphertext Generated
                  </p>
                </div>
                <p className="font-mono text-xl sm:text-2xl text-ink-primary break-all leading-relaxed">
                  {pipelineResult.finalOutput}
                </p>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-panel border border-ink-dim/30 text-ink-dim hover:text-signal-amber hover:border-signal-amber/40 font-mono text-[11px] uppercase rounded transition-colors cursor-pointer"
                    aria-label="Copy final ciphertext"
                  >
                    {copied ? <Check className="w-3 h-3 text-signal-cyan" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    type="button"
                    onClick={handleRun}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-panel border border-ink-dim/30 text-ink-dim hover:text-signal-amber hover:border-signal-amber/40 font-mono text-[11px] uppercase rounded transition-colors cursor-pointer"
                    aria-label="Run pipeline again"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Run Again
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-panel border border-ink-dim/30 text-ink-dim hover:text-signal-red hover:border-signal-red/40 font-mono text-[11px] uppercase rounded transition-colors cursor-pointer"
                    aria-label="Clear and reconfigure pipeline"
                  >
                    Change Pipeline
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
