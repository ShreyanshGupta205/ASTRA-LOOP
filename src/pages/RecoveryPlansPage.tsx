import React, { useState } from 'react';
import { useSimulation } from '../store/simulationStore';
import { RecoveryPlanCard } from '../components/recovery/RecoveryPlanCard';
import { RecoveryComparisonChart } from '../components/charts/RecoveryComparisonChart';
import { ResourceForecastChart } from '../components/charts/ResourceForecastChart';
import {
  LifeBuoy,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const RecoveryPlansPage: React.FC = () => {
  const {
    state,
    applyPlanWithFeedback,
    triggerScenarioWithFeedback,
    resetSimulation,
    navigate,
    setForecastResource,
    dispatch,
  } = useSimulation();

  const active = state.activeScenario;
  const result = state.simulationResult;

  // Selected plan for comparison / preview
  const selectedPlanId = state.selectedPlanForPreview?.id || (result?.recommendedPlanId ?? null);

  const handleSelectPlan = (planId: string) => {
    const found = active?.recoveryPlans.find((p) => p.id === planId) || null;
    dispatch({ type: 'PREVIEW_PLAN', payload: found });
  };

  // If no scenario active, show aerospace brutalist guidance panel with instant fault injection triggers
  if (!active || !result) {
    return (
      <div className="space-y-8 font-sans">
        {/* 0. Aerospace Cinematic Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-white/10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan/10 border border-cyan/30 text-cyan">
                03 / RECOVERY MATRIX
              </span>
              <span className="text-xs font-mono text-white/50 tracking-wider">
                ALGORITHMIC TRADEOFF OPTIMIZATION // DETERMINISTIC RUNWAY
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-[0.03em] text-white font-din flex items-center gap-3">
              <LifeBuoy className="w-7 h-7 text-cyan" />
              RECOVERY PLANS & CONTINGENCY PROTOCOLS
            </h1>
            <p className="text-xs sm:text-sm text-white/70 max-w-3xl font-sans mt-1 leading-relaxed">
              Evaluate alternative mitigation responses, compare calculated runtime extensions, and commit protocols.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('scenario-lab')}
              className="px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 hover:border-white/30 text-white/80 hover:text-white font-din font-bold text-xs uppercase tracking-[0.16em] transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>SCENARIO LAB</span>
            </button>
            <button
              onClick={() => navigate('digital-twin-3d')}
              className="px-6 py-3 rounded-xl bg-white hover:bg-cyan text-black font-din font-bold text-xs uppercase tracking-[0.16em] transition-all flex items-center gap-2 cursor-pointer shadow-xl group"
            >
              <span>3D SIMULATION ARENA</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Aerospace Zero-Fault Readiness Panel */}
        <div className="hud-panel rounded-2xl p-8 sm:p-12 bg-gradient-to-b from-white/[0.05] via-white/[0.02] to-transparent backdrop-blur-xl border border-white/10 text-center max-w-4xl mx-auto space-y-8 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-teal/15 text-teal border border-teal/40 mx-auto flex items-center justify-center shadow-teal-glow">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-mono tracking-widest text-teal uppercase font-bold block mb-2 bg-teal/10 border border-teal/30 px-3 py-1 rounded-full w-fit mx-auto">
              SYSTEM STATUS: NOMINAL FLIGHT EQUILIBRIUM
            </span>
            <h2 className="text-3xl font-extrabold font-din uppercase tracking-wide text-white">
              NO ACTIVE FAULT INCIDENT DETECTED
            </h2>
            <p className="text-xs sm:text-sm text-white/70 mt-3 max-w-xl mx-auto leading-relaxed font-sans">
              Habitat systems are currently in balanced equilibrium. To evaluate contingency mitigation protocols and compare survival runtime extensions, select an anomaly scenario below:
            </p>
          </div>

          {/* 3 Quick Anomaly Injection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left font-mono">
            <button
              onClick={() => triggerScenarioWithFeedback('solar-drop')}
              className="p-5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-red/60 transition-all cursor-pointer group text-left hover:translate-y-[-2px] shadow-lg"
            >
              <div className="flex items-center justify-between text-[10px] text-amber mb-2">
                <span className="font-bold">CASE 01</span>
                <Play className="w-3.5 h-3.5 text-red group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-sm font-bold text-white uppercase group-hover:text-red transition-colors font-din tracking-wide">
                SOLAR ARRAY DROP
              </div>
              <div className="text-[11px] text-white/60 mt-1 font-sans">
                8.0 kW → 3.0 kW (-5 kW drain)
              </div>
              <div className="text-[10px] text-red font-bold mt-3 font-mono">
                4.0h RUNWAY TO 18 kWh FLOOR
              </div>
            </button>

            <button
              onClick={() => triggerScenarioWithFeedback('water-recovery-fault')}
              className="p-5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-teal/60 transition-all cursor-pointer group text-left hover:translate-y-[-2px] shadow-lg"
            >
              <div className="flex items-center justify-between text-[10px] text-teal mb-2">
                <span className="font-bold">CASE 02</span>
                <Play className="w-3.5 h-3.5 text-teal group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-sm font-bold text-white uppercase group-hover:text-teal transition-colors font-din tracking-wide">
                WATER RECOVERY FAULT
              </div>
              <div className="text-[11px] text-white/60 mt-1 font-sans">
                Distillation Stall (-25 L/day)
              </div>
              <div className="text-[10px] text-teal font-bold mt-3 font-mono">
                12.0 DAYS TO 340 L FLOOR
              </div>
            </button>

            <button
              onClick={() => triggerScenarioWithFeedback('air-filter-fault')}
              className="p-5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-cyan/60 transition-all cursor-pointer group text-left hover:translate-y-[-2px] shadow-lg"
            >
              <div className="flex items-center justify-between text-[10px] text-cyan mb-2">
                <span className="font-bold">CASE 03</span>
                <Play className="w-3.5 h-3.5 text-cyan group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-sm font-bold text-white uppercase group-hover:text-cyan transition-colors font-din tracking-wide">
                AIR-FILTER FOULING
              </div>
              <div className="text-[11px] text-white/60 mt-1 font-sans">
                Sorbent Bed Decay (-1.6%/hr)
              </div>
              <div className="text-[10px] text-cyan font-bold mt-3 font-mono">
                25.0h TO 42% THRESHOLD
              </div>
            </button>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => triggerScenarioWithFeedback('solar-drop')}
              className="px-7 py-3.5 rounded-xl bg-white hover:bg-cyan text-black font-din font-bold text-xs uppercase tracking-[0.16em] transition-all cursor-pointer shadow-xl flex items-center gap-2 group"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>LAUNCH PRIMARY SOLAR DROP DEMO</span>
            </button>
            <button
              onClick={() => navigate('scenario-lab')}
              className="px-6 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 hover:border-white/30 text-white font-din font-bold text-xs uppercase tracking-[0.16em] transition-all cursor-pointer flex items-center gap-2"
            >
              <span>OPEN SCENARIO LAB</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedOutcome = result.planOutcomes.find(
    (p) => p.plan.id === selectedPlanId
  ) || result.planOutcomes[0];

  const isSelectedPlanApplied = state.habitat.appliedPlanId === selectedOutcome?.plan.id;

  return (
    <div className="space-y-8 font-sans">
      {/* 0. Aerospace Cinematic Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-white/10">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-red/15 border border-red/40 text-red animate-spacex-pulse">
              ACTIVE INCIDENT: {active.name.toUpperCase()}
            </span>
            <span className="text-xs font-mono text-white/50 tracking-wider">
              FAULTED RUNWAY: <strong className="text-red font-bold font-mono">{result.faultedRunway.toFixed(1)} {result.runwayUnit}</strong> // DETERMINISTIC MITIGATION
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-[0.03em] text-white font-din flex items-center gap-3">
            <LifeBuoy className="w-7 h-7 text-cyan" />
            CONTINGENCY PROTOCOL OPTIMIZATION
          </h1>
          <p className="text-xs sm:text-sm text-white/70 max-w-3xl font-sans mt-1 leading-relaxed">
            Active Incident: <strong className="text-white font-mono">{active.name}</strong> • Immediate Depletion Threshold:{' '}
            <strong className="text-red font-mono tabular-nums">{result.faultedRunway.toFixed(1)} {result.runwayUnit}</strong>. Select and commit an endurance recovery protocol.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {state.habitat.appliedPlanId && (
            <span className="text-xs font-mono font-bold text-teal flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal/15 border border-teal/40 shadow-teal-glow">
              <ShieldCheck className="w-4 h-4" />
              <span>PROTOCOL ACTIVE</span>
            </span>
          )}
          <button
            onClick={resetSimulation}
            className="px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 hover:border-white/30 text-white/80 hover:text-white font-din font-bold text-xs uppercase tracking-[0.16em] transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ABORT / RESET</span>
          </button>
          <button
            onClick={() => navigate('digital-twin-3d')}
            className="px-6 py-3 rounded-xl bg-white hover:bg-cyan text-black font-din font-bold text-xs uppercase tracking-[0.16em] transition-all flex items-center gap-2 cursor-pointer shadow-xl group"
          >
            <span>3D ARENA</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Applied Confirmation Banner */}
      {state.habitat.appliedPlanId && (
        <div className="p-5 rounded-2xl bg-teal/[0.07] border border-teal/40 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono shadow-teal-glow">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal text-black flex items-center justify-center shrink-0 font-bold shadow-teal-glow">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-teal uppercase tracking-widest font-din">
                CONTINGENCY PROTOCOL DEPLOYED // TELEMETRY STREAM SYNCHRONIZED
              </div>
              <p className="text-xs text-white/80 mt-0.5 font-sans leading-relaxed">
                Electrical loads and ECLSS operational duty cycles reconfigured according to{' '}
                <strong className="text-teal font-bold font-mono">
                  {active.recoveryPlans.find((p) => p.id === state.habitat.appliedPlanId)?.name}
                </strong>
                . Telemetry, dependency graph, and predictive curves updated in real time.
              </p>
            </div>
          </div>
          <button
            onClick={() => triggerScenarioWithFeedback(active.id, state.activeScenarioInputs)}
            className="text-xs font-mono text-cyan hover:text-white px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyan/50 shrink-0 cursor-pointer uppercase tracking-wider font-bold transition-all"
          >
            Revert to Fault State
          </button>
        </div>
      )}

      {/* 1. Comparison Visual Workspace: Bar Chart & Forecast Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecoveryComparisonChart
          faultedRunway={result.faultedRunway}
          planOutcomes={result.planOutcomes}
          runwayUnit={result.runwayUnit}
          selectedPlanId={selectedPlanId}
          onSelectPlan={handleSelectPlan}
        />

        <ResourceForecastChart
          forecastPoints={state.forecastPoints}
          resource={state.forecastResource}
          onResourceChange={setForecastResource}
        />
      </div>

      {/* 2. Three Alternative Recovery Plan Cards */}
      <div className="space-y-3 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#282828] pb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <span>EVALUATED RECOVERY RESPONSES</span>
            <span className="text-[10px] px-2 py-0.5 bg-black/60 border border-[#282828] text-cyan font-bold">
              RANKED BY RUNWAY EXTENSION
            </span>
          </h2>
          <span className="text-xs text-white/60">
            Baseline Fault Runway: <strong className="text-red tabular-nums font-bold">{result.faultedRunway.toFixed(1)} {result.runwayUnit}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {result.planOutcomes.map((outcome) => (
            <RecoveryPlanCard
              key={outcome.plan.id}
              outcome={outcome}
              isSelected={selectedPlanId === outcome.plan.id}
              isApplied={state.habitat.appliedPlanId === outcome.plan.id}
              onSelect={() => handleSelectPlan(outcome.plan.id)}
              onApply={() => applyPlanWithFeedback(outcome.plan)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
