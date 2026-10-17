import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { ForecastPoint } from '../../types/habitat';
import { HABITAT_THRESHOLDS } from '../../data/initialState';
import { useSimulation } from '../../store/simulationStore';
import { Activity } from 'lucide-react';

interface Props {
  forecastPoints: ForecastPoint[];
  resource: 'battery' | 'water' | 'oxygen';
  onResourceChange: (res: 'battery' | 'water' | 'oxygen') => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  unit: string;
  threshold: number;
}

const CustomForecastTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, unit, threshold }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#080808] border border-[#333333] p-3.5 sharp-brutalist shadow-2xl font-mono text-xs space-y-1.5 min-w-48">
        <div className="font-bold text-white border-b border-[#222222] pb-1 flex justify-between tracking-wider">
          <span className="text-cyan font-din uppercase">{label}</span>
          <span className="text-[9px] text-text-muted">PREDICTIVE HUD</span>
        </div>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
              <span className="w-1.5 h-1.5" style={{ backgroundColor: entry.color }} />
              <span className="text-text-muted text-[10px] uppercase font-din">{entry.name}:</span>
            </span>
            <span className="font-bold text-white tabular-nums">
              {entry.value} {unit}
            </span>
          </div>
        ))}
        <div className="pt-1 border-t border-[#222222] text-[10px] text-red flex justify-between">
          <span className="font-din uppercase font-bold">FLOOR LIMIT:</span>
          <span className="font-bold">{threshold} {unit}</span>
        </div>
      </div>
    );
  }
  return null;
};

export const ResourceForecastChart: React.FC<Props> = ({
  forecastPoints,
  resource,
  onResourceChange,
}) => {
  const { state } = useSimulation();

  const configs = {
    battery: {
      name: 'BATTERY STORAGE TRAJECTORY',
      unit: 'kWh',
      yDomain: [0, 50],
      threshold: HABITAT_THRESHOLDS.batteryFloorKWh, // 18
      thresholdLabel: 'SAFETY FLOOR: 18 kWh',
      baselineLabel: 'NOMINAL BASELINE (38 kWh)',
      faultedLabel: 'ACTIVE FAULT DEPLETION',
      recoveryLabel: state.habitat.appliedPlanId ? 'APPLIED PROTOCOL RECOVERY' : 'CONTINGENCY PROJECTION',
    },
    water: {
      name: 'POTABLE WATER STORAGE TRAJECTORY',
      unit: 'L',
      yDomain: [200, 700],
      threshold: HABITAT_THRESHOLDS.waterFloorLitres, // 340
      thresholdLabel: 'SAFETY FLOOR: 340 L',
      baselineLabel: 'NOMINAL BASELINE (640 L)',
      faultedLabel: 'UNCOMPENSATED LOSS (-25 L/d)',
      recoveryLabel: state.habitat.appliedPlanId ? 'APPLIED PROTOCOL RECOVERY' : 'CONTINGENCY PROJECTION',
    },
    oxygen: {
      name: 'OXYGEN MARGIN TRAJECTORY',
      unit: '%',
      yDomain: [0, 100],
      threshold: HABITAT_THRESHOLDS.oxygenThresholdPct, // 42
      thresholdLabel: 'SAFETY THRESHOLD: 42%',
      baselineLabel: 'NOMINAL REFERENCE (82%)',
      faultedLabel: 'ACTIVE FAULT DECLINE (-1.6%/h)',
      recoveryLabel: state.habitat.appliedPlanId ? 'APPLIED PROTOCOL RECOVERY' : 'CONTINGENCY PROJECTION',
    },
  }[resource];

  const hasRecoveryCurve = forecastPoints.some((p) => p.recoveryValue !== undefined);

  return (
    <div className="bg-[#080808] border border-[#333333] p-4 lg:p-6 sharp-brutalist flex flex-col justify-between">
      {/* Header with SpaceX Switcher Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#222222]">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan" />
            <h2 className="text-xs sm:text-sm font-extrabold font-din tracking-[0.14em] uppercase text-white">
              {configs.name}
            </h2>
          </div>
          <p className="text-[11px] font-mono text-white/50 mt-0.5">
            Real-time deterministic simulation curve modeling flight threshold runway
          </p>
        </div>

        {/* Telemetry Switcher Buttons */}
        <div className="flex items-center bg-[#050505] p-1 border border-[#333333] text-xs shrink-0 font-mono sharp-brutalist">
          {(['battery', 'water', 'oxygen'] as const).map((r) => (
            <button
              key={r}
              onClick={() => onResourceChange(r)}
              className={`px-3.5 py-1.5 text-xs font-din font-bold uppercase tracking-[0.14em] transition-all cursor-pointer sharp-brutalist ${
                resource === r
                  ? 'bg-cyan text-black shadow-cyan-glow'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full font-mono">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={forecastPoints} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 2" stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis
              dataKey="timeLabel"
              stroke="#7A8C9E"
              fontSize={10}
              tickLine={false}
              tick={{ fill: '#7A8C9E', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            />
            <YAxis
              domain={configs.yDomain}
              stroke="#7A8C9E"
              fontSize={10}
              tickLine={false}
              unit={` ${configs.unit}`}
              tick={{ fill: '#7A8C9E', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            />
            <Tooltip content={<CustomForecastTooltip unit={configs.unit} threshold={configs.threshold} />} />
            <Legend
              wrapperStyle={{ paddingTop: '8px', fontSize: '10px', fontFamily: 'JetBrains Mono' }}
              iconType="plainline"
            />

            {/* Threshold Floor Reference Line */}
            <ReferenceLine
              y={configs.threshold}
              stroke="#FF2A4D"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: configs.thresholdLabel,
                position: 'insideBottomRight',
                fill: '#FF2A4D',
                fontSize: 10,
                fontWeight: 700,
                fontFamily: 'JetBrains Mono',
              }}
            />

            {/* Baseline constant/normal curve */}
            <Line
              type="monotone"
              dataKey="baselineValue"
              name={configs.baselineLabel}
              stroke="#00FF88"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              dot={false}
            />

            {/* Faulted depletion curve */}
            <Line
              type="monotone"
              dataKey="faultedValue"
              name={configs.faultedLabel}
              stroke="#FF2A4D"
              strokeWidth={2}
              dot={{ r: 2, fill: '#FF2A4D' }}
              activeDot={{ r: 5 }}
            />

            {/* Recovery mitigation curve if plan previewed or applied */}
            {hasRecoveryCurve && (
              <Line
                type="monotone"
                dataKey="recoveryValue"
                name={configs.recoveryLabel}
                stroke="#00E5FF"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#00E5FF' }}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Context */}
      <div className="mt-3 pt-3 border-t border-border/50 flex flex-wrap items-center justify-between text-[10px] text-text-muted gap-2 font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan inline-block animate-spacex-pulse" />
          <span>T+0H INDICATES CURRENT SIMULATED FLIGHT TELEMETRY STATE</span>
        </span>
        <span className="text-text-muted/80">
          CH-01 • FLOOR LIMIT: {configs.threshold} {configs.unit}
        </span>
      </div>
    </div>
  );
};
