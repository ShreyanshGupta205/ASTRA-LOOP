import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Rocket, ShieldCheck, Clock } from 'lucide-react';

interface MissionScheduleItem {
  id: string;
  name: string;
  vehicle: string;
  site: string;
  windowUTC: string;
  countdown: string;
  status: 'GO FOR LAUNCH' | 'ON SCHEDULE' | 'AVIONICS ACTIVE' | 'TRAINING';
  statusColor: string;
}

const UPCOMING_MISSIONS: MissionScheduleItem[] = [
  {
    id: 'm-1',
    name: 'BANDWAGON-5 MISSION',
    vehicle: 'FALCON 9',
    site: 'SLC-40, CAPE CANAVERAL',
    windowUTC: '2026-10-18 // 19:42:00 UTC',
    countdown: 'T-01d 20h 10m',
    status: 'GO FOR LAUNCH',
    statusColor: '#00FF88',
  },
  {
    id: 'm-2',
    name: 'STARLINK MISSION 12-4',
    vehicle: 'FALCON 9',
    site: 'LC-39A, KENNEDY SPACE CENTER',
    windowUTC: '2026-10-21 // 04:15:30 UTC',
    countdown: 'T-04d 04h 44m',
    status: 'ON SCHEDULE',
    statusColor: '#FFFFFF',
  },
  {
    id: 'm-3',
    name: 'LUNAR HABITAT RESUPPLY (ASTRA-1)',
    vehicle: 'STARSHIP V3',
    site: 'STARBASE, BOCA CHICA, TX',
    windowUTC: '2026-10-24 // 11:00:00 UTC',
    countdown: 'T-07d 11h 28m',
    status: 'AVIONICS ACTIVE',
    statusColor: '#00E5FF',
  },
  {
    id: 'm-4',
    name: 'CREW-12 ASTRONAUT FLIGHT',
    vehicle: 'DRAGON // FALCON 9',
    site: 'LC-39A, KENNEDY SPACE CENTER',
    windowUTC: '2026-11-02 // 08:30:00 UTC',
    countdown: 'T-16d 08h 58m',
    status: 'TRAINING',
    statusColor: '#FF9900',
  },
];

export const MissionTelemetryStrip: React.FC = () => {
  return (
    <section id="schedule" className="relative bg-black py-20 px-6 md:px-12 border-t border-b border-white/15">
      <div className="max-w-[1720px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-white/50 font-din font-bold block mb-1">
              ORBITAL FLIGHT MANIFEST
            </span>
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-[0.05em] text-white font-din leading-[1.05]">
              UPCOMING LAUNCHES TELEMETRY
            </h2>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-white/60">
            <span className="w-2 h-2 bg-[#00FF88] animate-pulse" />
            <span>GLOBAL LAUNCH RANGE: ACTIVE</span>
          </div>
        </div>

        {/* Telemetry Grid with sharp 1px solid rgba(255,255,255,0.15) borders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-white/15">
          {UPCOMING_MISSIONS.map((mission, idx) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="group p-6 border-r border-b border-white/15 bg-black hover:bg-white/[0.03] transition-colors relative"
              style={{ borderRadius: '0px' }}
            >
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className="text-[10px] font-mono uppercase px-2 py-0.5 border tracking-wider font-semibold"
                  style={{
                    color: mission.statusColor,
                    borderColor: `${mission.statusColor}40`,
                    backgroundColor: `${mission.statusColor}10`,
                    borderRadius: '0px',
                  }}
                >
                  {mission.status}
                </span>
                <span className="text-[11px] font-mono text-white/50 tabular-nums">
                  {mission.countdown}
                </span>
              </div>

              {/* Mission Name */}
              <h3 className="font-din text-xl md:text-2xl font-bold uppercase text-white mb-3 tracking-[0.05em] leading-[1.1] group-hover:text-white transition-colors">
                {mission.name}
              </h3>

              {/* Vehicle & Site Meta */}
              <div className="space-y-2 pt-2 border-t border-white/10 font-mono text-xs text-white/70">
                <div className="flex items-center gap-2">
                  <Rocket className="w-3.5 h-3.5 text-white/40 shrink-0" />
                  <span className="truncate">{mission.vehicle}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-white/40 shrink-0" />
                  <span className="truncate text-[11px]">{mission.site}</span>
                </div>
                <div className="flex items-center gap-2 text-white/50 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-white/40 shrink-0" />
                  <span className="truncate">{mission.windowUTC}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
