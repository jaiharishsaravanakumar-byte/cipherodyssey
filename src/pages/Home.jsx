import React from 'react';
import AnimatedBackground from '../components/AnimatedBackground.jsx';
import TypingHeadline from '../components/TypingHeadline.jsx';

export default function Home({ onNavigate }) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <AnimatedBackground />
      <div className="w-full flex flex-col items-center justify-center my-auto z-10">
        <TypingHeadline onNavigate={onNavigate} />
      </div>
    </div>
  );
}
