import React, { useState } from 'react';
import { useSimulation } from '../store/simulationStore';
import { SCENARIO_DEFINITIONS } from '../scenarios/scenarioDefinitions';
import { ScenarioId } from '../types/habitat';
import { ScenarioCard } from '../components/scenario/ScenarioCard';
import { ScenarioParameterControl } from '../components/scenario/ScenarioParameterControl';
import {
  calculateBatteryRunway,
  calculateWaterRunway,
  calculateOxygenRunway,
} from '../engine/runway';
import {
  FlaskConical,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingDown,
  Clock,
  Sliders,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

export const ScenarioLabPage: React.FC = () => {
  const {
    state,
    triggerScenarioWithFeedback,
    resetSimulation,
    navigate,
  } = useSimulation();

  // Selected scenario in lab tab (defaults to active scenario or 'solar-drop')
  const [selectedScenarioId, setSelectedScenarioId] = useState<ScenarioId>(
    (state.habitat.activeScenarioId as ScenarioId) || 'solar-drop'
  );

  // Local draft inputs for tuning
  const activeDef = SCENARIO_DEFINITIONS[selectedScenarioId];
  const [draftInputs, setDraftInputs] = useState<Record<string, number>>(() => ({
    ...(activeDef.defaultInputs as unknown as Record<string, number>),
    ...state.activeScenarioInputs,
  }));

  // Handle switching scenario card
  const handleSelectScenario = (id: ScenarioId) => {
    setSelectedScenarioId(id);
    const def = SCENARIO_DEFINITIONS[id];
    setDraftInputs({ ...(def.defaultInputs as unknown as Record<string, number>) });
  };

  const handleInputChange = (key: string, value: number) => {
    setDraftInputs((prev) => ({ ...prev, [key]: value }));
  };

  // Preview Runway calculation based on current draft sliders
  let previewRunway = 0;
  let previewUsable = 0;
  let previewDrain = 0;
  let previewUnit: 'hours' | 'days' = activeDef.runwayUnit;

  if (selectedScenarioId === 'solar-drop') {
    const sOut = draftInputs['solarOutputKW'] ?? 3.0;
    const pDem = draftInputs['powerDemandKW'] ?? 8.0;
    const batt = draftInputs['batteryReserveKWh'] ?? 38.0;
    const res = calculateBatteryRunway(batt, sOut, pDem);
    previewRunway = res.runway ?? 0;
    previewUsable = res.usableMargin;
    previewDrain = res.drainRate;
  } else if (selectedScenarioId === 'water-recovery-fault') {
    const wRes = draftInputs['waterReserveLitres'] ?? 640;
    const wLoss = draftInputs['netWaterLossLPD'] ?? 25;
    const res = calculateWaterRunway(wRes, wLoss);
    previewRunway = res.runway ?? 0;
    previewUsable = res.usableMargin;
    previewDrain = res.drainRate;
  } else if (selectedScenarioId === 'air-filter-fault') {
    const o2Start = draftInputs['startingIndicatorPct'] ?? 82;
    const o2Dec = draftInputs['declineRatePctPerHour'] ?? 1.6;
    const res = calculateOxygenRunway(o2Start, o2Dec);
    previewRunway = res.runway ?? 0;
    previewUsable = res.usableMargin;
    previewDrain = res.drainRate;
  }

  // Sensitivity state (Blueprint Page 5 extension: sensitivity panel)
  const [sensitivityVariancePct, setSensitivityVariancePct] = useState<number>(20);

  // Dynamic sensitivity calculation: what happens when consumption/drain shifts
  const sensitivityDrainAdjusted = Math.max(0.1, previewDrain * (1 + sensitivityVariancePct / 100));
  const sensitivityRunwayAdjusted = sensitivityDrainAdjusted > 0 ? Math.round((previewUsable / sensitivityDrainAdjusted) * 100) / 100 : 0;
  const sensitivityDelta = Math.round((previewRunway - sensitivityRunwayAdjusted) * 100) / 100;

  const handleRunSimulation = () => {
    triggerScenarioWithFeedback(selectedScenarioId, draftInputs);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* 0. Aerospace Cinematic Page Header (SpaceX Homepage Style) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-[#333333]">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
            <span className="font-din text-xs sm:text-sm font-bold tracking-[0.2em] text-white/80 uppercase block">
              03 / ANOMALY LAB
            </span>
            <span className="text-white/30 text-xs font-mono">//</span>
            <span className="text-xs font-mono text-white/50 tracking-wider">
              FAULT INJECTION SUITE • SENSITIVITY CALIBRATION
            </span>
          </div>
          <h1 className="font-din text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-[0.04em] text-white leading-[1.05] mb-3">
            ANOMALY SIMULATION & PARAMETER LAB
          </h1>
          <p className="text-white/80 font-sans text-sm md:text-base max-w-3xl leading-relaxed font-normal">
            Inject deterministic lunar habitat resource anomalies, stress-test subsystem boundaries, and compute threshold runway with continuous parametric sensitivity.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={resetSimulation}
            className="px-5 py-3.5 border border-white/40 hover:border-white bg-transparent hover:bg-white/10 text-white font-din font-bold text-xs uppercase tracking-[0.16em] transition-all flex items-center gap-2 cursor-pointer sharp-brutalist"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET TO BASELINE</span>
          </button>
          <button
            onClick={() => navigate('digital-twin-3d')}
            className="px-6 py-3.5 bg-white hover:bg-cyan text-black font-din font-bold text-xs uppercase tracking-[0.18em] transition-all duration-300 flex items-center gap-2 cursor-pointer sharp-brutalist shadow-2xl group"
          >
            <span>3D SIMULATION ARENA</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* 1. Three Selectable Scenario Cards */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-white/60 font-semibold mb-3 flex items-center justify-between">
          <span>STEP 1: SELECT FAULT SCENARIO</span>
          <span className="text-[10px] text-cyan">3 SIMULATION CASES AVAILABLE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.values(SCENARIO_DEFINITIONS).map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              isSelected={selectedScenarioId === scenario.id}
              isActive={state.habitat.activeScenarioId === scenario.id}
              onSelect={() => handleSelectScenario(scenario.id)}
            />
          ))}
        </div>
      </div>

      {/* 2. Parameter Tuning & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Parameter Sliders */}
        <div className="lg:col-span-2 hud-panel p-6 sm:p-8 space-y-6 bg-[#080808] border border-[#333333] shadow-2xl sharp-brutalist">
          <div className="flex items-center justify-between border-b border-[#333333] pb-4">
            <div className="flex items-center gap-2.5">
              <Sliders className="w-5 h-5 text-cyan" />
              <h2 className="text-sm font-bold font-din uppercase tracking-[0.16em] text-white">
                STEP 2: CALIBRATE ANOMALY PARAMETERS
              </h2>
            </div>
            <span className="text-[10px] font-mono text-cyan bg-cyan/10 border border-cyan/30 px-2.5 py-1 sharp-brutalist font-bold">
              BOUNDED NUMERICAL SLIDERS
            </span>
          </div>

          <div className="space-y-4">
            {selectedScenarioId === 'solar-drop' && (
              <>
                <ScenarioParameterControl
                  label="Faulted Solar Array Generation"
                  value={draftInputs['solarOutputKW'] ?? 3.0}
                  min={1.0}
                  max={8.0}
                  step={0.5}
                  unit="kW"
                  baselineValue={8.0}
                  description="Instantaneous generation from dust-occluded photovoltaic array."
                  onChange={(v) => handleInputChange('solarOutputKW', v)}
                />
                <ScenarioParameterControl
                  label="Habitat Electrical Demand"
                  value={draftInputs['powerDemandKW'] ?? 8.0}
                  min={4.0}
                  max={12.0}
                  step={0.5}
                  unit="kW"
                  baselineValue={8.0}
                  description="Total electrical consumption across life support, heating, and payloads."
                  onChange={(v) => handleInputChange('powerDemandKW', v)}
                />
                <ScenarioParameterControl
                  label="Current Battery Reserve"
                  value={draftInputs['batteryReserveKWh'] ?? 38.0}
                  min={18.0}
                  max={60.0}
                  step={1.0}
                  unit="kWh"
                  baselineValue={38.0}
                  description="Stored Li-Ion electrical reserve before reaching 18 kWh safety threshold."
                  onChange={(v) => handleInputChange('batteryReserveKWh', v)}
                />
              </>
            )}

            {selectedScenarioId === 'water-recovery-fault' && (
              <>
                <ScenarioParameterControl
                  label="Potable Water Storage"
                  value={draftInputs['waterReserveLitres'] ?? 640}
                  min={340}
                  max={900}
                  step={10}
                  unit="L"
                  baselineValue={640}
                  description="Current potable drinking and food preparation reserve."
                  onChange={(v) => handleInputChange('waterReserveLitres', v)}
                />
                <ScenarioParameterControl
                  label="Net Reserve Loss Rate"
                  value={draftInputs['netWaterLossLPD'] ?? 25}
                  min={5}
                  max={60}
                  step={1}
                  unit="L/day"
                  baselineValue={25}
                  description="Uncompensated fluid loss resulting from distillation pump failure."
                  onChange={(v) => handleInputChange('netWaterLossLPD', v)}
                />
              </>
            )}

            {selectedScenarioId === 'air-filter-fault' && (
              <>
                <ScenarioParameterControl
                  label="Oxygen Reserve Margin Indicator"
                  value={draftInputs['startingIndicatorPct'] ?? 82}
                  min={45}
                  max={95}
                  step={1}
                  unit="%"
                  baselineValue={82}
                  description="Illustrative margin indicator index (threshold floor is 42%)."
                  onChange={(v) => handleInputChange('startingIndicatorPct', v)}
                />
                <ScenarioParameterControl
                  label="Decline Rate"
                  value={draftInputs['declineRatePctPerHour'] ?? 1.6}
                  min={0.5}
                  max={4.0}
                  step={0.1}
                  unit="%/hr"
                  baselineValue={1.6}
                  description="Hourly percentage-point decline from sorbent bed fouling."
                  onChange={(v) => handleInputChange('declineRatePctPerHour', v)}
                />
              </>
            )}
          </div>

          {/* Action Button: Run Simulation */}
          <div className="pt-5 border-t border-[#333333] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span className="text-[11px] font-mono text-white/50">
              SYNCS CALIBRATED PARAMETERS ACROSS ALL AVIONICS, DEPENDENCY SCHEMATICS, AND PREDICTIVE ENGINES.
            </span>
            <button
              onClick={handleRunSimulation}
              disabled={state.isComputing}
              className="flex items-center gap-2 px-8 py-4 bg-white hover:bg-cyan text-black font-din font-bold text-xs uppercase tracking-[0.18em] transition-all duration-300 shadow-2xl active:scale-95 cursor-pointer disabled:opacity-50 shrink-0 sharp-brutalist"
            >
              {state.isComputing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>COMPUTING TRAJECTORY...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-black" />
                  <span>ENGAGE ANOMALY SIMULATION</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Col: Live Scenario Preview & Sensitivity Card */}
        <div className="space-y-6">
          {/* Live Outcome Preview */}
          <div className="hud-panel p-6 space-y-4 bg-[#080808] border border-[#333333] shadow-2xl sharp-brutalist">
            <div className="flex items-center justify-between border-b border-[#333333] pb-3">
              <span className="text-xs font-din font-bold text-cyan uppercase tracking-[0.16em] flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                PREDICTIVE ENGINE HUD
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 bg-white/5 border border-white/10 text-white/60 sharp-brutalist">
                REACTIVE CALC
              </span>
            </div>

            <div className="space-y-3.5">
              <div className="p-4 bg-white/[0.03] border border-white/10 sharp-brutalist">
                <span className="text-[10px] font-mono text-white/50 block uppercase tracking-[0.2em]">
                  PREDICTED FAULT RUNWAY
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-extrabold font-din text-red tabular-nums">
                    {previewRunway.toFixed(1)}
                  </span>
                  <span className="font-mono text-xs text-white/70 uppercase font-bold">
                    {previewUnit}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-white/50 mt-1 block">
                  Usable reserve: {previewUsable.toFixed(1)} • Net draw: {previewDrain.toFixed(1)}
                </span>
              </div>

              <div className="text-xs space-y-2 text-white/60 font-mono">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Downstream Affected Systems:</span>
                  <span className="text-white font-bold">
                    {activeDef.dependentSystems.length} SUBSYSTEMS
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Available Contingency Plans:</span>
                  <span className="text-cyan font-bold">
                    {activeDef.recoveryPlans.length} VERIFIED RESPONSES
                  </span>
                </div>
              </div>

              {state.habitat.activeScenarioId === selectedScenarioId && (
                <div className="p-3.5 bg-teal/10 border border-teal/40 text-teal text-xs font-mono flex items-center gap-2.5 sharp-brutalist">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>ACTIVE: This scenario is currently injected into live avionics.</span>
                </div>
              )}
            </div>
          </div>

          {/* Sensitivity Exploration Section */}
          <div className="hud-panel p-6 space-y-4 bg-[#080808] border border-[#333333] shadow-2xl font-mono sharp-brutalist">
            <div className="flex items-center justify-between border-b border-[#333333] pb-3">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-amber" />
                <h3 className="text-xs font-bold text-white uppercase tracking-[0.16em] font-din">
                  SENSITIVITY ANALYSIS PANEL
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan px-2.5 py-0.5 bg-cyan/10 border border-cyan/30 sharp-brutalist">
                P.05 EXTENSION
              </span>
            </div>

            <p className="text-[11px] text-white/70 leading-relaxed font-sans">
              Test how threshold runway responds when consumption assumptions and subsystem drain fluctuate:
            </p>

            {/* Interactive Variance Slider */}
            <div className="space-y-2.5 p-3.5 bg-white/[0.03] border border-white/10 sharp-brutalist">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60 text-[11px] uppercase tracking-wider">Demand / Loss Strain:</span>
                <span className={`font-mono font-bold tabular-nums ${sensitivityVariancePct >= 0 ? 'text-amber' : 'text-teal'}`}>
                  {sensitivityVariancePct > 0 ? `+${sensitivityVariancePct}%` : `${sensitivityVariancePct}%`}
                </span>
              </div>
              <input
                type="range"
                min={-40}
                max={60}
                step={5}
                value={sensitivityVariancePct}
                onChange={(e) => setSensitivityVariancePct(Number(e.target.value))}
                className="w-full h-2 bg-black appearance-none cursor-pointer accent-cyan border border-white/20 sharp-brutalist"
              />
              <div className="flex justify-between text-[9px] text-white/40 font-mono">
                <span>-40% CONSERVATION</span>
                <span>0% NOMINAL</span>
                <span>+60% SEVERE STRAIN</span>
              </div>
            </div>

            {/* Elasticity Results */}
            <div className="p-3.5 bg-white/[0.03] border border-white/10 text-xs space-y-2 font-mono sharp-brutalist">
              <div className="flex justify-between text-white/60 text-[11px]">
                <span>Adjusted Drain Rate:</span>
                <span className="text-white font-bold tabular-nums">
                  {sensitivityDrainAdjusted.toFixed(1)} {previewUnit === 'hours' ? (selectedScenarioId === 'solar-drop' ? 'kW' : '%/hr') : 'L/day'}
                </span>
              </div>
              <div className="flex justify-between text-white/60 text-[11px]">
                <span>Elastic Runway:</span>
                <span className={`font-bold tabular-nums text-sm ${sensitivityVariancePct > 0 ? 'text-amber' : 'text-teal'}`}>
                  {sensitivityRunwayAdjusted.toFixed(1)} {previewUnit.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between text-white/60 text-[11px] pt-2 border-t border-white/10">
                <span>Runway Variance (&Delta;):</span>
                <span className={`font-bold tabular-nums ${sensitivityDelta >= 0 ? 'text-red' : 'text-teal'}`}>
                  {sensitivityDelta >= 0 ? `-${sensitivityDelta.toFixed(1)}` : `+${Math.abs(sensitivityDelta).toFixed(1)}`} {previewUnit}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-white/50 italic font-sans">
              "Demonstrates that the model depends on transparent assumptions rather than pretending to know the future exactly." — Blueprint p.05
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
