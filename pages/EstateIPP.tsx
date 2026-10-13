import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Zap,
  Flame,
  Sun,
  BatteryCharging,
  ShieldCheck,
  CheckCircle2,
  TrendingDown,
  VolumeX,
  Smartphone,
  Layers,
  ArrowRight,
  FileText,
  Clock,
  Radio,
  Award,
  Users,
  Check,
  Phone,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import EstateIPPCalculator from "@/components/ipp/EstateIPPCalculator";
import ResidentVendingSimulator from "@/components/ipp/ResidentVendingSimulator";
import EstateSCADAPreview from "@/components/ipp/EstateSCADAPreview";
import { formatNaira } from "@/lib/catalog";
import { pricingStore, PRICE_CODES, usePricing } from "@/lib/pricingStore";
import { toast } from "sonner";

export default function EstateIPP() {
  const { prices } = usePricing();
  const adminIppTariff = pricingStore.getPriceValue(PRICE_CODES.IPP_ESTATE_BASE_TARIFF_KWH, 195);
  const adminDieselPrice = pricingStore.getPriceValue(PRICE_CODES.AGO_DIESEL_PER_LITRE, 1250);

  // Lead form state
  const [formData, setFormData] = useState({
    estateName: "",
    location: "",
    units: "",
    contactName: "",
    role: "Estate Chairman / EXCO Member",
    phone: "",
    email: "",
    currentDieselSpend: "",
    comments: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.estateName || !formData.phone || !formData.contactName) {
      toast.error("Please fill in Estate Name, Contact Name, and Phone number");
      return;
    }
    setSubmitted(true);
    toast.success("Estate Technical Audit Request Submitted! An IPP Engineer will contact you within 24 hours.");
  };

  return (
    <div className="min-h-screen pt-4 pb-20 space-y-20">
      {/* ================================================================== */}
      {/* 1. HERO SECTION                                                    */}
      {/* ================================================================== */}
      <section className="relative overflow-hidden pt-8 md:pt-16 pb-12">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[var(--energy-green)] opacity-[0.07] blur-[150px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-[var(--cng-blue)] opacity-[0.06] blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)] mb-6">
            <Link to="/" className="hover:text-[var(--energy-green)] transition-colors">Home</Link>
            <span>/</span>
            <Link to="/#solutions" className="hover:text-[var(--energy-green)] transition-colors">Solutions</Link>
            <span>/</span>
            <span className="text-[var(--energy-green)]">Estate IPP Microgrids</span>
          </div>

          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 border border-[var(--energy-green)]/30">
              <Sparkles className="w-3.5 h-3.5 text-[var(--energy-green)]" />
              <span className="text-xs font-bold tracking-[0.18em] text-[var(--energy-green)] uppercase">
                SMARTFIX ESTATE IPP · CAPTIVE MICROGRID UTILITY
              </span>
            </div>

            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-[var(--electric)]">
              24/7 ISLAND POWER PLANTS FOR <br className="hidden sm:inline" />
              <span className="text-gradient-green">GATED RESIDENTIAL ESTATES</span>
            </h1>

            <p className="text-base sm:text-lg text-[var(--muted-foreground)] max-w-3xl mx-auto leading-relaxed">
              Eradicate deafening diesel generators, erratic Band A grid tariffs, and resident billing squabbles.
              SmartFix finances, builds, fuels, and operates captive gas-to-power microgrids hybridized with solar &amp; BESS battery storage under <strong>Zero-CapEx BOOT</strong> arrangements.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 pt-2">
              <span className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-[var(--electric)] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--energy-green)]" />
                99.8% Guaranteed Uptime SLA
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-[var(--electric)] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--energy-green)]" />
                ₦0 Upfront CapEx (BOOT Model)
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-[var(--electric)] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--energy-green)]" />
                Anti-Tamper STS Smart Metering
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-[var(--electric)] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--energy-green)]" />
                ~50% Cheaper than Diesel (₦{adminIppTariff}/kWh)
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href="#calculator"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-sm btn-magnetic glow-green flex items-center justify-center gap-2 shadow-xl"
              >
                <span>Calculate Estate Savings</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#vending-demo"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel border border-white/15 text-sm font-bold text-[var(--electric)] hover:text-[var(--energy-green)] hover:border-[var(--energy-green)]/40 transition-all flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4 text-[var(--cng-blue)]" />
                <span>Test Resident Vending Demo</span>
              </a>

              <a
                href="#site-audit"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/[0.05] border border-white/10 text-sm font-bold text-[var(--muted-foreground)] hover:text-white hover:border-white/25 transition-all flex items-center justify-center gap-2"
              >
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>Book Technical Site Audit</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 2. THE THREE-WAY COMPARISON (DIESEL vs DISCO vs SMARTFIX IPP)      */}
      {/* ================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold text-[var(--energy-green)] uppercase tracking-wider block mb-2">
            THE ECONOMIC REALITY
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--electric)]">
            Why Nigerian Gated Estates Are Transitioning to IPPs
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-2">
            Compare the punishing costs of estate diesel generators and grid instability against a dedicated captive gas/solar microgrid.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Traditional Estate Diesel */}
          <div className="p-6 md:p-8 rounded-3xl glass-card border border-red-500/20 bg-red-950/10 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-red-400 px-2.5 py-1 rounded-lg bg-red-500/10">
                TRADITIONAL MODEL
              </span>
              <span className="text-xs text-red-400 font-mono">High Risk &amp; Waste</span>
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-white">Estate Diesel Generators</h3>
              <div className="text-2xl font-extrabold font-mono text-red-400 mt-2">
                ₦480 – ₦550 <span className="text-xs font-normal text-[var(--muted-foreground)]">/ kWh</span>
              </div>
            </div>
            <ul className="space-y-2.5 text-xs text-[var(--muted-foreground)]">
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span>Crushing diesel spend (₦{adminDieselPrice}/Litre) draining estate reserve funds.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span>Deafening noise pollution (&gt;85 dBA) &amp; toxic black carbon soot on buildings.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span>Fuel pilferage, short delivery volumes &amp; diesel dilution risks.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span>Constant resident disputes over service charge allocation &amp; bill defaults.</span>
              </li>
            </ul>
          </div>

          {/* Card 2: DisCo National Grid */}
          <div className="p-6 md:p-8 rounded-3xl glass-card border border-amber-500/20 bg-amber-950/10 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-amber-400 px-2.5 py-1 rounded-lg bg-amber-500/10">
                NATIONAL GRID
              </span>
              <span className="text-xs text-amber-400 font-mono">Unreliable Uptime</span>
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-white">DisCo Grid (Band A)</h3>
              <div className="text-2xl font-extrabold font-mono text-amber-400 mt-2">
                ₦209+ <span className="text-xs font-normal text-[var(--muted-foreground)]">/ kWh (+ Blackout Gens)</span>
              </div>
            </div>
            <ul className="space-y-2.5 text-xs text-[var(--muted-foreground)]">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">!</span>
                <span>Frequent national grid collapses &amp; sudden feeder line faults.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">!</span>
                <span>Unpredictable tariff hikes with zero compensation for equipment damage.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">!</span>
                <span>Voltage spikes &amp; frequency fluctuations frying resident inverters and ACs.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">!</span>
                <span>Estates still forced to maintain backup diesel generators for blackouts.</span>
              </li>
            </ul>
          </div>

          {/* Card 3: SmartFix Estate IPP */}
          <div className="p-6 md:p-8 rounded-3xl glass-card border border-[var(--energy-green)]/40 bg-[var(--energy-green)]/5 space-y-5 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-[var(--energy-green)] px-2.5 py-1 rounded-lg bg-[var(--energy-green)]/20">
                SMARTFIX UTILITY
              </span>
              <span className="text-xs text-[var(--energy-green)] font-bold">99.8% Guaranteed</span>
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-[var(--electric)]">SmartFix Estate Hybrid IPP</h3>
              <div className="text-2xl font-extrabold font-mono text-gradient-green mt-2">
                ₦{adminIppTariff} <span className="text-xs font-normal text-[var(--muted-foreground)]">/ kWh (Flat/Indexed)</span>
              </div>
            </div>
            <ul className="space-y-2.5 text-xs text-[var(--electric)]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--energy-green)] shrink-0 mt-0.5" />
                <span><strong>Zero-CapEx BOOT:</strong> SmartFix funds 100% of equipment &amp; installation.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--energy-green)] shrink-0 mt-0.5" />
                <span><strong>24/7 Pure Sine Wave:</strong> 50Hz ±0.05% frequency stability with BESS reserve.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--energy-green)] shrink-0 mt-0.5" />
                <span><strong>Acoustic Silencing:</strong> Whisper-quiet &lt;56 dBA gas plant design.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--energy-green)] shrink-0 mt-0.5" />
                <span><strong>Automated STS Vending:</strong> Residents vend tokens on mobile app; zero estate debt.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 3. FOUR CORE TECHNICAL PILLARS                                     */}
      {/* ================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-[var(--cng-blue)] uppercase tracking-wider block mb-2">
            ENGINEERING EXCELLENCE
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--electric)]">
            The 4 Pillars of SmartFix Estate Microgrids
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-2">
            An integrated utility engineered to institutional standards for maximum uptime, safety, and efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--cng-blue)]/15 text-[var(--cng-blue)] flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-[var(--electric)]">
              1. Gas Generation Baseload
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              Industrial lean-burn natural gas engines fueled via piped gas or SmartFix virtual pipeline tube trailers (200-bar CNG / LNG). Delivers heavy baseload with zero soot.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/15 text-amber-400 flex items-center justify-center">
              <Sun className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-[var(--electric)]">
              2. Solar PV Hybridization
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              High-efficiency monocrystalline solar arrays mounted on clubhouse roofs, carports, and estate perimeter canopies, offsetting up to 45% of daytime gas consumption.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-400/15 text-purple-400 flex items-center justify-center">
              <BatteryCharging className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-[var(--electric)]">
              3. Utility-Grade BESS
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              LiFePO4 Battery Energy Storage Systems (BESS) acting as instantaneous spinning reserve. Eliminates power dips, stabilizes microgrid frequency, and handles motor in-rush currents.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--energy-green)]/15 text-[var(--energy-green)] flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-[var(--electric)]">
              4. STS Smart Meter Vending
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              Anti-tamper DIN-rail split meters locked in central feeder pillars with wireless in-home CIU keypads. Residents vend tokens 24/7 via mobile app, card, or USSD.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 4. COMMERCIAL DELIVERY MODELS (BOOT, PPA, EPC)                     */}
      {/* ================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl glass-card border border-white/15 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[var(--energy-green)] uppercase tracking-wider block">
              FLEXIBLE CONTRACTING STRUCTURES
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--electric)]">
              Commercial Delivery Models Tailored for Your Estate
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
              Choose the commercial framework that aligns with your estate association's capital preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Model 1: BOOT */}
            <div className="p-6 rounded-2xl bg-black/40 border border-[var(--energy-green)]/30 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full bg-[var(--energy-green)]/20 text-[var(--energy-green)] text-[10px] font-bold uppercase tracking-wider">
                  MOST POPULAR (ZERO CAPEX)
                </span>
                <h3 className="font-display font-bold text-lg text-white">
                  BOOT (Build-Own-Operate-Transfer)
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                  SmartFix funds 100% of the project capital expenditure. We procure, build, maintain, and fuel the entire microgrid. The estate pays ₦0 upfront. Residents purchase pre-paid electricity per kWh.
                </p>
              </div>
              <ul className="text-[11px] text-[var(--muted-foreground)] space-y-1.5 border-t border-white/10 pt-3">
                <li className="flex items-center gap-1.5 text-white">
                  <Check className="w-3.5 h-3.5 text-[var(--energy-green)]" /> Upfront Estate Cost: <strong>₦0 (Zero)</strong>
                </li>
                <li className="flex items-center gap-1.5 text-white">
                  <Check className="w-3.5 h-3.5 text-[var(--energy-green)]" /> Maintenance &amp; Gas: <strong>100% SmartFix</strong>
                </li>
                <li className="flex items-center gap-1.5 text-white">
                  <Check className="w-3.5 h-3.5 text-[var(--energy-green)]" /> Contract Tenure: <strong>10 – 15 Years</strong>
                </li>
              </ul>
            </div>

            {/* Model 2: PPA */}
            <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full bg-[var(--cng-blue)]/20 text-[var(--cng-blue)] text-[10px] font-bold uppercase tracking-wider">
                  UTILITY AGREEMENT
                </span>
                <h3 className="font-display font-bold text-lg text-white">
                  PPA (Power Purchase Agreement)
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                  Long-term indexed energy supply agreement with guaranteed 99.8% uptime SLA. SmartFix serves as the private estate utility provider with contractual penalty rebates for any unscheduled interruption.
                </p>
              </div>
              <ul className="text-[11px] text-[var(--muted-foreground)] space-y-1.5 border-t border-white/10 pt-3">
                <li className="flex items-center gap-1.5 text-white">
                  <Check className="w-3.5 h-3.5 text-[var(--cng-blue)]" /> Guaranteed Uptime: <strong>99.8% SLA</strong>
                </li>
                <li className="flex items-center gap-1.5 text-white">
                  <Check className="w-3.5 h-3.5 text-[var(--cng-blue)]" /> Indexed Tariff: <strong>₦{adminIppTariff}/kWh Base</strong>
                </li>
                <li className="flex items-center gap-1.5 text-white">
                  <Check className="w-3.5 h-3.5 text-[var(--cng-blue)]" /> Outage Penalties: <strong>Contractual Credits</strong>
                </li>
              </ul>
            </div>

            {/* Model 3: Turnkey EPC + O&M */}
            <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full bg-purple-400/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
                  ESTATE ASSET OWNERSHIP
                </span>
                <h3 className="font-display font-bold text-lg text-white">
                  Turnkey EPC + 24/7 O&amp;M
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                  The estate association or property developer purchases and retains ownership of the power plant assets. SmartFix delivers turnkey EPC engineering, NERC permitting, gas fuel logistics, and 24/7 operations &amp; maintenance.
                </p>
              </div>
              <ul className="text-[11px] text-[var(--muted-foreground)] space-y-1.5 border-t border-white/10 pt-3">
                <li className="flex items-center gap-1.5 text-white">
                  <Check className="w-3.5 h-3.5 text-purple-400" /> Plant Ownership: <strong>100% Estate Association</strong>
                </li>
                <li className="flex items-center gap-1.5 text-white">
                  <Check className="w-3.5 h-3.5 text-purple-400" /> Gas Supply: <strong>SmartFix Virtual Pipeline</strong>
                </li>
                <li className="flex items-center gap-1.5 text-white">
                  <Check className="w-3.5 h-3.5 text-purple-400" /> Operations: <strong>SmartFix Resident Engineers</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 5. INTERACTIVE ESTATE IPP CALCULATOR                               */}
      {/* ================================================================== */}
      <section id="calculator" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold text-[var(--energy-green)] uppercase tracking-wider block mb-2">
            INSTANT FEASIBILITY MODELER
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--electric)]">
            Calculate Your Estate's Microgrid Sizing &amp; Payback
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-2">
            Input your estate scale and current generator runtime to project annual savings and download an Executive PPA Term Sheet.
          </p>
        </div>

        <EstateIPPCalculator />
      </section>

      {/* ================================================================== */}
      {/* 6. LIVE RESIDENT STS VENDING DEMO                                  */}
      {/* ================================================================== */}
      <section id="vending-demo" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold text-[var(--cng-blue)] uppercase tracking-wider block mb-2">
            SEAMLESS RESIDENT EXPERIENCE
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--electric)]">
            Experience the Resident Pre-Paid Vending Portal
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-2">
            Residents purchase electricity tokens in seconds from anywhere in the world. Zero cash handling for facility managers.
          </p>
        </div>

        <ResidentVendingSimulator />
      </section>

      {/* ================================================================== */}
      {/* 7. LIVE SCADA & TELEMETRY COMMAND CENTER PREVIEW                   */}
      {/* ================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold text-[var(--energy-green)] uppercase tracking-wider block mb-2">
            CENTRAL COMMAND &amp; CONTROL
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--electric)]">
            24/7 SCADA Telemetry &amp; Microgrid Grid Health
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-2">
            Every SmartFix estate microgrid is monitored by centralized SCADA systems tracking phase voltages, frequency, gas pressure, and acoustic decibels.
          </p>
        </div>

        <EstateSCADAPreview />
      </section>

      {/* ================================================================== */}
      {/* 8. CASE STUDIES & BENCHMARKS                                       */}
      {/* ================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-[var(--cng-blue)] uppercase tracking-wider block mb-2">
            PROVEN TRACK RECORD
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--electric)]">
            Delivering Real Results to Nigerian Estates
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Case Study 1 */}
          <div className="p-8 rounded-3xl glass-card border border-white/10 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--energy-green)] font-mono">
                CASE STUDY · LEKKI PHASE 1
              </span>
              <span className="text-xs text-[var(--muted-foreground)]">320 Luxury Villas</span>
            </div>
            <h3 className="font-display font-bold text-xl text-white">
              Palm Crest Residential Community (Lagos)
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              The estate previously burned over ₦26M in diesel every month across two aging 1,000kVA generators, causing constant resident complaints about soot and noise. SmartFix deployed a 1.2MW Gas Engine + 350kWp Solar PV microgrid under a 12-year BOOT contract.
            </p>
            <div className="grid grid-cols-3 gap-3 text-center border-t border-b border-white/10 py-3">
              <div>
                <span className="text-[10px] text-[var(--muted-foreground)] block">Monthly Spend</span>
                <span className="text-base font-bold text-[var(--energy-green)] font-mono">-48% Cut</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--muted-foreground)] block">Uptime SLA</span>
                <span className="text-base font-bold text-white font-mono">99.91%</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--muted-foreground)] block">Acoustic Noise</span>
                <span className="text-base font-bold text-[var(--cng-blue)] font-mono">53.8 dBA</span>
              </div>
            </div>
            <blockquote className="text-xs italic text-[var(--muted-foreground)] border-l-2 border-[var(--energy-green)] pl-3">
              "SmartFix ended our 5-year diesel crisis. Our residents now have 24/7 clean power, and the monthly savings funded our new estate recreation centre."
              <span className="block not-italic font-bold text-white mt-1">— Engr. Tunde A., HOA Works Committee Chairman</span>
            </blockquote>
          </div>

          {/* Case Study 2 */}
          <div className="p-8 rounded-3xl glass-card border border-white/10 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--cng-blue)] font-mono">
                CASE STUDY · ABUJA FCT
              </span>
              <span className="text-xs text-[var(--muted-foreground)]">180 Diplomatic Mansions</span>
            </div>
            <h3 className="font-display font-bold text-xl text-white">
              Diplomatic Hilltop Enclave (Guzape, Abuja)
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              Diplomatic residents required zero-downtime, zero-flicker power to protect sensitive communication systems. SmartFix installed an 800kVA Gas Microgrid hybridized with a 600kWh LiFePO4 BESS and STS smart split meters with RF in-home CIUs.
            </p>
            <div className="grid grid-cols-3 gap-3 text-center border-t border-b border-white/10 py-3">
              <div>
                <span className="text-[10px] text-[var(--muted-foreground)] block">Outage Streak</span>
                <span className="text-base font-bold text-[var(--energy-green)] font-mono">420+ Days</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--muted-foreground)] block">Voltage Stability</span>
                <span className="text-base font-bold text-white font-mono">230V ±0.5%</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--muted-foreground)] block">CapEx Invested</span>
                <span className="text-base font-bold text-amber-300 font-mono">₦0 (BOOT)</span>
              </div>
            </div>
            <blockquote className="text-xs italic text-[var(--muted-foreground)] border-l-2 border-[var(--cng-blue)] pl-3">
              "The power stability is world-class. No voltage flicker, no generator crank delays. SmartFix handles the gas supply seamlessly."
              <span className="block not-italic font-bold text-white mt-1">— Facility Director, Guzape Enclave</span>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 9. REGULATORY & STATUTORY COMPLIANCE                              */}
      {/* ================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-8 rounded-3xl glass-card border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-bold text-[var(--energy-green)] uppercase tracking-wider block">
                STATUTORY &amp; LEGAL GOVERNANCE
              </span>
              <h3 className="font-display font-bold text-xl text-[var(--electric)]">
                Fully Licensed Under Nigerian Electricity &amp; Petroleum Law
              </h3>
            </div>
            <span className="text-xs font-mono text-[var(--muted-foreground)]">
              Nigerian Electricity Act 2023 Compliant
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--energy-green)]/15 text-[var(--energy-green)] flex items-center justify-center font-bold">
                NERC
              </div>
              <h4 className="font-bold text-white">Captive Generation Permit</h4>
              <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
                Complies with Nigerian Electricity Regulatory Commission (NERC) Captive Power Generation Permits &amp; Mini-Grid Regulations 2023.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--cng-blue)]/15 text-[var(--cng-blue)] flex items-center justify-center font-bold">
                NMDPRA
              </div>
              <h4 className="font-bold text-white">Gas Decanting License</h4>
              <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
                Virtual pipeline gas transportation, 200-bar cascade storage, and skid decanting licensed under NMDPRA regulations.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400/15 text-amber-400 flex items-center justify-center font-bold">
                STS
              </div>
              <h4 className="font-bold text-white">IEC 62055-41 Standard</h4>
              <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
                Standard Transfer Specification (STS) certified split-meters with encrypted 20-digit token generation and tamper detection.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-400/15 text-purple-400 flex items-center justify-center font-bold">
                HSE
              </div>
              <h4 className="font-bold text-white">NFPA 52 Safety Standard</h4>
              <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
                Mandatory 6-meter safety setback, automatic ESD gas shutoff valves, and fire containment certified by Federal Fire Service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 10. BOOK SITE AUDIT & PPA CONSULTATION FORM                        */}
      {/* ================================================================== */}
      <section id="site-audit" className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="glass-card p-8 sm:p-10 rounded-3xl border border-[var(--energy-green)]/30 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[var(--energy-green)] uppercase tracking-wider block">
              SCHEDULE TECHNICAL ASSESSMENT
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--electric)]">
              Request Estate Microgrid Audit &amp; PPA Presentation
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
              Our Senior Power Systems Engineers will visit your estate, install power loggers to profile your electrical demand, and prepare a tailored PPA Feasibility Pack for your EXCO.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-[var(--energy-green)]/10 border border-[var(--energy-green)]/30 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[var(--energy-green)] text-[var(--obsidian)] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Thank You, {formData.contactName}!</h3>
              <p className="text-xs text-[var(--muted-foreground)] max-w-md mx-auto">
                We have registered your request for <strong>{formData.estateName}</strong>. Our Lead Infrastructure Engineer will call you at <strong>{formData.phone}</strong> to confirm the site audit schedule.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs font-semibold text-[var(--energy-green)] hover:underline pt-2 cursor-pointer"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--electric)]">Estate Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Palm Gardens Gated Estate"
                    value={formData.estateName}
                    onChange={(e) => setFormData({ ...formData, estateName: e.target.value })}
                    className="w-full rounded-xl bg-black/40 border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--energy-green)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--electric)]">Location / City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lekki Phase 1, Lagos"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full rounded-xl bg-black/40 border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--energy-green)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--electric)]">Approx. Number of Units</label>
                  <input
                    type="number"
                    placeholder="e.g. 250 Units"
                    value={formData.units}
                    onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                    className="w-full rounded-xl bg-black/40 border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--energy-green)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--electric)]">Your Role in the Estate</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full rounded-xl bg-black/40 border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--energy-green)]"
                  >
                    <option value="Estate Chairman / EXCO Member">Estate Chairman / EXCO Member</option>
                    <option value="Facility Manager / Facility Management Rep">Facility Manager / Facility Management Rep</option>
                    <option value="Property Developer / Landlord">Property Developer / Landlord</option>
                    <option value="Resident / Homeowner">Resident / Homeowner</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--electric)]">Contact Person Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Engr. Babatunde Balogun"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full rounded-xl bg-black/40 border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--energy-green)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--electric)]">Phone Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0803 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl bg-black/40 border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--energy-green)]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--electric)]">
                  Current Monthly Diesel Spend (Estimated ₦)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₦18,000,000 / month"
                  value={formData.currentDieselSpend}
                  onChange={(e) => setFormData({ ...formData, currentDieselSpend: e.target.value })}
                  className="w-full rounded-xl bg-black/40 border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--energy-green)]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--electric)]">
                  Additional Notes or Specific Power Issues
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your current generators, Disco band status, or upcoming estate EXCO meeting date..."
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  className="w-full rounded-xl bg-black/40 border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--energy-green)]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-sm btn-magnetic glow-green flex items-center justify-center gap-2 cursor-pointer shadow-xl hover:brightness-110"
              >
                <span>Submit Estate Site Audit Request</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-[11px] text-[var(--muted-foreground)]">
                  Need immediate discussion? Call our Estate IPP Technical Lead directly:{" "}
                  <a href="tel:08139784331" className="text-[var(--energy-green)] font-bold hover:underline">
                    0813 978 4331
                  </a>
                </span>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
