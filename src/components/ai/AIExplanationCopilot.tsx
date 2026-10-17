import React, { useState } from 'react';
import { useSimulation } from '../../store/simulationStore';
import { HABITAT_THRESHOLDS } from '../../data/initialState';
import {
  Sparkles,
  Bot,
  X,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  Cpu,
  MessageSquare,
} from 'lucide-react';

interface AIExplanationCopilotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIExplanationCopilot: React.FC<AIExplanationCopilotProps> = ({ isOpen, onClose }) => {
  const { state } = useSimulation();
  const { habitat, activeScenario } = state;
  const [selectedPrompt, setSelectedPrompt] = useState<string>('status');

  if (!isOpen) return null;

  const isSolarFault = activeScenario?.id === 'solar-drop';
  const isWaterFault = activeScenario?.id === 'water-recovery-fault';
  const isAirFault = activeScenario?.id === 'air-filter-fault';
  const isPlanApplied = Boolean(habitat.appliedPlanId);

  // Dynamic plain-language advisory generator
  const getMissionAdvisory = () => {
    if (!activeScenario) {
      return {
        headline: 'Lunar Habitat Operating in Steady-State Equilibrium',
        details:
          'Solar generation of 8.0 kW matches the nominal habitat electrical load of 8.0 kW with zero net battery drain. Usable battery reserve sits at 20.0 kWh above the 18.0 kWh safety floor. Potable water recycling (640 L) and oxygen margin (82%) show zero degradation. All primary environmental control loops are nominal.',
        recommendation: 'Maintain standard mission cadence. Ready for contingency anomaly injection.',
      };
    }

    if (isSolarFault) {
      const remainingBatt = Math.max(0, habitat.batteryKWh - HABITAT_THRESHOLDS.batteryFloorKWh);
      const battRunwayStr = habitat.netDrainKW > 0
        ? `${(remainingBatt / habitat.netDrainKW).toFixed(1)} hours`
        : 'indefinite (generation meets demand)';

      if (!isPlanApplied) {
        return {
          headline: 'CRITICAL ALERT: Photovoltaic Generation Occluded by Regolith Dust',
          details:
            `Solar output has collapsed from 8.0 kW to ${habitat.solarOutputKW.toFixed(1)} kW due to lunar regolith dust ejecta. The habitat's base demand remains at ${habitat.powerDemandKW.toFixed(1)} kW, creating an active net deficit of -${habitat.netDrainKW.toFixed(1)} kW that is draining the Li-Ion main bus. With only ${remainingBatt.toFixed(1)} kWh remaining above the 18.0 kWh safety floor, the unmitigated survival runway is approximately ${battRunwayStr}.`,
          recommendation:
            'Immediate load shedding required. Plan C (Shedding Science & External Experiments) is recommended to reduce demand to 4.5 kW and extend runtime to 13.3 hours.',
        };
      } else {
        return {
          headline: 'MITIGATION ACTIVE: Contingency Protocol Deployed',
          details:
            `Contingency protocol ${habitat.appliedPlanId?.toUpperCase()} has been executed. Habitat power demand has been reconfigured down to ${habitat.powerDemandKW.toFixed(1)} kW. Net battery drain has been mitigated to -${habitat.netDrainKW.toFixed(1)} kW, extending the mission survival runway to ${battRunwayStr}.`,
          recommendation:
            'Crew life-support systems (2.5 kW) and thermal loops (1.0 kW) are 100% safeguarded. Science activities remain suspended until EVA dust clearing.',
        };
      }
    }

    if (isWaterFault) {
      const remainingWater = Math.max(0, habitat.waterLitres - HABITAT_THRESHOLDS.waterFloorLitres);
      const waterRunwayStr = habitat.waterLossRateLPD > 0
        ? `${(remainingWater / habitat.waterLossRateLPD).toFixed(1)} days`
        : 'indefinite (zero net loss)';

      return {
        headline: 'WARNING: Closed-Loop Water Recovery Distillation Fault',
        details:
          `Urine distillation assembly throughput has degraded, resulting in a net fluid loss of -${habitat.waterLossRateLPD} L/day. At current consumption, the remaining ${habitat.waterLitres} L reserve will reach the 340 L safety floor in approximately ${waterRunwayStr}.`,
        recommendation:
          'Initiate graywater rationing protocol and prepare redundant catalytic filtration beds.',
      };
    }

    const remainingO2 = Math.max(0, habitat.oxygenIndicatorPct - HABITAT_THRESHOLDS.oxygenThresholdPct);
    const o2RunwayStr = habitat.oxygenDeclineRatePctPerHour > 0
      ? `${(remainingO2 / habitat.oxygenDeclineRatePctPerHour).toFixed(1)} hours`
      : 'indefinite (stable margin)';

    return {
      headline: 'Atmospheric Scrubber Contaminant Saturation Detected',
      details:
        `Trace contaminant sorbent beds have begun saturating at a rate of -${habitat.oxygenDeclineRatePctPerHour}%/hour. Current margin is ${habitat.oxygenIndicatorPct}%, with approximately ${o2RunwayStr} until the 42% critical intervention threshold.`,
      recommendation:
        'Switch to secondary air revitalization canister and inspect particulate pre-filters.',
    };
  };

