import React, { useState, useEffect } from 'react';
import { useSimulation } from '../../store/simulationStore';
import { HabitatStatusBadge } from '../ui/HabitatStatusBadge';
import { PresenterModal } from '../ui/PresenterModal';
import { AIExplanationCopilot } from '../ai/AIExplanationCopilot';
import { GuidedDemoTour } from '../simulation/GuidedDemoTour';
import { soundEngine } from '../../utils/audio';
import {
  RotateCcw,
  Compass,
  Activity,
  Radio,
  Sparkles,
  Bot,
  PlayCircle,
  Volume2,
  VolumeX,
} from 'lucide-react';

export const AppHeader: React.FC = () => {
  const { state, resetSimulation, navigate } = useSimulation();
  const [isPresenterModalOpen, setIsPresenterModalOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundEngine.isMuted);
  const [elapsedSeconds, setElapsedSeconds] = useState(148);

  // Live mission elapsed timer (MET)
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatMET = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSec % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSec % 60).toString().padStart(2, '0');
    return `T+${hrs}:${mins}:${secs}`;
  };

  return (
    <>
      <header className="h-16 bg-bg-secondary/95 backdrop-blur-md border-b border-border px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30 font-sans">
        {/* Left: SpaceX-style Logo & Mission Identifier */}
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded bg-bg-panel border border-cyan/50 flex items-center justify-center shadow-cyan-glow relative overflow-hidden group">
            <Compass className="w-5 h-5 text-cyan transition-transform group-hover:rotate-90 duration-700" />
            <div className="absolute inset-0 bg-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-display font-extrabold text-base tracking-[0.2em] text-white flex items-center">
                ASTRA<span className="text-cyan ml-1">//</span><span className="text-white ml-1">LOOP</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest px-1.5 py-0.5 rounded bg-bg-elevated border border-border/80 text-cyan">
                DEMO-01
              </span>
            </div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-text-muted hidden sm:block">
              LUNAR SURFACE SURVIVAL INTELLIGENCE
            </p>
          </div>
        </div>

        {/* Center: SpaceX Avionics Telemetry HUD */}
        <div className="hidden md:flex items-center gap-3">
          {/* Mission Elapsed Time */}
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-bg-panel border border-border text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-spacex-pulse" />
            <span className="text-text-muted text-[10px] tracking-wider uppercase">MET</span>
            <span className="text-cyan font-bold tabular-nums tracking-widest">
              {formatMET(elapsedSeconds)}
            </span>
          </div>

          {/* Telemetry Stream Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-bg-panel border border-border text-xs font-mono text-text-muted">
            <Radio className="w-3 h-3 text-teal" />
            <span className="text-text-secondary text-[11px] font-semibold">FEED:</span>
            <span className="text-teal font-bold">120V DC BUS</span>
          </div>

          {/* Illustrative Disclosure */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-bg-panel border border-amber/30 text-xs font-mono text-amber">
            <Activity className="w-3 h-3" />
            <span className="text-[10px] tracking-wider font-semibold">ILLUSTRATIVE MODEL</span>
          </div>
        </div>

        {/* Right: Status Indicator & Mission Controls */}
        <div className="flex items-center gap-2">
          <HabitatStatusBadge status={state.habitat.status} />

          {/* Return to SpaceX Aerospace Landing Portal */}
          <button
            onClick={() => navigate('spacex-portal')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white text-white hover:text-black border border-white/40 text-xs font-din font-bold tracking-wider uppercase transition-all active:scale-95 cursor-pointer sharp-brutalist"
            title="Return to SpaceX Aerospace Landing Portal"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">AstraLoop Home</span>
          </button>

          {/* 2-Min Guided Demo Tour (Blueprint Page 11) */}
          <button
            onClick={() => setIsDemoTourOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan hover:bg-cyan-hover text-black text-xs font-din font-extrabold tracking-wider uppercase transition-all shadow-cyan-glow active:scale-95 cursor-pointer"
            title="Launch 2-Minute Guided Hackathon Pitch Tour (Blueprint Page 11)"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span className="hidden md:inline">2-Min Tour</span>
          </button>

          {/* AI Mission Copilot Button */}
          <button
            onClick={() => setIsCopilotOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan/15 hover:bg-cyan/25 border border-cyan/50 hover:border-cyan text-cyan text-xs font-din font-bold tracking-wider uppercase transition-all shadow-cyan-glow/20 active:scale-95 cursor-pointer"
            title="Open AI Mission Intelligence Copilot"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Copilot</span>
          </button>

          {/* Pitch & Defense Guide */}
          <button
            onClick={() => setIsPresenterModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-panel hover:bg-bg-elevated border border-border hover:border-cyan/50 text-white text-xs font-din font-bold tracking-wider uppercase transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Open hackathon pitch guide and 9-slide deck"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan" />
            <span className="hidden sm:inline">Presenter Guide</span>
          </button>

          {/* Audio Mute/Unmute Toggle */}
          <button
            onClick={() => {
              const muted = soundEngine.toggleMute();
              setIsMuted(muted);
              if (!muted) soundEngine.playClick();
            }}
            className="p-2 bg-bg-panel hover:bg-bg-elevated border border-border hover:border-cyan/50 text-text-muted hover:text-white transition-all cursor-pointer"
            title={isMuted ? 'Unmute Avionics Audio' : 'Mute Avionics Audio'}
            aria-label="Toggle Avionics Audio"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-text-muted" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-cyan" />
            )}
          </button>

          {/* Flight Reset Button */}
          <button
            onClick={resetSimulation}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-panel hover:bg-bg-elevated border border-border hover:border-cyan/50 text-text-muted hover:text-white text-xs font-din font-bold tracking-wider uppercase transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Reset flight console state to baseline equilibrium"
            aria-label="Reset Flight State"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </header>

      <GuidedDemoTour
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
      />

      <PresenterModal
        isOpen={isPresenterModalOpen}
        onClose={() => setIsPresenterModalOpen(false)}
      />

      <AIExplanationCopilot
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />
    </>
  );
};
