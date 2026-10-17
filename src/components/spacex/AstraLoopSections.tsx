import React from 'react';
import { motion } from 'framer-motion';
import { useSimulation } from '../../store/simulationStore';
import { ScrollIndicator } from './ScrollIndicator';
import {
  Boxes,
  Zap,
  Droplet,
  Wind,
  Sun,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  Activity,
  Layers,
  Cpu,
  Clock,
  Compass,
} from 'lucide-react';

export const AstraLoopSections: React.FC = () => {
  const { navigate, triggerScenarioWithFeedback } = useSimulation();

  return (
    <div className="w-full">
      {/* ============================================================== */}
      {/* SECTION 1: HABITAT ARCHITECTURE // THE DIGITAL TWIN */}
      {/* ============================================================== */}
      <section
        id="habitat"
        className="relative w-full h-screen min-h-[720px] flex items-end overflow-hidden bg-[#050505] select-none border-t border-[#333333]"
      >
        {/* Background Visual: Lunar Surface & Habitat Architecture */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?auto=format&fit=crop&w=2560&q=85"
            alt="Lunar Crater Surface and Terrain"
            className="w-full h-full object-cover object-center filter brightness-[0.70] contrast-[1.15]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-[#050505]/30 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1720px] mx-auto px-6 md:px-16 pb-20 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            <span className="font-din text-xs sm:text-sm font-bold tracking-[0.2em] text-white/80 uppercase block mb-3">
              01 / HABITAT ARCHITECTURE
            </span>

            <h2 className="font-din text-5xl sm:text-7xl md:text-8xl font-extrabold uppercase tracking-[0.04em] text-white leading-[1.02] mb-6">
              ENGINEERED FOR
              <br />
              EXTREME SURVIVAL
            </h2>

            <p className="text-white/80 font-sans text-sm md:text-base max-w-[560px] mb-8 leading-relaxed font-normal">
              Stationed on the illuminated rim of Shackleton Crater at 89.9°S. AstraLoop pairs dual 8.0 kW photovoltaic arrays with a 38.0 kWh lithium-ion storage bank, closed-loop water recovery, and catalytic CO2 scrubbing.
            </p>

            {/* Aerospace Key Specifications Strip (SpaceX vehicle-style) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 py-4 mb-8 border-y border-[#333333] font-mono text-xs max-w-3xl">
              <div>
                <span className="text-[10px] text-white/50 block tracking-widest uppercase">LOCATION</span>
                <span className="text-white font-bold">89.9°S RIM</span>
              </div>
              <div>
                <span className="text-[10px] text-white/50 block tracking-widest uppercase">SURFACE G</span>
                <span className="text-cyan font-bold">0.166 G</span>
              </div>
              <div>
                <span className="text-[10px] text-white/50 block tracking-widest uppercase">SOLAR GEN</span>
                <span className="text-amber font-bold">8.0 kW</span>
              </div>
              <div>
                <span className="text-[10px] text-white/50 block tracking-widest uppercase">STORAGE</span>
                <span className="text-white font-bold">38.0 kWh</span>
              </div>
              <div>
                <span className="text-[10px] text-white/50 block tracking-widest uppercase">WATER LOOP</span>
                <span className="text-teal font-bold">640 L</span>
              </div>
              <div>
                <span className="text-[10px] text-white/50 block tracking-widest uppercase">POWER BUS</span>
                <span className="text-white font-bold">120V DC</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('digital-twin-3d')}
                className="px-8 py-4 bg-white hover:bg-cyan text-black font-din font-bold text-xs uppercase tracking-[0.18em] transition-all duration-300 flex items-center gap-2.5 cursor-pointer sharp-brutalist shadow-xl group"
                style={{ borderRadius: '0px' }}
              >
                <span>INSPECT HABITAT 3D</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        </div>

        <ScrollIndicator targetId="simulation" />
      </section>

      {/* ============================================================== */}
      {/* SECTION 2: SIMULATION ENGINE // FAULT INJECTION */}
      {/* ============================================================== */}
      <section
        id="simulation"
        className="relative w-full h-screen min-h-[720px] flex items-end overflow-hidden bg-[#050505] select-none border-t border-[#333333]"
      >
        {/* Background Visual: Deep Space Micrometeorite / Solar Array */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2560&q=85"
            alt="Deep Space Orbital Telemetry"
            className="w-full h-full object-cover object-center filter brightness-[0.62] contrast-[1.20]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-[#050505]/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1720px] mx-auto px-6 md:px-16 pb-20 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            <span className="font-din text-xs sm:text-sm font-bold tracking-[0.2em] text-white/80 uppercase block mb-3">
              02 / SIMULATION ENGINE
            </span>

            <h2 className="font-din text-5xl sm:text-7xl md:text-8xl font-extrabold uppercase tracking-[0.04em] text-white leading-[1.02] mb-6">
              PREDICTING SYSTEM CASCADES
              <br />
              IN REAL TIME
            </h2>

            <p className="text-white/80 font-sans text-sm md:text-base max-w-[560px] mb-8 leading-relaxed font-normal">
              When micrometeorite dust cuts solar generation from 8.0 kW to 3.0 kW, battery reserves deplete toward the 18.0 kWh safety floor in exactly 4.0 hours. Transparent physical equations forecast every threshold before failure occurs.
            </p>

            {/* 3 Interactive Failure Scenario Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 max-w-3xl font-mono">
              <div
                onClick={() => {
                  triggerScenarioWithFeedback('solar-drop');
                  navigate('digital-twin-3d');
                }}
                className="p-3 border border-[#333333] hover:border-red bg-black/60 hover:bg-red/10 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-[10px] text-amber mb-1">
                  <span>SCENARIO A</span>
                  <Sun className="w-3.5 h-3.5" />
                </div>
                <div className="text-sm font-bold text-white uppercase group-hover:text-red transition-colors">
                  SOLAR OUTPUT DROP
                </div>
                <div className="text-[11px] text-white/70 mt-1">
                  8.0 kW → 3.0 kW (-5 kW drain)
                </div>
                <div className="text-[10px] text-red mt-1 font-bold">
                  4.0h RUNWAY TO 18 kWh FLOOR
                </div>
              </div>

              <div
                onClick={() => {
                  triggerScenarioWithFeedback('water-recovery-fault');
                  navigate('digital-twin-3d');
                }}
                className="p-3 border border-[#333333] hover:border-teal bg-black/60 hover:bg-teal/10 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-[10px] text-teal mb-1">
                  <span>SCENARIO B</span>
                  <Droplet className="w-3.5 h-3.5" />
                </div>
                <div className="text-sm font-bold text-white uppercase group-hover:text-teal transition-colors">
                  WATER RECOVERY FAULT
                </div>
                <div className="text-[11px] text-white/70 mt-1">
                  Distillation Loop Stall (-25 L/day)
                </div>
                <div className="text-[10px] text-teal mt-1 font-bold">
                  12.0 DAYS TO 340 L FLOOR
                </div>
              </div>

              <div
                onClick={() => {
                  triggerScenarioWithFeedback('air-filter-fault');
                  navigate('digital-twin-3d');
                }}
                className="p-3 border border-[#333333] hover:border-cyan bg-black/60 hover:bg-cyan/10 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-[10px] text-cyan mb-1">
                  <span>SCENARIO C</span>
                  <Wind className="w-3.5 h-3.5" />
                </div>
                <div className="text-sm font-bold text-white uppercase group-hover:text-cyan transition-colors">
                  AIR-FILTER FAULT
                </div>
                <div className="text-[11px] text-white/70 mt-1">
                  Sorbent Bed Fouling (-1.6%/hr)
                </div>
                <div className="text-[10px] text-cyan mt-1 font-bold">
                  25.0h TO 42% THRESHOLD
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('digital-twin-3d')}
                className="px-8 py-4 bg-white hover:bg-cyan text-black font-din font-bold text-xs uppercase tracking-[0.18em] transition-all duration-300 flex items-center gap-2.5 cursor-pointer sharp-brutalist shadow-xl group"
                style={{ borderRadius: '0px' }}
              >
                <span>ENTER SIMULATION ARENA</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        </div>

        <ScrollIndicator targetId="recovery-plans" />
      </section>

      {/* ============================================================== */}
      {/* SECTION 3: CONTINGENCY RECOVERY PROTOCOLS */}
      {/* ============================================================== */}
      <section
        id="recovery-plans"
        className="relative w-full h-screen min-h-[720px] flex items-end overflow-hidden bg-[#050505] select-none border-t border-[#333333]"
      >
        {/* Background Visual: Advanced Crew & Control Deck */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=2560&q=85"
            alt="Deep Space Celestial Horizon"
            className="w-full h-full object-cover object-center filter brightness-[0.65] contrast-[1.18]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-[#050505]/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1720px] mx-auto px-6 md:px-16 pb-20 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            <span className="font-din text-xs sm:text-sm font-bold tracking-[0.2em] text-white/80 uppercase block mb-3">
              03 / CONTINGENCY PROTOCOLS
            </span>

            <h2 className="font-din text-5xl sm:text-7xl md:text-8xl font-extrabold uppercase tracking-[0.04em] text-white leading-[1.02] mb-6">
              BALANCING LIFE SUPPORT
              <br />
              AND SCIENCE
            </h2>

            <p className="text-white/80 font-sans text-sm md:text-base max-w-[560px] mb-8 leading-relaxed font-normal">
              In a power deficit, automated shedding preserves life-support. Plan A pauses research (-3.0 kW, 10.0h). Plan B defers exterior payloads (-1.5 kW, 5.7h). Plan C sheds loads and throttles water recovery (-3.5 kW), tripling battery runway to 13.3 hours.
            </p>

            {/* Protocol Comparison Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 max-w-3xl font-mono text-xs">
              <div className="p-3 border border-[#333333] bg-black/60">
                <span className="text-[10px] text-white/50 block uppercase">PLAN A // STANDARD</span>
                <div className="text-white font-bold text-sm mt-0.5">SHED NON-ESSENTIAL</div>
                <div className="text-teal mt-1 font-bold">-3.0 kW DEMAND</div>
                <div className="text-white/70 text-[10px] mt-1">10.0h Battery Runway</div>
              </div>

              <div className="p-3 border border-[#333333] bg-black/60">
                <span className="text-[10px] text-white/50 block uppercase">PLAN B // MINIMAL</span>
                <div className="text-white font-bold text-sm mt-0.5">DELAY EXPERIMENTS</div>
                <div className="text-amber mt-1 font-bold">-1.5 kW DEMAND</div>
                <div className="text-white/70 text-[10px] mt-1">5.7h Battery Runway</div>
              </div>

              <div className="p-3 border border-cyan/50 bg-cyan/10">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-cyan uppercase font-bold">PLAN C // RECOMMENDED</span>
                  <span className="bg-cyan text-black px-1 font-bold text-[9px]">BEST</span>
                </div>
                <div className="text-white font-bold text-sm mt-0.5">SHED & THROTTLE WRS</div>
                <div className="text-cyan mt-1 font-bold">-3.5 kW DEMAND</div>
                <div className="text-white text-[10px] mt-1 font-bold">13.3h Battery Runway</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('recovery-plans')}
                className="px-8 py-4 bg-white hover:bg-cyan text-black font-din font-bold text-xs uppercase tracking-[0.18em] transition-all duration-300 flex items-center gap-2.5 cursor-pointer sharp-brutalist shadow-xl group"
                style={{ borderRadius: '0px' }}
              >
                <span>COMPARE RECOVERY MATRIX</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        </div>

        <ScrollIndicator targetId="mission-data" />
      </section>

      {/* ============================================================== */}
      {/* SECTION 4: MISSION DATA // DETERMINISTIC PHYSICS */}
      {/* ============================================================== */}
      <section
        id="mission-data"
        className="relative w-full h-screen min-h-[720px] flex items-end overflow-hidden bg-[#050505] select-none border-t border-[#333333]"
      >
        {/* Background Visual: Earth Orbit & Horizon */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=2560&q=85"
            alt="Orbital Earth Horizon"
            className="w-full h-full object-cover object-center filter brightness-[0.62] contrast-[1.18]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-[#050505]/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1720px] mx-auto px-6 md:px-16 pb-20 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            <span className="font-din text-xs sm:text-sm font-bold tracking-[0.2em] text-white/80 uppercase block mb-3">
              04 / MISSION DATA & VERIFICATION
            </span>

            <h2 className="font-din text-5xl sm:text-7xl md:text-8xl font-extrabold uppercase tracking-[0.04em] text-white leading-[1.02] mb-6">
              NO BLACK-BOX AI.
              <br />
              EXPLAINABLE SCIENCE.
            </h2>

            <p className="text-white/80 font-sans text-sm md:text-base max-w-[560px] mb-8 leading-relaxed font-normal">
              All predictions stem from verifiable first-principles conservation equations. In a high-stakes off-world habitat, mission commanders require transparent math, clear threshold margins, and an auditable telemetry ledger.
            </p>

            {/* Scientific Formulas Callout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 max-w-3xl font-mono text-xs">
              <div className="p-3 border border-[#333333] bg-black/70">
                <span className="text-[10px] text-cyan block uppercase mb-1">EQUATION 01 // NET DRAIN</span>
                <code className="text-white text-xs block font-bold">
                  P_drain = max(0, P_demand - P_solar)
                </code>
                <span className="text-white/50 text-[10px] mt-1 block">
                  Deterministic bus balance: 8.0 kW - 3.0 kW = 5.0 kW drain
                </span>
              </div>

              <div className="p-3 border border-[#333333] bg-black/70">
                <span className="text-[10px] text-cyan block uppercase mb-1">EQUATION 02 // USABLE RUNWAY</span>
                <code className="text-white text-xs block font-bold">
                  t_runway = (E_current - 18.0 kWh) / P_drain
                </code>
                <span className="text-white/50 text-[10px] mt-1 block">
                  Dynamic evaluation from current remaining stored energy
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('model-assumptions')}
                className="px-8 py-4 bg-white hover:bg-cyan text-black font-din font-bold text-xs uppercase tracking-[0.18em] transition-all duration-300 flex items-center gap-2.5 cursor-pointer sharp-brutalist shadow-xl group"
                style={{ borderRadius: '0px' }}
              >
                <span>EXPLORE MODEL ASSUMPTIONS</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => navigate('history')}
                className="px-8 py-4 border border-white/50 hover:border-white bg-transparent hover:bg-white/10 text-white font-din font-bold text-xs uppercase tracking-[0.18em] transition-all duration-300 flex items-center gap-2 cursor-pointer sharp-brutalist"
                style={{ borderRadius: '0px' }}
              >
                <span>INSPECT AUDIT LOG</span>
                <Clock className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>

        <ScrollIndicator targetId="launch" />
      </section>

      {/* ============================================================== */}
      {/* SECTION 5: FINAL LAUNCHPAD // FLIGHT READINESS */}
      {/* ============================================================== */}
      <section
        id="launch"
        className="relative w-full h-screen min-h-[720px] flex items-end overflow-hidden bg-[#050505] select-none border-t border-[#333333]"
      >
        {/* Background Visual: Lunar South Pole Horizon & Stars */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=2560&q=85"
            alt="Deep Space Celestial Horizon"
            className="w-full h-full object-cover object-center filter brightness-[0.60] contrast-[1.25]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/95 via-[#050505]/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1720px] mx-auto px-6 md:px-16 pb-20 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            <span className="font-din text-xs sm:text-sm font-bold tracking-[0.2em] text-white/80 uppercase block mb-3">
              SPACE & BEYOND IDEATHON 2026 // FLIGHT READINESS
            </span>

            <h2 className="font-din text-5xl sm:text-7xl md:text-8xl font-extrabold uppercase tracking-[0.04em] text-white leading-[1.02] mb-6">
              TAKE COMMAND OF
              <br />
              THE DIGITAL TWIN
            </h2>

            <p className="text-white/80 font-sans text-sm md:text-base max-w-[560px] mb-8 leading-relaxed font-normal">
              Experience the live interactive 3D lunar habitat. Inject micrometeorite faults, step the simulation clock from 1x to 60x, observe real-time telemetry, and safeguard the crew.
            </p>

            {/* Launch Action */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('digital-twin-3d')}
                className="px-10 py-5 bg-white hover:bg-cyan text-black font-din font-bold text-sm uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-3 cursor-pointer sharp-brutalist shadow-2xl group"
                style={{ borderRadius: '0px' }}
              >
                <span>ENTER SIMULATION ARENA</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
              </button>

              <button
                onClick={() => navigate('overview')}
                className="px-8 py-5 border border-white/50 hover:border-white bg-transparent hover:bg-white/10 text-white font-din font-bold text-xs uppercase tracking-[0.18em] transition-all duration-300 flex items-center gap-2 cursor-pointer sharp-brutalist"
                style={{ borderRadius: '0px' }}
              >
                <span>OPEN AVIONICS CONSOLE</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
