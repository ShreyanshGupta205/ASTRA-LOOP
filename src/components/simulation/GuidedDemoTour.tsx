import React, { useState } from 'react';
import { useSimulation } from '../../store/simulationStore';
import { SCENARIO_DEFINITIONS } from '../../scenarios/scenarioDefinitions';
import {
  Compass,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertOctagon,
  ChevronRight,
  ChevronLeft,
  X,
  Volume2,
  Sparkles,
  Zap,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const GuidedDemoTour: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    state,
    resetSimulation,
    triggerScenarioWithFeedback,
    applyPlanWithFeedback,
    navigate,
  } = useSimulation();

  const [step, setStep] = useState<number>(1);

  if (!isOpen) return null;

  const handleStepChange = (targetStep: number) => {
    setStep(targetStep);

    if (targetStep === 1) {
      resetSimulation();
      navigate('overview');
    } else if (targetStep === 2) {
      navigate('overview');
      triggerScenarioWithFeedback('solar-drop');
    } else if (targetStep === 3) {
      navigate('overview');
      if (!state.activeScenario) {
        triggerScenarioWithFeedback('solar-drop');
      }
    } else if (targetStep === 4) {
      navigate('recovery-plans');
    } else if (targetStep === 5) {
      navigate('overview');
      const solarDef = SCENARIO_DEFINITIONS['solar-drop'];
      const planC = solarDef.recoveryPlans.find((p) => p.id === 'plan-c');
      if (planC) {
        applyPlanWithFeedback(planC);
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-xl w-[92vw] sm:w-[540px] bg-black/95 border-2 border-cyan text-white shadow-cyan-glow p-4 sm:p-5 font-mono text-xs sharp-brutalist select-none backdrop-blur-md">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-border/70 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-cyan text-black flex items-center justify-center font-bold">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-din font-extrabold uppercase tracking-widest text-white text-sm">
                2-MIN GUIDED PITCH TOUR
              </span>
              <span className="text-[10px] bg-cyan/20 text-cyan px-1.5 py-0.2 border border-cyan/40">
                P.11 SCRIPT
              </span>
            </div>
            <span className="text-[10px] text-text-muted">
              Official Hackathon Narration Flow: Step {step} of 5
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-text-muted hover:text-white p-1 hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Exit Guided Demo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-5 gap-1 mb-4">
        {[
          { num: 1, label: 'BASELINE' },
          { num: 2, label: 'FAULT' },
          { num: 3, label: 'FORECAST' },
          { num: 4, label: 'RESPONSE' },
          { num: 5, label: 'COMPARE' },
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => handleStepChange(s.num)}
            className={`py-1.5 px-1 text-center transition-all cursor-pointer border ${
              step === s.num
                ? 'bg-cyan text-black font-extrabold border-cyan shadow-cyan-glow'
                : step > s.num
                ? 'bg-teal/20 text-teal border-teal/40'
                : 'bg-bg-secondary text-text-muted border-border hover:border-white/40'
            }`}
          >
            <div className="text-[10px] font-bold">0{s.num}</div>
            <div className="text-[8px] truncate hidden sm:block">{s.label}</div>
          </button>
        ))}
      </div>

      {/* Dynamic Step Content */}
      <div className="space-y-3 min-h-[140px] font-sans">
        {step === 1 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-din font-bold uppercase tracking-wider text-teal text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                STEP 1: BASELINE EQUILIBRIUM (0:00 - 0:45)
              </span>
              <span className="font-mono text-[10px] text-text-muted">ALL SYSTEMS NOMINAL</span>
            </div>
            <div className="p-3 bg-bg-secondary border border-border text-xs leading-relaxed text-text-secondary">
              <p className="italic text-white font-serif mb-1">
                "Judges, here is Lunar Habitat DEMO-01 in steady-state equilibrium. Photovoltaic output (8.0 kW) matches consumption (8.0 kW). Battery reserves (38 kWh), water (640 L), and oxygen margin (82%) show zero net depletion."
              </p>
              <span className="text-[10px] text-cyan font-mono block mt-1">
                &bull; Status: NOMINAL &bull; 0.0 kW Net Drain &bull; Infinite Endurance
              </span>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-din font-bold uppercase tracking-wider text-red text-xs flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 animate-pulse" />
                STEP 2: ANOMALY INJECTION (0:45 - 1:15)
              </span>
              <span className="font-mono text-[10px] text-red font-bold">FAULT ACTIVE</span>
            </div>
            <div className="p-3 bg-bg-secondary border border-red/40 text-xs leading-relaxed text-text-secondary">
              <p className="italic text-white font-serif mb-1">
                "A regolith dust storm occludes the photovoltaic array. Solar generation collapses from 8.0 kW to 3.0 kW. With demand at 8.0 kW, the habitat plunges into a critical -5.0 kW power deficit."
              </p>
              <span className="text-[10px] text-red font-mono block mt-1">
                &bull; Status: CRITICAL &bull; -5.0 kW Deficit &bull; Battery Discharging
              </span>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-din font-bold uppercase tracking-wider text-amber text-xs flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                STEP 3: RUNWAY CALCULATION (1:15 - 1:45)
              </span>
              <span className="font-mono text-[10px] text-amber font-bold">4.0 HOURS LEFT</span>
            </div>
            <div className="p-3 bg-bg-secondary border border-border text-xs leading-relaxed text-text-secondary">
              <p className="italic text-white font-serif mb-1">
                "Rather than merely sounding an alarm, AstraLoop computes the mathematical time to threshold. Usable margin above the 18 kWh safety floor is 20 kWh. Divided by 5.0 kW deficit, our battery breaches safety limits in exactly 4.0 hours."
              </p>
              <span className="text-[10px] text-amber font-mono block mt-1">
                &bull; Formula: (38 - 18) / (8.0 - 3.0) = 20 / 5.0 = 4.0h exactly
              </span>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-din font-bold uppercase tracking-wider text-cyan text-xs flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                STEP 4: RECOVERY PROTOCOL MATRIX (1:45 - 2:05)
              </span>
              <span className="font-mono text-[10px] text-cyan font-bold">3 PLANS EVALUATED</span>
            </div>
            <div className="p-3 bg-bg-secondary border border-cyan/40 text-xs leading-relaxed text-text-secondary">
              <p className="italic text-white font-serif mb-1">
                "AstraLoop evaluates 3 transparent recovery plans under identical assumptions. Plan A yields 10.0h (+6h). Plan B yields 5.7h (+1.7h). Plan C is ranked highest: throttling water recovery and shedding science payloads."
              </p>
              <span className="text-[10px] text-teal font-mono block mt-1">
                &bull; Plan C Ranked #1: Max endurance extension (+9.33 hours)
              </span>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-din font-bold uppercase tracking-wider text-teal text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                STEP 5: SIMULATED OUTCOME & VERIFICATION (2:05 - 2:30)
              </span>
              <span className="font-mono text-[10px] text-teal font-bold">+9.33H SURVIVAL GAIN</span>
            </div>
            <div className="p-3 bg-bg-secondary border border-teal/40 text-xs leading-relaxed text-text-secondary">
              <p className="italic text-white font-serif mb-1">
                "Deploying Plan C reconfigures habitat loads down to 4.5 kW. Net drain drops to 1.5 kW, extending battery endurance to 13.33 hours — buying 9.3 hours of survival margin for solar cleaning or an EVA repair."
              </p>
              <span className="text-[10px] text-teal font-mono block mt-1">
                &bull; Baseline: 4.0h &rarr; Post-Recovery: 13.33h (+233% Endurance Extension)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-3 border-t border-border/70 mt-3 font-din">
        <button
          onClick={() => handleStepChange(Math.max(1, step - 1))}
          disabled={step === 1}
          className="px-3 py-1.5 bg-bg-secondary border border-border hover:border-white text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>PREVIOUS</span>
        </button>

        <span className="text-[10px] font-mono text-text-muted">
          {step === 5 ? 'DEMO COMPLETE' : `UP NEXT: STEP ${step + 1}`}
        </span>

        {step < 5 ? (
          <button
            onClick={() => handleStepChange(step + 1)}
            className="px-4 py-1.5 bg-cyan hover:bg-cyan-hover text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-cyan-glow cursor-pointer"
          >
            <span>NEXT STEP</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={() => {
              handleStepChange(1);
              onClose();
            }}
            className="px-4 py-1.5 bg-teal text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-teal-glow cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>FINISH TOUR</span>
          </button>
        )}
      </div>
    </div>
  );
};
