import React, { useState } from "react";
import {
  X,
  AlertTriangle,
  Flame,
  Wrench,
  Camera,
  Mic,
  Upload,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { portalStorage, type CustomerAsset, type ServiceTicket } from "@/lib/portalData";
import { toast } from "sonner";
import { SMARTFIX_CONTACT } from "@/lib/contact";

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: CustomerAsset[];
  initialAssetId?: string;
  onTicketCreated: (ticket: ServiceTicket) => void;
}

const ISSUE_CATEGORIES = [
  { id: "Not working", label: "Not Working / Won't Start", icon: Wrench },
  { id: "Poor performance", label: "Poor Performance / Low Power", icon: AlertTriangle },
  { id: "Noise", label: "Abnormal Noise / Vibration", icon: AlertTriangle },
  { id: "Leak", label: "Gas or Liquid Fuel Leak", icon: Flame, isDanger: true },
  { id: "Error code", label: "Control Panel Error / Alarm", icon: Sparkles },
  { id: "Fuel issue", label: "Fuel Starvation / Filter Clog", icon: Flame },
  { id: "Electrical issue", label: "Electrical / ATS Tripping", icon: Sparkles },
  { id: "Physical damage", label: "Physical Damage / Piping", icon: Wrench },
  { id: "Other", label: "Other Operational Issue", icon: Wrench },
] as const;

