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
    <div className="hud-panel rounded p-4 border-t-2 border-t-cyan font-mono relative">
      {/* Top Header Strip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-border/70">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded flex items-center justify-center border ${
            isSimPlaying
              ? 'bg-cyan-dark text-cyan border-cyan/60 shadow-cyan-glow animate-spacex-pulse'
              : 'bg-bg-elevated text-text-muted border-border'
          }`}>
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-1.5">
                <span>SIMULATION ENGINE PLAYBACK</span>
                {isSimPlaying && (
                  <span className="w-2 h-2 rounded-full bg-cyan animate-ping" />
                )}
              </h2>
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                isSimPlaying ? 'bg-cyan text-black font-extrabold' : 'bg-bg-secondary text-text-muted border-border'
              }`}>
                {isSimPlaying ? 'LIVE RUNNING' : 'PAUSED'}
              </span>
            </div>
            <p className="text-[10px] text-text-muted tracking-tight font-sans">
              Dynamic time-stepped simulation controller: advance time, inspect live resource depletion, and test mitigation impact
            </p>
          </div>
        </div>

        {/* Live Simulation Clock Readout */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="px-3 py-1.5 rounded bg-bg-secondary border border-border text-right">
            <span className="text-[9px] text-text-muted uppercase tracking-wider block">
              SIMULATED ELAPSED TIME
            </span>
            <span className="text-base font-extrabold text-cyan tabular-nums tracking-widest">
              {formatSimTime(simTimeHours)}
              <span className="text-[10px] text-text-muted ml-1 font-normal font-sans">
                ({simTimeHours.toFixed(1)}h)
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Playback Controls & Speed Multipliers */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        {/* Play/Pause & Step Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSimPlaying(!isSimPlaying)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer sharp-brutalist ${
              isSimPlaying
                ? 'bg-amber text-black shadow-amber-glow'
                : 'bg-cyan hover:bg-cyan-hover text-black shadow-cyan-glow active:scale-95'
            }`}
            style={{ borderRadius: '0px' }}
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
            className="px-3 py-2 bg-bg-secondary hover:bg-bg-elevated border border-border text-text-secondary hover:text-white text-xs font-bold transition-colors cursor-pointer sharp-brutalist"
            style={{ borderRadius: '0px' }}
            title="Advance simulated time by +15 minutes (+0.25 hours)"
          >
            +15 MIN
          </button>
          <button
            onClick={() => stepSimForward(1.0)}
            className="px-3 py-2 bg-bg-secondary hover:bg-bg-elevated border border-border text-text-secondary hover:text-white text-xs font-bold transition-colors cursor-pointer sharp-brutalist"
            style={{ borderRadius: '0px' }}
            title="Advance simulated time by +60 minutes (+1.0 hour)"
          >
            +60 MIN
          </button>

          {/* Reset to Baseline & Restore Faulted Baseline */}
          <button
            onClick={resetSimulation}
            className="flex items-center gap-1.5 px-3 py-2 bg-bg-secondary hover:bg-bg-elevated border border-border hover:border-white text-text-muted hover:text-white text-xs font-bold transition-colors cursor-pointer sharp-brutalist"
            style={{ borderRadius: '0px' }}
            title="Reset flight state to nominal baseline equilibrium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET TO BASELINE</span>
          </button>
        </div>

        {/* Speed Multiplier Toggles: 1x, 10x, 60x */}
        <div className="flex items-center gap-1 bg-bg-secondary p-1 border border-border text-xs sharp-brutalist" style={{ borderRadius: '0px' }}>
          <span className="text-[10px] text-text-muted px-2 uppercase font-semibold">SPEED:</span>
          {[1, 10, 60].map((spd) => (
            <button
              key={spd}
              onClick={() => setSimSpeed(spd)}
              className={`px-3 py-1 text-xs font-bold transition-all cursor-pointer sharp-brutalist ${
                simSpeed === spd
                  ? 'bg-cyan text-black shadow-cyan-glow font-extrabold'
                  : 'text-text-muted hover:text-white'
              }`}
              style={{ borderRadius: '0px' }}
              title={`At ${spd}x speed: advance ${spd} simulated minute(s) per real second`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* Scrubbable Timeline Bar with Threshold Markers */}
      <div className="space-y-1.5 pt-2">
        <div className="relative w-full">
          {/* Visual Threshold Marker Labels */}
          {activeScenario?.id === 'solar-drop' && (
            <>
              {/* Fault Threshold: 4.0h */}
              <div
                className="absolute -top-4 -translate-x-1/2 flex flex-col items-center pointer-events-none z-10"
                style={{ left: `${faultedThresholdPct}%` }}
              >
                <span className="text-[9px] font-bold text-red uppercase tracking-tighter bg-bg-secondary px-1 py-0.2 rounded border border-red/40">
                  FLOOR T+4.0h
                </span>
                <div className="w-0.5 h-2 bg-red" />
              </div>

              {/* Recovery Threshold: 13.3h */}
              {isPlanApplied && (
                <div
                  className="absolute -top-4 -translate-x-1/2 flex flex-col items-center pointer-events-none z-10"
                  style={{ left: `${recoveryThresholdPct}%` }}
                >
                  <span className="text-[9px] font-bold text-teal uppercase tracking-tighter bg-bg-secondary px-1 py-0.2 rounded border border-teal/40">
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
            className="w-full h-2.5 bg-bg-secondary rounded appearance-none cursor-pointer accent-cyan border border-border"
          />
        </div>

        {/* Timeline Bounds Labels */}
        <div className="flex justify-between items-center text-[10px] text-text-muted font-mono pt-1">
          <span>T+00:00 (START)</span>
          <span className="text-cyan font-bold">
            SCRUB TIMELINE TO INSPECT HABITAT STATE
          </span>
          <span>T+{simMaxHours.toFixed(0)}:00 (MAX HORIZON)</span>
        </div>
      </div>
    </div>
  );
};
