import React from 'react';
import { CalculatedPlanOutcome } from '../../types/habitat';
import {
  AlertTriangle,
  ShieldCheck,
  Check,
  Zap,
} from 'lucide-react';

interface Props {
  outcome: CalculatedPlanOutcome;
  isSelected: boolean;
  isApplied: boolean;
  onSelect: () => void;
  onApply: () => void;
}

export const RecoveryPlanCard: React.FC<Props> = ({
  outcome,
  isSelected,
  isApplied,
  onSelect,
  onApply,
}) => {
  const { plan, predictedRunway, runwayUnit, runwayImprovement, isRecommended } = outcome;

  return (
    <div
      onClick={onSelect}
      className={`hud-panel p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden font-mono sharp-brutalist ${
        isApplied
          ? 'border-teal bg-[#061410] shadow-teal-glow'
          : isSelected
          ? 'border-white bg-[#0c0c0e] shadow-2xl'
          : 'border-[#333333] bg-[#080808] hover:border-white/40'
      }`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-white uppercase tracking-wider font-din">
              {plan.name}
            </span>
            {isRecommended && (
              <span className="text-[9px] font-bold px-2.5 py-0.5 bg-teal/20 text-teal border border-teal/40 font-din uppercase tracking-wider sharp-brutalist">
                RECOMMENDED
              </span>
            )}
          </div>

          {isApplied && (
            <span className="text-[9px] font-bold px-2.5 py-0.5 bg-teal text-black flex items-center gap-1 shadow-teal-glow font-din tracking-wider uppercase sharp-brutalist">
              <Check className="w-3 h-3" />
              DEPLOYED
            </span>
          )}
        </div>

        <p className="text-xs text-cyan mb-3 tracking-[0.16em] uppercase font-bold font-din">
          {plan.tagline}
        </p>

        {/* Action description */}
        <div className="p-3.5 bg-white/[0.03] border border-white/10 text-xs text-white/80 leading-relaxed mb-3.5 font-sans sharp-brutalist">
          {plan.actionDescription}
        </div>

        {/* Calculated Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 text-xs mb-3.5 font-mono">
          <div className="p-3.5 bg-white/[0.03] border border-white/10 sharp-brutalist">
            <span className="text-[9px] text-white/50 block uppercase tracking-[0.2em]">PREDICTED RUNWAY</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-extrabold text-white tabular-nums font-din">
                {predictedRunway.toFixed(1)}
              </span>
              <span className="text-[10px] text-cyan uppercase font-bold">
                {runwayUnit}
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-teal/[0.06] border border-teal/40 sharp-brutalist">
            <span className="text-[9px] text-teal font-bold block uppercase tracking-[0.2em]">SURVIVAL GAIN</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-extrabold text-teal tabular-nums font-din">
                +{runwayImprovement.toFixed(1)}
              </span>
              <span className="text-[10px] text-teal uppercase font-bold">
                {runwayUnit}
              </span>
            </div>
          </div>
        </div>

        {/* Operational Trade-off Box */}
        <div className="p-3.5 bg-amber/10 border border-amber/30 text-xs space-y-1 mb-3.5 sharp-brutalist">
          <div className="flex items-center gap-1.5 font-bold text-amber text-[10px] uppercase tracking-wider font-din">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>OPERATIONAL TRADE-OFF</span>
          </div>
          <p className="text-[11px] text-white/80 leading-relaxed font-sans">
            {plan.operationalTradeOff}
          </p>
        </div>

        {/* Engineering Rationale */}
        <div className="text-[11px] text-white/60 leading-relaxed mb-4 font-sans">
          <strong className="text-white block font-mono text-[10px] uppercase tracking-[0.2em] mb-0.5">
            ENGINEERING RATIONALE:
          </strong>
          {plan.reasoning}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3.5 border-t border-[#333333] flex items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-[0.16em] transition-all cursor-pointer font-din sharp-brutalist ${
            isSelected
              ? 'text-white bg-white/10 border border-white/50 shadow-sm'
              : 'text-white/60 hover:text-white bg-transparent hover:bg-white/10 border border-white/20'
          }`}
        >
          {isSelected ? 'PREVIEWING' : 'COMPARE'}
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onApply();
          }}
          disabled={isApplied}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-din font-bold uppercase tracking-[0.16em] transition-all cursor-pointer shadow-lg active:scale-95 sharp-brutalist ${
            isApplied
              ? 'bg-teal text-black cursor-default'
              : 'bg-white hover:bg-cyan text-black'
          }`}
        >
          {isApplied ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ACTIVE</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 fill-black" />
              <span>DEPLOY PROTOCOL</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
