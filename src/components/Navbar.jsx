import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'hero', label: 'Home' },
  { id: 'ciphers', label: 'Ciphers' },
  { id: 'lab', label: 'Laboratory' },
  { id: 'challenge', label: 'Challenge' },
  { id: 'progress', label: 'Progress' },
];

export default function Navbar({ activeSection = 'hero', onNavigate }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (id) => {
    onNavigate?.(id);
    setMobileOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-panel/90 backdrop-blur-md border-b border-ink-dim/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button
          type="button"
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-amber rounded px-1 cursor-pointer"
        >
          <div className="w-8 h-8 rounded bg-void border border-signal-amber/40 flex items-center justify-center text-signal-amber font-mono font-bold text-sm tracking-wider group-hover:border-signal-amber transition-colors">
            CO
          </div>
          <span className="font-mono text-base font-semibold tracking-tight text-ink-primary">
            Cipher<span className="text-signal-amber">Odyssey</span>
          </span>
        </button>

        <nav className="hidden md:flex items-center space-x-1 sm:space-x-2" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`relative px-3 py-2 text-sm font-medium micro-transition focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-amber rounded cursor-pointer ${
                  active ? 'text-ink-primary' : 'text-ink-dim hover:text-ink-primary'
                }`}
              >
                <span className="relative z-10">{item.label}</span>

                {active && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 rounded bg-void border border-signal-amber/40"
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 32,
                    }}
                    aria-hidden="true"
                  >
                    <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-4 h-[2px] bg-signal-amber rounded-full" />
                  </motion.div>
                )}
              </button>
            );
          })}
        </nav>

        <div className="md:hidden flex items-center">
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="p-2 rounded bg-void border border-ink-dim/20 text-ink-dim hover:text-ink-primary focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-ink-dim/20 bg-panel/95 backdrop-blur-md px-4 py-3 space-y-1"
          >
            {NAV_ITEMS.map((item) => {
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full text-left px-3 py-2 rounded text-sm font-mono tracking-wide ${
                    active
                      ? 'bg-void text-signal-amber font-bold border border-signal-amber/30'
                      : 'text-ink-dim hover:text-ink-primary hover:bg-void/50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
