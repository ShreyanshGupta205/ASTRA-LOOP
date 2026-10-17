import React, { useState, useMemo } from 'react';
import { useSimulation } from '../store/simulationStore';
import { LunarHabitat3DCanvas, ModuleInspectionData } from '../components/simulation3d/LunarHabitat3DCanvas';
import { SimulationControlDeck } from '../components/simulation/SimulationControlDeck';
import { DependencyMap } from '../components/scenario/DependencyMap';
import { SCENARIO_DEFINITIONS } from '../scenarios/scenarioDefinitions';
import { HABITAT_THRESHOLDS } from '../data/initialState';
import { ScenarioId, RecoveryPlan } from '../types/habitat';
import {
  Boxes,
  Zap,
  Droplet,
  Wind,
  Sun,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
  Clock,
  ArrowRight,
  Activity,
  Layers,
  Sliders,
  CheckCircle2,
  ChevronRight,
  Flame,
  Radio,
  Cpu,
} from 'lucide-react';

export const DigitalTwin3DPage: React.FC = () => {
  const {
    state,
    triggerScenarioWithFeedback,
    applyPlanWithFeedback,
    restoreFaultedState,
    resetSimulation,
    navigate,
  } = useSimulation();

  const { habitat, activeScenario, simTimeHours, isSimPlaying, events } = state;
  const [selectedModule, setSelectedModule] = useState<ModuleInspectionData | null>(null);

  const isSolarFault = activeScenario?.id === 'solar-drop';
  const isWaterFault = activeScenario?.id === 'water-recovery-fault';
  const isAirFault = activeScenario?.id === 'air-filter-fault';
  const isFloorBreached = habitat.batteryKWh <= HABITAT_THRESHOLDS.batteryFloorKWh;

  // Active recovery plans for solar drop scenario
  const solarPlans = SCENARIO_DEFINITIONS['solar-drop']?.recoveryPlans || [];

  // Calculate dynamic runway for any recovery plan given CURRENT remaining battery
  const calculateDynamicPlanRunway = (plan: RecoveryPlan) => {
    const powerReduction = plan.powerReductionKW ?? 0;
    const baseDemand = 8.0;
    const newDemand = Math.max(0, baseDemand - powerReduction);
    const solarGen = habitat.solarOutputKW;
    const netDrain = Math.max(0, newDemand - solarGen);
    const remainingUsableBattery = Math.max(0, habitat.batteryKWh - HABITAT_THRESHOLDS.batteryFloorKWh);

    if (netDrain <= 0) return { newDemand, netDrain, remainingRunway: Infinity, runwayStr: 'INFINITE (SURPLUS)' };
    const remainingHours = remainingUsableBattery / netDrain;
    return {
      newDemand,
      netDrain,
      remainingRunway: remainingHours,
      runwayStr: `${remainingHours.toFixed(1)} hrs`,
    };
  };

  // Determine current overall runway string for primary header
  const getOverallRunwayString = () => {
    if (!activeScenario) return 'STABLE // EQUILIBRIUM';
    if (activeScenario.id === 'solar-drop') {
      if (habitat.netDrainKW <= 0) return 'BALANCED // 0 kW DRAIN';
      if (isFloorBreached) return 'SAFETY FLOOR REACHED (18.0 kWh)';
      const remainingUsable = Math.max(0, habitat.batteryKWh - HABITAT_THRESHOLDS.batteryFloorKWh);
      const hrs = remainingUsable / habitat.netDrainKW;
      return `${hrs.toFixed(1)}h REMAINING TO 18 kWh FLOOR`;
    }
    if (activeScenario.id === 'water-recovery-fault') {
      const remainingWater = Math.max(0, habitat.waterLitres - HABITAT_THRESHOLDS.waterFloorLitres);
      const lossLPD = habitat.waterLossRateLPD || 25;
      const days = remainingWater / lossLPD;
      return `${days.toFixed(1)} DAYS REMAINING TO 340 L FLOOR`;
    }
    if (activeScenario.id === 'air-filter-fault') {
      const remainingMargin = Math.max(0, habitat.oxygenIndicatorPct - HABITAT_THRESHOLDS.oxygenThresholdPct);
      const declineRate = habitat.oxygenDeclineRatePctPerHour || 1.6;
      const hrs = remainingMargin / declineRate;
      return `${hrs.toFixed(1)}h REMAINING TO 42% FLOOR`;
    }
    return 'NOMINAL';
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header & Mission Status Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-white/10">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan/10 border border-cyan/30 text-cyan">
              02 / THREE.JS SIMULATION ARENA
            </span>
            <span className="text-xs font-mono text-white/50 tracking-wider">
              LUNAR SURFACE ENVIRONMENT // 0.166G // SHACKLETON RIM
            </span>
            {activeScenario && (
              <span className={`text-[10px] font-mono px-3 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isFloorBreached
                  ? 'bg-red text-white border border-red animate-pulse'
                  : habitat.appliedPlanId
                  ? 'bg-teal/20 text-teal border border-teal/40'
                  : 'bg-red/20 text-red border border-red/40 animate-pulse'
              }`}>
                {isFloorBreached
                  ? 'CRITICAL FLOOR REACHED'
                  : habitat.appliedPlanId
                  ? `PLAN ACTIVE: ${habitat.appliedPlanId.toUpperCase()}`
                  : `FAULT ACTIVE: ${activeScenario.id.toUpperCase()}`}
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-[0.03em] text-white font-din flex items-center gap-3">
            <Boxes className="w-7 h-7 text-cyan" />
            LUNAR HABITAT DIGITAL TWIN & SIMULATION ARENA
          </h1>
          <p className="text-xs sm:text-sm text-white/70 max-w-3xl font-sans mt-1 leading-relaxed">
            Interactive 3D WebGL digital twin integrated with deterministic physics equations. Inject real-time faults, step the simulation clock, observe subsystem state changes, and deploy contingency recovery plans.
          </p>
        </div>

        {/* Global Controls & Scenarios Navigation */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {activeScenario && (
            <button
              onClick={restoreFaultedState}
              className="px-4 py-3 rounded-xl text-xs font-din font-bold uppercase tracking-wider bg-amber/10 hover:bg-amber text-amber hover:text-black border border-amber/40 transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              title="Restore to T=0 faulted state to test different recovery plans under identical conditions"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESTORE FAULTED T=0</span>
            </button>
          )}

          <button
            onClick={resetSimulation}
            className="px-4 py-3 rounded-xl text-xs font-din font-bold uppercase tracking-wider bg-white/[0.04] hover:bg-white/10 border border-white/10 hover:border-white/30 text-white/80 hover:text-white transition-all cursor-pointer flex items-center gap-2"
            title="Reset flight state back to nominal 100% baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET BASELINE</span>
          </button>
        </div>
      </div>

      {/* Scenario Injection Bar */}
      <div className="hud-panel rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-white/[0.05] via-white/[0.02] to-transparent backdrop-blur-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0">
            <Sliders className="w-4 h-4 text-cyan" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest block font-bold">
              FAULT INJECTION SUITE // DETERMINISTIC SCENARIOS
            </span>
            <span className="text-xs sm:text-sm font-bold text-white font-mono mt-0.5 block">
              {activeScenario ? activeScenario.name : 'NOMINAL EQUILIBRIUM (NO FAULT ACTIVE)'}
            </span>
          </div>
        </div>

        {/* 3 Scenario Switcher Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Scenario A: Solar Drop */}
          <button
            onClick={() => triggerScenarioWithFeedback('solar-drop')}
            className={`px-4 py-2.5 rounded-xl text-xs font-din font-bold uppercase tracking-wider border transition-all text-left flex items-center justify-between gap-3 cursor-pointer shadow-sm ${
              isSolarFault
                ? 'bg-red text-white border-red shadow-red-glow'
                : 'bg-white/[0.04] hover:bg-red/10 border-white/10 hover:border-red/60 text-white'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Sun className={`w-4 h-4 shrink-0 ${isSolarFault ? 'text-white' : 'text-amber'}`} />
              <div className="truncate">
                <span className="block truncate leading-tight font-bold">SOLAR DROP (8→3 kW)</span>
                <span className={`text-[10px] font-mono block ${isSolarFault ? 'text-white/80' : 'text-white/50'}`}>
                  -5.0 kW • 4.0h Runway
                </span>
              </div>
            </div>
            {isSolarFault && <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />}
          </button>

          {/* Scenario B: Water Recovery Fault */}
          <button
            onClick={() => triggerScenarioWithFeedback('water-recovery-fault')}
            className={`px-4 py-2.5 rounded-xl text-xs font-din font-bold uppercase tracking-wider border transition-all text-left flex items-center justify-between gap-3 cursor-pointer shadow-sm ${
              isWaterFault
                ? 'bg-amber text-black border-amber font-extrabold shadow-amber-glow'
                : 'bg-white/[0.04] hover:bg-amber/10 border-white/10 hover:border-amber/60 text-white'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Droplet className={`w-4 h-4 shrink-0 ${isWaterFault ? 'text-black' : 'text-teal'}`} />
              <div className="truncate">
                <span className="block truncate leading-tight font-bold">WATER FAULT</span>
                <span className={`text-[10px] font-mono block ${isWaterFault ? 'text-black/80' : 'text-white/50'}`}>
                  -25 L/day • 12 Days
                </span>
              </div>
            </div>
            {isWaterFault && <CheckCircle2 className="w-4 h-4 shrink-0 text-black" />}
          </button>

          {/* Scenario C: Air-Filter Fault */}
          <button
            onClick={() => triggerScenarioWithFeedback('air-filter-fault')}
            className={`px-4 py-2.5 rounded-xl text-xs font-din font-bold uppercase tracking-wider border transition-all text-left flex items-center justify-between gap-3 cursor-pointer shadow-sm ${
              isAirFault
                ? 'bg-cyan text-black border-cyan font-extrabold shadow-cyan-glow'
                : 'bg-white/[0.04] hover:bg-cyan/10 border-white/10 hover:border-cyan/60 text-white'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Wind className={`w-4 h-4 shrink-0 ${isAirFault ? 'text-black' : 'text-cyan'}`} />
              <div className="truncate">
                <span className="block truncate leading-tight font-bold">AIR-FILTER FAULT</span>
                <span className={`text-[10px] font-mono block ${isAirFault ? 'text-black/80' : 'text-white/50'}`}>
                  -1.6%/hr • 25.0h Runway
                </span>
              </div>
            </div>
            {isAirFault && <CheckCircle2 className="w-4 h-4 shrink-0 text-black" />}
          </button>
        </div>
      </div>

      {/* 3D WebGL Interactive Canvas Viewport (Primary Visual Arena) */}
      <div className="relative rounded-2xl border border-white/10 bg-black overflow-hidden shadow-2xl">
        <LunarHabitat3DCanvas
          heightClass="h-[520px] sm:h-[600px] lg:h-[680px]"
          onSelectModule={setSelectedModule}
        />
      </div>

      {/* Real-Time Simulation Playback Deck (+15m, +60m, 1x, 10x, 60x, Reset) */}
      <SimulationControlDeck />

      {/* Telemetry Instrument Panel (Inputs vs Calculated Metrics) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-border/60 pb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              LIVE TELEMETRY INSTRUMENT PANEL // DUAL-PHASE AUDIT
            </h2>
          </div>
          <div className="text-[11px] font-mono text-text-muted">
            RUNWAY STATUS:{' '}
            <span className={`font-bold ${isFloorBreached ? 'text-red animate-pulse' : 'text-cyan'}`}>
              {getOverallRunwayString()}
            </span>
          </div>
        </div>

        {/* 4 Core Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Solar Generation & Demand */}
          <div className="hud-panel rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-xl group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-amber uppercase tracking-wider">
                PHOTOVOLTAIC ARRAY // PV-01
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber/10 border border-amber/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Sun className="w-4 h-4 text-amber" />
              </div>
            </div>
            <div className="text-2xl font-mono font-bold text-white tabular-nums">
              {habitat.solarOutputKW.toFixed(1)}{' '}
              <span className="text-xs text-text-muted font-sans font-normal">kW Gen</span>
            </div>
            <div className="text-[11px] font-mono text-text-muted mt-2 flex justify-between border-t border-white/10 pt-1.5">
              <span>Demand:</span>
              <span className="font-bold text-white">{habitat.powerDemandKW.toFixed(1)} kW</span>
            </div>
            <div className="text-[11px] font-mono text-text-muted mt-1 flex justify-between">
              <span>Net Balance:</span>
              <span className={`font-bold tabular-nums ${
                habitat.netDrainKW > 0 ? 'text-red' : 'text-teal'
              }`}>
                {habitat.netDrainKW > 0 ? `-${habitat.netDrainKW.toFixed(1)} kW Drain` : `0.0 kW Balanced`}
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-amber rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (habitat.solarOutputKW / 8.0) * 100)}%` }}
              />
            </div>
          </div>

          {/* 2. Battery Storage Bank */}
          <div className="hud-panel rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-xl group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-cyan uppercase tracking-wider">
                BATTERY STORAGE // BATT-01..03
              </span>
              <div className="w-8 h-8 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Zap className="w-4 h-4 text-cyan" />
              </div>
            </div>
            <div className="text-2xl font-mono font-bold text-white tabular-nums">
              {habitat.batteryKWh.toFixed(1)}{' '}
              <span className="text-xs text-text-muted font-sans font-normal">kWh</span>
            </div>
            <div className="text-[11px] font-mono text-text-muted mt-2 flex justify-between border-t border-white/10 pt-1.5">
              <span>Usable Margin:</span>
              <span className={`font-bold tabular-nums ${
                habitat.batteryKWh <= 18 ? 'text-red animate-pulse' : 'text-cyan'
              }`}>
                {Math.max(0, habitat.batteryKWh - 18.0).toFixed(1)} kWh
              </span>
            </div>
            <div className="text-[11px] font-mono text-text-muted mt-1 flex justify-between">
              <span>Safety Floor:</span>
              <span className="font-bold text-amber">18.0 kWh (Fixed)</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  habitat.batteryKWh <= 18 ? 'bg-red' : 'bg-cyan'
                }`}
                style={{ width: `${Math.min(100, (habitat.batteryKWh / 38) * 100)}%` }}
              />
            </div>
          </div>

          {/* 3. Water Recovery Reserve */}
          <div className="hud-panel rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-xl group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-teal uppercase tracking-wider">
                WATER DISTILLATION // WRS-02
              </span>
              <div className="w-8 h-8 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Droplet className="w-4 h-4 text-teal" />
              </div>
            </div>
            <div className="text-2xl font-mono font-bold text-white tabular-nums">
              {habitat.waterLitres.toFixed(0)}{' '}
              <span className="text-xs text-text-muted font-sans font-normal">Litres</span>
            </div>
            <div className="text-[11px] font-mono text-text-muted mt-2 flex justify-between border-t border-white/10 pt-1.5">
              <span>Loss Rate:</span>
              <span className="font-bold text-white">{habitat.waterLossRateLPD || 0} L/day</span>
            </div>
            <div className="text-[11px] font-mono text-text-muted mt-1 flex justify-between">
              <span>Safety Floor:</span>
              <span className="font-bold text-amber">340 L</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-teal rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (habitat.waterLitres / 640) * 100)}%` }}
              />
            </div>
          </div>

          {/* 4. Air Filtration Subsystem (Illustrative) */}
          <div className="hud-panel rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-xl group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-cyan uppercase tracking-wider">
                AIR-FILTER LOOP // AIR-01
              </span>
              <div className="w-8 h-8 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Wind className="w-4 h-4 text-cyan" />
              </div>
            </div>
            <div className="text-2xl font-mono font-bold text-white tabular-nums">
              {habitat.oxygenIndicatorPct.toFixed(1)}{' '}
              <span className="text-xs text-text-muted font-sans font-normal">% Indicator</span>
            </div>
            <div className="text-[11px] font-mono text-text-muted mt-2 flex justify-between border-t border-white/10 pt-1.5">
              <span>Decline Rate:</span>
              <span className="font-bold text-white">
                {habitat.oxygenDeclineRatePctPerHour ? `-${habitat.oxygenDeclineRatePctPerHour.toFixed(1)}%/hr` : '0.0%/hr'}
              </span>
            </div>
            <div className="text-[11px] font-mono text-text-muted mt-1 flex justify-between">
              <span>Safety Floor:</span>
              <span className="font-bold text-amber">42.0 % Margin</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-cyan rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, habitat.oxygenIndicatorPct)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Telemetry Annotation: Inputs vs Calculations Distinction */}
        <div className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-md text-[11px] text-text-muted flex flex-col md:flex-row items-start md:items-center justify-between gap-3 font-mono shadow-md">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan shrink-0" />
            <span>
              <strong className="text-white uppercase">Engine Invariant:</strong> Physical state calculations are strictly deterministic. Net Drain = Demand - Solar Gen. Battery = Initial - (Drain × Sim Hours). Floor at 18.0 kWh clamps depletion.
            </span>
          </div>
          <div className="flex items-center gap-4 shrink-0 text-[10px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber" /> INPUT: SOLAR (3.0 kW)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan" /> RESULT: DRAIN (5.0 kW)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red" /> FLOOR: 18.0 kWh
            </span>
          </div>
        </div>
      </div>

      {/* Contingency Recovery Protocol Matrix (3 Plans for Solar Scenario) */}
      {isSolarFault && (
        <div className="hud-panel rounded-2xl p-5 lg:p-6 border border-cyan/30 shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan" />
                <h2 className="text-sm font-bold font-mono tracking-wider uppercase text-white">
                  CONTINGENCY RECOVERY PROTOCOLS // SOLAR ANOMALY RESPONSE
                </h2>
              </div>
              <p className="text-[11px] font-mono text-text-muted mt-0.5">
                Apply electrical load-shedding and duty-cycle throttling to extend survivability runway before the 18.0 kWh safety floor.
              </p>
            </div>
            <div className="text-[10px] font-mono text-cyan bg-cyan/10 border border-cyan/30 px-3 py-1 rounded-full backdrop-blur-md">
              CURRENT BATTERY: {habitat.batteryKWh.toFixed(1)} kWh
            </div>
          </div>

          {/* 3 Recovery Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
            {solarPlans.map((plan) => {
              const isApplied = habitat.appliedPlanId === plan.id;
              const outcome = calculateDynamicPlanRunway(plan);
              const isPlanC = plan.id === 'plan-c';

              return (
                <div
                  key={plan.id}
                  className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                    isApplied
                      ? 'bg-teal/10 border-teal/60 shadow-teal-glow shadow-xl'
                      : isPlanC
                      ? 'bg-white/[0.03] hover:bg-white/[0.06] border-cyan/40 hover:border-cyan shadow-xl'
                      : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/10 hover:border-white/20 shadow-lg'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-widest uppercase text-cyan">
                        {plan.id.toUpperCase()}
                      </span>
                      {isPlanC && !isApplied && (
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-cyan text-black rounded-full uppercase shadow-sm">
                          RECOMMENDED
                        </span>
                      )}
                      {isApplied && (
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-teal text-black rounded-full uppercase shadow-sm">
                          DEPLOYED
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-white leading-snug">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-text-muted font-sans line-clamp-2 leading-relaxed">
                      {plan.actionDescription}
                    </p>

                    {/* Numerical Impact Matrix */}
                    <div className="space-y-1.5 py-3 my-2 border-y border-white/10 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-text-muted">Load Reduction:</span>
                        <span className="font-bold text-teal">-{plan.powerReductionKW?.toFixed(1)} kW</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">New Modeled Demand:</span>
                        <span className="font-bold text-white">{outcome.newDemand.toFixed(1)} kW</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">New Battery Drain:</span>
                        <span className="font-bold text-amber">-{outcome.netDrain.toFixed(1)} kW</span>
                      </div>
                      <div className="flex justify-between text-xs pt-1.5 border-t border-white/10">
                        <span className="text-cyan font-bold">Predicted Runway:</span>
                        <span className="font-bold text-white">{outcome.runwayStr}</span>
                      </div>
                    </div>

                    {/* Trade-off Warning */}
                    <div className="text-[11px] text-amber/90 leading-relaxed bg-amber/10 p-3 rounded-xl border border-amber/20 font-sans">
                      <strong>Trade-Off:</strong> {plan.operationalTradeOff}
                    </div>
                  </div>

                  {/* Deploy Action Button */}
                  <div className="mt-5 pt-2">
                    <button
                      onClick={() => applyPlanWithFeedback(plan)}
                      disabled={isApplied}
                      className={`w-full py-2.5 px-4 text-xs font-din font-bold uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                        isApplied
                          ? 'bg-teal text-black border border-teal cursor-default font-extrabold'
                          : isPlanC
                          ? 'bg-cyan hover:bg-white text-black border border-cyan shadow-cyan-glow'
                          : 'bg-white/[0.04] hover:bg-white hover:text-black border border-white/15 text-white'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>ACTIVE IN SIMULATION</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>DEPLOY {plan.id.toUpperCase()}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Runway calculation note */}
          <div className="text-[10px] font-mono text-text-muted flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-white/10 pt-3">
            <span>
              * Runway recalculates from CURRENT battery reserve ({habitat.batteryKWh.toFixed(1)} kWh). If applied at T+1.0h (33 kWh), Plan C yields 10.0h runway to floor.
            </span>
            <button
              onClick={restoreFaultedState}
              className="text-cyan hover:underline cursor-pointer flex items-center gap-1 shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restore T=0 Baseline to Compare Plans</span>
            </button>
          </div>
        </div>
      )}

      {/* Avionics Subsystem Dependency Schematic */}
      <DependencyMap />

      {/* Real-Time Simulation Event Timeline */}
      <div className="hud-panel rounded-2xl p-5 lg:p-6 border border-white/10 shadow-2xl space-y-4 font-mono">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              SIMULATION AUDIT TIMELINE // ACTUAL STATE TRANSITIONS
            </h2>
          </div>
          <div className="text-[10px] text-text-muted">
            CURRENT SIM TIME: <span className="font-bold text-white">T+{simTimeHours.toFixed(2)}h</span>
          </div>
        </div>

        <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1">
          {events.map((evt, idx) => (
            <div
              key={evt.id || idx}
              className={`p-3 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all ${
                evt.type === 'critical'
                  ? 'bg-red-dark/80 border-red/60 text-white shadow-sm'
                  : evt.type === 'warning'
                  ? 'bg-amber-dark/60 border-amber/50 text-white shadow-sm'
                  : evt.type === 'success'
                  ? 'bg-teal-dark/60 border-teal/50 text-teal shadow-sm'
                  : 'bg-white/[0.02] border-white/10 text-text-muted'
              }`}
            >
              <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                  evt.type === 'critical'
                    ? 'bg-red text-white'
                    : evt.type === 'warning'
                    ? 'bg-amber text-black'
                    : evt.type === 'success'
                    ? 'bg-teal text-black'
                    : 'bg-white/10 text-white'
                }`}>
                  {evt.type.toUpperCase()}
                </span>
                <span className="text-[10px] font-bold text-cyan shrink-0">
                  [{evt.source}]
                </span>
                <span className="text-[11px] text-text-main truncate">
                  {evt.message}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-text-muted shrink-0 pl-2">
                <span>WALL: {evt.formattedTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
