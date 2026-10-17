import React from 'react';
import { SpaceXHeader } from '../spacex/SpaceXHeader';
import { SpaceXFooter } from '../spacex/SpaceXFooter';

interface Props {
  children: React.ReactNode;
}

export const AppShell: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-white selection:text-black overflow-x-hidden">
      {/* 1. Unified Fixed SpaceX-Style Aerospace Top Header */}
      <SpaceXHeader />

      {/* 2. Main Full-Bleed Content Container with Subtle Grid */}
      <main className="flex-1 w-full pt-24 pb-16 spacex-grid">
        <div className="max-w-[1720px] mx-auto px-6 md:px-12 space-y-6">
          {children}
        </div>
      </main>

      {/* 3. Minimalist Aerospace Footer */}
      <SpaceXFooter />
    </div>
  );
};
