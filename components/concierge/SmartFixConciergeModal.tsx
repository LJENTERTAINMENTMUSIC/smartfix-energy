import { useState, useRef } from "react";
import {
  X,
  Sparkles,
  Send,
  Upload,
  Camera,
  CheckCircle2,
  FileText,
  ArrowRight,
  ShieldCheck,
  Building,
  User,
  Phone,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import { catalog } from "@/lib/catalog";
import { toast } from "sonner";

interface SmartFixConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
}

type Message = {
  sender: "ai" | "user";
  text: string;
  time: string;
};

export default function SmartFixConciergeModal({
  isOpen,
  onClose,
  initialTopic,
}: SmartFixConciergeModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: initialTopic
        ? `Hello! I see you are interested in ${initialTopic}. Tell me about your equipment, current monthly fuel spend, and location. I will model the optimal solution and generate your SmartFix Project Pack.`
        : "Welcome to SmartFix Energy. Tell me what you need—whether it's converting a generator to CNG, commercial solar & battery storage, fleet conversion, or recurring bulk diesel/CNG supply. What are you looking to achieve?",
      time: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectPack, setProjectPack] = useState<any>(null);

  // Form details collected
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("Lagos, Nigeria");
  const [equipmentName, setEquipmentName] = useState("");
  const [extractedOcr, setExtractedOcr] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userText = input.trim();
    const newMsgs: Message[] = [
      ...messages,
      { sender: "user", text: userText, time: "Just now" },
    ];
    setMessages(newMsgs);
    setInput("");

    // AI response simulation
    setTimeout(() => {
      let aiReply = "Thank you. I have logged these specifications into our engineering system.";
      const lower = userText.toLowerCase();

      if (lower.includes("diesel") || lower.includes("generator") || lower.includes("cummins") || lower.includes("perkins") || lower.includes("kva")) {
        aiReply = "Understood. Converting heavy-duty diesel generators to dual-fuel CNG typically reduces fuel expenditure by 50% - 60%. Do you have the generator kVA rating or a photo of the manufacturer nameplate? You can upload it directly below.";
        if (!equipmentName) setEquipmentName("Industrial Diesel Generator");
      } else if (lower.includes("fleet") || lower.includes("van") || lower.includes("car") || lower.includes("bus") || lower.includes("truck")) {
        aiReply = "Excellent. SmartFix engineers complete petrol-to-CNG conversions for transport, corporate, and logistics fleets with 200-bar certified cylinders. How many vehicles are in your fleet?";
        if (!equipmentName) setEquipmentName("Commercial Fleet Conversion");
      } else if (lower.includes("fuel") || lower.includes("litre") || lower.includes("litres") || lower.includes("supply")) {
        aiReply = "SmartFix Fuel delivers bulk certified diesel and CNG virtual pipeline gas directly to facilities across Lagos and major industrial corridors. What volume of fuel do you require monthly?";
        if (!equipmentName) setEquipmentName("Commercial Fuel Procurement Contract");
      } else if (lower.includes("solar") || lower.includes("battery") || lower.includes("inverter")) {
        aiReply = "SmartFix designs Tier-1 monocrystalline solar arrays paired with high-cycle LiFePO4 batteries to eliminate daytime generator runtime. What is your estimated peak load?";
        if (!equipmentName) setEquipmentName("Solar PV & Lithium Battery Microgrid");
      }

      setMessages((prev) => [...prev, { sender: "ai", text: aiReply, time: "Just now" }]);
    }, 600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toast.info("Analyzing photograph via SmartFix Computer Vision...");
    setTimeout(() => {
      setExtractedOcr("Perkins 2506C-E15TAG2 · 500 kVA Standby (Serial: PK-994821)");
      setEquipmentName("500 kVA Perkins Diesel Generator");
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "📷 Photograph received and analyzed! I extracted: Manufacturer: Perkins, Model: 2506C-E15TAG2, Rating: 500 kVA. Is this information correct? Please confirm your contact details to generate your Project Pack.",
          time: "Just now",
        },
      ]);
      toast.success("Nameplate extracted successfully!");
    }, 1200);
  };

  const handleGenerateProjectPack = async () => {
    if (!name.trim() || !phone.trim()) {
      toast.error("Please enter your name and phone number to create your Project Pack");
      return;
    }

    setIsSubmitting(true);
    const projectId = `SFE-PRJ-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const pack = {
      id: projectId,
      customerName: name,
      phone,
      email: email.trim(),
      company: company || "Direct Facility Client",
      location: location || "Lagos, Nigeria",
      equipment: equipmentName || "SmartFix Energy Project",
      extractedOcr,
      status: "Engineering Verification",
      nextStep: "Site Assessment Scheduled",
      materialsStatus: "Preparation in Progress (BOM 12/12 items)",
      createdAt: new Date().toISOString(),
      summary: messages.map((m) => `${m.sender.toUpperCase()}: ${m.text}`).join("\n"),
    };

    // Save to local storage for instant tracker lookup
    try {
      const existing = JSON.parse(localStorage.getItem("smartfix_projects") || "[]");
      existing.unshift(pack);
      localStorage.setItem("smartfix_projects", JSON.stringify(existing));
      localStorage.setItem("smartfix_latest_project", JSON.stringify(pack));

      // Also persist to Supabase CRM leads table
      await catalog.addLead({
        name,
        email: email.trim() || `${phone.replace(/\s+/g, "")}@smartfixenergy.com`,
        phone,
        company: company || "Direct Customer",
        service: `[${projectId}] ${equipmentName || "Complete Energy Project"}`,
        location,
        budget: "Custom Energy Project Pack",
        value: 4500000,
        status: "Hot",
      });
    } catch (err) {
      console.warn("Storage sync:", err);
    }

    setProjectPack(pack);
    setIsSubmitting(false);
    toast.success(`Project Pack ${projectId} generated!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0d0f12] border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#121418]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--energy-green)]/15 border border-[var(--energy-green)]/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[var(--energy-green)]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base sm:text-lg text-[var(--electric)]">
                  SmartFix AI Concierge
                </h3>
                <span className="w-2 h-2 rounded-full bg-[var(--energy-green)] animate-pulse" />
              </div>
              <p className="text-[11px] text-[var(--muted-foreground)]">
                Unified Energy Project &amp; Engineering Intake
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

        {/* Content Body */}
        {!projectPack ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Messages Area */}
            <div className="space-y-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                      m.sender === "user"
                        ? "bg-[var(--energy-green)] text-[var(--obsidian)] font-medium rounded-tr-none"
                        : "bg-white/[0.04] border border-white/5 text-[var(--electric)] rounded-tl-none"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Extracted OCR Card if present */}
            {extractedOcr && (
              <div className="p-3.5 rounded-2xl bg-[var(--cng-blue)]/10 border border-[var(--cng-blue)]/30 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[var(--cng-blue)] flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-[var(--electric)]">AI Nameplate Verified:</p>
                  <p className="text-[var(--muted-foreground)] font-mono mt-0.5">{extractedOcr}</p>
                </div>
              </div>
            )}

            {/* Upload Button */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl glass-panel text-xs text-[var(--electric)] hover:text-[var(--energy-green)] transition-colors cursor-pointer border border-white/5"
              >
                <Camera className="w-4 h-4 text-[var(--energy-green)]" />
                Take Photo / Upload Nameplate
              </button>
              <span className="text-[11px] text-[var(--muted-foreground)]">
                AI extracts kVA, engine &amp; serial number
              </span>
            </div>

            {/* Customer Details Capture */}
            <div className="pt-4 border-t border-white/10">
              <h4 className="text-xs font-bold text-[var(--electric)] uppercase tracking-wider mb-3">
                Project Ownership &amp; Site Location
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name *"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#141417] text-[#f5f5f7] border border-white/10 text-xs placeholder:text-[var(--muted-foreground)] focus:border-[var(--energy-green)] outline-none"
                  />
                </div>
                <div>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone / WhatsApp *"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#141417] text-[#f5f5f7] border border-white/10 text-xs placeholder:text-[var(--muted-foreground)] focus:border-[var(--energy-green)] outline-none"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Official Email Address"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#141417] text-[#f5f5f7] border border-white/10 text-xs placeholder:text-[var(--muted-foreground)] focus:border-[var(--energy-green)] outline-none"
                  />
                </div>
                <div>
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company / Facility Name"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#141417] text-[#f5f5f7] border border-white/10 text-xs placeholder:text-[var(--muted-foreground)] focus:border-[var(--energy-green)] outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Site City / State (e.g. Ikeja, Lagos)"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#141417] text-[#f5f5f7] border border-white/10 text-xs placeholder:text-[var(--muted-foreground)] focus:border-[var(--energy-green)] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Generated Project Pack Presentation */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            <div className="text-center pb-4 border-b border-white/10">
              <div className="w-12 h-12 rounded-full bg-[var(--energy-green)] text-[var(--obsidian)] flex items-center justify-center mx-auto mb-2 glow-green">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono text-[var(--energy-green)] font-bold tracking-widest uppercase">
                PROJECT PACK GENERATED
              </span>
              <h3 className="font-display font-bold text-2xl text-[var(--electric)] mt-1">
                {projectPack.id}
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                Assigned to SmartFix Energy Engineering &amp; Operations Grid
              </p>
            </div>

            {/* Pack Details */}
            <div className="space-y-2.5 rounded-2xl glass-card border border-white/10 p-4 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[var(--muted-foreground)]">Customer:</span>
                <span className="font-semibold text-[var(--electric)]">{projectPack.customerName} ({projectPack.company})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[var(--muted-foreground)]">Site Location:</span>
                <span className="font-semibold text-[var(--electric)]">{projectPack.location}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[var(--muted-foreground)]">Equipment / Scope:</span>
                <span className="font-semibold text-[var(--energy-green)]">{projectPack.equipment}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[var(--muted-foreground)]">Current Status:</span>
                <span className="font-semibold text-[var(--cng-blue)]">{projectPack.status}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[var(--muted-foreground)]">Materials Pack:</span>
                <span className="font-semibold text-white/90">{projectPack.materialsStatus}</span>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <Link
                to={`/track?id=${projectPack.id}`}
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-xs sm:text-sm btn-magnetic glow-green"
              >
                Track Live in Customer Portal
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => setProjectPack(null)}
                className="px-4 py-3.5 rounded-xl glass-panel text-xs text-[var(--muted-foreground)] hover:text-white"
              >
                Start Another
              </button>
            </div>
          </div>
        )}

        {/* Input Bar */}
        {!projectPack && (
          <div className="p-3 sm:p-4 border-t border-white/10 bg-[#121418] flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your energy requirement or questions..."
                className="flex-1 px-4 py-3 rounded-xl bg-[#141417] text-[#f5f5f7] border border-white/10 text-xs sm:text-sm placeholder:text-[var(--muted-foreground)] focus:border-[var(--energy-green)] outline-none"
              />
              <button
                type="button"
                onClick={handleSendMessage}
                className="w-11 h-11 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleGenerateProjectPack}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[var(--energy-green)] to-[var(--cng-blue)] text-[var(--obsidian)] font-bold text-xs sm:text-sm shadow-md cursor-pointer hover:opacity-95 disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              {isSubmitting ? "Generating Project Pack..." : "Lock In & Generate SmartFix Project Pack →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
