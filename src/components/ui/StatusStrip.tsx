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
    const remainingUsable = Math.max(0, state.habitat.batteryKWh - 18.0);
    const drain = state.habitat.netDrainKW;
    const currentRunway = drain > 0 ? `${(remainingUsable / drain).toFixed(1)}h` : 'STABLE';
    urgentThresholdText = `BATTERY SAFETY FLOOR: 18 kWh (${currentRunway} RUNWAY)`;
    urgentColor = isApplied ? 'text-amber' : 'text-red';
  } else if (state.habitat.activeScenarioId === 'water-recovery-fault') {
    const remainingWater = Math.max(0, state.habitat.waterLitres - 340);
    const loss = state.habitat.waterLossRateLPD;
    const currentRunway = loss > 0 ? `${(remainingWater / loss).toFixed(1)}d` : 'BALANCED';
    urgentThresholdText = `WATER SAFETY FLOOR: 340 L (${currentRunway} RUNWAY)`;
    urgentColor = isApplied ? 'text-amber' : 'text-red';
  } else if (state.habitat.activeScenarioId === 'air-filter-fault') {
    const remainingMargin = Math.max(0, state.habitat.oxygenIndicatorPct - 42);
    const decline = state.habitat.oxygenDeclineRatePctPerHour;
    const currentRunway = decline > 0 ? `${(remainingMargin / decline).toFixed(1)}h` : 'STABLE';
    urgentThresholdText = `O2 THRESHOLD: 42% (${currentRunway} RUNWAY)`;
    urgentColor = isApplied ? 'text-amber' : 'text-red';
  }

  return (
    <div className="hud-panel rounded-2xl p-4 lg:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 bg-gradient-to-r from-white/[0.05] via-white/[0.02] to-transparent backdrop-blur-xl border border-white/10 shadow-xl font-sans">
      {/* Metric 1: System State & Scenario Title */}
      <div className="flex items-center gap-4">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
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
            <span className="text-white/20">//</span>
            <span className="text-cyan font-bold tracking-wider">STAGE 01</span>
          </div>
          <div className="text-sm sm:text-base font-bold font-din uppercase tracking-wide text-white flex items-center gap-2 mt-0.5">
            <span>
              {state.activeScenario ? state.activeScenario.name.toUpperCase() : 'FLIGHT EQUILIBRIUM (NO ACTIVE FAULT)'}
            </span>
            {isApplied && (
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-teal/20 text-teal border border-teal/40">
                PLAN ACTIVE
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Metric 2: Primary Limiting Constraint */}
      <div className="hidden sm:block font-mono bg-white/[0.03] border border-white/5 px-4 py-2.5 rounded-xl">
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
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-cyan text-black font-din font-bold text-xs tracking-[0.16em] uppercase transition-all shadow-lg active:scale-95 cursor-pointer group"
            title="Launch primary solar drop demonstration loop"
          >
            <Play className="w-3.5 h-3.5 fill-black group-hover:fill-black transition-colors" />
            <span>ENGAGE SOLAR DROP DEMO</span>
          </button>
        ) : (
          <div className="flex items-center gap-3">
            {!isApplied && (
              <button
                onClick={() => navigate('recovery-plans')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-cyan text-black font-din font-bold text-xs tracking-[0.16em] uppercase shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-black" />
                <span>EVALUATE RESPONSE</span>
              </button>
            )}
            <button
              onClick={resetSimulation}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 hover:border-white/30 text-white/70 hover:text-white text-xs font-din font-bold tracking-[0.16em] uppercase transition-all cursor-pointer"
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