export default function ReportIssueModal({
  isOpen,
  onClose,
  assets,
  initialAssetId,
  onTicketCreated,
}: ReportIssueModalProps) {
  const [selectedAssetId, setSelectedAssetId] = useState(initialAssetId || (assets[0]?.id ?? ""));
  const [category, setCategory] = useState<ServiceTicket["issueCategory"]>("Not working");
  const [isEmergency, setIsEmergency] = useState(false);
  const [description, setDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<ServiceTicket | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFiles((prev) => [...prev, file.name]);
      toast.success(`Attached ${file.name}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error("Please describe what is happening with the equipment");
      return;
    }

    setIsSubmitting(true);
    const selectedAsset = assets.find((a) => a.id === selectedAssetId);

    // AI Triage calculation
    setTimeout(() => {
      const urgency: ServiceTicket["urgency"] = isEmergency || category === "Leak"
        ? "CRITICAL / EMERGENCY"
        : category === "Not working"
        ? "HIGH"
        : "MEDIUM";

      const potentialParts =
        category === "Leak"
          ? ["200-Bar Viton High-Pressure Gas O-Rings", "Stainless Line Coupling (1/2 inch)"]
          : category === "Noise" || category === "Not working"
          ? ["Dual-Fuel Actuator Solenoid", "Perkins Primary Fuel Filter"]
          : ["Multi-Sensor Calibration Kit"];

      const assignedTech = {
        name: isEmergency ? "Rapid Response Unit (Engr. Babatunde K.)" : "Engr. David K.",
        role: isEmergency ? "Emergency Gas Safety Lead" : "Senior Field Power Technician",
        arrivalWindow: isEmergency ? "IMMEDIATE (Under 60 Mins)" : "Today, 14:00 - 15:30",
      };

      const newTicket = portalStorage.addTicket({
        assetId: selectedAsset?.id,
        assetName: selectedAsset?.name || "General Facility Power Asset",
        issueCategory: category,
        urgency,
        description,
        assignedTechnician: assignedTech,
        potentialParts,
      });

      setIsSubmitting(false);
      setCreatedTicket(newTicket);
      onTicketCreated(newTicket);
      toast.success(`Service Ticket ${newTicket.ticketNumber} created!`);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0e1013] border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#14161b]">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isEmergency ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-[var(--energy-green)]/15 text-[var(--energy-green)] border border-[var(--energy-green)]/30"}`}>
              {isEmergency ? <ShieldAlert className="w-5 h-5 animate-pulse" /> : <Wrench className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-[var(--electric)]">
                {isEmergency ? "Emergency Service Escalation" : "Report an Issue / Request Repair"}
              </h3>
              <p className="text-[11px] text-[var(--muted-foreground)]">
                AI Service Triage &amp; Rapid Field Engineer Dispatch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full glass-panel flex items-center justify-center text-[var(--muted-foreground)] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {!createdTicket ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Emergency Banner Switcher */}
              <div
                onClick={() => setIsEmergency(!isEmergency)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isEmergency
                    ? "bg-red-950/40 border-red-500/50 text-red-200"
                    : "bg-white/[0.02] border-white/10 hover:border-white/20 text-[var(--muted-foreground)]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Flame className={`w-5 h-5 ${isEmergency ? "text-red-400 animate-bounce" : "text-amber-400"}`} />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[var(--electric)]">
                      {isEmergency ? "CRITICAL EMERGENCY ACTIVATED" : "Is this a critical emergency?"}
                    </div>
                    <p className="text-[11px] text-[var(--muted-foreground)]">
                      Power failure, gas smell/leak, or catastrophic production halt.
                    </p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${isEmergency ? "bg-red-500 text-white" : "glass-panel text-xs text-[var(--muted-foreground)]"}`}>
                  {isEmergency ? "URGENT" : "Mark Urgent"}
                </div>
              </div>

              {isEmergency && (
                <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 flex items-center justify-between">
                  <div className="text-xs text-red-200">
                    <span className="font-bold">Immediate Safety Notice:</span> Isolate the manual gas valve and evacuate personnel.
                  </div>
                  <a
                    href={`tel:${SMARTFIX_CONTACT.phone1Intl}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white font-bold text-xs hover:bg-red-600 transition-colors whitespace-nowrap"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> Call Hot-Line
                  </a>
                </div>
              )}

              {/* Asset Selection */}
              <div>
                <label className="block text-xs font-semibold text-[var(--muted-foreground)] mb-1.5 uppercase tracking-wider">
                  Which Asset is Affected?
                </label>
                <select
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-[#14161b] text-[#f5f5f7] border border-white/10 text-xs sm:text-sm [color-scheme:dark] outline-none focus:border-[var(--energy-green)]"
                >
                  {assets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.id}) · {a.location}
                    </option>
                  ))}
                  <option value="GENERAL">Other / General Facility Infrastructure</option>
                </select>
              </div>

              {/* Issue Category Grid */}
              <div>
                <label className="block text-xs font-semibold text-[var(--muted-foreground)] mb-2 uppercase tracking-wider">
                  What is the Primary Symptom?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ISSUE_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                          isSelected
                            ? "bg-[var(--energy-green)]/15 border-[var(--energy-green)] text-[var(--electric)]"
                            : "glass-panel border-white/5 text-[var(--muted-foreground)] hover:text-white"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? "text-[var(--energy-green)]" : "text-[var(--muted-foreground)]"}`} />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-xs font-semibold text-[var(--muted-foreground)] mb-1.5 uppercase tracking-wider">
                  Describe what you are observing *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="e.g. The generator shut down automatically after 10 minutes of running with code E-04 on the control panel..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#14161b] text-[#f5f5f7] border border-white/10 text-xs sm:text-sm outline-none focus:border-[var(--energy-green)] placeholder:text-[var(--muted-foreground)] resize-none"
                />
              </div>

              {/* Uploads */}
              <div>
                <label className="block text-xs font-semibold text-[var(--muted-foreground)] mb-1.5 uppercase tracking-wider">
                  Add Evidence (Photos / Control Panel / Voice Memo)
                </label>
                <div className="flex flex-wrap gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl glass-panel text-xs text-[var(--electric)] hover:text-[var(--energy-green)] cursor-pointer">
                    <Camera className="w-3.5 h-3.5 text-[var(--energy-green)]" />
                    Take Photo
                    <input type="file" accept="image/*" capture="environment" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl glass-panel text-xs text-[var(--electric)] hover:text-[var(--energy-green)] cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-[var(--cng-blue)]" />
                    Upload File
                    <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedFiles((prev) => [...prev, "Voice_Memo_Recorded.m4a"]);
                      toast.info("Voice memo recorded (32s)");
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl glass-panel text-xs text-[var(--electric)] hover:text-amber-400 cursor-pointer"
                  >
                    <Mic className="w-3.5 h-3.5 text-amber-400" />
                    Record Voice Memo
                  </button>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {uploadedFiles.map((f, i) => (
                      <span key={i} className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-[var(--energy-green)]">
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-sm btn-magnetic glow-green cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Running AI Service Triage..." : "Submit Ticket & Dispatch Technician →"}
              </button>
            </form>
          ) : (
            /* Ticket Confirmation Screen */
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-[var(--energy-green)] text-[var(--obsidian)] flex items-center justify-center mx-auto glow-green">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono font-bold text-[var(--energy-green)] uppercase tracking-widest">
                AI SERVICE TRIAGE COMPLETED
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[var(--electric)]">
                {createdTicket.ticketNumber}
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] max-w-md mx-auto">
                Your service ticket has been logged into the SmartFix Engineering Grid. A field technician has been assigned.
              </p>

              <div className="max-w-md mx-auto rounded-2xl glass-card border border-white/10 p-5 text-left text-xs space-y-3">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[var(--muted-foreground)]">Asset:</span>
                  <span className="font-bold text-[var(--electric)]">{createdTicket.assetName}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[var(--muted-foreground)]">Urgency Level:</span>
                  <span className={`font-bold ${createdTicket.urgency.includes("EMERGENCY") ? "text-red-400" : "text-amber-400"}`}>
                    {createdTicket.urgency}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[var(--muted-foreground)]">Assigned Engineer:</span>
                  <span className="font-semibold text-[var(--electric)]">{createdTicket.assignedTechnician?.name}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[var(--muted-foreground)]">Expected Arrival:</span>
                  <span className="font-bold text-[var(--energy-green)] font-mono">
                    {createdTicket.assignedTechnician?.arrivalWindow}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--muted-foreground)] block mb-1">Pre-Allocated Parts:</span>
                  <div className="flex flex-wrap gap-1">
                    {createdTicket.potentialParts.map((p, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-white/5 text-[11px] font-mono text-[var(--cng-blue)]">
                        • {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-xs sm:text-sm btn-magnetic glow-green"
                >
                  View in My Tickets
                </button>
                <a
                  href={`https://wa.me/2348139784331?text=${encodeURIComponent(
                    `Hello SmartFix Dispatch, I just logged Ticket ${createdTicket.ticketNumber} regarding ${createdTicket.assetName}.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 rounded-xl glass-panel text-xs sm:text-sm font-semibold text-[var(--energy-green)] hover:bg-[var(--energy-green)]/15 inline-flex items-center justify-center gap-2"
                >
                  Chat with Field Dispatch on WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
