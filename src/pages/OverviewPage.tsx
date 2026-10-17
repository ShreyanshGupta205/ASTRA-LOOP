import React, { useState } from 'react';
import { useSimulation } from '../store/simulationStore';
import { HABITAT_THRESHOLDS } from '../data/initialState';
import { StatusStrip } from '../components/ui/StatusStrip';
import { ResourceCard } from '../components/ui/ResourceCard';
import { ResourceForecastChart } from '../components/charts/ResourceForecastChart';
import { ActiveScenarioPanel } from '../components/scenario/ActiveScenarioPanel';
import { DependencyMap } from '../components/scenario/DependencyMap';
import { AlertPanel } from '../components/ui/AlertPanel';
import { SimulationControlDeck } from '../components/simulation/SimulationControlDeck';
import { LunarHabitat3DCanvas } from '../components/simulation3d/LunarHabitat3DCanvas';
import { Boxes, CircuitBoard, LayoutDashboard, ArrowRight, Activity } from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const { state, setForecastResource, navigate } = useSimulation();
  const { habitat } = state;
  const [viewMode, setViewMode] = useState<'3d' | 'schematic'>('3d');

  // Determine status levels for resource cards
  const isSolarFault = habitat.activeScenarioId === 'solar-drop';
  const isWaterFault = habitat.activeScenarioId === 'water-recovery-fault';
  const isAirFault = habitat.activeScenarioId === 'air-filter-fault';
  const isPlanApplied = Boolean(habitat.appliedPlanId);

  const batteryStatusLevel = habitat.batteryKWh <= HABITAT_THRESHOLDS.batteryFloorKWh
    ? 'critical'
    : (isSolarFault ? (isPlanApplied ? 'warning' : 'critical') : 'nominal');

  const waterStatusLevel = habitat.waterLitres <= HABITAT_THRESHOLDS.waterFloorLitres
    ? 'critical'
    : (isWaterFault ? (isPlanApplied ? 'warning' : 'critical') : 'nominal');

  const oxygenStatusLevel = habitat.oxygenIndicatorPct <= HABITAT_THRESHOLDS.oxygenThresholdPct
    ? 'critical'
    : (isAirFault ? (isPlanApplied ? 'warning' : 'critical') : 'nominal');

  const solarStatusLevel = habitat.solarOutputKW < habitat.powerDemandKW
    ? (isPlanApplied ? 'warning' : 'critical')
    : 'nominal';

  return (
    <div className="space-y-8 font-sans">
      {/* 0. Aerospace Cinematic Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-white/10">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan/10 border border-cyan/30 text-cyan">
              01 / AVIONICS CONSOLE
            </span>
            <span className="text-xs font-mono text-white/50 tracking-wider">
              120V DC POWER BUS // CLOSED-LOOP WRS // ECLSS CORE
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-[0.03em] text-white font-din flex items-center gap-3">
            <LayoutDashboard className="w-7 h-7 text-cyan" />
            LUNAR HABITAT AVIONICS OVERVIEW
          </h1>
          <p className="text-xs sm:text-sm text-white/70 max-w-3xl font-sans mt-1 leading-relaxed">
            Live telemetry stream from DEMO-01 on Shackleton Crater rim (89.9°S). Monitor instantaneous power bus equilibrium, water reserve inventory, and trace-contaminant indicator margins.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('digital-twin-3d')}
            className="px-6 py-3 rounded-xl bg-white hover:bg-cyan text-black font-din font-bold text-xs uppercase tracking-[0.16em] transition-all flex items-center gap-2.5 cursor-pointer shadow-xl group"
          >
            <Boxes className="w-4 h-4" />
            <span>3D SIMULATION ARENA</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* 1. Main Status Strip */}
      <StatusStrip />

      {/* 2. Four Resource Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Battery Card */}
        <ResourceCard
          id="battery"
          title="Battery Storage"
          subtitle="Li-Ion Main Energy Bus"
          value={habitat.batteryKWh}
          unit="kWh"
          secondaryValue={`${Math.round((habitat.batteryKWh / HABITAT_THRESHOLDS.batteryCapacityKWh) * 100)}% stored`}
          floorValue={HABITAT_THRESHOLDS.batteryFloorKWh}
          floorLabel="Safety Floor"
          capacityValue={HABITAT_THRESHOLDS.batteryCapacityKWh}
          percentage={(habitat.batteryKWh / HABITAT_THRESHOLDS.batteryCapacityKWh) * 100}
          statusText={batteryStatusLevel === 'nominal' ? 'NOMINAL' : (batteryStatusLevel === 'warning' ? 'DRAIN MITIGATED' : 'ACTIVE DRAIN')}
          statusLevel={batteryStatusLevel}
          trend={habitat.netDrainKW > 0 ? (isPlanApplied ? 'recovering' : 'draining') : 'stable'}
          trendRateText={habitat.netDrainKW > 0 ? `-${habitat.netDrainKW.toFixed(1)} kW drain` : undefined}
          explanation="Stores 38 kWh of nominal usable capacity above the 18 kWh safety threshold. Battery feeds continuous critical life support, thermal loops, and habitat systems."
        />

        {/* Water Card */}
        <ResourceCard
          id="water"
          title="Potable Water"
          subtitle="Closed-Loop Fluid Reserve"
          value={habitat.waterLitres}
          unit="L"
          secondaryValue={`${Math.round((habitat.waterLitres / HABITAT_THRESHOLDS.waterCapacityLitres) * 100)}% volume`}
          floorValue={HABITAT_THRESHOLDS.waterFloorLitres}
          floorLabel="Safety Floor"
          capacityValue={HABITAT_THRESHOLDS.waterCapacityLitres}
          percentage={(habitat.waterLitres / HABITAT_THRESHOLDS.waterCapacityLitres) * 100}
          statusText={waterStatusLevel === 'nominal' ? 'BALANCED' : (waterStatusLevel === 'warning' ? 'RATIONED' : 'UNCOMPENSATED LOSS')}
          statusLevel={waterStatusLevel}
          trend={habitat.waterLossRateLPD > 0 ? (isPlanApplied ? 'recovering' : 'draining') : 'stable'}
          trendRateText={habitat.waterLossRateLPD > 0 ? `-${habitat.waterLossRateLPD} L/day` : undefined}
          explanation="640 L potable water inventory with 340 L strict safety reserve. Purified through distillation loop for crew hydration and oxygen generation electrolysis."
        />

        {/* Oxygen Card */}
        <ResourceCard
          id="oxygen"
          title="Oxygen Reserve"
          subtitle="Illustrative Indicator Index"
          value={habitat.oxygenIndicatorPct}
          unit="%"
          secondaryValue={`${Math.max(0, habitat.oxygenIndicatorPct - HABITAT_THRESHOLDS.oxygenThresholdPct)}% margin`}
          floorValue={HABITAT_THRESHOLDS.oxygenThresholdPct}
          floorLabel="Threshold"
          percentage={habitat.oxygenIndicatorPct}
          statusText={oxygenStatusLevel === 'nominal' ? 'OPTIMAL' : (oxygenStatusLevel === 'warning' ? 'EXTENDED' : 'DECLINING')}
          statusLevel={oxygenStatusLevel}
          trend={habitat.oxygenDeclineRatePctPerHour > 0 ? (isPlanApplied ? 'recovering' : 'draining') : 'stable'}
          trendRateText={habitat.oxygenDeclineRatePctPerHour > 0 ? `-${habitat.oxygenDeclineRatePctPerHour.toFixed(1)} %/h` : undefined}
          explanation="Illustrative atmospheric margin indicator model (baseline 82%, critical threshold 42%). Demonstrates degradation in trace contaminant scrubber beds."
        />

        {/* Solar Power Card */}
        <ResourceCard
          id="solar"
          title="Solar Generation"
          subtitle="Photovoltaic Array Output"
          value={habitat.solarOutputKW}
          unit="kW"
          secondaryValue={`Demand: ${habitat.powerDemandKW.toFixed(1)} kW`}
          floorValue={habitat.powerDemandKW}
          floorLabel="Demand Load"
          capacityValue={10.0}
          percentage={(habitat.solarOutputKW / 10.0) * 100}
          statusText={solarStatusLevel === 'nominal' ? 'FULL GENERATION' : (isPlanApplied ? 'PARTIAL BALANCED' : 'DEFICIT')}
          statusLevel={solarStatusLevel}
          trend={habitat.solarOutputKW < habitat.powerDemandKW ? 'draining' : 'stable'}
          trendRateText={habitat.solarOutputKW < habitat.powerDemandKW ? `Deficit: -${(habitat.powerDemandKW - habitat.solarOutputKW).toFixed(1)} kW` : undefined}
          explanation="Instantaneous power generated by the photovoltaic array (nominal 8.0 kW vs base demand 8.0 kW). Drops to 3.0 kW during regolith dust occlusion."
        />
      </div>

      {/* 2.5 Live Simulation Engine Playback & Time-Lapse Deck */}
      <SimulationControlDeck />

      {/* 3. Mid Section: Resource Forecast Chart & Active Scenario Incident Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ResourceForecastChart
            forecastPoints={state.forecastPoints}
            resource={state.forecastResource}
            onResourceChange={setForecastResource}
          />
        </div>

        <div className="lg:col-span-1">
          <ActiveScenarioPanel />
        </div>
      </div>

      {/* 4. Bottom Section: 3D Digital Twin Viewport / 2D Circuit Schematic & Live Event Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* View Mode Selector Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('3d')}
                className={`px-4 py-2 rounded-xl text-xs font-din font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                  viewMode === '3d'
                    ? 'bg-white text-black shadow-lg'
                    : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Boxes className="w-4 h-4" />
                <span>3D LUNAR HABITAT</span>
              </button>
              <button
                onClick={() => setViewMode('schematic')}
                className={`px-4 py-2 rounded-xl text-xs font-din font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                  viewMode === 'schematic'
                    ? 'bg-white text-black shadow-lg'
                    : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <CircuitBoard className="w-4 h-4" />
                <span>2D BUS SCHEMATIC</span>
              </button>
            </div>

            <button
              onClick={() => navigate('digital-twin-3d')}
              className="text-xs font-din font-bold text-cyan hover:text-white tracking-wider uppercase flex items-center gap-1.5 self-end sm:self-auto cursor-pointer px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <span>FULLSCREEN 3D SIMULATION ARENA</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Conditional View with Rounded Corners */}
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            {viewMode === '3d' ? (
              <LunarHabitat3DCanvas heightClass="h-[460px]" />
            ) : (
              <DependencyMap />
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <AlertPanel />
        </div>
      </div>
    </div>
  );
};
