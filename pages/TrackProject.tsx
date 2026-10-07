import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  Package,
  Wrench,
  ShieldCheck,
  User,
  MapPin,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Phone,
} from "lucide-react";
import { SMARTFIX_CONTACT } from "@/lib/contact";
import { toast } from "sonner";

export default function TrackProject() {
  const [searchParams] = useSearchParams();
  const [projectIdInput, setProjectIdInput] = useState(searchParams.get("id") || "");
  const [activeProject, setActiveProject] = useState<any>(null);
  const [reportedDifference, setReportedDifference] = useState(false);
  const [differenceText, setDifferenceText] = useState("");
  const [showDiffModal, setShowDiffModal] = useState(false);

  // Load project from local storage or fallback to mock
  useEffect(() => {
    const id = searchParams.get("id") || projectIdInput;
    if (id) {
      loadProject(id);
    } else {
      // Load latest or default demo project
      const latest = localStorage.getItem("smartfix_latest_project");
      if (latest) {
        setActiveProject(JSON.parse(latest));
      } else {
        // High fidelity demo project
        setActiveProject({
          id: "SFE-GEN-LAG-00231",
          customerName: "ABC Manufacturing Ltd",
          phone: "0813 978 4331",
          company: "ABC Industrial Facilities",
          location: "Ikeja Industrial Estate, Lagos",
          equipment: "3 × 500 kVA Perkins Diesel Generators",
          requirement: "Reduce diesel consumption through engineered gas/dual-fuel solution & solar peak-shaving.",
          status: "Engineering Review",
          stepNumber: 2,
          nextStep: "Site Assessment & Gas Line Audit — Friday 10:00 AM",
          assignedEngineer: "Engr. Tunde A. (Senior Energy Specialist)",
          documents: [
            { name: "Generator Nameplate Photographs (3/3)", verified: true },
            { name: "Site Layout & ATS Wiring Diagram", verified: true },
            { name: "Historical Diesel Fuel Log", verified: true },
            { name: "HSE Setback Clearance", verified: true },
          ],
          materials: [
            { item: "High-Pressure CNG Regulators", required: 3, loaded: 3, returned: 0, status: "Staged in Warehouse" },
            { item: "Dual-Fuel ECU Micro-Calibrators", required: 3, loaded: 3, returned: 0, status: "Firmware Flashed" },
            { item: "Stainless Steel Gas Line (100m)", required: "100m", loaded: "100m", returned: "0m", status: "Pressure Tested" },
            { item: "200-Bar Tested Gas Train Valves", required: 12, loaded: 12, returned: 0, status: "Certified" },
          ],
          fieldPack: {
            ppe: ["Gas-Rated Face Shield", "Anti-Static Safety Boots", "ATEX Flashlight", "Flame Retardant Coveralls"],
            tools: ["Ultrasonic Gas Leak Detector", "Extech Digital Multimeter", "Calibrated Torque Wrench (10-100Nm)"],
            safetyChecklist: ["Verify 0.0% gas concentration before ignition", "Perform 250-bar pneumatic pressure hold", "Test ATS instant switchover to diesel backup"],
          },
        });
      }
    }
  }, [searchParams]);

  const loadProject = (id: string) => {
    try {
      const allProjects = JSON.parse(localStorage.getItem("smartfix_projects") || "[]");
      const found = allProjects.find((p: any) => p.id.toLowerCase() === id.trim().toLowerCase());
      if (found) {
        setActiveProject({
          ...found,
          stepNumber: 2,
          documents: [
            { name: "Equipment / Nameplate Intake", verified: true },
            { name: "Site GPS & Facility Record", verified: true },
            { name: "Load Profile Estimates", verified: true },
          ],
          materials: [
            { item: "Engineered Dual-Fuel Conversion Kit", required: 1, loaded: 1, returned: 0, status: "Allocated" },
            { item: "High-Pressure Gas Train Assembly", required: 1, loaded: 1, returned: 0, status: "Staged" },
          ],
          fieldPack: {
            ppe: ["Gas-Rated Goggles", "Safety Boots", "Flame Retardant Vest"],
            tools: ["Gas Leak Sniffer", "Multimeter", "Torque Kit"],
            safetyChecklist: ["200-bar pressure check", "Dual-fuel ECU verification"],
          },
        });
        toast.success(`Project ${found.id} loaded!`);
      } else {
        toast.info(`Displaying Project Reference ${id}`);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleReportDifference = () => {
    if (!differenceText.trim()) {
      toast.error("Please describe the equipment difference found on site");
      return;
    }
    setReportedDifference(true);
    setShowDiffModal(false);
    toast.warning("Site Information Difference logged! Project placed on Engineering Hold for review.");
  };

  return (
    <div className="relative min-h-screen py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-3">
              <span className="w-2 h-2 rounded-full bg-[var(--energy-green)] pulse-ring" />
              <span className="text-xs font-semibold tracking-[0.2em] text-[var(--muted-foreground)] uppercase">
                MY SMARTFIX · REAL-TIME PROJECT TRACKER
              </span>
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[var(--electric)]">
              Project Dashboard &amp; Readiness
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[var(--muted-foreground)]">
              Track your energy engineering lifecycle, material allocation, and technician arrival in real time.
            </p>
          </div>

          {/* Search Box */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <input
                value={projectIdInput}
                onChange={(e) => setProjectIdInput(e.target.value)}
                placeholder="Enter Project ID (e.g. SFE-...)"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#141417] text-[#f5f5f7] border border-white/10 text-xs outline-none focus:border-[var(--energy-green)] font-mono"
              />
            </div>
            <button
              onClick={() => loadProject(projectIdInput)}
              className="px-4 py-2.5 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-xs btn-magnetic"
            >
              Lookup
            </button>
          </div>
        </div>

        {activeProject && (
          <div className="space-y-8">
            {/* Status Alert Banner */}
            {reportedDifference ? (
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-4 text-xs sm:text-sm text-amber-200">
                <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-base text-amber-300">PROJECT STATUS: ON ENGINEERING HOLD</p>
                  <p className="mt-1">
                    A site equipment difference was flagged: <em>"{differenceText}"</em>.
                    The AI Orchestrator has notified Lead Engineering and HSE. No technician will improvise on site until re-calculated BOM is approved.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl glass-card border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--energy-green)]/15 border border-[var(--energy-green)]/30 flex items-center justify-center text-[var(--energy-green)]">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold text-[var(--energy-green)] tracking-wider">
                      PROJECT ID: {activeProject.id}
                    </span>
                    <h2 className="font-display font-bold text-xl sm:text-2xl text-[var(--electric)]">
                      {activeProject.equipment}
                    </h2>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Customer: {activeProject.customerName} · {activeProject.location}
                    </p>
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-white/10 sm:pl-6">
                  <span className="text-[10px] font-mono uppercase text-[var(--muted-foreground)] block">CURRENT STATUS</span>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[var(--cng-blue)]/15 text-[var(--cng-blue)] border border-[var(--cng-blue)]/30 mt-1">
                    {activeProject.status}
                  </span>
                </div>
              </div>
            )}

            {/* Stepper Progress */}
            <div className="p-6 rounded-3xl glass-card border border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-6">
                Execution Lifecycle
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
                {[
                  { label: "1. Intake", desc: "Complete", active: true },
                  { label: "2. Engineering", desc: reportedDifference ? "Reviewing Difference" : "Approved", active: true },
                  { label: "3. Materials Pack", desc: "Staged", active: !reportedDifference },
                  { label: "4. Field Visit", desc: activeProject.nextStep?.split("—")[0] || "Scheduled", active: !reportedDifference },
                  { label: "5. Installation", desc: "Pending", active: false },
                  { label: "6. Handover", desc: "Fuel & SLA", active: false },
                ].map((s, idx) => (
                  <div
                    key={s.label}
                    className={`p-3 rounded-2xl border text-xs ${
                      s.active
                        ? "bg-[var(--energy-green)]/10 border-[var(--energy-green)]/40 text-[var(--electric)]"
                        : "bg-white/[0.02] border-white/5 text-[var(--muted-foreground)]"
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 mx-auto mb-1 ${
                        s.active ? "text-[var(--energy-green)]" : "text-white/20"
                      }`}
                    />
                    <p className="font-bold">{s.label}</p>
                    <p className="text-[10px] text-[var(--muted-foreground)] truncate">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3 Pillars: Project Pack • Materials Control • Field Readiness */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Project Information Pack */}
              <div className="rounded-3xl glass-card border border-white/10 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                    <FileText className="w-5 h-5 text-[var(--energy-green)]" />
                    <h3 className="font-display font-bold text-base text-[var(--electric)]">
                      Project Information Pack
                    </h3>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="py-1">
                      <span className="text-[var(--muted-foreground)] block">Next Step:</span>
                      <span className="font-semibold text-[var(--electric)]">{activeProject.nextStep}</span>
                    </div>
                    <div className="py-1">
                      <span className="text-[var(--muted-foreground)] block">Assigned Lead:</span>
                      <span className="font-semibold text-[var(--electric)]">{activeProject.assignedEngineer || "SmartFix Energy Ops"}</span>
                    </div>
                    <div className="py-2 border-t border-white/5">
                      <span className="text-[var(--muted-foreground)] block mb-1">Information Received:</span>
                      <ul className="space-y-1">
                        {(activeProject.documents || []).map((doc: any, i: number) => (
                          <li key={i} className="flex items-center gap-1.5 text-[11px] text-[var(--electric)]/80">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--energy-green)] flex-shrink-0" />
                            <span>{doc.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Report Difference Button */}
                <button
                  type="button"
                  onClick={() => setShowDiffModal(true)}
                  className="mt-4 w-full py-2.5 rounded-xl border border-amber-500/40 text-amber-300 text-xs font-semibold hover:bg-amber-500/10 transition-colors"
                >
                  Flag Equipment / Site Difference
                </button>
              </div>

              {/* Card 2: Material Control (BOM) */}
              <div className="rounded-3xl glass-card border border-white/10 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                    <Package className="w-5 h-5 text-[var(--cng-blue)]" />
                    <h3 className="font-display font-bold text-base text-[var(--electric)]">
                      Material Control &amp; BOM
                    </h3>
                  </div>
                  <p className="text-[11px] text-[var(--muted-foreground)] mb-3 font-mono">
                    CHAIN: WAREHOUSE → VEHICLE → SITE
                  </p>
                  <div className="space-y-2 text-xs">
                    {(activeProject.materials || []).map((mat: any, i: number) => (
                      <div key={i} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="flex justify-between font-semibold text-[var(--electric)]">
                          <span>{mat.item}</span>
                          <span className="text-[var(--energy-green)]">Qty: {mat.required}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-[var(--muted-foreground)] mt-1">
                          <span>Status: {mat.status}</span>
                          <span>Variance: {mat.variance || 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 p-2.5 rounded-xl bg-white/[0.02] text-[10px] text-[var(--muted-foreground)] text-center font-mono">
                  ✓ 100% Barcode / Serial Verified
                </div>
              </div>

              {/* Card 3: Field Team Readiness Pack */}
              <div className="rounded-3xl glass-card border border-white/10 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                    <Wrench className="w-5 h-5 text-[#ff9f0a]" />
                    <h3 className="font-display font-bold text-base text-[var(--electric)]">
                      Field Team Readiness
                    </h3>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider block mb-1">
                        Mandatory PPE Cleared
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {(activeProject.fieldPack?.ppe || ["Gas-Goggles", "Anti-Static Boots", "ATEX Light"]).map((p: string) => (
                          <span key={p} className="px-2 py-0.5 rounded-md glass-panel text-[10px] text-[var(--electric)]">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider block mb-1">
                        Specialized Diagnostic Tools
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {(activeProject.fieldPack?.tools || ["Gas Leak Sniffer", "Multimeter"]).map((t: string) => (
                          <span key={t} className="px-2 py-0.5 rounded-md glass-panel text-[10px] text-[var(--electric)]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider block mb-1">
                        Safety Protocols
                      </span>
                      <p className="text-[11px] text-[var(--muted-foreground)]">
                        Pneumatic pressure hold test &amp; ATS diesel fallback certified.
                      </p>
                    </div>
                  </div>
                </div>

                <a
                  href={SMARTFIX_CONTACT.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full py-2.5 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Contact Site Coordinator
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Site Difference Modal */}
        {showDiffModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#121418] border border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
                <h3 className="font-display font-bold text-lg text-[var(--electric)]">
                  Log Site Information Difference
                </h3>
              </div>
              <p className="text-xs text-[var(--muted-foreground)] mb-4">
                If the generator kVA, engine model, space, or wiring differs from the initial intake, report it here. The project will be automatically routed to Lead Engineering.
              </p>
              <textarea
                value={differenceText}
                onChange={(e) => setDifferenceText(e.target.value)}
                placeholder="e.g. Generator is actually 750 kVA Cummins (not 500 kVA Perkins). Requires larger gas manifold."
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl bg-[#141417] text-[#f5f5f7] border border-white/10 text-xs outline-none focus:border-amber-400 resize-none mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDiffModal(false)}
                  className="px-4 py-2 rounded-xl glass-panel text-xs text-[var(--muted-foreground)]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReportDifference}
                  className="px-4 py-2 rounded-xl bg-amber-400 text-black font-bold text-xs"
                >
                  Submit &amp; Put on Hold
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
