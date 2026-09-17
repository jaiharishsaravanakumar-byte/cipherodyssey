import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CIPHERS_CONFIG } from '../data/ciphersConfig';
import { useAppStore } from '../store/useAppStore';
import { Lock, Check } from 'lucide-react';


const NODE_POSITIONS = {
  caesar: { x: 90, y: 70, order: 1 },
  atbash: { x: 90, y: 200, order: 2 },
  reverse: { x: 90, y: 320, order: 3 },

  rot13: { x: 260, y: 50, order: 4 },
  affine: { x: 260, y: 125, order: 5 },
  'rail-fence': { x: 260, y: 320, order: 6 },

  vigenere: { x: 430, y: 80, order: 7 },
  bacon: { x: 430, y: 200, order: 8 },
  columnar: { x: 430, y: 320, order: 9 },

  playfair: { x: 610, y: 105, order: 10 },
};


const EDGES = [
  { from: 'caesar', to: 'rot13' },
  { from: 'caesar', to: 'affine' },
  { from: 'rot13', to: 'vigenere' },
  { from: 'caesar', to: 'vigenere' },
  { from: 'vigenere', to: 'playfair' },
  { from: 'affine', to: 'playfair' },
  { from: 'atbash', to: 'bacon' },
  { from: 'reverse', to: 'rail-fence' },
  { from: 'rail-fence', to: 'columnar' },
];

