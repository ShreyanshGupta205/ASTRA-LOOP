import React from 'react';
import { ScenarioDefinition } from '../../types/habitat';
import { Sun, Droplets, Wind, AlertTriangle, ArrowRight, Check } from 'lucide-react';

interface Props {
  scenario: ScenarioDefinition;
  isSelected: boolean;
  isActive: boolean;
  onSelect: () => void;
}

export const ScenarioCard: React.FC<Props> = ({
  scenario,
  isSelected,
  isActive,
  onSelect,
}) => {
  const icons = {
    'solar-drop': Sun,
    'water-recovery-fault': Droplets,
    'air-filter-fault': Wind,
  };
  const Icon = icons[scenario.id] || AlertTriangle;

  return (
    <div
      onClick={onSelect}
      className={`hud-panel p-5 sm:p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden group font-mono sharp-brutalist ${
        isSelected
          ? 'border-white bg-[#0c0c0e] shadow-2xl'
          : 'border-[#333333] bg-[#080808] hover:border-white/40'
      }`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 flex items-center justify-center shrink-0 transition-colors border sharp-brutalist ${
                isSelected
                  ? 'bg-white text-black border-white shadow-lg'
                  : 'bg-white/[0.04] text-white/60 border-white/10 group-hover:text-white group-hover:border-white/30'
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-cyan block font-bold">
                ANOMALY // {scenario.id.toUpperCase()}
              </span>
              <h3 className="text-sm font-bold text-white uppercase group-hover:text-cyan transition-colors font-din tracking-wide">
                {scenario.name}
              </h3>
            </div>
          </div>

          {isActive && (
            <span className="text-[9px] font-mono font-bold px-2.5 py-0.5 bg-red/20 border border-red/60 text-red animate-spacex-pulse sharp-brutalist">
              FAULT ACTIVE
            </span>
          )}
        </div>

        <p className="text-xs text-white/70 leading-relaxed line-clamp-3 mb-4 font-sans">
          {scenario.faultDescription}
        </p>

        {/* Dependent Systems Tags */}
        <div className="space-y-1.5 mb-4">
          <span className="text-[9px] text-white/40 block uppercase tracking-[0.2em] font-mono">
            DOWNSTREAM DEPENDENTS:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {scenario.dependentSystems.slice(0, 3).map((sys) => (
              <span
                key={sys}
                className="text-[9px] px-2 py-0.5 bg-white/[0.04] border border-white/10 text-white/80 font-mono sharp-brutalist"
              >
                {sys}
              </span>
            ))}
            {scenario.dependentSystems.length > 3 && (
              <span className="text-[9px] px-2 py-0.5 bg-white/[0.02] border border-white/5 text-white/40 font-mono sharp-brutalist">
                +{scenario.dependentSystems.length - 3} MORE
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3.5 border-t border-[#333333] flex items-center justify-between text-xs">
        <span className="text-[10px] text-white/50 font-mono">
          TIMESCALE: <strong className="text-white uppercase font-bold">{scenario.runwayUnit}</strong>
        </span>

        <span
          className={`flex items-center gap-1.5 font-bold text-xs uppercase tracking-[0.16em] font-din ${
            isSelected ? 'text-white' : 'text-white/40 group-hover:text-white'
          }`}
        >
          {isSelected ? (
            <>
              <Check className="w-3.5 h-3.5 text-cyan" />
              <span>CONFIGURED</span>
            </>
          ) : (
            <>
              <span>SELECT</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </span>
      </div>
    </div>
  );
};
