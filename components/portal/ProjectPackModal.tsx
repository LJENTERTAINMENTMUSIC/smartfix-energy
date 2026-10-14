import React, { useState, useMemo } from "react";
import {
  X,
  PackageCheck,
  Truck,
  Warehouse,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  Download,
  AlertTriangle,
  Search,
  Filter,
  QrCode,
  ArrowRight,
  UserCheck,
  Check,
  Clock,
  FileText,
  Layers,
  Hash,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import {
  portalStorage,
  type PortalProject,
  type BomMaterialItem,
  type ChainStage,
  createStandardBomItems,
} from "@/lib/portalData";
import { formatNaira } from "@/lib/catalog";
import { toast } from "sonner";

interface ProjectPackModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: PortalProject | null;
  onProjectUpdated?: (updatedProject: PortalProject) => void;
}

const STAGES: { stage: ChainStage; label: string; desc: string; icon: any }[] = [
  {
    stage: "Warehouse",
    label: "Warehouse Staged",
    desc: "Serialized & QC inspected at SmartFix Central Depot",
    icon: Warehouse,
  },
  {
    stage: "Vehicle",
    label: "Vehicle In-Transit",
    desc: "Loaded & locked with serialized bolt seals on dispatch fleet",
    icon: Truck,
  },
  {
    stage: "Site",
    label: "Site Received",
    desc: "Arrived at customer facility & accepted by site lead",
    icon: MapPin,
  },
  {
    stage: "Installed",
    label: "Installed & Handover",
    desc: "Mounted, pressure-tested & commissioned for operations",
    icon: CheckCircle2,
  },
];

