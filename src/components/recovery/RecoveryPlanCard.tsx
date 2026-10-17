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
      className={`hud-panel rounded-2xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden font-mono hover:translate-y-[-2px] ${
        isApplied
          ? 'border-teal/60 bg-gradient-to-b from-teal/[0.08] via-teal/[0.03] to-transparent shadow-teal-glow'
          : isSelected
          ? 'border-white/50 bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-transparent shadow-[0_16px_40px_rgba(0,0,0,0.6)]'
          : 'border-white/10 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.05]'
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
              <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-teal/15 text-teal border border-teal/40">
                RECOMMENDED
              </span>
            )}
          </div>

          {isApplied && (
            <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-teal text-black flex items-center gap-1 shadow-teal-glow font-din">
              <Check className="w-3 h-3" />
              DEPLOYED
            </span>
          )}
        </div>

        <p className="text-xs text-cyan mb-3 tracking-wide uppercase font-bold font-din">
          {plan.tagline}
        </p>

        {/* Action description */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white/80 leading-relaxed mb-3.5 font-sans">
          {plan.actionDescription}
        </div>

        {/* Calculated Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 text-xs mb-3.5 font-mono">
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
            <span className="text-[9px] text-white/50 block uppercase tracking-wider">PREDICTED RUNWAY</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-extrabold text-white tabular-nums font-din">
                {predictedRunway.toFixed(1)}
              </span>
              <span className="text-[10px] text-cyan uppercase font-bold">
                {runwayUnit}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-teal/[0.04] border border-teal/30">
            <span className="text-[9px] text-teal font-bold block uppercase tracking-wider">SURVIVAL GAIN</span>
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
        <div className="p-3.5 rounded-xl bg-amber/10 border border-amber/30 text-xs space-y-1 mb-3.5">
          <div className="flex items-center gap-1.5 font-bold text-amber text-[10px] uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>OPERATIONAL TRADE-OFF</span>
          </div>
          <p className="text-[11px] text-white/80 leading-relaxed font-sans">
            {plan.operationalTradeOff}
          </p>
        </div>

        {/* Engineering Rationale */}
        <div className="text-[11px] text-white/60 leading-relaxed mb-4 font-sans">
          <strong className="text-white block font-mono text-[10px] uppercase tracking-wider mb-0.5">
            ENGINEERING RATIONALE:
          </strong>
          {plan.reasoning}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3.5 border-t border-white/10 flex items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer font-din ${
            isSelected
              ? 'text-white bg-white/10 border border-white/40 shadow-sm'
              : 'text-white/60 hover:text-white bg-white/[0.04] hover:bg-white/10 border border-white/10'
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
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-din font-bold uppercase tracking-[0.16em] transition-all cursor-pointer shadow-lg active:scale-95 ${
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
