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
    <div className="space-y-6 font-sans">
      {/* 0. Aerospace Cinematic Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#282828]">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-cyan/10 border border-cyan/40 text-cyan">
              [06] MODEL SPECIFICATIONS & DETERMINISTIC RULES
            </span>
            <span className="text-xs font-mono text-white/50">
              FIRST-PRINCIPLES MATH // NASA CITATIONS // ZERO BLACK-BOX AI
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white font-din flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-cyan" />
            MODEL SPECIFICATIONS & ENGINEERING RULES
          </h1>
          <p className="text-xs text-white/70 max-w-3xl font-sans mt-0.5">
            Complete mathematical transparency, subsystem physical boundaries, and literature citations for technical evaluation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('overview')}
            className="px-4 py-2.5 border border-[#333333] hover:border-white text-white/80 hover:text-white font-din font-bold text-xs uppercase tracking-[0.16em] transition-all flex items-center gap-2 cursor-pointer"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>AVIONICS</span>
          </button>
          <button
            onClick={() => navigate('digital-twin-3d')}
            className="px-5 py-2.5 bg-white hover:bg-neutral-200 text-black font-din font-bold text-xs uppercase tracking-[0.16em] transition-all flex items-center gap-2 cursor-pointer shadow-lg group"
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>3D SIMULATION ARENA</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Mandatory Ideathon Disclaimer */}
      <div className="p-4 bg-amber/10 border border-amber/40 space-y-1.5 font-mono">
        <div className="flex items-center gap-2 text-amber font-bold text-xs uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>MANDATORY PROTOTYPE DISCLOSURE // SPACE & BEYOND IDEATHON</span>
        </div>
        <p className="text-xs text-white/80 leading-relaxed font-sans">
          "AstraLoop is a hackathon decision-support simulation using illustrative values and simplified deterministic rules. It is not a certified life-support controller, does not predict actual mission safety, and must not be used for real crew decisions."
        </p>
      </div>

      {/* Section 1: Purpose & Scope */}
      <div className="hud-panel p-5 space-y-3 bg-[#0c0c0c] border border-[#282828]">
        <h2 className="text-sm font-bold text-white uppercase font-din tracking-wide flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan" />
          <span>1. PURPOSE & SYSTEM SCOPE</span>
        </h2>
        <p className="text-xs text-white/70 leading-relaxed font-sans">
          In a future permanently-crewed lunar outpost, resources (power, water, and breathable atmosphere) are finite and deeply coupled. When a subsystem suffers degradation (such as lunar regolith dust on solar panels or filtration clogging), flight directors and habitat commanders must rapidly answer five crucial questions:
        </p>
        <ul className="text-xs text-white/60 space-y-1.5 list-disc list-inside ml-2 font-mono">
          <li><strong className="text-white">What failed?</strong> Identification of root-cause subsystem.</li>
          <li><strong className="text-white">Which dependent systems are affected?</strong> Cascading downstream loads.</li>
          <li><strong className="text-white">How long remains before safety thresholds are breached?</strong> Deterministic runway calculation.</li>
          <li><strong className="text-white">Which recovery actions are available, and what are their trade-offs?</strong> Load shedding vs mission delay vs throughput throttling.</li>
          <li><strong className="text-white">How much does the predicted outcome improve after selecting a response?</strong> Calculated endurance extension delta.</li>
        </ul>
      </div>

      {/* Section 2: Baseline Constants & Thresholds Table */}
      <div className="hud-panel p-5 space-y-3 bg-[#0c0c0c] border border-[#282828]">
        <h2 className="text-sm font-bold text-white uppercase font-din tracking-wide flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan" />
          <span>2. BASELINE CONSTANTS & DEFINED THRESHOLDS</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-black/80 border-b border-[#282828] text-[11px] font-mono text-white/50 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">RESOURCE</th>
                <th className="px-4 py-3">STARTING RESERVE</th>
                <th className="px-4 py-3">SAFETY FLOOR</th>
                <th className="px-4 py-3">USABLE MARGIN</th>
                <th className="px-4 py-3">STORAGE CAPACITY</th>
                <th className="px-4 py-3">ENGINEERING MODEL NOTE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#282828]/60 text-[11px]">
              <tr>
                <td className="px-4 py-3 font-bold text-white">Battery Storage</td>
                <td className="px-4 py-3 text-cyan font-bold">38.0 kWh</td>
                <td className="px-4 py-3 text-red font-bold">18.0 kWh</td>
                <td className="px-4 py-3 text-teal font-bold">20.0 kWh</td>
                <td className="px-4 py-3 text-white/60">100.0 kWh</td>
                <td className="px-4 py-3 font-sans text-white/60">Li-Ion main distribution bus buffer.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-white">Potable Water</td>
                <td className="px-4 py-3 text-cyan font-bold">640 L</td>
                <td className="px-4 py-3 text-red font-bold">340 L</td>
                <td className="px-4 py-3 text-teal font-bold">300 L</td>
                <td className="px-4 py-3 text-white/60">1,000 L</td>
                <td className="px-4 py-3 font-sans text-white/60">Closed-loop distillation & hygiene reserve.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-white">Oxygen Reserve</td>
                <td className="px-4 py-3 text-cyan font-bold">82%</td>
                <td className="px-4 py-3 text-red font-bold">42%</td>
                <td className="px-4 py-3 text-teal font-bold">40 pts</td>
                <td className="px-4 py-3 text-white/60">100% Index</td>
                <td className="px-4 py-3 font-sans text-white/60">Illustrative margin index (not physiological O2).</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-white">Solar Photovoltaic</td>
                <td className="px-4 py-3 text-cyan font-bold">8.0 kW (Nominal)</td>
                <td className="px-4 py-3 text-white/60">8.0 kW Base Demand</td>
                <td className="px-4 py-3 text-white/60">Balanced (0 kW)</td>
                <td className="px-4 py-3 text-white/60">10.0 kW Peak</td>
                <td className="px-4 py-3 font-sans text-white/60">Drops to 3.0 kW during regolith dust occlusion.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Mathematical Formulas */}
      <div className="hud-panel p-5 space-y-4 bg-[#0c0c0c] border border-[#282828]">
        <h2 className="text-sm font-bold text-white uppercase font-din tracking-wide flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan" />
          <span>3. PURE MATHEMATICAL FORMULAS & RUNWAY LOGIC</span>
        </h2>

        <div className="space-y-3 text-xs font-mono">
          <div className="p-3.5 bg-black/60 border border-[#282828] space-y-1">
            <span className="text-cyan font-bold block uppercase tracking-wider">A. POWER BALANCE & BATTERY RUNWAY (HOURS):</span>
            <p className="text-white/60">netPowerKW = solarOutputKW - powerDemandKW</p>
            <p className="text-white/60">netDrainKW = powerDemandKW - solarOutputKW</p>
            <p className="text-white/60">usableBatteryKWh = Math.max(0, batteryKWh - safetyFloorKWh)</p>
            <p className="text-white font-bold">
              runwayHours = netDrainKW &gt; 0 ? (usableBatteryKWh / netDrainKW) : "No depletion"
            </p>
            <p className="text-[10px] text-white/40 italic mt-1 font-sans">
              *Primary Scenario Verification: (38 - 18) / (8.0 - 3.0) = 20 / 5.0 = 4.0 hours exactly.
            </p>
          </div>

          <div className="p-3.5 bg-black/60 border border-[#282828] space-y-1">
            <span className="text-cyan font-bold block uppercase tracking-wider">B. POTABLE WATER RUNWAY (DAYS):</span>
            <p className="text-white/60">usableWaterLitres = Math.max(0, currentWaterLitres - waterFloorLitres)</p>
            <p className="text-white font-bold">
              runwayDays = netLossLPD &gt; 0 ? (usableWaterLitres / netLossLPD) : "No depletion"
            </p>
            <p className="text-[10px] text-white/40 italic mt-1 font-sans">
              *Water Scenario Verification: (640 - 340) / 25 = 300 / 25 = 12.0 days exactly.
            </p>
          </div>

          <div className="p-3.5 bg-black/60 border border-[#282828] space-y-1">
            <span className="text-cyan font-bold block uppercase tracking-wider">C. OXYGEN MARGIN INDICATOR RUNWAY (HOURS):</span>
            <p className="text-white/60">usableMarginPoints = Math.max(0, currentIndicatorPct - thresholdFloorPct)</p>
            <p className="text-white font-bold">
              runwayHours = declineRatePerHour &gt; 0 ? (usableMarginPoints / declineRatePerHour) : "Stable"
            </p>
            <p className="text-[10px] text-white/40 italic mt-1 font-sans">
              *Air-Filter Verification: (82 - 42) / 1.6 = 40 / 1.6 = 25.0 hours exactly.
            </p>
          </div>
        </div>
      </div>

      {/* Section 4: Primary Solar Scenario Recovery Plan Rules */}
      <div className="hud-panel p-5 space-y-3 bg-[#0c0c0c] border border-[#282828]">
        <h2 className="text-sm font-bold text-white uppercase font-din tracking-wide flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan" />
          <span>4. PRIMARY SOLAR FAULT RECOVERY PARAMETER SPECIFICATIONS</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-black/80 border-b border-[#282828] text-[11px] font-mono text-white/50 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">PLAN</th>
                <th className="px-4 py-3">LOAD REDUCTION</th>
                <th className="px-4 py-3">REMAINING DEMAND</th>
                <th className="px-4 py-3">NET DRAIN</th>
                <th className="px-4 py-3">PREDICTED RUNWAY</th>
                <th className="px-4 py-3">OPERATIONAL TRADE-OFF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#282828]/60 text-[11px]">
              <tr className="bg-cyan/5">
                <td className="px-4 py-3 font-bold text-cyan">Plan C (Recommended)</td>
                <td className="px-4 py-3 text-white font-bold">-3.5 kW</td>
                <td className="px-4 py-3 text-white">4.5 kW</td>
                <td className="px-4 py-3 text-teal font-bold">1.5 kW</td>
                <td className="px-4 py-3 text-teal font-bold tabular-nums">13.33 hours (+9.33h)</td>
                <td className="px-4 py-3 font-sans text-white/70">Water recovery throttled; labs/experiments shed.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-white">Plan A</td>
                <td className="px-4 py-3 text-white">-3.0 kW</td>
                <td className="px-4 py-3 text-white">5.0 kW</td>
                <td className="px-4 py-3 text-white/60">2.0 kW</td>
                <td className="px-4 py-3 text-white font-bold tabular-nums">10.00 hours (+6.00h)</td>
                <td className="px-4 py-3 font-sans text-white/60">Laboratories paused; experiments halted.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-white">Plan B</td>
                <td className="px-4 py-3 text-white">-1.5 kW</td>
                <td className="px-4 py-3 text-white">6.5 kW</td>
                <td className="px-4 py-3 text-white/60">3.5 kW</td>
                <td className="px-4 py-3 text-white font-bold tabular-nums">5.71 hours (+1.71h)</td>
                <td className="px-4 py-3 font-sans text-white/60">External regolith experiments deferred.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 5: Model Limitations & Engineering Assumptions */}
      <div className="hud-panel p-5 space-y-3 bg-[#0c0c0c] border border-[#282828]">
        <h2 className="text-sm font-bold text-white uppercase font-din tracking-wide flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber" />
          <span>5. MODEL LIMITATIONS & ENGINEERING ASSUMPTIONS</span>
        </h2>
        <ul className="text-xs text-white/70 space-y-2 list-disc list-inside leading-relaxed font-sans">
          <li><strong className="text-white font-mono">Deterministic Rules:</strong> Runway projections assume constant generation deficit and constant subsystem draw across each timestep. Real flight dynamics feature thermal diurnal cycles and non-linear chemical degradation.</li>
          <li><strong className="text-white font-mono">Unit Separation:</strong> Stored battery energy (kWh) is strictly separated from instantaneous power rate (kW). Water runway is computed in days; battery in hours.</li>
          <li><strong className="text-white font-mono">Division-by-Zero Safety:</strong> Zero or negative net depletion returns an auditable status string rather than an invalid numerical or infinite runway.</li>
          <li><strong className="text-white font-mono">Idempotent Protocol Execution:</strong> Deploying the same plan twice produces no duplicate state changes.</li>
        </ul>
      </div>

      {/* Section 6: Risks & How We Handle Them (Blueprint Page 14) */}
      <div className="hud-panel p-5 space-y-3 bg-[#0c0c0c] border border-[#282828]">
        <h2 className="text-sm font-bold text-white uppercase font-din tracking-wide flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-cyan" />
          <span>6. TECHNICAL RISKS & DEFENSIBLE MITIGATIONS</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-black/80 border-b border-[#282828] text-[11px] font-mono text-white/50 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">IDENTIFIED RISK</th>
                <th className="px-4 py-3">HOW ASTRALOOP HANDLES IT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#282828]/60 text-[11px] text-white/70">
              <tr>
                <td className="px-4 py-3 font-bold text-white">Overclaiming the Science</td>
                <td className="px-4 py-3 font-sans">All values explicitly labeled simulated and illustrative. Real NASA literature cited as motivation, not validation.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-white">Incorrect Mathematics</td>
                <td className="px-4 py-3 font-sans">Strict separation of energy (kWh) vs power (kW). 21 automated unit tests in Vitest verify bounds and division-by-zero guards.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-white">AI Hallucinations in Life-Support</td>
                <td className="px-4 py-3 font-sans">Calculations are 100% deterministic TypeScript. AI assistant is strictly downstream for human-language explanation.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-white">Judges Question Novelty</td>
                <td className="px-4 py-3 font-sans">Differentiated by connecting root cause &rarr; cross-resource runway &rarr; ranked recovery options with transparent before/after verification.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-white">Stage Network Failure</td>
                <td className="px-4 py-3 font-sans">100% browser-based with zero external server or cloud dependencies. Runs offline without network access.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 7: Post-Hackathon Roadmap & Earth Applications (Blueprint Page 14) */}
      <div className="hud-panel p-5 space-y-4 bg-[#0c0c0c] border border-[#282828]">
        <h2 className="text-sm font-bold text-white uppercase font-din tracking-wide flex items-center gap-2">
          <Cpu className="w-4 h-4 text-teal" />
          <span>7. POST-HACKATHON ROADMAP & EARTH SPIN-OFF APPLICATIONS</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-black/60 border border-[#282828] space-y-2">
            <span className="text-xs font-din font-bold uppercase tracking-wider text-cyan block">
              Four-Phase Engineering Roadmap
            </span>
            <ul className="text-xs text-white/70 space-y-1.5 font-sans">
              <li><strong className="text-white font-mono">1. Enhanced Physics:</strong> Diurnal lunar night (354-hour freeze) & battery degradation curves.</li>
              <li><strong className="text-white font-mono">2. Interface Evolution:</strong> Mission report export, scenario library, and telemetry playback.</li>
              <li><strong className="text-white font-mono">3. Domain Review:</strong> Peer review of assumptions with aerospace life-support researchers.</li>
              <li><strong className="text-white font-mono">4. Telemetry Stream:</strong> NASA CCSDS / MQTT live sensor packet ingestion.</li>
            </ul>
          </div>

          <div className="p-4 bg-black/60 border border-[#282828] space-y-2">
            <span className="text-xs font-din font-bold uppercase tracking-wider text-teal block">
              Terrestrial Spin-off Applications
            </span>
            <p className="text-xs text-white/70 leading-relaxed font-sans">
              The same multi-resource decision intelligence engine directly adapts to:
            </p>
            <ul className="text-xs text-white/70 space-y-1.5 font-sans">
              <li>• <strong className="text-white font-mono">Antarctic Research Outposts:</strong> Fuel, power, and water rationing under extreme isolation.</li>
              <li>• <strong className="text-white font-mono">Remote Mining Microgrids:</strong> Solar-diesel hybrid load balancing during generator faults.</li>
              <li>• <strong className="text-white font-mono">Disaster Relief Shelters:</strong> Potable water and field hospital power endurance optimization.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section 8: Official Reference Citations */}
      <div className="hud-panel p-5 space-y-3 bg-[#0c0c0c] border border-[#282828]">
        <h2 className="text-sm font-bold text-white uppercase font-din tracking-wide flex items-center gap-2">
          <ExternalLink className="w-4 h-4 text-cyan" />
          <span>8. OFFICIAL NASA & TECHNICAL REFERENCE CITATIONS</span>
        </h2>
        <p className="text-xs text-white/70 leading-relaxed font-sans">
          The following research sources provide real-world motivation for lunar life-support systems. Cited purely as background:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
          <a
            href="https://www.nasa.gov/lunar-surface-technology/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-black/60 border border-[#282828] hover:border-white/50 text-white hover:text-cyan transition-colors"
          >
            <span>[1] NASA Lunar Surface Technology</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          </a>
          <a
            href="https://www.nasa.gov/reference/environmental-control-and-life-support-systems-eclss/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-black/60 border border-[#282828] hover:border-white/50 text-white hover:text-cyan transition-colors"
          >
            <span>[2] NASA Environmental Control (ECLSS)</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          </a>
          <a
            href="https://www.nasa.gov/space-technology-mission-directorate/lunar-surface-innovation-initiative/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-black/60 border border-[#282828] hover:border-white/50 text-white hover:text-cyan transition-colors"
          >
            <span>[3] NASA Lunar Surface Innovation (LSII)</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          </a>
          <div className="flex items-center justify-between p-3 bg-black/60 border border-[#282828] text-white/60">
            <span>[4] NASA Class A Flight Software (NPR 7150.2)</span>
            <span className="text-[10px] font-mono text-cyan font-bold">STANDARD</span>
          </div>
        </div>
      </div>

      {/* Section 9: Team HackDevs Signature */}
      <div className="p-4 bg-[#0c0c0c] border border-[#282828] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan" />
          <span className="font-bold text-white uppercase tracking-wider font-din text-sm">
            AstraLoop Prototype Developed by Team HackDevs
          </span>
        </div>
        <span className="text-white/60 font-mono text-[11px]">
          Shreyansh Gupta (Lead) • Uttkarsh Patel (Sim Eng) • Akshita Garg (ECLSS)
        </span>
      </div>
    </div>
  );
};
