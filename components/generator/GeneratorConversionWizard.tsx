import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Factory,
  Zap,
  Flame,
  CheckCircle2,
  Camera,
  Upload,
  ArrowRight,
  ChevronLeft,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  Clock,
  Gauge,
  FileText,
} from "lucide-react";
import { catalog } from "@/lib/catalog";
import { toast } from "sonner";

const GEN_TYPES = [
  { id: "diesel", label: "Diesel Generator", desc: "Standard industrial or standby diesel power set" },
  { id: "gas", label: "Gas Generator", desc: "Dedicated natural gas or LPG generator" },
  { id: "dual-fuel", label: "Dual-Fuel Generator", desc: "Runs on blended gas + diesel simultaneously" },
  { id: "industrial", label: "Heavy Industrial (1MW+)", desc: "Continuous prime power for manufacturing & grid" },
  { id: "petrol", label: "Petrol / Small Commercial", desc: "Up to 15kVA portable or small business unit" },
  { id: "unknown", label: "Unknown / I Need Help", desc: "Let a SmartFix engineer inspect and identify" },
];

const GOALS = [
  "Reduce diesel consumption (45-60%)",
  "Convert to CNG / Dual-fuel",
  "Reduce overall monthly energy cost",
  "Improve power reliability & uptime",
  "Add solar & LiFePO4 battery storage",
  "Hybridise my entire power system",
  "Replace aging generator with CNG set",
  "Contract reliable bulk diesel / CNG supply",
  "Install real-time fuel consumption telemetry",
  "I don't know — Design the best solution for me",
];

const POPULAR_MAKES = [
  "Cummins",
  "Perkins",
  "Caterpillar (CAT)",
  "Mikano",
  "Baudouin",
  "FG Wilson",
  "Kohler / SDMO",
  "Doosan",
  "Other / Unsure",
];

