import React from 'react';
import { useSimulation } from '../../store/simulationStore';
import { getHabitatTopology, DependencyNode } from '../../engine/dependencies';
import {
  Sun,
  Zap,
  BatteryCharging,
  ShieldAlert,
  Thermometer,
  Radio,
  Droplets,
  FlaskConical,
  Atom,
  Wind,
  Layers,
} from 'lucide-react';

export const DependencyMap: React.FC = () => {
  const { state } = useSimulation();

  const topology = getHabitatTopology(
    state.habitat.activeScenarioId,
    state.habitat.appliedPlanId,
    state.habitat.solarOutputKW,
    state.habitat.powerDemandKW
  );

  const nodeIcons: Record<string, React.ElementType> = {
    'solar-array': Sun,
    'power-bus': Zap,
    'battery-bank': BatteryCharging,
    'life-support-load': ShieldAlert,
    'thermal-load': Thermometer,
    'comms-load': Radio,
    'water-rec-load': Droplets,
    'labs-load': FlaskConical,
    'exp-load': Atom,
    'water-storage': Droplets,
    'o2-indicator': Wind,
  };

  const getStatusColor = (status: DependencyNode['status']) => {
    switch (status) {
      case 'critical':
        return {
          border: 'border-red/60 shadow-red-glow/30 bg-red-dark/80',
          badge: 'bg-red text-white font-bold',
          text: 'text-red',
          dot: 'bg-red animate-spacex-pulse',
        };
      case 'warning':
        return {
          border: 'border-amber/50 shadow-amber-glow/20 bg-amber-dark/60',
          badge: 'bg-amber text-black font-bold',
          text: 'text-amber',
          dot: 'bg-amber',
        };
      case 'throttled':
        return {
          border: 'border-cyan/50 shadow-cyan-glow/20 bg-cyan-dark/60',
          badge: 'bg-cyan text-black font-bold',
          text: 'text-cyan',
          dot: 'bg-cyan',
        };
      case 'offline':
        return {
          border: 'border-white/5 bg-white/[0.01] opacity-40',
          badge: 'bg-white/10 text-text-muted',
          text: 'text-text-muted',
          dot: 'bg-text-muted',
        };
      case 'nominal':
      default:
        return {
          border: 'border-white/10 bg-white/[0.03] hover:border-teal/50 hover:bg-white/[0.06]',
          badge: 'bg-teal-dark text-teal border border-teal/40',
          text: 'text-teal',
          dot: 'bg-teal',
        };
    }
  };

  return (
    <div className="hud-panel rounded-2xl p-5 lg:p-6 border border-white/10 shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-5 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan" />
            <h2 className="text-sm font-bold font-mono tracking-wider uppercase text-white">
              AVIONICS SUBSYSTEM DEPENDENCY SCHEMATIC
            </h2>
          </div>
          <p className="text-[11px] font-mono text-text-muted mt-0.5">
            120V DC power distribution bus, critical life support loops, and fluid reserve topology
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[10px] font-mono text-text-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal" /> NOMINAL
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber" /> DEGRADED
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red animate-spacex-pulse" /> FAULT
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan" /> THROTTLED
          </span>
        </div>
      </div>

      {/* SpaceX Avionics Rack Columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white/[0.02] rounded-2xl border border-white/10 font-mono shadow-inner">
        {/* Column 1: Power Generation */}
        <div className="space-y-3">
          <div className="text-[10px] uppercase tracking-widest text-text-muted font-bold border-b border-white/10 pb-1.5 flex items-center justify-between">
            <span>STAGE 1: GENERATION</span>
            <span className="text-cyan">BUS-A</span>
          </div>
          {topology.nodes.filter((n) => n.type === 'source').map((node) => {
            const Icon = nodeIcons[node.id] || Zap;
            const style = getStatusColor(node.status);
            return (
              <div
                key={node.id}
                className={`p-3 rounded-xl border transition-all duration-200 ${style.border}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${style.text}`} />
                    <span className="text-xs font-bold text-white uppercase">{node.label}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs mt-2 border-t border-white/10 pt-1.5">
                  <span className="text-[10px] text-text-muted uppercase">{node.category}</span>
                  <span className={`font-bold tabular-nums text-xs ${style.text}`}>{node.metric}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Column 2: Distribution & Storage */}
        <div className="space-y-3">
          <div className="text-[10px] uppercase tracking-widest text-text-muted font-bold border-b border-white/10 pb-1.5 flex items-center justify-between">
            <span>STAGE 2: 120V BUS</span>
            <span className="text-cyan">MAIN-B</span>
          </div>
          {topology.nodes.filter((n) => n.type === 'bus').map((node) => {
            const Icon = nodeIcons[node.id] || Zap;
            const style = getStatusColor(node.status);
            return (
              <div
                key={node.id}
                className={`p-3 rounded-xl border transition-all duration-200 ${style.border}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${style.text}`} />
                    <span className="text-xs font-bold text-white uppercase">{node.label}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs mt-2 border-t border-white/10 pt-1.5">
                  <span className="text-[10px] text-text-muted uppercase">{node.category}</span>
                  <span className={`font-bold tabular-nums text-xs ${style.text}`}>{node.metric}</span>
                </div>
              </div>
            );
          })}

          <div className="text-[10px] uppercase tracking-widest text-text-muted font-bold border-b border-white/10 pb-1.5 pt-1 flex items-center justify-between">
            <span>STAGE 3: STORAGE</span>
            <span className="text-cyan">LI-ION</span>
          </div>
          {topology.nodes.filter((n) => n.type === 'storage').map((node) => {
            const Icon = nodeIcons[node.id] || Zap;
            const style = getStatusColor(node.status);
            return (
              <div
                key={node.id}
                className={`p-3 rounded-xl border transition-all duration-200 ${style.border}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${style.text}`} />
                    <span className="text-xs font-bold text-white uppercase">{node.label}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs mt-2 border-t border-white/10 pt-1.5">
                  <span className="text-[10px] text-text-muted uppercase">{node.category}</span>
                  <span className={`font-bold tabular-nums text-xs ${style.text}`}>{node.metric}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Column 3: Electrical Consumers (Sum = 8.0 kW) */}
        <div className="space-y-2 md:col-span-1">
          <div className="text-[10px] uppercase tracking-widest text-text-muted font-bold border-b border-white/10 pb-1.5 flex items-center justify-between">
            <span>CONSUMERS (8.0 kW)</span>
            <span className="text-cyan">LOADS</span>
          </div>
          {topology.nodes.filter((n) => n.type === 'consumer').map((node) => {
            const Icon = nodeIcons[node.id] || Zap;
            const style = getStatusColor(node.status);
            return (
              <div
                key={node.id}
                className={`p-2.5 rounded-xl border transition-all duration-200 ${style.border}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-3 h-3 shrink-0 ${style.text}`} />
                    <span className="text-[11px] font-bold text-white truncate max-w-[125px]">
                      {node.label}
                    </span>
                  </div>
                  <span className={`font-mono text-[10px] font-bold tabular-nums ${style.text}`}>
                    {node.metric}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Column 4: ECLSS Fluid & Atmosphere Reservoirs */}
        <div className="space-y-3">
          <div className="text-[10px] uppercase tracking-widest text-text-muted font-bold border-b border-white/10 pb-1.5 flex items-center justify-between">
            <span>ECLSS RESERVES</span>
            <span className="text-cyan">OUTCOMES</span>
          </div>
          {topology.nodes.filter((n) => n.type === 'eclss').map((node) => {
            const Icon = nodeIcons[node.id] || Zap;
            const style = getStatusColor(node.status);
            return (
              <div
                key={node.id}
                className={`p-3 rounded-xl border transition-all duration-200 ${style.border}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${style.text}`} />
                    <span className="text-xs font-bold text-white uppercase">{node.label}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs mt-2 border-t border-white/10 pt-1.5">
                  <span className="text-[10px] text-text-muted uppercase">{node.category}</span>
                  <span className={`font-bold tabular-nums text-xs ${style.text}`}>{node.metric}</span>
                </div>
              </div>
            );
          })}

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-[10px] text-text-muted leading-relaxed">
            <strong className="text-cyan block uppercase tracking-wider mb-0.5">AVIONICS BUS RULE:</strong>
            Faults propagate down direct modeled electrical and ECLSS pipelines with zero unmodeled crosstalk.
          </div>
        </div>
      </div>
    </div>
  );
};
