import React from 'react';
import { SpaceXHeader } from '../spacex/SpaceXHeader';
import { SpaceXFooter } from '../spacex/SpaceXFooter';

interface Props {
  children: React.ReactNode;
}

export const AppShell: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-white selection:text-black overflow-x-hidden relative">
      {/* Subtle Aerospace Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[380px] bg-gradient-to-b from-cyan/8 via-cyan/[0.02] to-transparent pointer-events-none blur-3xl z-0" />
      <div className="fixed top-48 right-0 w-[500px] h-[500px] bg-teal/[0.02] pointer-events-none blur-3xl z-0" />

      {/* 1. Unified Fixed SpaceX-Style Aerospace Top Header */}
      <SpaceXHeader />

      {/* 2. Main Full-Bleed Content Container with Subtle Grid */}
      <main className="flex-1 w-full pt-24 pb-20 spacex-grid relative z-10">
        <div className="max-w-[1720px] mx-auto px-6 md:px-12 space-y-8">
          {children}
        </div>
      </main>

      {/* 3. Minimalist Aerospace Footer */}
      <SpaceXFooter />
    </div>
  );
};
