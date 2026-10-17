import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Volume2, ShieldCheck, Activity, Gauge, Flame } from 'lucide-react';
import { CurtainButton } from './CurtainButton';

interface MissionVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchSimulator: () => void;
}

export const MissionVideoModal: React.FC<MissionVideoModalProps> = ({
  isOpen,
  onClose,
  onLaunchSimulator,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
          className="relative w-full max-w-5xl bg-[#030508] border-2 border-white/20 z-10 overflow-hidden shadow-2xl sharp-brutalist"
          style={{ borderRadius: '0px' }}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/15 bg-black">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-[#00FF88] animate-ping" />
              <span className="font-din text-sm font-bold tracking-[0.2em] text-white uppercase">
                STARSHIP // FLIGHT 14 MISSION REPLAY & TELEMETRY
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-white/60 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Video Player Visual Simulation */}
          <div className="relative aspect-video w-full bg-black overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1517976547714-720226b864c1?auto=format&fit=crop&w=1920&q=85"
              alt="Starship Flight Replay"
              className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.1]"
            />

            {/* Flight HUD Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

            {/* Top Telemetry HUD */}
            <div className="absolute top-4 left-6 right-6 flex items-center justify-between font-mono text-xs text-white/90">
              <div className="flex items-center gap-4 bg-black/60 px-3 py-1.5 border border-white/20 backdrop-blur-sm">
                <span>VELOCITY: <strong className="text-[#00E5FF]">27,150 KM/H</strong></span>
                <span>ALTITUDE: <strong className="text-[#00E5FF]">184.2 KM</strong></span>
              </div>
              <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 border border-white/20 backdrop-blur-sm">
                <Flame className="w-3.5 h-3.5 text-[#FF9900]" />
                <span>RAPTOR 3: <strong className="text-[#00FF88]">33 / 33 ENGINES NOMINAL</strong></span>
              </div>
            </div>

            {/* Center Play Indicator */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 border-2 border-white/80 bg-black/50 backdrop-blur-sm flex items-center justify-center hover:scale-105 hover:bg-white hover:text-black text-white transition-all cursor-pointer">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>
            </div>

            {/* Bottom Scrubber & Time */}
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between font-mono text-xs text-white/80">
              <span>MET: T+00:08:42 // BOOSTER CATCH COMPLETE</span>
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-white/70" />
                <span className="text-[#00FF88]">AUDIO FEED: 48kHz STEREO</span>
              </div>
            </div>
          </div>

          {/* Mission Stats Breakdown */}
          <div className="p-6 md:p-8 bg-black grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-white/15">
            <div className="p-4 border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-2 font-din text-xs font-bold tracking-widest text-white/50 uppercase">
                <Gauge className="w-4 h-4 text-[#00E5FF]" />
                <span>SUPER HEAVY BOOSTER</span>
              </div>
              <p className="font-din text-2xl font-bold text-white mb-1 uppercase">
                CHOPSTICKS CATCH
              </p>
              <p className="text-xs text-white/70 font-sans leading-relaxed">
                Precision return and mechanical tower capture at Starbase Launch Mount within &plusmn;0.2m targeting tolerance.
              </p>
            </div>

            <div className="p-4 border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-2 font-din text-xs font-bold tracking-widest text-white/50 uppercase">
                <Activity className="w-4 h-4 text-[#00FF88]" />
                <span>PROPELLANT TRANSFER</span>
              </div>
              <p className="font-din text-2xl font-bold text-white mb-1 uppercase">
                10.2 TONS CRYO CH4/LOX
              </p>
              <p className="text-xs text-white/70 font-sans leading-relaxed">
                Internal header tank to main tank cryogenic transfer verified in microgravity for future Artemis Lunar missions.
              </p>
            </div>

            <div className="p-4 border border-[#00E5FF]/40 bg-[#00E5FF]/5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 font-din text-xs font-bold tracking-widest text-[#00E5FF] uppercase">
                  <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
                  <span>LUNAR HABITAT INTEGRATION</span>
                </div>
                <p className="font-din text-lg font-bold text-white mb-1 uppercase">
                  ASTRA // LOOP DIGITAL TWIN
                </p>
                <p className="text-xs text-white/70 font-sans leading-relaxed mb-4">
                  Test the habitat's life support and power runway under micro-meteorite regolith dust occlusion.
                </p>
              </div>

              <CurtainButton
                onClick={() => {
                  onClose();
                  onLaunchSimulator();
                }}
                variant="cyan"
                className="w-full"
              >
                OPEN DIGITAL TWIN
              </CurtainButton>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