export default function CipherLearningMap({ onSelectCipher }) {
  const shouldReduceMotion = useReducedMotion();
  const { isUnlocked, isMastered } = useAppStore();
  const [hoveredNode, setHoveredNode] = useState(null);

  return (
    <div className="border border-ink-dim/20 bg-panel/80 p-6 rounded-lg relative overflow-hidden">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-ink-dim/15 pb-4">
        <div>
          <div className="font-mono text-[16px] text-signal-amber uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-signal-amber" />
            <span>Progress Map</span>
          </div>
          <p className="text-ink-dim text-xs mt-1">
            Master foundational algorithms to unlock downstream cryptanalytic paradigms.
          </p>
        </div>

        
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-signal-amber">
            <span className="w-2.5 h-2.5 rounded-full bg-signal-amber/20 border border-signal-amber" />
            <span>Mastered</span>
          </div>
          <div className="flex items-center gap-1.5 text-signal-cyan">
            <span className="w-2.5 h-2.5 rounded-full bg-signal-cyan/20 border border-signal-cyan" />
            <span>Frontier (Unlocked)</span>
          </div>
          <div className="flex items-center gap-1.5 text-ink-dim/60">
            <span className="w-2.5 h-2.5 rounded-full bg-void border border-ink-dim/30" />
            <span>Locked</span>
          </div>
        </div>
      </div>

      
      <div className="w-full overflow-x-auto">
        <svg
          viewBox="0 0 710 390"
          className="w-full min-w-[650px] h-auto select-none"
        >
          <defs>
            
            <marker
              id="arrowhead-dim"
              markerWidth="7"
              markerHeight="7"
              refX="16"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 7 3.5, 0 7" fill="#5C6B7A" opacity="0.4" />
            </marker>
            <marker
              id="arrowhead-active"
              markerWidth="7"
              markerHeight="7"
              refX="16"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 7 3.5, 0 7" fill="#4FD1C5" opacity="0.8" />
            </marker>
            <marker
              id="arrowhead-mastered"
              markerWidth="7"
              markerHeight="7"
              refX="16"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 7 3.5, 0 7" fill="#E8A33D" opacity="0.9" />
            </marker>

            
            <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#4FD1C5" floodOpacity="0.6" />
            </filter>
            <filter id="amberGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#E8A33D" floodOpacity="0.7" />
            </filter>
          </defs>

          
          {EDGES.map(({ from, to }) => {
            const start = NODE_POSITIONS[from];
            const end = NODE_POSITIONS[to];
            if (!start || !end) return null;

            const fromMastered = isMastered(from);
            const toUnlocked = isUnlocked(to);

            let strokeColor = '#5C6B7A';
            let strokeOpacity = 0.25;
            let markerId = 'url(#arrowhead-dim)';

            if (fromMastered && toUnlocked) {
              strokeColor = '#E8A33D';
              strokeOpacity = 0.7;
              markerId = 'url(#arrowhead-mastered)';
            } else if (toUnlocked) {
              strokeColor = '#4FD1C5';
              strokeOpacity = 0.5;
              markerId = 'url(#arrowhead-active)';
            }

            
            const dx = (end.x - start.x) * 0.5;
            const pathData = `M ${start.x} ${start.y} C ${start.x + dx} ${start.y}, ${end.x - dx} ${end.y}, ${end.x} ${end.y}`;

            return (
              <path
                key={`${from}->${to}`}
                d={pathData}
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.5"
                strokeOpacity={strokeOpacity}
                markerEnd={markerId}
                className="micro-transition"
              />
            );
          })}

          
          {CIPHERS_CONFIG.map((cipher) => {
            const pos = NODE_POSITIONS[cipher.slug];
            if (!pos) return null;

            const unlocked = isUnlocked(cipher.slug);
            const mastered = isMastered(cipher.slug);
            const isHovered = hoveredNode === cipher.slug;

            
            let circleFill = '#0A0E14';
            let circleStroke = '#5C6B7A';
            let strokeWidth = 1.5;
            let filter = 'none';

            if (mastered) {
              circleFill = 'rgba(232, 163, 61, 0.15)';
              circleStroke = '#E8A33D';
              strokeWidth = 2;
              filter = 'url(#amberGlow)';
            } else if (unlocked) {
              circleFill = 'rgba(79, 209, 197, 0.1)';
              circleStroke = '#4FD1C5';
              strokeWidth = 2;
              filter = 'url(#cyanGlow)';
            } else {
              circleStroke = 'rgba(92, 107, 122, 0.3)';
              circleFill = 'rgba(10, 14, 20, 0.6)';
            }

            return (
              <g
                key={cipher.slug}
                className={`cursor-${unlocked ? 'pointer' : 'not-allowed'}`}
                onClick={() => {
                  if (unlocked) {
                    onSelectCipher?.(cipher.slug);
                  }
                }}
                onMouseEnter={() => setHoveredNode(cipher.slug)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {unlocked && !mastered && !shouldReduceMotion && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="20"
                    fill="none"
                    stroke="#4FD1C5"
                    strokeWidth="1"
                    opacity="0.4"
                    className="animate-ping"
                    style={{ transformOrigin: `${pos.x}px ${pos.y}px`, animationDuration: '3s' }}
                  />
                )}

                
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="17"
                  fill={circleFill}
                  stroke={circleStroke}
                  strokeWidth={strokeWidth}
                  filter={filter}
                  className="micro-transition"
                />

               
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  fill={mastered ? '#E8A33D' : unlocked ? '#4FD1C5' : '#5C6B7A'}
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {pos.order < 10 ? `0${pos.order}` : pos.order}
                </text>

               
                <text
                  x={pos.x}
                  y={pos.y + 30}
                  textAnchor="middle"
                  fill={unlocked ? '#E8ECF1' : '#5C6B7A'}
                  fontSize="11"
                  fontWeight="500"
                  fontFamily="'Inter', sans-serif"
                  opacity={unlocked ? 1 : 0.6}
                >
                  {cipher.name}
                </text>

                
                <text
                  x={pos.x}
                  y={pos.y + 42}
                  textAnchor="middle"
                  fill={unlocked ? '#4FD1C5' : '#5C6B7A'}
                  fontSize="9"
                  fontFamily="'JetBrains Mono', monospace"
                  opacity={unlocked ? 0.7 : 0.4}
                >
                  {cipher.badgeText}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      
      <div className="mt-3 pt-3 border-t border-ink-dim/15 min-h-[2.5rem] flex items-center justify-between text-xs font-mono">
        {hoveredNode ? (
          (() => {
            const c = CIPHERS_CONFIG.find((item) => item.slug === hoveredNode);
            const unlocked = isUnlocked(c.slug);
            const mastered = isMastered(c.slug);
            return (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-ink-primary font-bold">{c.name}</span>
                  <span className="text-ink-dim">({c.difficultyTier})</span>
                  <span className="text-ink-dim">·</span>
                  <span className="text-ink-dim">{c.shortDescription}</span>
                </div>
                <div>
                  {mastered ? (
                    <span className="text-signal-amber font-semibold">✓ Mastered</span>
                  ) : unlocked ? (
                    <span className="text-signal-cyan font-semibold">Click to Enter Lab</span>
                  ) : (
                    <span className="text-ink-dim flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Requires:{' '}
                      {c.prerequisites.join(', ')}
                    </span>
                  )}
                </div>
              </>
            );
          })()
        ) : (
          <span className="text-ink-dim/60">
            Hover over nodes to inspect dependencies. Click any unlocked cipher to open its curriculum station.
          </span>
        )}
      </div>
    </div>
  );
}