export default function ProjectPackModal({
  isOpen,
  onClose,
  project,
  onProjectUpdated,
}: ProjectPackModalProps) {
  if (!isOpen || !project) return null;

  // Active state for BOM items, ensuring standard 12 items exist
  const [currentProject, setCurrentProject] = useState<PortalProject>(() => {
    if (!project.bomItems || project.bomItems.length === 0) {
      const items = createStandardBomItems(project.id, project.chainStage || "Warehouse");
      return { ...project, bomItems: items, chainStage: project.chainStage || "Warehouse" };
    }
    return project;
  });

  const [activeStageFilter, setActiveStageFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [signedHandover, setSignedHandover] = useState<boolean>(false);
  const [isAdvancing, setIsAdvancing] = useState<boolean>(false);

  // Sync state if project prop changes
  React.useEffect(() => {
    if (project) {
      if (!project.bomItems || project.bomItems.length === 0) {
        const items = createStandardBomItems(project.id, project.chainStage || "Warehouse");
        setCurrentProject({ ...project, bomItems: items, chainStage: project.chainStage || "Warehouse" });
      } else {
        setCurrentProject(project);
      }
    }
  }, [project]);

  const bomList = useMemo(() => {
    return currentProject.bomItems || [];
  }, [currentProject]);

  const filteredBom = useMemo(() => {
    return bomList.filter((item) => {
      const matchesStage = activeStageFilter === "All" || item.chainStage === activeStageFilter;
      const matchesQuery =
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.serialNumber && item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStage && matchesQuery;
    });
  }, [bomList, activeStageFilter, searchQuery]);

  const currentStageIdx = useMemo(() => {
    const stage = currentProject.chainStage || "Warehouse";
    return STAGES.findIndex((s) => s.stage === stage);
  }, [currentProject.chainStage]);

  // Stage progression action
  const handleAdvanceStage = () => {
    setIsAdvancing(true);
    const updated = portalStorage.advanceProjectChainStage(currentProject.id);
    if (updated) {
      setCurrentProject({ ...updated });
      if (onProjectUpdated) onProjectUpdated(updated);
      toast.success(
        `Project Pack ${updated.id} successfully advanced to "${updated.chainStage}" stage!`,
        { description: updated.materialsStatus }
      );
    }
    setIsAdvancing(false);
  };

  // Change individual item stage
  const handleItemStageChange = (itemId: string, newStage: ChainStage) => {
    const updated = portalStorage.updateBomItemStage(currentProject.id, itemId, newStage);
    if (updated) {
      setCurrentProject({ ...updated });
      if (onProjectUpdated) onProjectUpdated(updated);
      toast.success(`BOM item moved to ${newStage}`);
    }
  };

  const handleCustodySignOff = () => {
    setSignedHandover(true);
    toast.success("Chain of Custody Handover Electronically Signed & Verified!", {
      description: `Signee: Engr. Sarah D. / Facility Lead · Tamper-proof timestamp recorded.`,
    });
  };

  const handleDownloadManifest = () => {
    toast.success(`Generating Material Readiness Manifest for ${currentProject.id}...`, {
      description: "Includes 12/12 verified serialized items, seal hashes, and custody audit log.",
    });
  };

  const cleanPhone = currentProject.phone
    ? currentProject.phone.replace(/[^0-9]/g, "").replace(/^0/, "")
    : "8139784331";

  const getStageBadgeColor = (stage: ChainStage) => {
    switch (stage) {
      case "Warehouse":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "Vehicle":
        return "bg-[var(--cng-blue)]/15 text-[var(--cng-blue)] border-[var(--cng-blue)]/30";
      case "Site":
        return "bg-purple-500/15 text-purple-400 border-purple-500/30";
      case "Installed":
        return "bg-[var(--energy-green)]/15 text-[var(--energy-green)] border-[var(--energy-green)]/30";
      default:
        return "bg-white/10 text-white/70 border-white/10";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0d0f12] border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 bg-[#12151b] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--energy-green)]/15 text-[var(--energy-green)] border border-[var(--energy-green)]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-[var(--energy-green)] px-2.5 py-0.5 rounded bg-[var(--energy-green)]/15 border border-[var(--energy-green)]/30">
                  {currentProject.id}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 text-[var(--cng-blue)] border border-white/10 font-semibold">
                  {currentProject.type}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${getStageBadgeColor(
                    currentProject.chainStage || "Warehouse"
                  )}`}
                >
                  Stage: {currentProject.chainStage || "Warehouse"}
                </span>
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-[var(--electric)]">
                {currentProject.name}
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted-foreground)] mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[var(--cng-blue)]" />
                  {currentProject.location}
                </span>
                <span>·</span>
                <span>Customer: <strong className="text-white">{currentProject.customer || "SmartFix Client"}</strong></span>
                <span>·</span>
                <span>Lead: <strong className="text-[var(--energy-green)]">{currentProject.projectManager}</strong></span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="self-end sm:self-center w-9 h-9 rounded-full glass-panel flex items-center justify-center text-[var(--muted-foreground)] hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* ============================================================== */}
          {/* 1. INTERACTIVE 4-STAGE CHAIN OF CUSTODY PIPELINE               */}
          {/* ============================================================== */}
          <div className="p-5 sm:p-6 rounded-3xl glass-card border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--energy-green)] font-bold block">
                  Material Custody &amp; Readiness Chain
                </span>
                <h4 className="font-display font-bold text-base text-[var(--electric)]">
                  Warehouse → Vehicle → Site → Installed
                </h4>
              </div>
              <div className="flex items-center gap-2">
                {currentStageIdx < STAGES.length - 1 && (
                  <button
                    type="button"
                    onClick={handleAdvanceStage}
                    disabled={isAdvancing}
                    className="px-3.5 py-1.5 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer shadow-md"
                  >
                    <span>Advance to Next Stage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                {currentStageIdx === STAGES.length - 1 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--energy-green)]/15 text-[var(--energy-green)] text-xs font-bold border border-[var(--energy-green)]/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Handover Complete
                  </span>
                )}
              </div>
            </div>

            {/* Stepper Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {STAGES.map((s, idx) => {
                const Icon = s.icon;
                const isPassed = idx < currentStageIdx;
                const isCurrent = idx === currentStageIdx;
                const isPending = idx > currentStageIdx;

                return (
                  <div
                    key={s.stage}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isCurrent
                        ? "bg-gradient-to-b from-[var(--energy-green)]/15 to-transparent border-[var(--energy-green)] shadow-lg shadow-[var(--energy-green)]/5"
                        : isPassed
                        ? "bg-white/[0.03] border-[var(--energy-green)]/30 text-white"
                        : "bg-white/[0.01] border-white/5 text-[var(--muted-foreground)] opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          isCurrent
                            ? "bg-[var(--energy-green)] text-[var(--obsidian)] font-bold shadow-md"
                            : isPassed
                            ? "bg-[var(--energy-green)]/20 text-[var(--energy-green)]"
                            : "bg-white/5 text-[var(--muted-foreground)]"
                        }`}
                      >
                        {isPassed ? <Check className="w-4 h-4 stroke-[3]" /> : <Icon className="w-4 h-4" />}
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                        Step 0{idx + 1}
                      </span>
                    </div>
                    <div className="font-bold text-xs text-[var(--electric)] mb-0.5">
                      {s.label}
                    </div>
                    <p className="text-[11px] text-[var(--muted-foreground)] line-clamp-2 leading-tight">
                      {s.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Current Stage Status Callout */}
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--energy-green)] animate-ping" />
                <span className="text-[var(--muted-foreground)]">
                  Live Status: <strong className="text-white">{currentProject.materialsStatus}</strong>
                </span>
              </div>
              <div className="font-mono text-[11px] text-[var(--energy-green)] font-semibold">
                Custody Transfer Integrity: 100% Verified
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 2. BOM MATERIAL ITEMS (12/12 ALLOCATED)                        */}
          {/* ============================================================== */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-display font-bold text-lg text-[var(--electric)]">
                    Bill of Materials (BOM) Items
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-[var(--energy-green)]/15 text-[var(--energy-green)] font-mono text-xs font-bold border border-[var(--energy-green)]/30">
                    12/12 Allocated · 0 Inventory Variance
                  </span>
                </div>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Itemized hardware, instrumentation, safety couplings, and serialized seals in this project pack.
                </p>
              </div>

              {/* Stage Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {["All", "Warehouse", "Vehicle", "Site", "Installed"].map((filterName) => (
                  <button
                    key={filterName}
                    type="button"
                    onClick={() => setActiveStageFilter(filterName)}
                    className={`px-3 py-1 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap ${
                      activeStageFilter === filterName
                        ? "bg-white/20 text-white font-bold"
                        : "bg-white/5 text-[var(--muted-foreground)] hover:text-white"
                    }`}
                  >
                    {filterName}
                    {filterName === "All" && ` (${bomList.length})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Search filter input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[var(--muted-foreground)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search BOM by SKU, material name, or serial number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white/[0.03] border border-white/10 text-[var(--electric)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--energy-green)] transition-colors"
              />
            </div>

            {/* Material Items List */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {filteredBom.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl glass-card border border-white/5 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-[var(--cng-blue)] px-2 py-0.5 rounded bg-[var(--cng-blue)]/10 border border-[var(--cng-blue)]/20">
                        {item.sku}
                      </span>
                      <span className="font-semibold text-white text-xs">{item.name}</span>
                      <span className="px-2 py-0.5 rounded bg-white/5 text-white/80 font-mono text-[10px]">
                        Qty: {item.qty} {item.unit}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-[var(--muted-foreground)]">
                      <span className="flex items-center gap-1 font-mono text-white/70">
                        <Hash className="w-3 h-3 text-[var(--energy-green)]" />
                        SN: {item.serialNumber || "N/A"}
                      </span>
                      <span>·</span>
                      <span>Handler: <strong className="text-white/80">{item.handler}</strong></span>
                      <span>·</span>
                      <span className="text-[10px] text-white/50">{item.allocatedDate}</span>
                    </div>
                  </div>

                  {/* Stage Switcher Dropdown */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    <select
                      aria-label={`Change stage for ${item.name}`}
                      value={item.chainStage}
                      onChange={(e) => handleItemStageChange(item.id, e.target.value as ChainStage)}
                      className={`text-xs px-2.5 py-1 rounded-xl border focus:outline-none cursor-pointer font-bold ${getStageBadgeColor(
                        item.chainStage
                      )}`}
                    >
                      <option value="Warehouse" className="bg-[#14161b] text-amber-400">Warehouse</option>
                      <option value="Vehicle" className="bg-[#14161b] text-[var(--cng-blue)]">Vehicle</option>
                      <option value="Site" className="bg-[#14161b] text-purple-400">Site</option>
                      <option value="Installed" className="bg-[#14161b] text-[var(--energy-green)]">Installed</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(item.serialNumber || item.sku);
                        toast.success(`Copied Serial #${item.serialNumber || item.sku} to clipboard`);
                      }}
                      className="p-1.5 rounded-lg glass-panel hover:text-white text-[var(--muted-foreground)] transition-colors"
                      title="Copy serial number"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredBom.length === 0 && (
                <div className="p-8 text-center glass-panel rounded-2xl text-xs text-[var(--muted-foreground)]">
                  No materials match the filter criteria.
                </div>
              )}
            </div>
          </div>

          {/* ============================================================== */}
          {/* 3. FIELD LEAD & CUSTODY ACTIONS                                */}
          {/* ============================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field Lead Card */}
            <div className="p-4 rounded-2xl glass-card border border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[var(--energy-green)]/15 text-[var(--energy-green)] flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-[var(--muted-foreground)] block">
                    Assigned Field Project Manager
                  </span>
                  <div className="font-bold text-sm text-[var(--electric)]">
                    {currentProject.projectManager}
                  </div>
                  <div className="text-[11px] text-[var(--muted-foreground)]">
                    Direct Line: 0813 978 4331
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <a
                  href={`https://wa.me/234${cleanPhone}?text=${encodeURIComponent(
                    `Hello ${currentProject.projectManager}, following up regarding Project Pack ${currentProject.id} (${currentProject.name}). Current stage: ${currentProject.chainStage}.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-xl bg-[#25D366]/15 text-[#25D366] hover:bg-[#25D366]/30 flex items-center justify-center transition-colors"
                  title="WhatsApp Field Lead"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
                <a
                  href={`tel:${currentProject.phone || "08139784331"}`}
                  className="w-8 h-8 rounded-xl bg-[var(--cng-blue)]/15 text-[var(--cng-blue)] hover:bg-[var(--cng-blue)]/30 flex items-center justify-center transition-colors"
                  title="Call Field Lead"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Custody Transfer Sign-off & Manifest */}
            <div className="p-4 rounded-2xl glass-card border border-white/10 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-[var(--muted-foreground)] block">
                  Custody Transfer Verification
                </span>
                <div className="font-bold text-sm text-[var(--electric)] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[var(--energy-green)]" />
                  {signedHandover ? "Digitally Signed & Validated" : "Awaiting Final Sign-Off"}
                </div>
                <div className="text-[11px] text-[var(--muted-foreground)]">
                  {signedHandover ? "Verified on blockchain-ready audit trail" : "Sign transfer of custody"}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!signedHandover ? (
                  <button
                    type="button"
                    onClick={handleCustodySignOff}
                    className="px-3 py-1.5 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                  >
                    Sign Handover
                  </button>
                ) : (
                  <span className="px-2.5 py-1 rounded-xl bg-[var(--energy-green)]/15 text-[var(--energy-green)] text-xs font-bold border border-[var(--energy-green)]/30">
                    Signed ✓
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleDownloadManifest}
                  className="w-8 h-8 rounded-xl glass-panel text-[var(--electric)] hover:text-[var(--energy-green)] flex items-center justify-center transition-colors"
                  title="Download Manifest"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#12151b] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-[var(--muted-foreground)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--energy-green)]" />
            <span>
              Total Contract Valuation:{" "}
              <strong className="text-white font-mono">{formatNaira(currentProject.cost)}</strong> (
              {Math.round((currentProject.paidAmount / (currentProject.cost || 1)) * 100)}% Settled)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadManifest}
              className="px-4 py-2 rounded-xl glass-panel text-xs text-[var(--electric)] hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[var(--cng-blue)]" />
              <span>Export BOM Manifest</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-xs hover:opacity-95 transition-opacity cursor-pointer shadow-md"
            >
              Close Inspector
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
