import React from 'react';
import { useSimulation } from '../../store/simulationStore';
import {
  AlertOctagon,
  CheckCircle,
  Play,
  ArrowRight,
  Zap,
} from 'lucide-react';

export const ActiveScenarioPanel: React.FC = () => {
  const { state, triggerScenarioWithFeedback, applyPlanWithFeedback, navigate } = useSimulation();

  const active = state.activeScenario;
  const result = state.simulationResult;

  if (!active || !result) {
    return (
      <div className="hud-panel rounded-2xl p-6 flex flex-col justify-between h-full border border-teal/40 shadow-2xl">
        <div className="space-y-4 font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-teal" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                FLIGHT SYSTEMS STATUS
              </h2>
            </div>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-teal-dark border border-teal/40 text-teal shadow-teal-glow/30">
              ALL NOMINAL
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              DEMO-01 Operating at Steady State
            </h3>
            <p className="text-xs text-text-muted leading-relaxed font-sans">
              Solar generation (8.0 kW) is perfectly balanced with total electrical demand (8.0 kW). Potable water (640 L) and oxygen margin (82%) show zero net depletion.
            </p>
          </div>
        </div>

        {/* Quick Launch Action for Live Demo */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => triggerScenarioWithFeedback('solar-drop')}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-cyan-glow active:scale-98 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>Launch Solar Drop Anomaly</span>
          </button>

          <button
            onClick={() => navigate('scenario-lab')}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-cyan text-white font-mono text-xs font-medium uppercase tracking-wider transition-all duration-200 cursor-pointer"
          >
            <span>Scenario Terminal</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan" />
          </button>
        </div>
      </div>
    );
  }

  const topPlan = result.planOutcomes.find((p) => p.isRecommended) || result.planOutcomes[0];

  return (
    <div className="hud-panel rounded-2xl p-6 flex flex-col justify-between h-full border border-red/50 shadow-red-glow/20 shadow-2xl">
      <div className="space-y-4 font-mono">
        {/* SpaceX Alert Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-red animate-spacex-pulse" />
            <h2 className="text-xs font-bold text-red uppercase tracking-widest">
              [ ANOMALY DETECTED ]
            </h2>
          </div>
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-red-dark border border-red/40 text-red shadow-red-glow/30">
            {active.severity.toUpperCase()} // HIGH PRIORITY
          </span>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {active.name}
          </h3>
          <p className="text-xs text-text-muted mt-1.5 leading-relaxed font-sans">
            {active.faultDescription}
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
            <span className="text-[9px] text-text-muted block uppercase">AFFECTED NODE</span>
            <span className="font-bold text-white text-[11px] truncate block mt-0.5">
              {active.affectedSubsystem}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-red/10 border border-red/40 shadow-red-glow/20">
            <span className="text-[9px] text-red font-bold block uppercase">PREDICTED RUNWAY</span>
            <span className="font-mono font-extrabold text-red text-base tabular-nums block mt-0.5">
              {result.faultedRunway.toFixed(1)} {result.runwayUnit.toUpperCase()}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 col-span-2 sm:col-span-1">
            <span className="text-[9px] text-text-muted block uppercase">NET DEFICIT RATE</span>
            <span className="font-mono font-bold text-amber text-xs block mt-0.5 tabular-nums">
              {result.netDrainOrLoss.toFixed(1)} {active.primaryResource === 'solar' ? 'kW DRAIN' : (active.primaryResource === 'water' ? 'L/DAY' : '%/HR')}
            </span>
          </div>
        </div>

        {/* Recommended Recovery Action Preview */}
        {topPlan && (
          <div className="p-3.5 rounded-xl bg-cyan/10 border border-cyan/40">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-[10px] font-bold text-cyan uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan" />
                TOP CONTINGENCY: {topPlan.plan.name}
              </span>
              <span className="text-[10px] font-bold text-teal tabular-nums">
                +{(topPlan.predictedRunway - result.faultedRunway).toFixed(1)} {result.runwayUnit.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed font-sans">
              {topPlan.plan.actionDescription}
            </p>
          </div>
        )}

        {/* Blueprint Page 7 Wireframe: Recovery Plan Comparison (A, B, C) */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between text-[10px] font-mono text-text-muted uppercase">
            <span>RECOVERY PLAN COMPARISON</span>
            <span className="text-cyan">RULE-BASED / DETERMINISTIC</span>
          </div>

          <div className="space-y-1.5">
            {result.planOutcomes.map((outcome) => {
              const planLetter = outcome.plan.id.replace('plan-', '').toUpperCase();
              const isApplied = state.habitat.appliedPlanId === outcome.plan.id;
              const delta = outcome.predictedRunway - result.faultedRunway;

              return (
                <div
                  key={outcome.plan.id}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all duration-200 ${
                    isApplied
                      ? 'bg-teal-dark/60 border-teal/70 text-white shadow-teal-glow/20'
                      : outcome.isRecommended
                      ? 'bg-cyan/10 border-cyan/40 hover:border-cyan text-white'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-text-secondary'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <span
                      className={`w-6 h-6 rounded-lg font-mono text-[10px] font-bold flex items-center justify-center shrink-0 ${
                        isApplied
                          ? 'bg-teal text-black'
                          : outcome.isRecommended
                          ? 'bg-cyan text-black'
                          : 'bg-white/[0.05] border border-white/15 text-text-muted'
                      }`}
                    >
                      {planLetter}
                    </span>
                    <div className="truncate">
                      <span className="text-white font-medium text-[11px] block truncate">
                        {outcome.plan.name}
                      </span>
                      <span className="text-[10px] text-text-muted block font-sans truncate">
                        {outcome.plan.tagline}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="font-mono text-teal text-[11px] font-bold tabular-nums">
                      +{delta.toFixed(1)} {result.runwayUnit}
                    </span>
                    <button
                      onClick={() => applyPlanWithFeedback(outcome.plan)}
                      className={`px-3 py-1 rounded-lg font-mono text-[10px] font-bold uppercase transition-all duration-200 cursor-pointer ${
                        isApplied
                          ? 'bg-teal text-black'
                          : 'bg-cyan/15 hover:bg-cyan text-cyan hover:text-black border border-cyan/40'
                      }`}
                    >
                      {isApplied ? 'DEPLOYED' : 'DEPLOY'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between gap-3">
        <span className="text-[11px] font-mono text-text-muted hidden sm:inline">
          Full trade study & sensitivity analysis:
        </span>
        <button
          onClick={() => navigate('recovery-plans')}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-wider shadow-cyan-glow transition-all duration-200 cursor-pointer"
        >
          <span>Compare Protocols Matrix</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
