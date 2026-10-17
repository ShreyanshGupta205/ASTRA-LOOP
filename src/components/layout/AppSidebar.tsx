import React from 'react';
import { NavPage } from '../../types/habitat';
import { useSimulation } from '../../store/simulationStore';
import {
  LayoutDashboard,
  Boxes,
  FlaskConical,
  LifeBuoy,
  History,
  BookOpen,
  ChevronRight,
  Radio,
  Cpu,
  Compass,
} from 'lucide-react';

interface NavItem {
  id: NavPage;
  code: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  badge?: string;
}

export const AppSidebar: React.FC = () => {
  const { state, navigate } = useSimulation();

  const navItems: NavItem[] = [
    {
      id: 'spacex-portal',
      code: '00',
      label: 'MISSION VISION',
      sublabel: 'Cinematic Aerospace Portal',
      icon: Compass,
      badge: 'HOME',
    },
    {
      id: 'overview',
      code: '01',
      label: 'OVERVIEW',
      sublabel: 'Flight Avionics Console',
      icon: LayoutDashboard,
    },
    {
      id: 'digital-twin-3d',
      code: '02',
      label: 'SIMULATION ARENA',
      sublabel: 'Habitat Digital Twin (3D Engine)',
      icon: Boxes,
      badge: '3D LIVE',
    },
    {
      id: 'scenario-lab',
      code: '03',
      label: 'SCENARIO LAB',
      sublabel: 'Anomaly Injection Terminal',
      icon: FlaskConical,
      badge: state.activeScenario ? 'FAULT' : undefined,
    },
    {
      id: 'recovery-plans',
      code: '04',
      label: 'RECOVERY PLANS',
      sublabel: 'Contingency Protocol Matrix',
      icon: LifeBuoy,
      badge: state.habitat.appliedPlanId ? 'DEPLOYED' : (state.simulationResult ? '3 READY' : undefined),
    },
    {
      id: 'history',
      code: '05',
      label: 'SIM HISTORY',
      sublabel: 'Telemetry Audit Log',
      icon: History,
      badge: state.history.length > 0 ? `${state.history.length}` : undefined,
    },
    {
      id: 'model-assumptions',
      code: '06',
      label: 'MODEL & RULES',
      sublabel: 'Deterministic Engine Specs',
      icon: BookOpen,
    },
  ];

  return (
    <aside className="w-full lg:w-64 bg-bg-secondary border-r border-border flex flex-col justify-between shrink-0 font-sans">
      <div className="p-3 lg:p-4 space-y-2">
        <div className="px-3 py-1.5 text-[10px] font-mono tracking-widest text-text-muted uppercase flex items-center justify-between border-b border-border/40 pb-2">
          <span>FLIGHT SYSTEMS</span>
          <span className="text-cyan font-bold">AV-26</span>
        </div>

        <nav className="space-y-1" aria-label="Flight Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = state.currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-left transition-all group cursor-pointer relative ${
                  isActive
                    ? 'bg-bg-panel border border-cyan/40 text-white shadow-cyan-glow/20'
                    : 'text-text-muted hover:text-white hover:bg-bg-panel/70 border border-transparent'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Active Left Indicator Bar */}
                {isActive && (
                  <div className="absolute left-0 top-1 bottom-1 w-1 bg-cyan rounded-r shadow-cyan-glow" />
                )}

                <div className="flex items-center gap-3 min-w-0 pl-1">
                  <span className="text-[10px] font-mono font-bold text-text-muted/70 group-hover:text-cyan transition-colors">
                    [{item.code}]
                  </span>
                  <div className="truncate">
                    <div className="text-xs font-bold font-mono tracking-wider leading-tight truncate">
                      {item.label}
                    </div>
                    <div className="text-[10px] text-text-muted/70 truncate hidden sm:block">
                      {item.sublabel}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                        item.badge === 'FAULT'
                          ? 'bg-red-dark text-red border border-red/40 animate-pulse'
                          : item.badge === 'DEPLOYED'
                          ? 'bg-teal-dark text-teal border border-teal/40'
                          : 'bg-bg-elevated text-cyan border border-border'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-3.5 h-3.5 opacity-30 group-hover:opacity-100 transition-opacity ${
                      isActive ? 'opacity-100 text-cyan' : ''
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* SpaceX Flight Operations Console Footer */}
      <div className="p-3 lg:p-4 border-t border-border bg-bg-panel/40 font-mono text-[11px]">
        <div className="p-3 rounded bg-bg-panel border border-border/80 relative">
          <div className="flex items-center justify-between text-text-main mb-1">
            <span className="font-bold tracking-wider text-xs flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan" />
              TEAM HACKDEVS
            </span>
            <span className="text-[9px] text-teal">ONLINE</span>
          </div>
          <p className="text-[10px] text-text-muted tracking-tight">
            Space & Beyond Ideathon 2026
          </p>
          <div className="mt-2 pt-2 border-t border-border/40 text-[10px] text-text-secondary flex flex-col gap-0.5">
            <span>• Shreyansh Gupta (Lead)</span>
            <span>• Uttkarsh Patel (Sim Eng)</span>
            <span>• Akshita Garg (ECLSS)</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
