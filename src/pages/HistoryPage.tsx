import React, { useState } from 'react';
import { useSimulation } from '../store/simulationStore';
import { SimulationRun } from '../types/habitat';
import { ConfirmationDialog } from '../components/ui/ConfirmationDialog';
import {
  History,
  Trash2,
  Download,
  Info,
  ChevronRight,
  TrendingUp,
  RotateCcw,
  Clock,
  ShieldAlert,
  X,
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { state, clearHistory, resetSimulation } = useSimulation();
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [selectedRun, setSelectedRun] = useState<SimulationRun | null>(null);

  const runs = state.history;

  // Export JSON Report containing actual runs
  const handleExportJSON = () => {
    if (runs.length === 0) return;
    const reportData = {
      system: 'AstraLoop Lunar Habitat Survival Intelligence System',
      version: '1.0.0-hackathon',
      habitatId: 'DEMO-01',
      generatedAt: new Date().toISOString(),
      totalRunsRecorded: runs.length,
      runs: runs,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `astraloop-sim-report-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export Markdown Report (concise scenario report as required by Blueprint Page 7)
  const handleExportMarkdownReport = () => {
    if (runs.length === 0) return;
    const now = new Date().toLocaleString();
    let md = `# ASTRALOOP // LUNAR HABITAT MISSION INCIDENT REPORT\n`;
    md += `**Habitat Designation**: DEMO-01 (Lunar Surface Base)\n`;
    md += `**Generated**: ${now}\n`;
    md += `**Event**: Shunya 2026 / Space & Beyond Ideathon (Theme: Beyond Earth)\n`;
    md += `**Engineering Team (HackDevs)**: Shreyansh Gupta (Lead), Uttkarsh Patel (Sim Eng), Akshita Garg (ECLSS)\n\n`;
    md += `## 1. Executive Summary\n`;
    md += `AstraLoop models multi-resource survival constraints in deep space outposts. This report documents the recorded sequence of failure scenarios, cross-resource depletion runways, and rule-based mitigation outcomes.\n\n`;
    md += `## 2. Telemetry Run Incident Audit Log\n\n`;
    md += `| Time | Scenario Incident | Faulted Runway | Applied Recovery Protocol | Post-Mitigation Runway | Endurance Gain |\n`;
    md += `|---|---|---|---|---|---|\n`;
    runs.forEach((r) => {
      const delta = r.runwayDelta !== null && r.runwayDelta > 0 ? `+${r.runwayDelta} ${r.runwayUnit}` : 'N/A';
      md += `| ${r.formattedTime} | ${r.scenarioName} | ${r.faultedRunway.toFixed(1)} ${r.runwayUnit} | ${r.appliedPlanName || 'None'} | ${r.postRecoveryRunway !== null ? `${r.postRecoveryRunway.toFixed(1)} ${r.runwayUnit}` : 'Critical'} | ${delta} |\n`;
    });
    md += `\n## 3. Mathematical Runway Equations\n`;
    md += `$$\\text{Usable Margin} = \\max(0, \\text{Current Reserve} - \\text{Safety Floor})$$\n`;
    md += `$$\\text{Runway} = \\frac{\\text{Usable Margin}}{\\text{Net Depletion Rate}}$$\n\n`;
    md += `- **Primary Solar Scenario Proof**: (38 - 18) kWh / (8.0 - 3.0) kW = 20 / 5 = 4.0 hours.\n`;
    md += `- **Plan C Mitigation Proof**: With 3.5 kW shedded, net drain drops to 1.5 kW -> 20 / 1.5 = 13.33 hours (+9.33h extension).\n\n`;
    md += `## 4. NASA Reference Grounding\n`;
    md += `- [1] NASA Lunar Surface Technology (Surface power & dust mitigation)\n`;
    md += `- [2] NASA Environmental Control & Life Support Systems (ECLSS air/water loops)\n`;
    md += `- [3] NASA Lunar Surface Innovation Initiative (LSII)\n\n`;
    md += `*Disclaimer: AstraLoop is a hackathon decision-support prototype using illustrative parameters. It is not certified for real spacecraft flight operations.*\n`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `astraloop-mission-briefing-${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Keyboard navigation for inspect modal
  React.useEffect(() => {
    if (!selectedRun) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedRun(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedRun]);

  return (
    <div className="space-y-8 font-sans">
      {/* 0. Aerospace Cinematic Page Header (SpaceX Homepage Style) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-[#333333]">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
            <span className="font-din text-xs sm:text-sm font-bold tracking-[0.2em] text-white/80 uppercase block">
              05 / TELEMETRY AUDIT TRAIL
            </span>
            <span className="text-white/30 text-xs font-mono">//</span>
            <span className="text-xs font-mono text-white/50 tracking-wider">
              FLIGHT INCIDENT LEDGER • VERIFIED DETERMINISTIC ACTIONS
            </span>
          </div>
          <h1 className="font-din text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-[0.04em] text-white leading-[1.05] mb-3">
            SIMULATION SESSION HISTORY & AUDIT TRAIL
          </h1>
          <p className="text-white/80 font-sans text-sm md:text-base max-w-3xl leading-relaxed font-normal">
            Persisted record of actual scenario triggers, parametric assumptions, and applied recovery decisions stored in browser localStorage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {runs.length > 0 && (
            <>
              <button
                onClick={handleExportMarkdownReport}
                className="flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-cyan text-black font-din font-bold text-xs uppercase tracking-[0.18em] transition-all duration-300 shadow-2xl cursor-pointer sharp-brutalist"
                title="Download formatted Markdown Mission Incident Briefing Report"
              >
                <Download className="w-3.5 h-3.5" />
                <span>EXPORT BRIEFING (MD)</span>
              </button>
              <button
                onClick={handleExportJSON}
                className="flex items-center gap-2 px-5 py-3.5 border border-white/40 hover:border-white bg-transparent hover:bg-white/10 text-white font-din font-bold text-xs uppercase tracking-[0.16em] transition-all cursor-pointer sharp-brutalist"
                title="Download JSON run audit report"
              >
                <Download className="w-3.5 h-3.5 text-white/60" />
                <span>EXPORT JSON</span>
              </button>
              <button
                onClick={() => setIsClearDialogOpen(true)}
                className="flex items-center gap-2 px-5 py-3.5 border border-red/40 hover:border-red bg-red/10 hover:bg-red text-red hover:text-white font-din font-bold text-xs uppercase tracking-[0.16em] transition-all cursor-pointer sharp-brutalist"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>CLEAR LEDGER</span>
              </button>
            </>
          )}
          <button
            onClick={resetSimulation}
            className="flex items-center gap-2 px-5 py-3.5 border border-white/40 hover:border-white bg-transparent hover:bg-white/10 text-white font-din font-bold text-xs uppercase tracking-[0.16em] transition-all cursor-pointer sharp-brutalist"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>
        </div>
      </div>

      {/* Summary Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 sm:p-5 bg-[#080808] border border-[#333333] sharp-brutalist shadow-lg">
          <span className="text-[10px] text-white/50 block uppercase tracking-[0.2em] font-mono">RECORDED INCIDENTS</span>
          <span className="text-2xl font-extrabold text-white font-din tabular-nums mt-0.5 block">{runs.length} RUNS</span>
        </div>
        <div className="p-4 sm:p-5 bg-[#080808] border border-[#333333] sharp-brutalist shadow-lg">
          <span className="text-[10px] text-white/50 block uppercase tracking-[0.2em] font-mono">HABITAT DESIGNATION</span>
          <span className="text-2xl font-extrabold text-cyan font-din mt-0.5 block">DEMO-01 (89.9°S)</span>
        </div>
        <div className="p-4 sm:p-5 bg-[#080808] border border-[#333333] sharp-brutalist shadow-lg">
          <span className="text-[10px] text-white/50 block uppercase tracking-[0.2em] font-mono">AUDIT INTEGRITY</span>
          <span className="text-2xl font-extrabold text-teal font-din mt-0.5 block">DETERMINISTIC</span>
        </div>
        <div className="p-4 sm:p-5 bg-[#080808] border border-[#333333] sharp-brutalist shadow-lg">
          <span className="text-[10px] text-white/50 block uppercase tracking-[0.2em] font-mono">STORAGE ENGINE</span>
          <span className="text-2xl font-extrabold text-white font-din mt-0.5 block">LOCAL STORAGE</span>
        </div>
      </div>

      {/* Main Table or Empty State */}
      {runs.length === 0 ? (
        <div className="hud-panel p-12 text-center max-w-xl mx-auto space-y-5 font-mono bg-[#080808] border border-[#333333] shadow-2xl sharp-brutalist">
          <div className="w-16 h-16 bg-cyan/10 text-cyan border border-cyan/30 mx-auto flex items-center justify-center shadow-cyan-glow sharp-brutalist">
            <History className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-din uppercase tracking-wide text-white">
              NO TELEMETRY RUNS RECORDED
            </h2>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-sans mt-2 max-w-md mx-auto">
              Runs are automatically saved to your browser’s localStorage whenever you trigger a fault anomaly and apply a contingency mitigation protocol.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => resetSimulation()}
              className="px-8 py-4 bg-white hover:bg-cyan text-black font-din font-bold text-xs uppercase tracking-[0.18em] transition-all duration-300 cursor-pointer shadow-2xl sharp-brutalist"
            >
              LAUNCH SIMULATION IN LAB
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#080808] border border-[#333333] sharp-brutalist overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0c0c0c] border-b border-[#222222] text-[11px] font-mono text-white/60 uppercase tracking-[0.14em]">
                <tr>
                  <th className="px-5 py-4">TIMESTAMP</th>
                  <th className="px-5 py-4">FAULT SCENARIO</th>
                  <th className="px-5 py-4">APPLIED PROTOCOL</th>
                  <th className="px-5 py-4">FAULTED RUNWAY</th>
                  <th className="px-5 py-4">POST-RECOVERY</th>
                  <th className="px-5 py-4">ENDURANCE GAIN</th>
                  <th className="px-5 py-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {runs.map((run) => (
                  <tr
                    key={run.id}
                    className="hover:bg-white/[0.04] transition-colors cursor-pointer"
                    onClick={() => setSelectedRun(run)}
                  >
                    <td className="px-5 py-4 font-mono text-white/60 tabular-nums">
                      {run.formattedTime}
                    </td>
                    <td className="px-5 py-4 font-bold text-white font-din text-sm tracking-wide">
                      {run.scenarioName}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-cyan font-mono">
                        {run.appliedPlanName || 'No plan applied'}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-red font-bold tabular-nums">
                      {run.faultedRunway.toFixed(1)} {run.runwayUnit}
                    </td>
                    <td className="px-5 py-4 font-mono text-teal font-bold tabular-nums">
                      {run.postRecoveryRunway !== null
                        ? `${run.postRecoveryRunway.toFixed(1)} ${run.runwayUnit}`
                        : '—'}
                    </td>
                    <td className="px-5 py-4 font-mono text-teal font-bold tabular-nums">
                      {run.runwayDelta !== null ? `+${run.runwayDelta.toFixed(1)} ${run.runwayUnit}` : '—'}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRun(run);
                        }}
                        className="px-4 py-2 border border-[#333333] hover:border-white bg-[#050505] hover:bg-white/10 text-white/80 hover:text-white text-[11px] font-din font-bold uppercase tracking-[0.16em] transition-all sharp-brutalist"
                      >
                        INSPECT
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspect Modal Dialog */}
      {selectedRun && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedRun(null)}
        >
          <div
            className="bg-[#080808] border border-[#333333] max-w-lg w-full p-6 sm:p-8 space-y-5 font-mono shadow-2xl sharp-brutalist"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#222222] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan block tracking-[0.2em] font-bold">
                  RUN ID: {selectedRun.id} • {selectedRun.formattedTime}
                </span>
                <h3 className="text-2xl font-extrabold text-white font-din uppercase tracking-[0.04em] mt-1">
                  {selectedRun.scenarioName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRun(null)}
                className="text-white/50 hover:text-white p-2 border border-transparent hover:border-[#333333] hover:bg-white/5 transition-colors cursor-pointer sharp-brutalist"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Run details */}
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-[#050505] border border-[#222222] space-y-2.5 sharp-brutalist">
                <span className="font-bold text-white uppercase text-[10px] tracking-[0.18em] block font-din">
                  CALIBRATED INPUT PARAMETERS:
                </span>
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-white/70">
                  {Object.entries(selectedRun.inputs).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-[#1a1a1a] pb-1">
                      <span>{k}:</span>
                      <strong className="text-white font-bold">{v}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="p-4 bg-[#0c0808] border border-red/40 sharp-brutalist">
                  <span className="text-[10px] font-mono text-red block uppercase tracking-wider font-bold">FAULTED RUNWAY</span>
                  <span className="text-3xl font-extrabold font-din text-red tabular-nums mt-0.5 block">
                    {selectedRun.faultedRunway.toFixed(1)} {selectedRun.runwayUnit}
                  </span>
                </div>
                <div className="p-4 bg-[#080d0b] border border-teal/40 sharp-brutalist">
                  <span className="text-[10px] font-mono text-teal block uppercase tracking-wider font-bold">RECOVERED RUNWAY</span>
                  <span className="text-3xl font-extrabold font-din text-teal tabular-nums mt-0.5 block">
                    {selectedRun.postRecoveryRunway?.toFixed(1) || '—'} {selectedRun.runwayUnit}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-[#050505] border border-[#222222] sharp-brutalist">
                <span className="font-bold text-white uppercase text-[10px] tracking-[0.18em] block mb-1 font-din">
                  COMMITTED RECOVERY PROTOCOL:
                </span>
                <p className="text-white/80 leading-relaxed font-sans text-xs">
                  {selectedRun.appliedPlanName || 'None'}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#222222]">
              <button
                onClick={() => setSelectedRun(null)}
                className="px-6 py-3 text-xs font-din font-bold uppercase tracking-[0.18em] bg-white hover:bg-cyan text-black cursor-pointer shadow-lg transition-all sharp-brutalist"
              >
                CLOSE AUDIT VIEW
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Clearing History */}
      <ConfirmationDialog
        isOpen={isClearDialogOpen}
        title="CLEAR SIMULATION HISTORY?"
        message="This action will permanently delete all recorded simulation runs stored in your browser's localStorage. This operation cannot be reversed."
        confirmLabel="CLEAR ALL RUNS"
        isDestructive={true}
        onConfirm={() => {
          clearHistory();
          setIsClearDialogOpen(false);
        }}
        onCancel={() => setIsClearDialogOpen(false)}
      />
    </div>
  );
};
