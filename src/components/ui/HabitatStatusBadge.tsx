import React from 'react';
import { HabitatStatus } from '../../types/habitat';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

interface Props {
  status: HabitatStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const HabitatStatusBadge: React.FC<Props> = ({ status, size = 'md' }) => {
  const config = {
    STABLE: {
      label: 'NOMINAL // STABLE',
      color: 'bg-teal-dark text-teal border-teal/40',
      glow: 'shadow-teal-glow',
      dot: 'bg-teal',
      icon: ShieldCheck,
      desc: 'All subsystems within nominal operating margins',
    },
    WARNING: {
      label: 'DEGRADED // WARNING',
      color: 'bg-amber-dark text-amber border-amber/50',
      glow: 'shadow-amber-glow',
      dot: 'bg-amber animate-spacex-pulse',
      icon: AlertTriangle,
      desc: 'Subsystem performance degraded; mitigation engaged',
    },
    CRITICAL: {
      label: 'CRITICAL // FAULT',
      color: 'bg-red-dark text-red border-red/60 animate-spacex-pulse',
      glow: 'shadow-red-glow',
      dot: 'bg-red',
      icon: AlertOctagon,
      desc: 'Active unmitigated resource drain or threshold breached',
    },
  }[status];

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-3 py-1 text-xs gap-2 font-mono font-bold tracking-wider',
    lg: 'px-4 py-1.5 text-sm gap-2 font-mono font-bold tracking-widest',
  }[size];

  return (
    <div
      className={`inline-flex items-center rounded-full border ${config.color} ${config.glow} ${sizeClasses} transition-all duration-300 backdrop-blur-md`}
      title={config.desc}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{config.label}</span>
    </div>
  );
};