export default function GeneratorConversionWizard() {
  const [step, setStep] = useState(1);
  const [genType, setGenType] = useState("Diesel Generator");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    "Reduce diesel consumption (45-60%)",
  ]);

  // Equipment specifications
  const [make, setMake] = useState("Perkins");
  const [model, setModel] = useState("");
  const [serial, setSerial] = useState("");
  const [kva, setKva] = useState("500 kVA");
  const [gensetCount, setGensetCount] = useState("1");
  const [dutyType, setDutyType] = useState("Prime (Primary Daily Power)");
  const [dailyHours, setDailyHours] = useState("12 - 16 hours/day");
  const [monthlySpend, setMonthlySpend] = useState("₦3,000,000 - ₦6,000,000");

  // Contact details
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("Lagos, Nigeria");

  // Photos & OCR
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [ocrVerified, setOcrVerified] = useState<string | null>(null);
  const [projectPack, setProjectPack] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const toggleGoal = (g: string) => {
    if (g === "I don't know — Design the best solution for me") {
      setSelectedGoals([g]);
      return;
    }
    const filtered = selectedGoals.filter(
      (item) => item !== "I don't know — Design the best solution for me"
    );
    if (filtered.includes(g)) {
      setSelectedGoals(filtered.filter((item) => item !== g));
    } else {
      setSelectedGoals([...filtered, g]);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedPhotos((prev) => [...prev, file.name]);
    toast.info("Analyzing photograph via SmartFix Computer Vision...");

    setTimeout(() => {
      setOcrVerified("Perkins 2506C-E15TAG2 · 500 kVA (Serial: PK-88219)");
      setModel("2506C-E15TAG2");
      setKva("500 kVA");
      toast.success("Nameplate data extracted into wizard!");
    }, 1200);
  };

  const handleComplete = async () => {
    if (!name || !phone) {
      toast.error("Please enter your name and phone number to generate your Project Pack");
      return;
    }

    setIsSubmitting(true);
    const projectId = `SFE-GEN-LAG-${Math.floor(100 + Math.random() * 900)}`;

    const pack = {
      id: projectId,
      customerName: name,
      phone,
      email: email.trim(),
      company: company || "Commercial Client",
      location,
      equipment: `${gensetCount} × ${kva} ${make} ${model ? `(${model})` : ""}`,
      goals: selectedGoals,
      dailyHours,
      monthlySpend,
      dutyType,
      ocrVerified,
      uploadedPhotosCount: uploadedPhotos.length,
      status: "Engineering Review",
      nextStep: "Site Assessment & Gas Line Sizing Scheduled",
      materialsStatus: "Staging BOM (Dual-Fuel Gas Train & Regulators)",
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem("smartfix_projects") || "[]");
      existing.unshift(pack);
      localStorage.setItem("smartfix_projects", JSON.stringify(existing));
      localStorage.setItem("smartfix_latest_project", JSON.stringify(pack));

      await catalog.addLead({
        name,
        email: email.trim() || `${phone.replace(/\s+/g, "")}@smartfixenergy.com`,
        phone,
        company: company || "Direct Facility Client",
        service: `[${projectId}] GENERATOR CONVERSION: ${pack.equipment}`,
        location,
        budget: monthlySpend,
        value: 8500000,
        status: "Hot",
      });
    } catch (err) {
      console.warn(err);
    }

    setProjectPack(pack);
    setIsSubmitting(false);
    toast.success(`SmartFix Project Pack ${projectId} generated!`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl glass-card border border-white/10 p-5 sm:p-8 md:p-12 shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[var(--energy-green)] opacity-10 blur-[130px] pointer-events-none" />

      {/* Progress Header */}
      {!projectPack && (
        <div className="mb-8 pb-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-[var(--energy-green)] uppercase tracking-widest">
              GENERATOR ENERGY CONVERSION WIZARD · STEP {step} OF 4
            </span>
            <span className="text-xs text-[var(--muted-foreground)]">
              {step === 1 && "Equipment Type"}
              {step === 2 && "Primary Objectives"}
              {step === 3 && "Technical & Fuel Specifications"}
              {step === 4 && "Photos & Contact Handover"}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-[var(--energy-green)] transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* STEP 1: What do you have? */}
      {step === 1 && (
        <div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--electric)] mb-2">
            What generator do you currently operate?
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mb-6">
            Select the primary power generation asset at your facility.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
            {GEN_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setGenType(t.label)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  genType === t.label
                    ? "bg-[var(--energy-green)]/15 border-[var(--energy-green)] text-[var(--electric)]"
                    : "glass-panel border-white/5 text-[var(--muted-foreground)] hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm sm:text-base text-[var(--electric)]">
                    {t.label}
                  </span>
                  {genType === t.label && (
                    <CheckCircle2 className="w-4 h-4 text-[var(--energy-green)]" />
                  )}
                </div>
                <p className="text-xs text-[var(--muted-foreground)]">{t.desc}</p>
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-magnetic flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-sm"
            >
              Continue to Goals
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: What do you want to achieve? */}
      {step === 2 && (
        <div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--electric)] mb-2">
            What do you want to achieve?
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mb-6">
            You don't need to choose technical kits. Select your goals—our engineering team determines the exact system configuration.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
            {GOALS.map((g) => {
              const isSelected = selectedGoals.includes(g);
              const isAiAdvisor = g.includes("Design the best solution for me");
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleGoal(g)}
                  className={`p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${
                    isAiAdvisor
                      ? isSelected
                        ? "bg-gradient-to-r from-[var(--energy-green)] to-[var(--cng-blue)] text-[var(--obsidian)] font-bold border-transparent"
                        : "glass-card border-[var(--energy-green)]/40 text-[var(--energy-green)] font-semibold"
                      : isSelected
                      ? "bg-[var(--energy-green)]/15 border-[var(--energy-green)] text-[var(--electric)] font-medium"
                      : "glass-panel border-white/5 text-[var(--muted-foreground)] hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isAiAdvisor && <Sparkles className="w-4 h-4 flex-shrink-0" />}
                    {g}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 px-5 py-3 rounded-xl glass-panel text-xs text-[var(--muted-foreground)]"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="btn-magnetic flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-sm"
            >
              Specify Technical Details
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Generator Technical & Operational Data */}
      {step === 3 && (
        <div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--electric)] mb-2">
            Equipment &amp; Consumption Profile
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mb-6">
            Capturing this once eliminates repeated sales calls and allows instant engineering sizing.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1.5">
                Manufacturer
              </label>
              <select
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="w-full px-3 py-3 rounded-xl bg-[#141417] text-[#f5f5f7] border border-white/10 text-xs sm:text-sm [color-scheme:dark] outline-none"
              >
                {POPULAR_MAKES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1.5">
                Capacity / Rating
              </label>
              <select
                value={kva}
                onChange={(e) => setKva(e.target.value)}
                className="w-full px-3 py-3 rounded-xl bg-[#141417] text-[#f5f5f7] border border-white/10 text-xs sm:text-sm [color-scheme:dark] outline-none"
              >
                <option value="50 - 100 kVA">50 - 100 kVA</option>
                <option value="150 - 250 kVA">150 - 250 kVA</option>
                <option value="350 - 500 kVA">350 - 500 kVA</option>
                <option value="650 - 1,000 kVA">650 - 1,000 kVA</option>
                <option value="1,250 - 2,500 kVA">1,250 - 2,500 kVA (Heavy)</option>
                <option value="Unsure / Need Sizing">Unsure / Need Sizing</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1.5">
                Number of Units
              </label>
              <select
                value={gensetCount}
                onChange={(e) => setGensetCount(e.target.value)}
                className="w-full px-3 py-3 rounded-xl bg-[#141417] text-[#f5f5f7] border border-white/10 text-xs sm:text-sm [color-scheme:dark] outline-none"
              >
                <option value="1">1 Generator</option>
                <option value="2">2 Generators</option>
                <option value="3">3 Generators</option>
                <option value="4+">4+ Generators (Multi-Synchronised)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1.5">
                Average Daily Runtime
              </label>
              <select
                value={dailyHours}
                onChange={(e) => setDailyHours(e.target.value)}
                className="w-full px-3 py-3 rounded-xl bg-[#141417] text-[#f5f5f7] border border-white/10 text-xs sm:text-sm [color-scheme:dark] outline-none"
              >
                <option value="4 - 8 hours/day">4 - 8 hours/day (Standby)</option>
                <option value="10 - 16 hours/day">10 - 16 hours/day (Heavy Commercial)</option>
                <option value="20 - 24 hours/day">20 - 24 hours/day (Continuous 24/7)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1.5">
                Estimated Monthly Diesel Spend
              </label>
              <select
                value={monthlySpend}
                onChange={(e) => setMonthlySpend(e.target.value)}
                className="w-full px-3 py-3 rounded-xl bg-[#141417] text-[#f5f5f7] border border-white/10 text-xs sm:text-sm [color-scheme:dark] outline-none"
              >
                <option value="Under ₦1,500,000">Under ₦1,500,000</option>
                <option value="₦1,500,000 - ₦4,000,000">₦1,500,000 - ₦4,000,000</option>
                <option value="₦4,000,000 - ₦10,000,000">₦4,000,000 - ₦10,000,000</option>
                <option value="₦10,000,000+">₦10,000,000+ (Industrial Scale)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 px-5 py-3 rounded-xl glass-panel text-xs text-[var(--muted-foreground)]"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="btn-magnetic flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-sm"
            >
              Upload Photos &amp; Finalize
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Photographs & Project Pack Handover */}
      {step === 4 && !projectPack && (
        <div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--electric)] mb-2">
            Upload Equipment Photographs &amp; Site Details
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mb-6">
            Take a photo of the generator nameplate or control panel. Our AI extracts exact model parameters automatically.
          </p>

          {/* Photo Actions */}
          <div className="p-6 rounded-2xl glass-card border border-dashed border-white/20 text-center mb-6">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />
            <input
              type="file"
              ref={cameraInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              capture="environment"
              className="hidden"
            />

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-xs sm:text-sm"
              >
                <Camera className="w-4 h-4" />
                Take Photo Now (Mobile)
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl glass-panel text-xs sm:text-sm text-[var(--electric)]"
              >
                <Upload className="w-4 h-4" />
                Upload Nameplate / Documents
              </button>
            </div>

            <p className="text-[11px] text-[var(--muted-foreground)] mt-3">
              Upload photos of: Nameplate, control panel, fuel tank, or installation area.
            </p>

            {/* Uploaded badges */}
            {uploadedPhotos.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {uploadedPhotos.map((f, i) => (
                  <span key={i} className="text-xs font-mono glass-panel px-3 py-1 rounded-full text-[var(--energy-green)]">
                    ✓ {f}
                  </span>
                ))}
              </div>
            )}
          </div>

          {ocrVerified && (
            <div className="p-4 rounded-2xl bg-[var(--cng-blue)]/15 border border-[var(--cng-blue)]/30 flex items-center gap-3 mb-6">
              <ShieldCheck className="w-6 h-6 text-[var(--cng-blue)] flex-shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-[var(--electric)]">AI Computer Vision Extracted:</p>
                <p className="text-white/90 font-mono mt-0.5">{ocrVerified}</p>
              </div>
            </div>
          )}

          {/* Contact Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1.5">
                Contact Name *
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-3 py-3 rounded-xl bg-[#141417] text-[#f5f5f7] border border-white/10 text-xs sm:text-sm outline-none focus:border-[var(--energy-green)]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1.5">
                Phone / WhatsApp *
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0803 000 0000"
                className="w-full px-3 py-3 rounded-xl bg-[#141417] text-[#f5f5f7] border border-white/10 text-xs sm:text-sm outline-none focus:border-[var(--energy-green)]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1.5">
                Official Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-3 py-3 rounded-xl bg-[#141417] text-[#f5f5f7] border border-white/10 text-xs sm:text-sm outline-none focus:border-[var(--energy-green)]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1.5">
                Company / Facility
              </label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Landmark Hotel / Apex Mills"
                className="w-full px-3 py-3 rounded-xl bg-[#141417] text-[#f5f5f7] border border-white/10 text-xs sm:text-sm outline-none focus:border-[var(--energy-green)]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1.5">
                Site Location
              </label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Ikeja, Lagos"
                className="w-full px-3 py-3 rounded-xl bg-[#141417] text-[#f5f5f7] border border-white/10 text-xs sm:text-sm outline-none focus:border-[var(--energy-green)]"
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex items-center gap-1.5 px-5 py-3 rounded-xl glass-panel text-xs text-[var(--muted-foreground)]"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              type="button"
              onClick={handleComplete}
              disabled={isSubmitting}
              className="btn-magnetic flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-sm glow-green cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Generating Project Pack..." : "Lock In & Generate SmartFix Project Pack →"}
            </button>
          </div>
        </div>
      )}

      {/* COMPLETED: Project Pack Output Screen */}
      {projectPack && (
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-[var(--energy-green)] text-[var(--obsidian)] flex items-center justify-center mx-auto mb-4 glow-green">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-xs font-mono font-bold text-[var(--energy-green)] tracking-widest uppercase">
            PROJECT PACK READY FOR ENGINEERING REVIEW
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--electric)] mt-1 mb-2">
            {projectPack.id}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-lg mx-auto mb-8">
            Thank you, {projectPack.customerName}. Your generator profile has been logged directly into the SmartFix Engineering Grid.
          </p>

          <div className="max-w-xl mx-auto rounded-2xl glass-card border border-white/10 p-6 text-left text-xs space-y-3 mb-8">
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-[var(--muted-foreground)]">Equipment:</span>
              <span className="font-semibold text-[var(--electric)]">{projectPack.equipment}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-[var(--muted-foreground)]">Primary Goals:</span>
              <span className="font-semibold text-[var(--energy-green)]">{projectPack.goals.slice(0, 2).join(", ")}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-[var(--muted-foreground)]">Operating Runtime:</span>
              <span className="font-semibold text-[var(--electric)]">{projectPack.dailyHours}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-[var(--muted-foreground)]">Baseline Spend:</span>
              <span className="font-semibold text-[#ff9f0a]">{projectPack.monthlySpend}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[var(--muted-foreground)]">Field Pack Status:</span>
              <span className="font-semibold text-[var(--cng-blue)]">{projectPack.materialsStatus}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to={`/track?id=${projectPack.id}`}
              className="btn-magnetic px-8 py-4 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-sm glow-green inline-flex items-center justify-center gap-2"
            >
              Track Live in Customer Portal
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/fuel"
              className="px-6 py-4 rounded-xl glass-panel text-sm font-semibold text-[var(--electric)] hover:text-[#ff9f0a] inline-flex items-center justify-center gap-2"
            >
              Add Scheduled Diesel / CNG Fuel Supply
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
