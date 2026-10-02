import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Learn from './pages/Learn.jsx';
import CipherDetails from './pages/CipherDetails.jsx';
import CipherPipeline from './pages/CipherPipeline.jsx';
import CipherComparison from './pages/CipherComparison.jsx';
import Challenge from './pages/Challenge.jsx';
import Progress from './pages/Progress.jsx';
import { ArrowUp } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedCipher, setSelectedCipher] = useState('caesar');

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 64;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: Math.max(0, elementPosition - navOffset),
        behavior: 'smooth',
      });
    }
  };

  const handleSelectCipher = (slug) => {
    setSelectedCipher(slug);
    scrollToSection('lab');
  };

  useEffect(() => {
    const sectionIds = ['hero', 'ciphers', 'lab', 'pipeline', 'compare', 'challenge', 'progress'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-void text-ink-primary flex flex-col font-sans selection:bg-signal-amber/30 selection:text-ink-primary scroll-smooth">
      <Navbar activeSection={activeSection} onNavigate={scrollToSection} />

      <main className="flex-1 pt-16">
        <section id="hero" className="relative border-b border-ink-dim/10">
          <Home onNavigate={scrollToSection} />
        </section>

        <section id="ciphers" className="relative border-b border-ink-dim/10">
          <Learn onSelectCipher={handleSelectCipher} />
        </section>

        <section id="lab" className="relative border-b border-ink-dim/10 bg-panel/30">
          <CipherDetails activeCipherId={selectedCipher} onSelectCipher={setSelectedCipher} />
        </section>

        <section id="pipeline" className="relative border-b border-ink-dim/10">
          <CipherPipeline />
        </section>

        <section id="compare" className="relative border-b border-ink-dim/10 bg-panel/30">
          <CipherComparison />
        </section>

        <section id="challenge" className="relative border-b border-ink-dim/10">
          <Challenge />
        </section>

        <section id="progress" className="relative">
          <Progress />
        </section>
      </main>

      <footer className="border-t border-ink-dim/20 bg-panel/90 text-ink-dim text-xs py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-signal-cyan animate-pulse" />
            <span className="font-mono text-[11px] text-ink-primary tracking-wider uppercase">
              CipherOdyssey Laboratory • Operational
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-[11px]">
            <button
              type="button"
              onClick={() => scrollToSection('hero')}
              className="hover:text-signal-amber cursor-pointer transition-colors"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('ciphers')}
              className="hover:text-signal-amber cursor-pointer transition-colors"
            >
              Ciphers
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('lab')}
              className="hover:text-signal-amber cursor-pointer transition-colors"
            >
              Laboratory
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('pipeline')}
              className="hover:text-signal-amber cursor-pointer transition-colors"
            >
              Pipeline
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('compare')}
              className="hover:text-signal-amber cursor-pointer transition-colors"
            >
              Compare
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('challenge')}
              className="hover:text-signal-amber cursor-pointer transition-colors"
            >
              Challenge
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('progress')}
              className="hover:text-signal-amber cursor-pointer transition-colors"
            >
              Progress
            </button>
          </div>

          <button
            type="button"
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-void border border-ink-dim/20 hover:border-signal-amber hover:text-signal-amber text-ink-dim font-mono text-[11px] tracking-wider transition-colors cursor-pointer"
          >
            <ArrowUp className="w-3 h-3" />
            <span>Top</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
