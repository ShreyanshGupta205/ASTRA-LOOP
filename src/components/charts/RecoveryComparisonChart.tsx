import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { CalculatedPlanOutcome } from '../../types/habitat';
import { BarChart3 } from 'lucide-react';

interface Props {
  faultedRunway: number;
  planOutcomes: CalculatedPlanOutcome[];
  runwayUnit: 'hours' | 'days';
  selectedPlanId: string | null;
  onSelectPlan: (planId: string) => void;
}

interface CustomBarTooltipProps {
  active?: boolean;
  payload?: any[];
  runwayUnit: 'hours' | 'days';
  faultedRunway: number;
}

const CustomBarTooltip: React.FC<CustomBarTooltipProps> = ({ active, payload, runwayUnit, faultedRunway }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-[#080808] border border-[#333333] p-3.5 sharp-brutalist shadow-2xl font-mono text-xs space-y-1.5">
        <div className="font-bold text-white flex items-center gap-2 border-b border-[#222222] pb-1.5 font-din uppercase tracking-wider">
          <span className="w-2 h-2" style={{ backgroundColor: item.color }} />
          <span>{item.fullName || item.name}</span>
        </div>
        <div className="text-white/60">
          RUNWAY:{' '}
          <strong className="text-white tabular-nums text-sm font-bold font-din">
            {item.runway.toFixed(1)} {runwayUnit.toUpperCase()}
          </strong>
        </div>
        {!item.isFaulted && (
          <div className="text-teal font-bold text-[11px] font-din tracking-wide">
            +{(item.runway - faultedRunway).toFixed(1)} {runwayUnit.toUpperCase()} DELTA
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const RecoveryComparisonChart: React.FC<Props> = ({
  faultedRunway,
  planOutcomes,
  runwayUnit,
  selectedPlanId,
  onSelectPlan,
}) => {
  const data = [
    {
      id: 'faulted',
      name: 'FAULT BASE',
      runway: faultedRunway,
      isFaulted: true,
      color: '#FF2A4D',
    },
    ...planOutcomes.map((outcome) => ({
      id: outcome.plan.id,
      name: outcome.plan.name.split('—')[0].trim().toUpperCase(),
      fullName: outcome.plan.name,
      runway: outcome.predictedRunway,
      isFaulted: false,
      color: outcome.isRecommended ? '#00FF88' : '#00E5FF',
    })),
  ];

  return (
    <div className="bg-[#080808] border border-[#333333] p-5 lg:p-6 sharp-brutalist shadow-2xl flex flex-col justify-between font-mono">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#222222]">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan" />
            <h3 className="text-xs sm:text-sm font-extrabold font-din uppercase tracking-[0.14em] text-white">
              CONTINGENCY RUNWAY TRADE STUDY
            </h3>
          </div>
          <p className="text-[11px] text-white/50 mt-0.5">
            Calculated survivability runway comparison across alternative mitigation plans
          </p>
        </div>
        <span className="text-[10px] font-bold text-cyan uppercase tracking-widest px-3 py-1 bg-[#050505] border border-[#333333] sharp-brutalist">
          UNIT: {runwayUnit.toUpperCase()}
        </span>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 2" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#7A8C9E"
              fontSize={10}
              tickLine={false}
              tick={{ fill: '#7A8C9E', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            />
            <YAxis
              stroke="#7A8C9E"
              fontSize={10}
              tickLine={false}
              unit={` ${runwayUnit === 'hours' ? 'h' : 'd'}`}
              tick={{ fill: '#7A8C9E', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            />
            <Tooltip content={<CustomBarTooltip runwayUnit={runwayUnit} faultedRunway={faultedRunway} />} />

            {/* Baseline threshold reference */}
            <ReferenceLine
              y={faultedRunway}
              stroke="#FF2A4D"
              strokeDasharray="3 3"
              label={{
                value: `FAULT: ${faultedRunway.toFixed(1)}${runwayUnit === 'hours' ? 'h' : 'd'}`,
                position: 'insideTopRight',
                fill: '#FF2A4D',
                fontSize: 10,
                fontFamily: 'JetBrains Mono',
              }}
            />

            <Bar
              dataKey="runway"
              radius={[0, 0, 0, 0]}
              onClick={(entry: any) => {
                const targetId = entry?.id || entry?.payload?.id;
                const isFaulted = entry?.isFaulted || entry?.payload?.isFaulted;
                if (!isFaulted && targetId && typeof targetId === 'string') {
                  onSelectPlan(targetId);
                }
              }}
              cursor="pointer"
            >
              {data.map((entry) => (
                <Cell
                  key={`cell-${entry.id}`}
                  fill={entry.color}
                  stroke={entry.id === selectedPlanId ? '#FFFFFF' : 'transparent'}
                  strokeWidth={2}
                  opacity={entry.id === selectedPlanId || entry.isFaulted ? 1 : 0.75}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-[#222222] flex items-center justify-between text-[10px] text-white/50">
        <span>CLICK PROTOCOL BAR TO PREVIEW TRAJECTORY</span>
        <span className="text-teal font-bold uppercase tracking-wider font-din">LONGER VECTOR = SUPERIOR ENDURANCE</span>
      </div>
    </div>
  );
};
