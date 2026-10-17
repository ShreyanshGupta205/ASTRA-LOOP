import React from 'react';

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  description: string;
  baselineValue: number;
  onChange: (val: number) => void;
}

export const ScenarioParameterControl: React.FC<Props> = ({
  label,
  value,
  min,
  max,
  step,
  unit,
  description,
  baselineValue,
  onChange,
}) => {
  const isChangedFromBaseline = value !== baselineValue;

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3 font-mono hover:border-white/20 transition-all">
      <div className="flex items-center justify-between text-xs">
        <div>
          <span className="font-bold text-white tracking-wide uppercase text-xs block font-din">
            {label}
          </span>
          <p className="text-[11px] text-white/50 mt-0.5 font-sans leading-relaxed">{description}</p>
        </div>
        <div className="text-right shrink-0 ml-4">
          <span className="font-bold text-base text-cyan tabular-nums tracking-wider font-mono">
            {value} {unit}
          </span>
          {isChangedFromBaseline && (
            <span className="block text-[9px] text-amber uppercase font-semibold mt-0.5 bg-amber/10 border border-amber/30 px-1.5 py-0.2 rounded">
              BASE: {baselineValue} {unit}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2.5 rounded-full bg-white/[0.08] appearance-none cursor-pointer accent-cyan border border-white/10"
        />
      </div>

      <div className="flex justify-between text-[10px] text-white/40 pt-0.5">
        <span>MIN: {min} {unit}</span>
        <span className="text-cyan font-bold tracking-wider">NOMINAL: {baselineValue} {unit}</span>
        <span>MAX: {max} {unit}</span>
      </div>
    </div>
  );
};
