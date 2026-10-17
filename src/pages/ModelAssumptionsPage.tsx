import React from 'react';
import { useSimulation } from '../store/simulationStore';
import {
  BookOpen,
  AlertTriangle,
  ExternalLink,
  Cpu,
  Layers,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Boxes,
  LayoutDashboard,
} from 'lucide-react';

export const ModelAssumptionsPage: React.FC = () => {
  const { navigate } = useSimulation();

  return (
    <div className="space-y-8 font-sans">
      {/* 0. SpaceX Standardized Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#222222]">
        <div>
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="w-2 h-2 rounded-full bg-cyan animate-pulse shadow-cyan-glow" />
            <span className="font-din text-xs sm:text-sm font-bold tracking-[0.2em] text-white/80 uppercase">
              SPECIFICATIONS // 05 • FIRST-PRINCIPLES MATH // ZERO BLACK-BOX AI
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-[0.04em] text-white font-din flex items-center gap-4">
            <BookOpen className="w-8 h-8 text-cyan shrink-0" />
            MODEL SPECIFICATIONS & ENGINEERING RULES
          </h1>
          <p className="text-xs sm:text-sm text-white/70 max-w-3xl font-sans mt-2 leading-relaxed">
            Deterministic first-principles mathematical formulas, subsystem physical boundaries, and literature citations for technical validation.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('overview')}
            className="px-5 py-3.5 border border-white/40 hover:border-white bg-transparent hover:bg-white/10 text-white font-din font-bold text-xs uppercase tracking-[0.16em] transition-all sharp-brutalist flex items-center gap-2 cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>AVIONICS</span>
          </button>
          <button
            onClick={() => navigate('digital-twin-3d')}
            className="px-6 py-3.5 bg-white hover:bg-cyan text-black font-din font-bold text-xs uppercase tracking-[0.18em] transition-all duration-300 sharp-brutalist shadow-2xl flex items-center gap-2 cursor-pointer group"
          >
            <Boxes className="w-4 h-4" />
            <span>3D SIMULATION ARENA</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Mandatory Ideathon Disclaimer */}
      <div className="p-5 bg-[#0e0a05] border border-amber/50 space-y-2 font-mono sharp-brutalist">
        <div className="flex items-center gap-2 text-amber font-bold text-xs uppercase tracking-[0.18em] font-din">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>MANDATORY PROTOTYPE DISCLOSURE // SPACE & BEYOND IDEATHON</span>
        </div>
        <p className="text-xs text-white/80 leading-relaxed font-sans">
          "AstraLoop is a hackathon decision-support simulation using illustrative values and simplified deterministic rules. It is not a certified life-support controller, does not predict actual mission safety, and must not be used for real crew decisions."
        </p>
      </div>

      {/* Section 1: Purpose & Scope */}
      <div className="p-6 sm:p-8 space-y-4 bg-[#080808] border border-[#333333] sharp-brutalist">
        <h2 className="text-sm sm:text-base font-extrabold text-white uppercase font-din tracking-[0.14em] flex items-center gap-2.5">
          <Cpu className="w-5 h-5 text-cyan" />
          <span>1. PURPOSE & SYSTEM SCOPE</span>
        </h2>
        <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
          In a future permanently-crewed lunar outpost, resources (power, water, and breathable atmosphere) are finite and deeply coupled. When a subsystem suffers degradation (such as lunar regolith dust on solar panels or filtration clogging), flight directors and habitat commanders must rapidly answer five crucial questions:
        </p>
        <ul className="text-xs sm:text-sm text-white/70 space-y-2 list-disc list-inside ml-2 font-sans">
          <li><strong className="text-white font-din uppercase tracking-wide">What failed?</strong> Root-cause subsystem identification.</li>
          <li><strong className="text-white font-din uppercase tracking-wide">Which dependent systems are affected?</strong> Cascading downstream electrical and life-support loads.</li>
          <li><strong className="text-white font-din uppercase tracking-wide">How long remains before safety thresholds are breached?</strong> Deterministic first-principles runway calculation.</li>
          <li><strong className="text-white font-din uppercase tracking-wide">Which recovery actions are available, and what are their trade-offs?</strong> Load shedding vs experiment pausing vs throughput throttling.</li>
          <li><strong className="text-white font-din uppercase tracking-wide">How much does the predicted outcome improve after selecting a response?</strong> Calculated endurance extension delta.</li>
        </ul>
      </div>

      {/* Section 2: Baseline Constants & Thresholds Table */}
      <div className="p-6 sm:p-8 space-y-4 bg-[#080808] border border-[#333333] sharp-brutalist">
        <h2 className="text-sm sm:text-base font-extrabold text-white uppercase font-din tracking-[0.14em] flex items-center gap-2.5">
          <Layers className="w-5 h-5 text-cyan" />
          <span>2. BASELINE CONSTANTS & DEFINED THRESHOLDS</span>
        </h2>
        <div className="overflow-x-auto border border-[#222222] sharp-brutalist">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0c0c0c] border-b border-[#222222] text-[11px] font-mono text-white/60 uppercase tracking-[0.14em]">
              <tr>
                <th className="px-5 py-3.5">RESOURCE</th>
                <th className="px-5 py-3.5">STARTING RESERVE</th>
                <th className="px-5 py-3.5">SAFETY FLOOR</th>
                <th className="px-5 py-3.5">USABLE MARGIN</th>
                <th className="px-5 py-3.5">STORAGE CAPACITY</th>
                <th className="px-5 py-3.5">ENGINEERING MODEL NOTE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a] text-[11px]">
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3.5 font-bold text-white font-din text-sm uppercase">Battery Storage</td>
                <td className="px-5 py-3.5 text-cyan font-bold">38.0 kWh</td>
                <td className="px-5 py-3.5 text-red font-bold">18.0 kWh</td>
                <td className="px-5 py-3.5 text-teal font-bold">20.0 kWh</td>
                <td className="px-5 py-3.5 text-white/60">100.0 kWh</td>
                <td className="px-5 py-3.5 font-sans text-white/70">Li-Ion main distribution bus buffer.</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3.5 font-bold text-white font-din text-sm uppercase">Potable Water</td>
                <td className="px-5 py-3.5 text-cyan font-bold">640 L</td>
                <td className="px-5 py-3.5 text-red font-bold">340 L</td>
                <td className="px-5 py-3.5 text-teal font-bold">300 L</td>
                <td className="px-5 py-3.5 text-white/60">1,000 L</td>
                <td className="px-5 py-3.5 font-sans text-white/70">Closed-loop distillation & hygiene reserve.</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3.5 font-bold text-white font-din text-sm uppercase">Oxygen Reserve</td>
                <td className="px-5 py-3.5 text-cyan font-bold">82%</td>
                <td className="px-5 py-3.5 text-red font-bold">42%</td>
                <td className="px-5 py-3.5 text-teal font-bold">40 pts</td>
                <td className="px-5 py-3.5 text-white/60">100% Index</td>
                <td className="px-5 py-3.5 font-sans text-white/70">Illustrative margin index (not physiological O2).</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3.5 font-bold text-white font-din text-sm uppercase">Solar Photovoltaic</td>
                <td className="px-5 py-3.5 text-cyan font-bold">8.0 kW (Nominal)</td>
                <td className="px-5 py-3.5 text-white/60">8.0 kW Base Demand</td>
                <td className="px-5 py-3.5 text-white/60">Balanced (0 kW)</td>
                <td className="px-5 py-3.5 text-white/60">10.0 kW Peak</td>
                <td className="px-5 py-3.5 font-sans text-white/70">Drops to 3.0 kW during regolith dust occlusion.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Mathematical Formulas */}
      <div className="p-6 sm:p-8 space-y-5 bg-[#080808] border border-[#333333] sharp-brutalist">
        <h2 className="text-sm sm:text-base font-extrabold text-white uppercase font-din tracking-[0.14em] flex items-center gap-2.5">
          <Cpu className="w-5 h-5 text-cyan" />
          <span>3. PURE MATHEMATICAL FORMULAS & RUNWAY LOGIC</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 sm:p-5 bg-[#050505] border border-[#222222] space-y-1.5 sharp-brutalist">
            <span className="text-cyan font-bold block uppercase tracking-[0.16em] font-din text-xs">A. POWER BALANCE & BATTERY RUNWAY:</span>
            <p className="text-white/60 font-mono">netPowerKW = solar - demand</p>
            <p className="text-white/60 font-mono">netDrainKW = demand - solar</p>
            <p className="text-white/60 font-mono">usable = Math.max(0, batt - floor)</p>
            <p className="text-white font-bold font-mono pt-1">
              runway = usable / netDrainKW
            </p>
            <p className="text-[10px] text-white/40 italic mt-2 font-sans">
              *Primary Scenario: (38 - 18) / (8.0 - 3.0) = 4.0 hours exactly.
            </p>
          </div>

          <div className="p-4 sm:p-5 bg-[#050505] border border-[#222222] space-y-1.5 sharp-brutalist">
            <span className="text-cyan font-bold block uppercase tracking-[0.16em] font-din text-xs">B. POTABLE WATER RUNWAY:</span>
            <p className="text-white/60 font-mono">usable = Math.max(0, water - floor)</p>
            <p className="text-white font-bold font-mono pt-1">
              runwayDays = usable / netLossLPD
            </p>
            <p className="text-[10px] text-white/40 italic mt-2 font-sans">
              *Water Scenario: (640 - 340) / 25 = 12.0 days exactly.
            </p>
          </div>

          <div className="p-4 sm:p-5 bg-[#050505] border border-[#222222] space-y-1.5 sharp-brutalist">
            <span className="text-cyan font-bold block uppercase tracking-[0.16em] font-din text-xs">C. OXYGEN MARGIN INDICATOR:</span>
            <p className="text-white/60 font-mono">usable = Math.max(0, o2 - floor)</p>
            <p className="text-white font-bold font-mono pt-1">
              runwayHours = usable / declineRate
            </p>
            <p className="text-[10px] text-white/40 italic mt-2 font-sans">
              *Air-Filter: (82 - 42) / 1.6 = 25.0 hours exactly.
            </p>
          </div>
        </div>
      </div>

      {/* Section 4: Primary Solar Scenario Recovery Plan Rules */}
      <div className="p-6 sm:p-8 space-y-4 bg-[#080808] border border-[#333333] sharp-brutalist">
        <h2 className="text-sm sm:text-base font-extrabold text-white uppercase font-din tracking-[0.14em] flex items-center gap-2.5">
          <Layers className="w-5 h-5 text-cyan" />
          <span>4. PRIMARY SOLAR FAULT RECOVERY PARAMETER SPECIFICATIONS</span>
        </h2>
        <div className="overflow-x-auto border border-[#222222] sharp-brutalist">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0c0c0c] border-b border-[#222222] text-[11px] font-mono text-white/60 uppercase tracking-[0.14em]">
              <tr>
                <th className="px-5 py-3.5">PLAN</th>
                <th className="px-5 py-3.5">LOAD REDUCTION</th>
                <th className="px-5 py-3.5">REMAINING DEMAND</th>
                <th className="px-5 py-3.5">NET DRAIN</th>
                <th className="px-5 py-3.5">PREDICTED RUNWAY</th>
                <th className="px-5 py-3.5">OPERATIONAL TRADE-OFF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a] text-[11px]">
              <tr className="bg-cyan/[0.03] hover:bg-cyan/[0.06] transition-colors">
                <td className="px-5 py-3.5 font-bold text-cyan font-din text-sm uppercase">Plan C (Recommended)</td>
                <td className="px-5 py-3.5 text-white font-bold">-3.5 kW</td>
                <td className="px-5 py-3.5 text-white">4.5 kW</td>
                <td className="px-5 py-3.5 text-teal font-bold">1.5 kW</td>
                <td className="px-5 py-3.5 text-teal font-bold tabular-nums">13.33 hours (+9.33h)</td>
                <td className="px-5 py-3.5 font-sans text-white/70">Water recovery throttled; labs/experiments shed.</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3.5 font-bold text-white font-din text-sm uppercase">Plan A</td>
                <td className="px-5 py-3.5 text-white">-3.0 kW</td>
                <td className="px-5 py-3.5 text-white">5.0 kW</td>
                <td className="px-5 py-3.5 text-white/60">2.0 kW</td>
                <td className="px-5 py-3.5 text-white font-bold tabular-nums">10.00 hours (+6.00h)</td>
                <td className="px-5 py-3.5 font-sans text-white/60">Laboratories paused; experiments halted.</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3.5 font-bold text-white font-din text-sm uppercase">Plan B</td>
                <td className="px-5 py-3.5 text-white">-1.5 kW</td>
                <td className="px-5 py-3.5 text-white">6.5 kW</td>
                <td className="px-5 py-3.5 text-white/60">3.5 kW</td>
                <td className="px-5 py-3.5 text-white font-bold tabular-nums">5.71 hours (+1.71h)</td>
                <td className="px-5 py-3.5 font-sans text-white/60">External regolith experiments deferred.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 5: Model Limitations & Engineering Assumptions */}
      <div className="p-6 sm:p-8 space-y-4 bg-[#080808] border border-[#333333] sharp-brutalist">
        <h2 className="text-sm sm:text-base font-extrabold text-white uppercase font-din tracking-[0.14em] flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 text-amber" />
          <span>5. MODEL LIMITATIONS & ENGINEERING ASSUMPTIONS</span>
        </h2>
        <ul className="text-xs sm:text-sm text-white/70 space-y-2 list-disc list-inside leading-relaxed font-sans">
          <li><strong className="text-white font-mono">Deterministic Rules:</strong> Runway projections assume constant generation deficit and constant subsystem draw across each timestep. Real flight dynamics feature thermal diurnal cycles and non-linear chemical degradation.</li>
          <li><strong className="text-white font-mono">Unit Separation:</strong> Stored battery energy (kWh) is strictly separated from instantaneous power rate (kW). Water runway is computed in days; battery in hours.</li>
          <li><strong className="text-white font-mono">Division-by-Zero Safety:</strong> Zero or negative net depletion returns an auditable status string rather than an invalid numerical or infinite runway.</li>
          <li><strong className="text-white font-mono">Idempotent Protocol Execution:</strong> Deploying the same plan twice produces no duplicate state changes.</li>
        </ul>
      </div>

      {/* Section 6: Risks & How We Handle Them */}
      <div className="p-6 sm:p-8 space-y-4 bg-[#080808] border border-[#333333] sharp-brutalist">
        <h2 className="text-sm sm:text-base font-extrabold text-white uppercase font-din tracking-[0.14em] flex items-center gap-2.5">
          <AlertTriangle className="w-5 h-5 text-cyan" />
          <span>6. TECHNICAL RISKS & DEFENSIBLE MITIGATIONS</span>
        </h2>
        <div className="overflow-x-auto border border-[#222222] sharp-brutalist">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0c0c0c] border-b border-[#222222] text-[11px] font-mono text-white/60 uppercase tracking-[0.14em]">
              <tr>
                <th className="px-5 py-3.5">IDENTIFIED RISK</th>
                <th className="px-5 py-3.5">HOW ASTRALOOP HANDLES IT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a] text-[11px] text-white/70">
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3.5 font-bold text-white font-din text-sm uppercase">Overclaiming the Science</td>
                <td className="px-5 py-3.5 font-sans">All values explicitly labeled simulated and illustrative. Real NASA literature cited as motivation, not validation.</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3.5 font-bold text-white font-din text-sm uppercase">Incorrect Mathematics</td>
                <td className="px-5 py-3.5 font-sans">Strict separation of energy (kWh) vs power (kW). 27 automated unit tests in Vitest verify bounds and division-by-zero guards.</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3.5 font-bold text-white font-din text-sm uppercase">AI Hallucinations in Life-Support</td>
                <td className="px-5 py-3.5 font-sans">Calculations are 100% deterministic TypeScript. AI assistant is strictly downstream for human-language explanation.</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3.5 font-bold text-white font-din text-sm uppercase">Judges Question Novelty</td>
                <td className="px-5 py-3.5 font-sans">Differentiated by connecting root cause &rarr; cross-resource runway &rarr; ranked recovery options with transparent before/after verification.</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3.5 font-bold text-white font-din text-sm uppercase">Stage Network Failure</td>
                <td className="px-5 py-3.5 font-sans">100% browser-based with zero external server or cloud dependencies. Runs offline without network access.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 7: Post-Hackathon Roadmap & Earth Applications */}
      <div className="p-6 sm:p-8 space-y-5 bg-[#080808] border border-[#333333] sharp-brutalist">
        <h2 className="text-sm sm:text-base font-extrabold text-white uppercase font-din tracking-[0.14em] flex items-center gap-2.5">
          <Cpu className="w-5 h-5 text-teal" />
          <span>7. POST-HACKATHON ROADMAP & EARTH SPIN-OFF APPLICATIONS</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 bg-[#050505] border border-[#222222] space-y-2.5 sharp-brutalist">
            <span className="text-sm font-din font-bold uppercase tracking-[0.14em] text-cyan block">
              Four-Phase Engineering Roadmap
            </span>
            <ul className="text-xs sm:text-sm text-white/70 space-y-2 font-sans">
              <li><strong className="text-white font-mono">1. Enhanced Physics:</strong> Diurnal lunar night (354-hour freeze) & battery degradation curves.</li>
              <li><strong className="text-white font-mono">2. Interface Evolution:</strong> Mission report export, scenario library, and telemetry playback.</li>
              <li><strong className="text-white font-mono">3. Domain Review:</strong> Peer review of assumptions with aerospace life-support researchers.</li>
              <li><strong className="text-white font-mono">4. Telemetry Stream:</strong> NASA CCSDS / MQTT live sensor packet ingestion.</li>
            </ul>
          </div>

          <div className="p-5 bg-[#050505] border border-[#222222] space-y-2.5 sharp-brutalist">
            <span className="text-sm font-din font-bold uppercase tracking-[0.14em] text-teal block">
              Terrestrial Spin-off Applications
            </span>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
              The same multi-resource decision intelligence engine directly adapts to:
            </p>
            <ul className="text-xs sm:text-sm text-white/70 space-y-2 font-sans">
              <li>• <strong className="text-white font-mono">Antarctic Research Outposts:</strong> Fuel, power, and water rationing under extreme isolation.</li>
              <li>• <strong className="text-white font-mono">Remote Mining Microgrids:</strong> Solar-diesel hybrid load balancing during generator faults.</li>
              <li>• <strong className="text-white font-mono">Disaster Relief Shelters:</strong> Potable water and field hospital power endurance optimization.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section 8: Official Reference Citations */}
      <div className="p-6 sm:p-8 space-y-4 bg-[#080808] border border-[#333333] sharp-brutalist">
        <h2 className="text-sm sm:text-base font-extrabold text-white uppercase font-din tracking-[0.14em] flex items-center gap-2.5">
          <ExternalLink className="w-5 h-5 text-cyan" />
          <span>8. OFFICIAL NASA & TECHNICAL REFERENCE CITATIONS</span>
        </h2>
        <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
          The following research sources provide real-world motivation for lunar life-support systems. Cited purely as background:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <a
            href="https://www.nasa.gov/lunar-surface-technology/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-[#050505] border border-[#222222] hover:border-white/50 text-white hover:text-cyan transition-all sharp-brutalist"
          >
            <span>[1] NASA Lunar Surface Technology</span>
            <ExternalLink className="w-4 h-4 shrink-0" />
          </a>
          <a
            href="https://www.nasa.gov/reference/environmental-control-and-life-support-systems-eclss/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-[#050505] border border-[#222222] hover:border-white/50 text-white hover:text-cyan transition-all sharp-brutalist"
          >
            <span>[2] NASA Environmental Control (ECLSS)</span>
            <ExternalLink className="w-4 h-4 shrink-0" />
          </a>
          <a
            href="https://www.nasa.gov/space-technology-mission-directorate/lunar-surface-innovation-initiative/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-[#050505] border border-[#222222] hover:border-white/50 text-white hover:text-cyan transition-all sharp-brutalist"
          >
            <span>[3] NASA Lunar Surface Innovation (LSII)</span>
            <ExternalLink className="w-4 h-4 shrink-0" />
          </a>
          <div className="flex items-center justify-between p-4 bg-[#050505] border border-[#222222] text-white/60 sharp-brutalist">
            <span>[4] NASA Class A Flight Software (NPR 7150.2)</span>
            <span className="text-[10px] font-mono text-cyan font-bold bg-cyan/10 border border-cyan/30 px-2 py-0.5">STANDARD</span>
          </div>
        </div>
      </div>

      {/* Section 9: Team HackDevs Signature */}
      <div className="p-5 bg-[#080808] border border-[#333333] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono sharp-brutalist">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-cyan" />
          <span className="font-extrabold text-white uppercase tracking-[0.16em] font-din text-sm">
            AstraLoop Prototype Developed by Team HackDevs
          </span>
        </div>
        <span className="text-white/60 font-mono text-xs">
          Shreyansh Gupta (Lead) • Uttkarsh Patel (Sim Eng) • Akshita Garg (ECLSS)
        </span>
      </div>
    </div>
  );
};
