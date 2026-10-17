import React, { useState } from 'react';
import {
  BatteryCharging,
  Droplets,
  Wind,
  Sun,
  Info,
  TrendingDown,
  TrendingUp,
  Minus,
} from 'lucide-react';

export interface ResourceCardProps {
  id: 'battery' | 'water' | 'oxygen' | 'solar';
  title: string;
  subtitle: string;
  value: number;
  unit: string;
  secondaryValue?: string;
  floorValue: number;
  floorLabel: string;
  capacityValue?: number;
  percentage?: number;
  statusText: string;
  statusLevel: 'nominal' | 'warning' | 'critical';
  trend: 'stable' | 'draining' | 'recovering';
  trendRateText?: string;
  explanation: string;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  id,
  title,
  subtitle,
  value,
  unit,
  secondaryValue,
  floorValue,
  floorLabel,
  capacityValue,
  percentage,
  statusText,
  statusLevel,
  trend,
  trendRateText,
  explanation,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const icons = {
    battery: BatteryCharging,
    water: Droplets,
    oxygen: Wind,
    solar: Sun,
  };
  const Icon = icons[id];

  const statusStyles = {
    nominal: {
      border: 'border-white/10 hover:border-teal/50',
      badge: 'bg-teal-dark text-teal border-teal/40',
      progress: 'bg-teal shadow-teal-glow',
      iconText: 'text-teal',
      accentGlow: 'hover:shadow-teal-glow',
    },
    warning: {
      border: 'border-amber/50 shadow-amber-glow',
      badge: 'bg-amber-dark text-amber border-amber/40',
      progress: 'bg-amber shadow-amber-glow',
      iconText: 'text-amber',
      accentGlow: 'shadow-amber-glow',
    },
    critical: {
      border: 'border-red/60 shadow-red-glow animate-spacex-pulse',
      badge: 'bg-red-dark text-red border-red/40 font-bold',
      progress: 'bg-red shadow-red-glow',
      iconText: 'text-red',
      accentGlow: 'shadow-red-glow',
    },
  }[statusLevel];

  const calcPct = percentage ?? (capacityValue ? Math.min(100, Math.max(0, (value / capacityValue) * 100)) : 100);

  return (
    <div
      className={`relative hud-panel rounded-2xl p-5 sm:p-6 bg-gradient-to-b from-white/[0.05] via-white/[0.02] to-transparent backdrop-blur-xl border flex flex-col justify-between font-mono transition-all duration-300 hover:translate-y-[-2px] ${statusStyles.border} ${statusStyles.accentGlow}`}
    >
      {/* Top Telemetry Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
              <Icon className={`w-4 h-4 ${statusStyles.iconText}`} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase">
                  SYS.{id.toUpperCase()}
                </span>
                <span className="text-white/30 text-[10px] font-mono">//</span>
                <span className="text-[10px] font-mono text-cyan tracking-wider uppercase font-bold">
                  CH-0{id === 'battery' ? '1' : id === 'water' ? '2' : id === 'oxygen' ? '3' : '4'}
                </span>
              </div>
              <h3 className="text-sm font-bold font-din uppercase tracking-wide text-white">
                {title}
              </h3>
              {subtitle && (
                <p className="text-[10px] text-white/50 tracking-wider font-mono uppercase mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowTooltip(!showTooltip)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-white/40 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              aria-label={`More info on ${title}`}
            >
              <Info className="w-3.5 h-3.5" />
            </button>

            {/* Technical Detail Hover Overlay */}
            {showTooltip && (
              <div className="absolute right-0 top-8 w-72 p-4 rounded-xl bg-[#090b10]/95 backdrop-blur-xl border border-white/15 text-xs text-white/80 shadow-2xl z-30 font-mono text-[11px] leading-relaxed pointer-events-none">
                <div className="font-bold text-white mb-1.5 flex items-center gap-2 border-b border-white/10 pb-1.5 font-din uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan shadow-cyan-glow" />
                  <span>SPECIFICATION // {title.toUpperCase()}</span>
                </div>
                {explanation}
              </div>
            )}
          </div>
        </div>

        {/* Big Bold SpaceX Telemetry Display */}
        <div className="mt-4 flex items-baseline justify-between border-b border-white/10 pb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold font-din text-white tabular-nums tracking-tight">
              {typeof value === 'number' ? (id === 'solar' ? value.toFixed(1) : value.toLocaleString()) : value}
            </span>
            <span className="text-xs font-mono font-bold text-cyan tracking-wider uppercase">
              {unit}
            </span>
          </div>

          {secondaryValue && (
            <span className="text-[11px] font-mono text-white/60 tabular-nums bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
              {secondaryValue}
            </span>
          )}
        </div>

        {/* SpaceX Segmented Telemetry Progress Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="relative w-full h-2 rounded-full bg-black/60 overflow-hidden p-0.5 border border-white/10">
            <div
              className={`h-full rounded-full transition-all duration-500 ${statusStyles.progress}`}
              style={{ width: `${Math.min(100, Math.max(3, calcPct))}%` }}
            />
          </div>

          {/* Reference Floor & Capacity Readouts */}
          <div className="flex justify-between items-center text-[10px] font-mono text-white/50 pt-0.5">
            <span className="flex items-center gap-1">
              <span>{floorLabel}:</span>
              <strong className="text-white tabular-nums font-bold">{floorValue} {unit}</strong>
            </span>
            {capacityValue && (
              <span className="flex items-center gap-1">
                <span>MAX:</span>
                <strong className="text-white/70 tabular-nums">{capacityValue} {unit}</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Avionics Status & Vector */}
      <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs">
        <span className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-md border tracking-wider uppercase ${statusStyles.badge}`}>
          {statusText}
        </span>

        <div className="flex items-center gap-1 font-mono text-[11px]">
          {trend === 'draining' && (
            <span className="flex items-center gap-1.5 text-red font-bold">
              <TrendingDown className="w-3.5 h-3.5" />
              <span className="tabular-nums">{trendRateText || 'NET DRAIN'}</span>
            </span>
          )}
          {trend === 'recovering' && (
            <span className="flex items-center gap-1.5 text-teal font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="tabular-nums">{trendRateText || 'EXTENDED'}</span>
            </span>
          )}
          {trend === 'stable' && (
            <span className="flex items-center gap-1.5 text-white/50">
              <Minus className="w-3 h-3 text-cyan" />
              <span className="tracking-wider uppercase font-bold">BALANCED</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