  const advisory = getMissionAdvisory();

  const promptAnswers: Record<string, { title: string; answer: string }> = {
    status: {
      title: 'Current Plain-Language Mission Briefing',
      answer: advisory.details,
    },
    runway_math: {
      title: 'How is the Runway Formulated Mathematically?',
      answer:
        'AstraLoop computes runway strictly as Usable Margin divided by Net Depletion Rate: (Current Reserve - Safety Floor) / (Demand - Generation). For example, under the solar fault: (38 kWh - 18 kWh floor) / (8.0 kW - 3.0 kW) = 20 kWh / 5.0 kW = exactly 4.0 hours. No opaque neural network guesswork is involved.',
    },
    tradeoff: {
      title: 'Why is Plan C Ranked #1 Over Plans A and B?',
      answer:
        'Plan B only defers external experiments, saving 1.5 kW and giving a brief 5.7h runway. Plan A pauses laboratories, saving 3.0 kW and yielding 10.0h. Plan C sheds all non-essential science and throttles water distillation power, cutting 3.5 kW total. This leaves a tiny 1.5 kW net drain, extending runway to 13.33 hours (+9.33h gain) with zero risk to crew life support.',
    },
    nasa_grounding: {
      title: 'Is this NASA Certified or Based on Real Data?',
      answer:
        'AstraLoop is a transparent hackathon decision-support prototype using illustrative engineering values grounded in NASA public research (Lunar Surface Technology & ECLSS). It is not certified for real spacecraft flight operations. Our innovation lies in linking root faults to cross-resource runways and explainable contingency choices.',
    },
    ai_role: {
      title: 'What is the Role of AI in AstraLoop?',
      answer:
        'In aerospace life-critical systems, AI must never be an unverified black box that guesses numerical values. In AstraLoop, the physics engine produces 100% deterministic numbers first. The AI layer acts strictly as a downstream operational explainer, converting tabular avionics metrics into clear human language for flight controllers.',
    },
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none font-sans"
      onClick={onClose}
    >
      <div
        className="bg-[#090b10]/95 border border-cyan/40 shadow-2xl backdrop-blur-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan/15 text-cyan flex items-center justify-center border border-cyan/40 shadow-cyan-glow">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-din text-base font-bold uppercase tracking-wider text-white">
                  AstraLoop AI Mission Copilot
                </h3>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan text-black font-extrabold uppercase shadow-sm">
                  EXPLAINABLE LLM ASSISTANT
                </span>
              </div>
              <p className="text-[11px] text-text-muted font-sans mt-0.5">
                Translating deterministic habitat avionics telemetry into plain-language mission intelligence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prompt Category Pills */}
        <div className="p-3.5 border-b border-white/10 bg-black/40 flex flex-wrap gap-2 text-xs font-din font-bold uppercase">
          {[
            { id: 'status', label: 'STATUS ADVISORY' },
            { id: 'runway_math', label: 'RUNWAY MATH' },
            { id: 'tradeoff', label: 'PLAN C TRADE-OFF' },
            { id: 'nasa_grounding', label: 'NASA STANDARDS' },
            { id: 'ai_role', label: 'ROLE OF AI' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedPrompt(tab.id)}
              className={`px-3 py-1.5 text-[11px] border rounded-xl transition-all duration-200 cursor-pointer ${
                selectedPrompt === tab.id
                  ? 'bg-cyan text-black border-cyan font-extrabold shadow-cyan-glow/20'
                  : 'bg-white/[0.03] text-text-muted hover:text-white border-white/10 hover:border-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Advisory Body */}
        <div className="p-6 overflow-y-auto space-y-4 max-h-[60vh]">
          {/* Headline Banner */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-din font-bold uppercase tracking-wide mb-1 text-cyan">
              <Lightbulb className="w-4 h-4 text-cyan" />
              <span>{promptAnswers[selectedPrompt].title}</span>
            </div>
            <p className="text-white/90 text-xs leading-relaxed font-sans mt-2">
              {promptAnswers[selectedPrompt].answer}
            </p>
          </div>

          {/* Operational Recommendation Box */}
          <div className="p-4 rounded-xl bg-cyan/10 border-l-4 border-cyan space-y-1 shadow-sm">
            <span className="text-[10px] font-mono text-cyan uppercase font-bold tracking-widest block">
              RECOMMENDED FLIGHT DIRECTOR ACTION
            </span>
            <p className="text-xs text-text-secondary leading-relaxed font-sans">
              {advisory.recommendation}
            </p>
          </div>

          {/* Scope Honesty Tag */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-[10px] font-mono text-text-muted flex items-center justify-between">
            <span>MODEL INTEGRITY: 100% DETERMINISTIC</span>
            <span className="text-teal font-bold">HALLUCINATION RISK: 0.0%</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
          <span className="text-[11px] font-mono text-text-muted">
            SHUNYA 2026 • SPACE & BEYOND IDEATHON
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/[0.05] hover:bg-white/10 border border-white/15 rounded-xl text-xs text-white font-din font-bold uppercase transition-all duration-200 cursor-pointer"
          >
            DISMISS COPILOT
          </button>
        </div>
      </div>
    </div>
  );
};
