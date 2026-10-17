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
    <div className="space-y-6 font-sans">
      {/* 0. Aerospace Cinematic Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#282828]">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-cyan/10 border border-cyan/40 text-cyan">
              [05] TELEMETRY AUDIT LOG
            </span>
            <span className="text-xs font-mono text-white/50">
              FLIGHT INCIDENT LEDGER // VERIFIED DETERMINISTIC ACTIONS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white font-din flex items-center gap-2.5">
            <History className="w-6 h-6 text-cyan" />
            SIMULATION SESSION HISTORY & AUDIT TRAIL
          </h1>
          <p className="text-xs text-white/70 max-w-3xl font-sans mt-0.5">
            Persisted record of actual scenario triggers, parametric assumptions, and applied recovery decisions stored in browser localStorage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {runs.length > 0 && (
            <>
              <button
                onClick={handleExportMarkdownReport}
                className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-neutral-200 text-black font-din font-bold text-xs uppercase tracking-[0.16em] transition-all shadow-lg cursor-pointer"
                title="Download formatted Markdown Mission Incident Briefing Report"
              >
                <Download className="w-3.5 h-3.5" />
                <span>EXPORT BRIEFING (MD)</span>
              </button>
              <button
                onClick={handleExportJSON}
                className="flex items-center gap-2 px-4 py-2.5 border border-[#333333] hover:border-white text-white font-din font-bold text-xs uppercase tracking-[0.16em] transition-all cursor-pointer"
                title="Download JSON run audit report"
              >
                <Download className="w-3.5 h-3.5 text-white/60" />
                <span>EXPORT JSON</span>
              </button>
              <button
                onClick={() => setIsClearDialogOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 border border-[#333333] hover:border-red/60 text-white/60 hover:text-red font-din font-bold text-xs uppercase tracking-[0.16em] transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>CLEAR LEDGER</span>
              </button>
            </>
          )}
          <button
            onClick={resetSimulation}
            className="flex items-center gap-2 px-4 py-2.5 border border-[#333333] hover:border-white text-white/80 hover:text-white font-din font-bold text-xs uppercase tracking-[0.16em] transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>
        </div>
      </div>

      {/* Summary Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3.5 bg-[#0c0c0c] border border-[#282828]">
          <span className="text-[10px] text-white/50 block uppercase tracking-widest">RECORDED INCIDENTS</span>
          <span className="text-xl font-extrabold text-white font-din tabular-nums">{runs.length} RUNS</span>
        </div>
        <div className="p-3.5 bg-[#0c0c0c] border border-[#282828]">
          <span className="text-[10px] text-white/50 block uppercase tracking-widest">HABITAT DESIGNATION</span>
          <span className="text-xl font-extrabold text-cyan font-din">DEMO-01 (89.9°S)</span>
        </div>
        <div className="p-3.5 bg-[#0c0c0c] border border-[#282828]">
          <span className="text-[10px] text-white/50 block uppercase tracking-widest">AUDIT INTEGRITY</span>
          <span className="text-xl font-extrabold text-teal font-din">DETERMINISTIC</span>
        </div>
        <div className="p-3.5 bg-[#0c0c0c] border border-[#282828]">
          <span className="text-[10px] text-white/50 block uppercase tracking-widest">STORAGE ENGINE</span>
          <span className="text-xl font-extrabold text-white font-din">LOCAL STORAGE</span>
        </div>
      </div>

      {/* Main Table or Empty State */}
      {runs.length === 0 ? (
        <div className="hud-panel p-12 text-center max-w-xl mx-auto space-y-4 font-mono bg-[#0c0c0c] border border-[#282828]">
          <div className="w-14 h-14 bg-black/80 text-cyan border border-[#282828] mx-auto flex items-center justify-center">
            <History className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-din uppercase tracking-wide text-white">
              NO TELEMETRY RUNS RECORDED
            </h2>
            <p className="text-xs text-white/60 leading-relaxed font-sans mt-2 max-w-md mx-auto">
              Runs are automatically saved to your browser’s localStorage whenever you trigger a fault anomaly and apply a contingency mitigation protocol.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => resetSimulation()}
              className="px-5 py-2.5 bg-white hover:bg-neutral-200 text-black font-din font-bold text-xs uppercase tracking-[0.16em] transition-all cursor-pointer shadow-lg"
            >
              LAUNCH SIMULATION IN LAB
            </button>
          </div>
        </div>
      ) : (
        <div className="hud-panel bg-[#0c0c0c] border border-[#282828] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-black/80 border-b border-[#282828] text-[11px] font-mono text-white/50 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">TIMESTAMP</th>
                  <th className="px-5 py-3.5">FAULT SCENARIO</th>
                  <th className="px-5 py-3.5">APPLIED PROTOCOL</th>
                  <th className="px-5 py-3.5">FAULTED RUNWAY</th>
                  <th className="px-5 py-3.5">POST-RECOVERY</th>
                  <th className="px-5 py-3.5">ENDURANCE GAIN</th>
                  <th className="px-5 py-3.5 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#282828]/60">
                {runs.map((run) => (
                  <tr
                    key={run.id}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer"
                    onClick={() => setSelectedRun(run)}
                  >
                    <td className="px-5 py-4 font-mono text-white/60 tabular-nums">
                      {run.formattedTime}
                    </td>
                    <td className="px-5 py-4 font-bold text-white font-din text-sm tracking-wide">
                      {run.scenarioName}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-cyan">
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
                        className="px-3 py-1.5 bg-black/60 border border-[#282828] hover:border-white text-white/60 hover:text-white text-[11px] font-din font-bold uppercase tracking-wider transition-colors"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedRun(null)}
        >
          <div
            className="bg-[#0c0c0c] border border-[#282828] max-w-lg w-full p-6 space-y-4 font-mono"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#282828] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan block tracking-widest font-bold">
                  RUN ID: {selectedRun.id} • {selectedRun.formattedTime}
                </span>
                <h3 className="text-xl font-bold text-white font-din uppercase mt-0.5">
                  {selectedRun.scenarioName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRun(null)}
                className="text-white/50 hover:text-white p-1 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Run details */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-black/60 border border-[#282828] space-y-2">
                <span className="font-bold text-white uppercase text-[10px] tracking-wider block">
                  CALIBRATED INPUT PARAMETERS:
                </span>
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-white/70">
                  {Object.entries(selectedRun.inputs).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-[#282828]/50 pb-1">
                      <span>{k}:</span>
                      <strong className="text-white font-bold">{v}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-black/60 border border-red/40">
                  <span className="text-[10px] font-mono text-red block uppercase tracking-wider font-bold">FAULTED RUNWAY</span>
                  <span className="text-2xl font-extrabold font-din text-red tabular-nums">
                    {selectedRun.faultedRunway.toFixed(1)} {selectedRun.runwayUnit}
                  </span>
                </div>
                <div className="p-3 bg-black/60 border border-teal/40">
                  <span className="text-[10px] font-mono text-teal block uppercase tracking-wider font-bold">RECOVERED RUNWAY</span>
                  <span className="text-2xl font-extrabold font-din text-teal tabular-nums">
                    {selectedRun.postRecoveryRunway?.toFixed(1) || '—'} {selectedRun.runwayUnit}
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-black/60 border border-[#282828]">
                <span className="font-bold text-white uppercase text-[10px] tracking-wider block mb-1">
                  COMMITTED RECOVERY PROTOCOL:
                </span>
                <p className="text-white/80 leading-relaxed font-sans">
                  {selectedRun.appliedPlanName || 'None'}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#282828]">
              <button
                onClick={() => setSelectedRun(null)}
                className="px-5 py-2 text-xs font-din font-bold uppercase tracking-[0.16em] bg-white hover:bg-neutral-200 text-black cursor-pointer shadow-lg"
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
