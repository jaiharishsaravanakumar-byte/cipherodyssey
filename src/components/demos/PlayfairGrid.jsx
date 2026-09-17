import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { generatePlayfairMatrix, playfairEncode, preparePlayfairText } from '../../utils/cipherHelpers';
import { Grid, Sparkles, HelpCircle } from 'lucide-react';

const RULE_EXAMPLES = [
  {
    id: 'row',
    title: 'Rule 1: Same Row',
    ruleText: 'If both letters fall on the same row, replace each with the letter to its immediate right (wrapping to the left edge if at the end).',
    pair: ['O', 'N'],
    op: 'Shift Right →',
  },
  {
    id: 'column',
    title: 'Rule 2: Same Column',
    ruleText: 'If both letters fall in the same column, replace each with the letter immediately below it (wrapping to the top if at the bottom).',
    pair: ['M', 'B'],
    op: 'Shift Down ↓',
  },
  {
    id: 'rectangle',
    title: 'Rule 3: Rectangle',
    ruleText: 'If letters define opposite corners of a rectangle, each is replaced by the letter in its own row but in the other letter\'s column.',
    pair: ['H', 'E'],
    op: 'Swap Corners ⤢',
  },
];

export default function PlayfairGrid() {
  const [keyword, setKeyword] = useState('MONARCHY');
  const [activeRuleIdx, setActiveRuleIdx] = useState(2);

  const cleanKey = keyword.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I') || 'MONARCHY';
  const matrix = generatePlayfairMatrix(cleanKey);

  const activeRule = RULE_EXAMPLES[activeRuleIdx];
  const testPair = activeRule.pair;
  const encodedPair = playfairEncode(testPair.join(''), cleanKey);

  const idxA = matrix.indexOf(testPair[0]);
  const idxB = matrix.indexOf(testPair[1]);
  const resIdxA = matrix.indexOf(encodedPair[0]);
  const resIdxB = matrix.indexOf(encodedPair[1]);

  return (
    <div className="border border-ink-dim/20 bg-panel/90 p-6 sm:p-8 rounded-lg space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink-dim/15 pb-4">
        <div>
          <span className="font-mono text-xs text-signal-amber uppercase tracking-wider">
            5×5 Polybius Square
          </span>
          <h2 className="text-xl font-sans font-bold text-ink-primary mt-1">
            Playfair 5×5 Matrix & Geometric Rules
          </h2>
          <p className="text-ink-dim text-xs mt-1">
            Encrypts digraph pairs across a 5×5 grid (I and J merged into a single cell). Select each of the 3 rules to observe its geometric transformation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            maxLength={10}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value.toUpperCase())}
            placeholder="Key (e.g. MONARCHY)"
            className="w-32 px-3 py-1.5 text-xs font-mono rounded bg-void border border-ink-dim/30 text-signal-amber font-bold focus:outline-none focus:border-signal-amber"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-2">
        {RULE_EXAMPLES.map((r, idx) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setActiveRuleIdx(idx)}
            className={`p-3 rounded text-left border micro-transition cursor-pointer ${
              activeRuleIdx === idx
                ? 'bg-signal-amber/15 border-signal-amber shadow-[0_0_12px_rgba(232,163,61,0.2)]'
                : 'bg-void border-ink-dim/20 hover:border-ink-dim/50'
            }`}
          >
            <div className="text-[10px] font-mono uppercase text-ink-dim">
              {idx === 0 ? 'Same Row' : idx === 1 ? 'Same Column' : 'Corner Swap'}
            </div>
            <div className="text-sm font-bold font-sans text-ink-primary mt-0.5">
              {r.title}
            </div>
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="p-6 rounded bg-void border border-ink-dim/30 space-y-3 select-none font-mono">
          <div className="text-xs text-ink-dim flex justify-between border-b border-ink-dim/15 pb-2">
            <span>5×5 Key Square (I/J merged)</span>
            <span className="text-signal-cyan">Key: {cleanKey}</span>
          </div>

          <div className="grid grid-cols-5 gap-2 max-w-[280px] mx-auto py-2">
            {matrix.map((letter, idx) => {
              const isInputA = idx === idxA;
              const isInputB = idx === idxB;
              const isOutputA = idx === resIdxA;
              const isOutputB = idx === resIdxB;

              let styleClasses = 'bg-panel border-ink-dim/20 text-ink-primary';
              let badgeText = null;

              if (isInputA || isInputB) {
                styleClasses = 'bg-signal-cyan/25 border-signal-cyan text-signal-cyan font-bold shadow-[0_0_10px_rgba(79,209,197,0.3)]';
                badgeText = 'IN';
              } else if (isOutputA || isOutputB) {
                styleClasses = 'bg-signal-amber/25 border-signal-amber text-signal-amber font-bold shadow-[0_0_10px_rgba(232,163,61,0.3)]';
                badgeText = 'OUT';
              }

              return (
                <div
                  key={`matrix-${idx}`}
                  className={`relative w-12 h-12 rounded flex items-center justify-center text-base border micro-transition ${styleClasses}`}
                >
                  <span>{letter === 'I' ? 'I/J' : letter}</span>
                  {badgeText && (
                    <span className="absolute -top-1.5 -right-1 text-[8px] font-sans px-1 rounded bg-void border border-ink-dim/30 leading-tight">
                      {badgeText}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-4 text-[10px] text-ink-dim pt-2 border-t border-ink-dim/15">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-signal-cyan" /> Plain Digraph
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-signal-amber" /> Cipher Digraph
            </span>
          </div>
        </div>

        <div className="p-6 rounded bg-void border border-ink-dim/30 space-y-4 font-mono">
          <div className="text-xs text-signal-amber font-bold uppercase tracking-wider">
            Active Rule Inspector
          </div>

          <h3 className="text-lg font-sans font-bold text-ink-primary">
            {activeRule.title}
          </h3>

          <p className="text-xs text-ink-dim font-sans leading-relaxed">
            {activeRule.ruleText}
          </p>

          <div className="p-4 rounded bg-panel border border-ink-dim/20 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-dim">Demonstration Pair:</span>
              <span className="text-signal-cyan font-bold">{testPair[0]} + {testPair[1]}</span>
            </div>

            <div className="flex items-center justify-center gap-4 py-2">
              <div className="w-14 h-14 rounded bg-void border border-signal-cyan flex items-center justify-center text-xl font-bold text-signal-cyan">
                {testPair.join('')}
              </div>

              <div className="text-xs text-ink-dim">
                {activeRule.op}
              </div>

              <div className="w-14 h-14 rounded bg-void border border-signal-amber flex items-center justify-center text-xl font-bold text-signal-amber shadow-[0_0_10px_rgba(232,163,61,0.25)]">
                {encodedPair}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
