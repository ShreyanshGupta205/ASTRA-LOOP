import React from 'react';
import { useSimulation } from '../../store/simulationStore';
import {
  Play,
  Pause,
  FastForward,
  RotateCcw,
  Clock,
  Zap,
  Activity,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';

export const SimulationControlDeck: React.FC = () => {
  const {
    state,
    setSimPlaying,
    setSimSpeed,
    scrubSimTime,
    stepSimForward,
    resetSimulation,
  } = useSimulation();

  const { simTimeHours, isSimPlaying, simSpeed, simMaxHours, habitat, activeScenario } = state;

  const isFaultActive = habitat.isFaultActive;
  const isPlanApplied = Boolean(habitat.appliedPlanId);

  // Format hours into T+HH:MM:SS
  const formatSimTime = (hours: number) => {
    const totalSeconds = Math.round(hours * 3600);
    const hrs = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `T+${hrs}:${mins}:${secs}`;
  };

  // Calculate percentage of timeline
  const progressPct = (simTimeHours / simMaxHours) * 100;
  // Threshold mark for solar scenario: 4.0h out of 16h = 25%
  const faultedThresholdPct = activeScenario?.id === 'solar-drop' ? (4.0 / 16.0) * 100 : 0;
  // Plan C threshold mark: 13.33h out of 16h = 83.3%
  const recoveryThresholdPct = activeScenario?.id === 'solar-drop' ? (13.33 / 16.0) * 100 : 0;

  return (
    <div className="hud-panel p-5 border-t-2 border-t-cyan bg-[#080808] border border-[#333333] shadow-2xl font-mono relative sharp-brutalist">
      {/* Top Header Strip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-[#333333]">
        <div className="flex items-center gap-3.5">
          <div className={`w-10 h-10 flex items-center justify-center border sharp-brutalist transition-all ${
            isSimPlaying
              ? 'bg-cyan/15 text-cyan border-cyan/60 shadow-cyan-glow animate-spacex-pulse'
              : 'bg-white/[0.04] text-white/50 border-white/10'
          }`}>
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2 font-din">
                <span>SIMULATION ENGINE PLAYBACK</span>
                {isSimPlaying && (
                  <span className="w-2 h-2 rounded-full bg-cyan animate-ping" />
                )}
              </h2>
              <span className={`text-[9px] font-bold px-2 py-0.5 border sharp-brutalist ${
                isSimPlaying ? 'bg-cyan text-black font-extrabold border-cyan' : 'bg-white/5 text-white/50 border-white/10'
              }`}>
                {isSimPlaying ? 'LIVE RUNNING' : 'PAUSED'}
              </span>
            </div>
            <p className="text-[11px] text-white/50 tracking-tight font-sans mt-0.5">
              Dynamic time-stepped simulation controller: advance time, inspect live resource depletion, and test mitigation impact
            </p>
          </div>
        </div>

        {/* Live Simulation Clock Readout */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="px-4 py-2 bg-white/[0.04] border border-white/10 text-right sharp-brutalist">
            <span className="text-[9px] text-white/50 uppercase tracking-[0.2em] block font-mono">
              SIMULATED ELAPSED TIME
            </span>
            <span className="text-lg font-extrabold text-cyan tabular-nums tracking-widest font-mono">
              {formatSimTime(simTimeHours)}
              <span className="text-[11px] text-white/50 ml-1.5 font-normal font-sans">
                ({simTimeHours.toFixed(1)}h)
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Playback Controls & Speed Multipliers */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {/* Play/Pause & Step Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setSimPlaying(!isSimPlaying)}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold font-din uppercase tracking-[0.16em] transition-all cursor-pointer shadow-lg active:scale-95 sharp-brutalist ${
              isSimPlaying
                ? 'bg-amber text-black shadow-amber-glow'
                : 'bg-white hover:bg-cyan text-black font-bold'
            }`}
          >
            {isSimPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-black" />
                <span>PAUSE ENGINE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>{simTimeHours > 0 ? 'RESUME SIMULATION' : 'START SIMULATION'}</span>
              </>
            )}
          </button>

          {/* Step Controls: +15m (+0.25h) & +60m (+1.0h) */}
          <button
            onClick={() => stepSimForward(0.25)}
            className="px-3.5 py-2.5 bg-white/[0.04] hover:bg-white/10 border border-white/20 text-white/80 hover:text-white text-xs font-din font-bold uppercase tracking-[0.14em] transition-colors cursor-pointer sharp-brutalist"
            title="Advance simulated time by +15 minutes (+0.25 hours)"
          >
            +15 MIN
          </button>
          <button
            onClick={() => stepSimForward(1.0)}
            className="px-3.5 py-2.5 bg-white/[0.04] hover:bg-white/10 border border-white/20 text-white/80 hover:text-white text-xs font-din font-bold uppercase tracking-[0.14em] transition-colors cursor-pointer sharp-brutalist"
            title="Advance simulated time by +60 minutes (+1.0 hour)"
          >
            +60 MIN
          </button>

          {/* Reset to Baseline */}
          <button
            onClick={resetSimulation}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white/[0.04] hover:bg-white/10 border border-white/20 text-white/60 hover:text-white text-xs font-din font-bold uppercase tracking-[0.14em] transition-colors cursor-pointer sharp-brutalist"
            title="Reset flight state to nominal baseline equilibrium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET TO BASELINE</span>
          </button>
        </div>

        {/* Speed Multiplier Toggles: 1x, 10x, 60x */}
        <div className="flex items-center gap-1 bg-white/[0.04] p-1 border border-white/10 text-xs sharp-brutalist">
          <span className="text-[10px] text-white/50 px-2 uppercase font-mono tracking-wider">SPEED:</span>
          {[1, 10, 60].map((spd) => (
            <button
              key={spd}
              onClick={() => setSimSpeed(spd)}
              className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer font-mono sharp-brutalist ${
                simSpeed === spd
                  ? 'bg-cyan text-black shadow-cyan-glow font-extrabold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
              title={`At ${spd}x speed: advance ${spd} simulated minute(s) per real second`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* Scrubbable Timeline Bar with Threshold Markers */}
      <div className="space-y-2 pt-2">
        <div className="relative w-full">
          {/* Visual Threshold Marker Labels */}
          {activeScenario?.id === 'solar-drop' && (
            <>
              {/* Fault Threshold: 4.0h */}
              <div
                className="absolute -top-5 -translate-x-1/2 flex flex-col items-center pointer-events-none z-10"
                style={{ left: `${faultedThresholdPct}%` }}
              >
                <span className="text-[9px] font-bold text-red uppercase tracking-tighter bg-black px-1.5 py-0.5 border border-red/40 shadow-sm sharp-brutalist">
                  FLOOR T+4.0h
                </span>
                <div className="w-0.5 h-2 bg-red" />
              </div>

              {/* Recovery Threshold: 13.3h */}
              {isPlanApplied && (
                <div
                  className="absolute -top-5 -translate-x-1/2 flex flex-col items-center pointer-events-none z-10"
                  style={{ left: `${recoveryThresholdPct}%` }}
                >
                  <span className="text-[9px] font-bold text-teal uppercase tracking-tighter bg-black px-1.5 py-0.5 border border-teal/40 shadow-sm sharp-brutalist">
                    PLAN T+13.3h
                  </span>
                  <div className="w-0.5 h-2 bg-teal" />
                </div>
              )}
            </>
          )}

          {/* Scrub Range Slider */}
          <input
            type="range"
            min={0}
            max={simMaxHours}
            step={0.1}
            value={simTimeHours}
            onChange={(e) => scrubSimTime(parseFloat(e.target.value))}
            className="w-full h-2.5 bg-black appearance-none cursor-pointer accent-cyan border border-white/20 sharp-brutalist"
          />
        </div>

        {/* Timeline Bounds Labels */}
        <div className="flex justify-between items-center text-[10px] text-white/50 font-mono pt-1">
          <span>T+00:00 (START)</span>
          <span className="text-cyan font-bold tracking-[0.2em] uppercase">
            SCRUB TIMELINE TO INSPECT HABITAT DYNAMICS
          </span>
          <span>T+{simMaxHours.toFixed(0)}:00 (MAX HORIZON)</span>
        </div>
      </div>
    </div>
  );
};
