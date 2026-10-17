import React from 'react';
import { useSimulation } from '../../store/simulationStore';

export const SpaceXFooter: React.FC = () => {
  const { navigate } = useSimulation();

  return (
    <footer id="footer" className="w-full bg-[#050505] py-12 px-6 md:px-12 border-t border-[#333333] select-none font-sans">
      <div className="max-w-[1720px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 font-din text-xs tracking-[0.16em] font-semibold text-white/50">
        {/* Brand & Mission */}
        <div className="flex items-center gap-3">
          <span className="text-white font-bold tracking-[0.2em]">ASTRA // LOOP</span>
          <span className="text-white/20">|</span>
          <span className="font-mono text-[11px] text-white/50">SPACE & BEYOND IDEATHON 2026</span>
        </div>

        {/* Navigation Shortcuts */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
          <button
            onClick={() => {
              const el = document.getElementById('habitat');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-white transition-colors uppercase cursor-pointer"
          >
            HABITAT
          </button>
          <button
            onClick={() => navigate('digital-twin-3d')}
            className="hover:text-cyan transition-colors uppercase cursor-pointer text-cyan"
          >
            SIMULATION ARENA
          </button>
          <button
            onClick={() => navigate('recovery-plans')}
            className="hover:text-white transition-colors uppercase cursor-pointer"
          >
            RECOVERY PLANS
          </button>
          <button
            onClick={() => navigate('model-assumptions')}
            className="hover:text-white transition-colors uppercase cursor-pointer"
          >
            MISSION DATA
          </button>
          <button
            onClick={() => navigate('history')}
            className="hover:text-white transition-colors uppercase cursor-pointer"
          >
            AUDIT LOG
          </button>
        </div>

        {/* Team Credits & Status */}
        <div className="font-mono text-[10px] text-white/40 text-center md:text-right">
          <span>TEAM HACKDEVS</span>
          <span className="mx-2">•</span>
          <span className="text-teal">AVIONICS 120V // NOMINAL</span>
        </div>
      </div>
    </footer>
  );
};
