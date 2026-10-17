import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  Play,
  HelpCircle,
  Users,
  Presentation,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Zap,
  Cpu,
  Layers,
  ArrowRight,
  ListChecks,
  CheckSquare,
  Square,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SLIDES = [
  {
    num: '01',
    title: 'TITLE & TEAM',
    tagline: 'AstraLoop — Lunar Habitat Survival Intelligence System',
    keyPoints: [
      'Team HackDevs: Shreyansh Gupta (Lead), Uttkarsh Patel (Sim Eng), Akshita Garg (ECLSS).',
      'Event: Shunya 2026 / Space & Beyond Ideathon (Theme: Beyond Earth).',
      'Mission: Transparent digital-twin decision-support simulation for deep-space habitat survival.',
    ],
    takeaway: 'Predict resource depletion runway before threshold crossings occur.',
  },
  {
    num: '02',
    title: 'PROBLEM STATEMENT',
    tagline: 'Cascading Subsystem Failures in Isolated Habitats',
    keyPoints: [
      'Single-point anomalies (dust on solar panels, water recovery pump failure) cascade across dependent life support systems.',
      'Operators lack instant visibility into which resource breaches safety thresholds first.',
      'Manual calculation under critical emergency pressure is slow and error-prone.',
    ],
    takeaway: 'When one subsystem fails, crews must know what becomes critical next and which plan saves the mission.',
  },
  {
    num: '03',
    title: 'WHY IT MATTERS',
    tagline: 'Grounded in NASA Surface Exploration Challenges',
    keyPoints: [
      'NASA cites surface power, dust mitigation, and autonomous ECLSS as vital for sustained lunar exploration.',
      'Resupply from Earth takes days or weeks; local closed-loop reserves are life-critical.',
      'Illustrative model grounds real trade-offs between scientific operations and human survival.',
    ],
    takeaway: 'Survival Beyond Earth requires proactive decision intelligence, not passive gauge monitoring.',
  },
  {
    num: '04',
    title: 'PROPOSED SOLUTION',
    tagline: 'AstraLoop Four-Piece Integrated Workflow',
    keyPoints: [
      '1. Habitat Digital Twin: Real-time 3D Three.js & telemetry model of power, water, O2 reserves.',
      '2. Failure Simulator: Selectable anomaly injection (Solar drop, water fault, filter saturation).',
      '3. Survival Runway Engine: Deterministic threshold crossing calculations with division-by-zero safety.',
      '4. Recovery Matrix: Ranked contingency plans with instant before-and-after forecast comparison.',
    ],
    takeaway: 'Connected chain: Failure -> Cross-Resource Impact -> Ranked Response Plans -> Verified Outcome.',
  },
  {
    num: '05',
    title: 'HOW IT WORKS',
    tagline: 'Deterministic Physics & Rule-Based Architecture',
    keyPoints: [
      'Inputs: Solar output (kW), demand loads (kW), battery reserves (kWh), water reserves (L), O2 (%).',
      'Runway Equation: Usable Margin = (Reserve - Safety Floor) / Net Depletion Rate.',
      'Load Shedding Circuit: Prioritizes Tier-1 Life Support (2.5 kW) by selectively shedding Tier-3 Science (3.0 kW).',
      'Pure TypeScript functions verified by 21 automated Vitest unit test suites.',
    ],
    takeaway: 'Auditable, zero-hallucination mathematical logic with complete unit separation.',
  },
  {
    num: '06',
    title: 'WORKING PROTOTYPE',
    tagline: 'Live End-to-End Browser Demonstration',
    keyPoints: [
      'Baseline: 8.0 kW Solar = 8.0 kW Demand. Battery 38 kWh. Water 640 L. Status: NOMINAL.',
      'Fault Trigger: Regolith dust drops solar to 3.0 kW -> -5.0 kW net drain -> Runway falls to 4.0 hours.',
      'Plan C Deployed: Sheds science & labs -> Net drain drops to 1.5 kW -> Runway extends to 13.33 hours (+9.33h gain).',
      'Interactive 3D Three.js Digital Twin: Particle dust clouds, battery LED discharge bars, and module inspection.',
    ],
    takeaway: 'A working browser prototype with real calculations, not a static mockup.',
  },
  {
    num: '07',
    title: 'INNOVATION & DEFENSE',
    tagline: 'Three Defensible Differentiators',
    keyPoints: [
      '1. Connected Failure Chains: Connects a root fault to cross-subsystem consequences instead of isolated alarms.',
      '2. Trade-Off Comparison: Evaluates multiple response plans under identical baseline assumptions.',
      '3. Explainable Recommendations: Transparent rules and math show why Plan C was chosen over Plans A and B.',
    ],
    takeaway: 'Differentiates by connecting resource forecasting and explainable recovery plans.',
  },
  {
    num: '08',
    title: 'FEASIBILITY & SCOPE',
    tagline: 'Honest Scope & Production Roadmap',
    keyPoints: [
      'Built with React 19, TypeScript, Tailwind CSS, Recharts, Three.js, and Vitest.',
      'Zero external server dependency: Runs 100% locally in browser for offline hackathon demonstrations.',
      'Scope Honesty: Hackathon decision-support prototype; not a flight-certified controller.',
    ],
    takeaway: 'Technically sound, verified with unit tests, and packaged for immediate deployment.',
  },
  {
    num: '09',
    title: 'ROADMAP & CONCLUSION',
    tagline: 'Future Milestones & Earth Applications',
    keyPoints: [
      'Phase 1: Dynamic diurnal solar cycles and non-linear chemical degradation models.',
      'Phase 2: NASA CCSDS / MQTT telemetry ingestion adapter for live sensor streams.',
      'Earth Spin-offs: Microgrid energy management in Antarctic stations, mining outposts, and disaster relief shelters.',
    ],
    takeaway: 'AstraLoop proves that intelligent resource forecasting saves lives in extreme environments.',
  },
];

