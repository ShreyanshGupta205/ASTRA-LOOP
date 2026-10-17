import React from 'react';
import { motion } from 'framer-motion';
import { useSimulation } from '../../store/simulationStore';
import { CurtainButton } from './CurtainButton';
import { ScrollIndicator } from './ScrollIndicator';
import { ArrowRight, ChevronDown, Compass } from 'lucide-react';

interface SpaceXHeroSectionProps {
  onWatchClick?: () => void;
}

export const SpaceXHeroSection: React.FC<SpaceXHeroSectionProps> = ({ onWatchClick }) => {
  const { navigate } = useSimulation();

  const handleEnterSimulation = () => {
    navigate('digital-twin-3d');
  };

  const handleExploreMission = () => {
    const el = document.getElementById('habitat');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative w-full h-screen min-h-[720px] flex items-end overflow-hidden bg-[#050505] select-none"
    >
      {/* Background Cinematic Lunar Visual Asset */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=2560&q=85"
          alt="Lunar Surface and Space Horizon"
          className="w-full h-full object-cover object-center filter brightness-[0.65] contrast-[1.18]"
        />
        {/* Layered dark radial & linear overlays for high contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-[#050505]/40 to-transparent" />

        {/* Subtle illuminated lunar horizon line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* Main Bottom-Left Anchored Typography & CTA */}
      <div className="relative top-[50px] z-10 w-full max-w-[1720px] mx-auto px-6 md:px-16 pb-20 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          {/* Eyebrow metadata */}
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
            <span className="font-din text-xs sm:text-sm font-bold tracking-[0.2em] text-white/80 uppercase block">
              ASTRALOOP / LUNAR SURFACE SYSTEMS
            </span>
          </div>

          {/* Primary H1 Title */}
          <h1 className="font-din text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold uppercase tracking-[0.04em] text-white leading-[1.02] mb-6">
            WHEN SYSTEMS FAIL,
            <br />
            EVERY SECOND MATTERS.
          </h1>

          {/* Supporting text */}
          <p className="text-white/80 font-sans text-sm md:text-base max-w-[560px] mb-8 leading-relaxed font-normal">
            A transparent digital twin for exploring resource failures, forecasting critical thresholds, and comparing recovery strategies for a future lunar habitat.
          </p>

          {/* Dual Action CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Primary Button: ENTER SIMULATION */}
            <button
              onClick={handleEnterSimulation}
              className="px-8 py-4 bg-white hover:bg-cyan text-black font-din font-bold text-xs uppercase tracking-[0.18em] transition-all duration-300 flex items-center gap-2.5 cursor-pointer sharp-brutalist shadow-2xl group"
              style={{ borderRadius: '0px' }}
            >
              <span>ENTER SIMULATION</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Secondary Button: EXPLORE THE MISSION */}
            <button
              onClick={handleExploreMission}
              className="px-8 py-4 border border-white/50 hover:border-white bg-transparent hover:bg-white/10 text-white font-din font-bold text-xs uppercase tracking-[0.18em] transition-all duration-300 flex items-center gap-2 cursor-pointer sharp-brutalist"
              style={{ borderRadius: '0px' }}
            >
              <span>EXPLORE THE MISSION</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Small Bottom-Corner Technical Indicator */}
      <div className="absolute bottom-8 right-6 md:right-16 z-10 hidden sm:flex flex-col items-end text-right font-mono text-[11px] text-white/50 leading-tight select-none">
        <span className="text-white/80 font-bold tracking-widest uppercase">HABITAT DEMO-01</span>
        <span className="text-cyan tracking-wider">SIMULATION ENVIRONMENT</span>
        <span className="text-white/40 text-[9px] mt-0.5">SHACKLETON RIM // 0.166G</span>
      </div>

      {/* Restrained Scroll Indicator at Bottom */}
      <ScrollIndicator targetId="habitat" />
    </section>
  );
};
