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
    <div className="p-4 bg-black/60 border border-[#282828] space-y-3 font-mono">
      <div className="flex items-center justify-between text-xs">
        <div>
          <span className="font-bold text-white tracking-wide uppercase text-[11px] block font-din">
            {label}
          </span>
          <p className="text-[10px] text-white/50 mt-0.5 font-sans">{description}</p>
        </div>
        <div className="text-right shrink-0 ml-3">
          <span className="font-bold text-sm text-cyan tabular-nums tracking-wider">
            {value} {unit}
          </span>
          {isChangedFromBaseline && (
            <span className="block text-[9px] text-amber uppercase font-semibold">
              BASE: {baselineValue} {unit}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-[#222222] appearance-none cursor-pointer accent-cyan"
        />
      </div>

      <div className="flex justify-between text-[9px] text-white/40">
        <span>MIN: {min} {unit}</span>
        <span className="text-cyan font-bold">DEFAULT: {baselineValue} {unit}</span>
        <span>MAX: {max} {unit}</span>
      </div>
    </div>
  );
};