export const PresenterModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'script' | 'slides' | 'qa' | 'roles' | 'checklists'>('script');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [checkedDemoItems, setCheckedDemoItems] = useState<Record<number, boolean>>({
    0: true, 1: true, 2: true, 3: true, 4: true, 5: true, 6: true
  });
  const [checkedSubItems, setCheckedSubItems] = useState<Record<number, boolean>>({
    0: true, 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true
  });

  const toggleDemoCheck = (idx: number) => {
    setCheckedDemoItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleSubCheck = (idx: number) => {
    setCheckedSubItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (activeTab === 'slides') {
        if (e.key === 'ArrowRight' && currentSlideIndex < SLIDES.length - 1) {
          setCurrentSlideIndex((prev) => prev + 1);
        } else if (e.key === 'ArrowLeft' && currentSlideIndex > 0) {
          setCurrentSlideIndex((prev) => prev - 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, activeTab, currentSlideIndex]);

  if (!isOpen) return null;

  const currentSlide = SLIDES[currentSlideIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md select-none"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-bg-panel border-2 border-white/20 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden font-sans sharp-brutalist"
        style={{ borderRadius: '0px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between bg-bg-secondary/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-cyan/15 text-cyan flex items-center justify-center border border-cyan/40 shadow-cyan-glow">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-din uppercase tracking-wider text-white">
                  AstraLoop Presenter Guide & Slide Deck
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-bg-panel text-cyan border border-border">
                  TEAM HACKDEVS
                </span>
              </div>
              <p className="text-xs text-text-muted font-sans">
                Shunya 2026 • Space & Beyond Ideathon • Complete 9-Slide Deck & Judge Defense Guide
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-white p-1.5 hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close presenter guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border bg-bg-secondary/60 px-4 pt-2 gap-2 text-xs font-din font-bold uppercase tracking-wider overflow-x-auto">
          <button
            onClick={() => setActiveTab('script')}
            className={`px-3 py-2 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'script'
                ? 'border-cyan text-cyan'
                : 'border-transparent text-text-muted hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>2-Min Pitch Script</span>
          </button>

          <button
            onClick={() => setActiveTab('slides')}
            className={`px-3 py-2 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'slides'
                ? 'border-cyan text-cyan'
                : 'border-transparent text-text-muted hover:text-white'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>9-Slide PPT Deck</span>
          </button>

          <button
            onClick={() => setActiveTab('qa')}
            className={`px-3 py-2 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'qa'
                ? 'border-cyan text-cyan'
                : 'border-transparent text-text-muted hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>8 Judge Q&As</span>
          </button>

          <button
            onClick={() => setActiveTab('roles')}
            className={`px-3 py-2 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'roles'
                ? 'border-cyan text-cyan'
                : 'border-transparent text-text-muted hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Team Roles</span>
          </button>

          <button
            onClick={() => setActiveTab('checklists')}
            className={`px-3 py-2 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'checklists'
                ? 'border-cyan text-cyan'
                : 'border-transparent text-text-muted hover:text-white'
            }`}
          >
            <ListChecks className="w-3.5 h-3.5" />
            <span>Checklists (p.11 & 16)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs leading-relaxed text-text-muted max-h-[65vh]">
          {/* TAB 1: PITCH SCRIPT & STORY */}
          {activeTab === 'script' && (
            <div className="space-y-4 font-sans">
              <div className="p-3.5 rounded-none bg-bg-secondary border border-cyan/40">
                <span className="font-mono text-cyan font-bold block mb-1 uppercase tracking-wider text-[11px]">
                  Official 60-Second Opening Pitch
                </span>
                <p className="text-white text-xs leading-relaxed italic">
                  "A future lunar habitat will depend on connected systems for power, water, and life support. When one system degrades, the hard question is not only what failed, but what becomes critical next and which response is best. AstraLoop is an interactive habitat simulation that lets a user trigger failures, estimate resource runway under visible assumptions, and compare recovery actions. Unlike a simple monitoring dashboard, our prototype links a fault to downstream resource impact and explains why each recommendation appears. We are starting with a transparent, rule-based model that can be tested and improved before any real mission use. Our goal is to make complex resource trade-offs easier to inspect, explain, and rehearse."
                </p>
              </div>

              <div className="p-3 rounded-none bg-bg-secondary border border-border">
                <span className="font-mono text-text-muted font-bold block mb-1 uppercase text-[10px]">
                  One-Liner (If a judge asks: "What exactly have you built?")
                </span>
                <p className="text-white font-medium text-xs">
                  "A working browser prototype that simulates selected habitat resource failures, estimates threshold runway with explicit assumptions, and compares rule-based response options."
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-bg-secondary border border-border">
                  <span className="text-cyan font-bold font-din uppercase text-xs block mb-1">
                    Demo Step 1: Baseline (0:00 - 0:45)
                  </span>
                  <p className="text-text-muted text-[11px]">
                    Show nominal state: Solar 8.0 kW matches Demand 8.0 kW. Battery 38 kWh, Water 640 L, O2 82%. Zero drain. Status: NOMINAL.
                  </p>
                </div>

                <div className="p-3 bg-bg-secondary border border-red/40">
                  <span className="text-red font-bold font-din uppercase text-xs block mb-1">
                    Demo Step 2: Fault Injection (0:45 - 1:30)
                  </span>
                  <p className="text-text-muted text-[11px]">
                    Click "Engage Solar Drop Demo": generation drops to 3.0 kW &rarr; -5.0 kW deficit &rarr; Battery runway drops to 4.0h. Status turns CRITICAL.
                  </p>
                </div>

                <div className="p-3 bg-bg-secondary border border-teal/40">
                  <span className="text-teal font-bold font-din uppercase text-xs block mb-1">
                    Demo Step 3: Contingency Matrix (1:30 - 2:15)
                  </span>
                  <p className="text-text-muted text-[11px]">
                    Navigate to Recovery Plans. Deploy Plan C (Shed Science & Labs) &rarr; Net drain drops to 1.5 kW &rarr; Runway extends to 13.33 hours (+9.33h gain).
                  </p>
                </div>

                <div className="p-3 bg-bg-secondary border border-cyan/40">
                  <span className="text-cyan font-bold font-din uppercase text-xs block mb-1">
                    Demo Step 4: Defense & Rigor (2:15 - 3:00)
                  </span>
                  <p className="text-text-muted text-[11px]">
                    Show Three.js 3D Digital Twin, 21 automated Vitest unit tests passing, unit separation (kWh vs kW), and NASA ECLSS reference citations.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE 9-SLIDE PPT DECK */}
          {activeTab === 'slides' && (
            <div className="space-y-4">
              {/* Slide Presentation Card */}
              <div className="p-6 bg-black border-2 border-white/20 relative">
                {/* Slide Number Tag */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/15">
                  <span className="font-mono text-cyan font-bold tracking-widest text-xs">
                    SLIDE {currentSlide.num} / 09
                  </span>
                  <span className="font-din text-xs uppercase text-white/50 tracking-wider">
                    {currentSlide.title}
                  </span>
                </div>

                <h3 className="font-din text-2xl md:text-3xl font-extrabold uppercase text-white tracking-wide mb-2">
                  {currentSlide.tagline}
                </h3>

                {/* Key Bullet Points */}
                <div className="space-y-2.5 my-5">
                  {currentSlide.keyPoints.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <ChevronRight className="w-4 h-4 text-cyan shrink-0 mt-0.5" />
                      <span className="text-white/85 text-xs font-sans leading-relaxed">
                        {pt}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Key Takeaway Banner */}
                <div className="p-3 bg-cyan/10 border-l-2 border-cyan text-white text-xs font-din font-bold tracking-wider uppercase">
                  <span className="text-cyan mr-1.5 font-mono">[KEY TAKEAWAY]:</span>
                  {currentSlide.takeaway}
                </div>
              </div>

              {/* Slide Navigation Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentSlideIndex === 0}
                  className="px-4 py-2 bg-bg-secondary border border-border hover:border-white text-white text-xs font-din font-bold uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>PREVIOUS SLIDE</span>
                </button>

                {/* Thumbnail Dots */}
                <div className="flex items-center gap-1.5">
                  {SLIDES.map((s, idx) => (
                    <button
                      key={s.num}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`w-6 h-6 text-[10px] font-mono font-bold flex items-center justify-center transition-all cursor-pointer ${
                        currentSlideIndex === idx
                          ? 'bg-cyan text-black font-extrabold shadow-cyan-glow'
                          : 'bg-bg-secondary text-text-muted hover:text-white border border-border'
                      }`}
                    >
                      {s.num}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentSlideIndex((prev) => Math.min(SLIDES.length - 1, prev + 1))}
                  disabled={currentSlideIndex === SLIDES.length - 1}
                  className="px-4 py-2 bg-bg-secondary border border-border hover:border-white text-white text-xs font-din font-bold uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>NEXT SLIDE</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: COMPLETE 8 JUDGE Q&As */}
          {activeTab === 'qa' && (
            <div className="space-y-3 font-sans">
              {[
                {
                  q: '1. What is actually new here?',
                  a: 'Our prototype connects scenario-triggered failures to cross-resource forecasts and transparent response-plan comparisons in one accessible interface. We are presenting this connected failure-chain as our differentiator, not claiming no similar aerospace research exists.',
                },
                {
                  q: '2. Are these real lunar data?',
                  a: 'No. The hackathon MVP uses illustrative values to demonstrate the method. A real system would need validated engineering models, sensor verification, and mission-specific review. All metrics are clearly labeled simulated.',
                },
                {
                  q: '3. Why use deterministic rules instead of an LLM or ML model?',
                  a: 'The core calculations are deterministic, not an opaque AI guess. Under NASA Class A software standards (NPR 7150.2), life support cannot tolerate hallucinations. An optional language model can explain already-calculated outcomes in plain language, but it does not control life-support decisions.',
                },
                {
                  q: '4. How do you calculate runway?',
                  a: 'For a simple constant-rate case, usable reserve above a defined safety floor is divided by the net depletion rate: (Current - Safety Floor) / Net Drain. We guard against division-by-zero, clamp physical bounds, and label assumptions.',
                },
                {
                  q: '5. What if your model is wrong?',
                  a: 'We explicitly state all assumptions, build 21 automated unit tests in Vitest to verify expected results, and avoid presenting the prototype as certified for real operations. Higher-fidelity chemical/thermal modeling is a future roadmap milestone.',
                },
                {
                  q: '6. How can this scale?',
                  a: 'Add more modular subsystem dependencies, multi-scenario compound failures, sensitivity slider ranges, versioned assumption profiles, and eventually validated engineering-model or NASA CCSDS telemetry integrations.',
                },
                {
                  q: '7. Who would use it?',
                  a: 'Initially, mission planners, habitat operators, educators, and students exploring resource trade-offs in simulated lunar bases. Operational flight use would require formal NASA verification and flight software certification.',
                },
                {
                  q: '8. Why not just use a dashboard?',
                  a: 'A normal dashboard merely shows static status. AstraLoop connects the status to a failure scenario, forecasts exact threshold crossing times, compares multiple recovery options, and demonstrates the post-mitigation endurance gain.',
                },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-bg-secondary border border-border">
                  <span className="font-din font-bold uppercase text-white tracking-wide text-xs block mb-1">
                    {item.q}
                  </span>
                  <p className="text-text-muted text-[11px] leading-relaxed">
                    <strong className="text-cyan font-mono mr-1">RESPONSE:</strong>
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: TEAM ROLES */}
          {activeTab === 'roles' && (
            <div className="space-y-3 font-sans">
              <div className="p-3.5 bg-bg-secondary border border-border flex items-start gap-3">
                <div className="w-8 h-8 bg-cyan/20 text-cyan flex items-center justify-center shrink-0 font-bold font-mono">
                  S
                </div>
                <div>
                  <h4 className="font-din text-sm font-bold uppercase text-white">Shreyansh Gupta</h4>
                  <p className="text-[11px] text-cyan font-mono mb-1">Project Lead / Architecture Owner</p>
                  <p className="text-[11px] text-text-muted">
                    Owns project scope, system integration, core simulation loop, opening pitch, and live demo narration. Explains the connected failure-chain and 5 operator questions.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-bg-secondary border border-border flex items-start gap-3">
                <div className="w-8 h-8 bg-teal/20 text-teal flex items-center justify-center shrink-0 font-bold font-mono">
                  U
                </div>
                <div>
                  <h4 className="font-din text-sm font-bold uppercase text-white">Uttkarsh Patel</h4>
                  <p className="text-[11px] text-teal font-mono mb-1">Simulation & Calculation Engineer</p>
                  <p className="text-[11px] text-text-muted">
                    Owns the mathematical runway logic, Recharts forecasting trajectories, Three.js 3D Digital Twin visualization, unit separation (kWh vs kW), and the 21 Vitest unit tests.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-bg-secondary border border-border flex items-start gap-3">
                <div className="w-8 h-8 bg-amber/20 text-amber flex items-center justify-center shrink-0 font-bold font-mono">
                  A
                </div>
                <div>
                  <h4 className="font-din text-sm font-bold uppercase text-white">Akshita Garg</h4>
                  <p className="text-[11px] text-amber font-mono mb-1">ECLSS & Research Domain Owner</p>
                  <p className="text-[11px] text-text-muted">
                    Researched lunar power, dust mitigation, and ECLSS functions. Explains recovery plan trade-offs (Plan A vs B vs C), human factors, and alignment with NASA reference documents.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DEMO & SUBMISSION CHECKLISTS (Pages 11 & 16) */}
          {activeTab === 'checklists' && (
            <div className="space-y-5 font-sans">
              {/* Demo Test Checklist (Blueprint Page 11) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-cyan" />
                    <h3 className="font-din font-bold uppercase tracking-wider text-white text-xs">
                      Demo Test Checklist (Before Every Live Demo — Blueprint p.11)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-cyan">
                    {Object.values(checkedDemoItems).filter(Boolean).length} / 7 READY
                  </span>
                </div>

                <div className="space-y-1.5">
                  {[
                    'The reset button restores the same baseline every time.',
                    'Each scenario changes the correct variables and produces a relevant alert.',
                    'Runway calculations handle zero drain, negative/invalid inputs, and already-breached thresholds.',
                    'The same inputs always produce the same model output (deterministic reproducibility).',
                    'Every recommendation shows a reason and a measurable predicted effect.',
                    'The layout works on the presentation laptop and a smaller browser window.',
                    'No dashboard value is labelled as real NASA data or real lunar telemetry (scope honesty).',
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => toggleDemoCheck(idx)}
                      className="w-full text-left p-2.5 bg-bg-secondary hover:bg-bg-elevated border border-border flex items-start gap-3 transition-colors cursor-pointer"
                    >
                      {checkedDemoItems[idx] ? (
                        <CheckSquare className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
                      )}
                      <span className={`text-xs ${checkedDemoItems[idx] ? 'text-white' : 'text-text-muted line-through'}`}>
                        {item}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submission Checklist (Blueprint Page 16) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-teal" />
                    <h3 className="font-din font-bold uppercase tracking-wider text-white text-xs">
                      Final Submission Checklist (Blueprint p.16)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-teal">
                    {Object.values(checkedSubItems).filter(Boolean).length} / 10 CONFIRMED
                  </span>
                </div>

                <div className="space-y-1.5">
                  {[
                    'Problem and target user are stated in plain language.',
                    'The proposed solution and differentiator can be explained in one sentence.',
                    'At least one working end-to-end scenario is tested live (Solar Drop -> Plan C).',
                    'All metrics have units and are labelled simulated / illustrative where appropriate.',
                    'Before/after comparison uses consistent assumptions.',
                    'The 8-10 slide deck includes problem, solution, innovation, implementation, feasibility, impact, and future scope.',
                    'Scientific claims have credible references on the relevant slide.',
                    'No fabricated test results, "NASA-approved" language, or unsupported claims of uniqueness.',
                    'PPTX/PDF opens correctly, demo link works, and local backups are available.',
                    'Submission confirmed before the safest deadline (15 October, based on the detailed listing).',
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => toggleSubCheck(idx)}
                      className="w-full text-left p-2.5 bg-bg-secondary hover:bg-bg-elevated border border-border flex items-start gap-3 transition-colors cursor-pointer"
                    >
                      {checkedSubItems[idx] ? (
                        <CheckSquare className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
                      )}
                      <span className={`text-xs ${checkedSubItems[idx] ? 'text-white' : 'text-text-muted line-through'}`}>
                        {item}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-border bg-bg-secondary/90 flex items-center justify-between">
          <span className="text-[11px] font-mono text-text-muted">
            SHUNYA 2026 • SPACE & BEYOND IDEATHON • PROTOTYPE ROUND
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-bg-panel hover:bg-white/10 border border-border text-xs text-white font-din font-bold uppercase tracking-wider cursor-pointer"
          >
            CLOSE GUIDE
          </button>
        </div>
      </div>
    </div>
  );
};
