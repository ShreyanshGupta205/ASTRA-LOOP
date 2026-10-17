import React from 'react';
import { useSimulation } from '../../store/simulationStore';
import { Play, RotateCcw, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export const StatusStrip: React.FC = () => {
  const { state, triggerScenarioWithFeedback, resetSimulation, navigate } = useSimulation();

  const isFault = state.habitat.isFaultActive;
  const isApplied = Boolean(state.habitat.appliedPlanId);

  // Most urgent threshold computation
  let urgentThresholdText = 'ALL SUBSYSTEMS NOMINAL';
  let urgentColor = 'text-teal';

  if (state.habitat.activeScenarioId === 'solar-drop') {
    urgentThresholdText = isApplied
      ? 'BATTERY SAFETY FLOOR: 18 kWh (13.3h RUNWAY)'
      : 'BATTERY SAFETY FLOOR: 18 kWh (4.0h RUNWAY)';
    urgentColor = isApplied ? 'text-amber' : 'text-red';
  } else if (state.habitat.activeScenarioId === 'water-recovery-fault') {
    urgentThresholdText = isApplied
      ? 'WATER SAFETY FLOOR: 340 L (60d RUNWAY)'
      : 'WATER SAFETY FLOOR: 340 L (12d RUNWAY)';
    urgentColor = isApplied ? 'text-amber' : 'text-red';
  } else if (state.habitat.activeScenarioId === 'air-filter-fault') {
    urgentThresholdText = isApplied
      ? 'O2 THRESHOLD: 42% (200h RUNWAY)'
      : 'O2 THRESHOLD: 42% (25h RUNWAY)';
    urgentColor = isApplied ? 'text-amber' : 'text-red';
  }

  return (
    <div className="hud-panel p-4 lg:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-l-4 border-l-cyan bg-[#0c0c0c] border border-[#282828] font-sans">
      {/* Metric 1: System State & Scenario Title */}
      <div className="flex items-center gap-3.5">
        <div
          className={`w-10 h-10 flex items-center justify-center shrink-0 border ${
            isFault
              ? isApplied
                ? 'bg-amber/15 text-amber border-amber/40 shadow-amber-glow'
                : 'bg-red/20 text-red border-red/50 shadow-red-glow animate-spacex-pulse'
              : 'bg-teal/15 text-teal border-teal/40 shadow-teal-glow'
          }`}
        >
          {isFault ? <AlertTriangle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
        </div>
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-white/50 flex items-center gap-2">
            <span>OPERATIONAL READINESS</span>
            <span>//</span>
            <span className="text-cyan font-bold">STAGE 01</span>
          </div>
          <div className="text-sm font-bold font-din uppercase tracking-wide text-white flex items-center gap-2 mt-0.5">
            <span>
              {state.activeScenario ? state.activeScenario.name.toUpperCase() : 'FLIGHT EQUILIBRIUM (NO ACTIVE FAULT)'}
            </span>
            {isApplied && (
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-teal/20 text-teal border border-teal/40">
                PLAN ACTIVE
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Metric 2: Primary Limiting Constraint */}
      <div className="hidden sm:block font-mono">
        <div className="text-[10px] font-mono uppercase tracking-widest text-white/50">
          CRITICAL CONSTRAINT THRESHOLD
        </div>
        <div className={`text-xs font-mono font-bold tracking-wider ${urgentColor} mt-0.5`}>
          {urgentThresholdText}
        </div>
      </div>

      {/* Metric 3: SpaceX Tactical Command Buttons */}
      <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
        {!isFault ? (
          <button
            onClick={() => triggerScenarioWithFeedback('solar-drop')}
            className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-neutral-200 text-black font-din font-bold text-xs tracking-[0.16em] uppercase transition-all shadow-lg active:scale-95 cursor-pointer"
            title="Launch primary solar drop demonstration loop"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>ENGAGE SOLAR DROP DEMO</span>
          </button>
        ) : (
          <div className="flex items-center gap-2.5">
            {!isApplied && (
              <button
                onClick={() => navigate('recovery-plans')}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-white hover:bg-neutral-200 text-black font-din font-bold text-xs tracking-[0.16em] uppercase shadow-lg transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-black" />
                <span>EVALUATE RESPONSE</span>
              </button>
            )}
            <button
              onClick={resetSimulation}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-black/60 hover:bg-[#161616] border border-[#333333] hover:border-white text-white/70 hover:text-white text-xs font-din font-bold tracking-[0.16em] uppercase transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ABORT / RESET</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
