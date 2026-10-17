import React from 'react';
import { useSimulation } from '../../store/simulationStore';
import { AlertEvent } from '../../types/habitat';
import { Terminal, ShieldAlert, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export const AlertPanel: React.FC = () => {
  const { state } = useSimulation();

  const getEventIcon = (type: AlertEvent['type']) => {
    switch (type) {
      case 'critical':
        return <ShieldAlert className="w-3.5 h-3.5 text-red shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber shrink-0" />;
      case 'success':
        return <CheckCircle2 className="w-3.5 h-3.5 text-teal shrink-0" />;
      case 'info':
      default:
        return <Info className="w-3.5 h-3.5 text-cyan shrink-0" />;
    }
  };

  return (
    <div className="hud-panel rounded-2xl p-5 lg:p-6 border border-white/10 shadow-2xl flex flex-col h-full font-mono">
      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-white">
            AVIONICS EVENT & ALARM LOG
          </h2>
        </div>
        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan/10 text-cyan border border-cyan/30 font-bold">
          {state.events.length} ENTRIES
        </span>
      </div>

      {/* Scrollable Event List */}
      <div className="space-y-2.5 overflow-y-auto max-h-72 pr-1 text-xs">
        {state.events.map((evt) => (
          <div
            key={evt.id}
            className="p-3 rounded-xl bg-white/[0.02] border border-white/10 hover:border-cyan/40 hover:bg-white/[0.05] transition-all duration-200 flex items-start gap-2.5"
          >
            <div className="mt-0.5">{getEventIcon(evt.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] font-bold text-cyan uppercase tracking-wide truncate">
                  [{evt.source}]
                </span>
                <span className="text-[10px] text-text-muted shrink-0 tabular-nums">
                  {evt.formattedTime}
                </span>
              </div>
              <p className="text-[11px] text-text-secondary leading-relaxed break-words font-sans">
                {evt.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
