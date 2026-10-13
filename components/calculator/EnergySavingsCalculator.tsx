import React, { useState, useMemo } from "react";
import {
  Zap,
  TrendingDown,
  DollarSign,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Share2,
  Leaf,
  Fuel,
  Flame,
  PhoneCall,
} from "lucide-react";
import { pricingStore, PRICE_CODES } from "@/lib/pricingStore";
import { catalog, formatNaira } from "@/lib/catalog";
import { toast } from "sonner";
import { SMARTFIX_CONTACT } from "@/lib/contact";

interface EnergySavingsCalculatorProps {
  embedded?: boolean;
  onProjectCreated?: (projectId: string) => void;
}

export default function EnergySavingsCalculator({
  embedded = false,
  onProjectCreated,
}: EnergySavingsCalculatorProps) {
  // Input parameters
  const [kva, setKva] = useState<number>(500);
  const [hoursPerDay, setHoursPerDay] = useState<number>(14);
  const [daysPerMonth, setDaysPerMonth] = useState<number>(26);
  const [loadFactor, setLoadFactor] = useState<number>(70); // % average electrical load
  const [substitutionRate, setSubstitutionRate] = useState<number>(65); // % gas substitution (50-70%)

  // Pricing (read live from admin pricingStore, with reactive fallback)
  const dieselPrice = pricingStore.getPriceValue(PRICE_CODES.AGO_DIESEL_PER_LITRE) || 1250;
  const cngPrice = pricingStore.getPriceValue(PRICE_CODES.CNG_PER_SCM) || 1150;
  const conversionBaseKvaRate = pricingStore.getPriceValue(PRICE_CODES.GENERATOR_DUALFUEL_CONVERSION) || 35000;

  // Lead modal state
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientLocation, setClientLocation] = useState("Lagos, Nigeria");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proposalGenerated, setProposalGenerated] = useState<string | null>(null);

  // Calculations
  const metrics = useMemo(() => {
    // Specific fuel consumption: ~0.25 L per kVA-hr at nominal load
    const litersPerHour100Load = kva * 0.25;
    const actualLitersPerHour = litersPerHour100Load * (loadFactor / 100);
    const monthlyDieselLiters = actualLitersPerHour * hoursPerDay * daysPerMonth;

    // Current baseline monthly spend (100% AGO Diesel)
    const baselineMonthlySpend = monthlyDieselLiters * dieselPrice;
    const baselineAnnualSpend = baselineMonthlySpend * 12;

    // With SmartFix Dual-Fuel CNG:
    // Natural gas substitution: substitutionRate% of diesel is replaced by CNG
    const dieselLitersSaved = monthlyDieselLiters * (substitutionRate / 100);
    const dieselLitersRetained = monthlyDieselLiters - dieselLitersSaved;

    // 1 Litre Diesel equivalent in natural gas ≈ 1.05 SCM
    const scmGasRequired = dieselLitersSaved * 1.05;

    const monthlyRetainedDieselCost = dieselLitersRetained * dieselPrice;
    const monthlyGasCost = scmGasRequired * cngPrice;
    const newMonthlySpend = monthlyRetainedDieselCost + monthlyGasCost;

    const monthlySavings = baselineMonthlySpend - newMonthlySpend;
    const annualSavings = monthlySavings * 12;
    const savingsPercent = Math.round((monthlySavings / baselineMonthlySpend) * 100);

    // Approximate Turnkey Conversion CAPEX (ECU, gas train, venturi mixer, regulators, safety valves, certification)
    const estimatedCapex = kva * conversionBaseKvaRate;
    const paybackMonths = monthlySavings > 0 ? (estimatedCapex / monthlySavings).toFixed(1) : "0";

    // Environmental impact: ~2.68 kg CO2 per liter of diesel burned; natural gas emits ~25% less CO2
    const metricTonsCo2Avoided = Math.round((dieselLitersSaved * 2.68 * 0.25 * 12) / 1000);

    return {
      monthlyDieselLiters: Math.round(monthlyDieselLiters),
      baselineMonthlySpend,
      baselineAnnualSpend,
      dieselLitersSaved: Math.round(dieselLitersSaved),
      scmGasRequired: Math.round(scmGasRequired),
      newMonthlySpend,
      monthlySavings,
      annualSavings,
      savingsPercent,
      estimatedCapex,
      paybackMonths,
      metricTonsCo2Avoided,
    };
  }, [kva, hoursPerDay, daysPerMonth, loadFactor, substitutionRate, dieselPrice, cngPrice, conversionBaseKvaRate]);

  const handleGenerateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      toast.error("Please enter your name and phone number");
      return;
    }

    setIsSubmitting(true);
    const projectId = "SFE-ROI-" + Math.floor(1000 + Math.random() * 9000);

    const pack = {
      id: projectId,
      customer: clientName,
      customerEmail: clientEmail,
      company: clientCompany || "Industrial Client",
      equipment: `Dual-Fuel CNG Conversion (${kva} kVA Generator)`,
      location: clientLocation,
      phone: clientPhone,
      objective: `Projected Savings: ₦${Math.round(metrics.monthlySavings / 1000000)}M/mo (${metrics.savingsPercent}% reduction). Payback in ${metrics.paybackMonths} months.`,
      status: "Engineering Review",
      nextStep: "Technical Site Audit & Gas Train Sizing",
      materialsStatus: "Gas Train & ECU Sized",
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem("smartfix_projects") || "[]");
      existing.unshift(pack);
      localStorage.setItem("smartfix_projects", JSON.stringify(existing));
      localStorage.setItem("smartfix_latest_project", JSON.stringify(pack));

      await catalog.addLead({
        name: clientName,
        email: clientEmail.trim() || `${clientPhone.replace(/\s+/g, "")}@roi.smartfixenergy.com`,
        phone: clientPhone,
        company: clientCompany || "Commercial Facility",
        service: `[${projectId}] ${kva}kVA Dual-Fuel Conversion (ROI: ₦${Math.round(metrics.monthlySavings).toLocaleString()}/mo)`,
        location: clientLocation,
        budget: `Est. CAPEX: ₦${Math.round(metrics.estimatedCapex).toLocaleString()}`,
        value: metrics.estimatedCapex,
        status: "Hot",
      });

      setProposalGenerated(projectId);
      if (onProjectCreated) onProjectCreated(projectId);
      toast.success(`Executive Feasibility Pack ${projectId} generated!`);
    } catch (err) {
      console.error("Failed to generate lead:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const shareToWhatsApp = () => {
    const text = `*SMARTFIX ENERGY — DUAL-FUEL FEASIBILITY REPORT*%0A` +
      `*Facility:* ${clientCompany || "Client Site"} (${clientLocation})%0A` +
      `*Generator:* ${kva} kVA (${hoursPerDay} hrs/day, ${daysPerMonth} days/mo)%0A` +
      `*Current Diesel Spend:* ${formatNaira(metrics.baselineMonthlySpend)}/month%0A` +
      `*Dual-Fuel Hybrid Spend:* ${formatNaira(metrics.newMonthlySpend)}/month%0A` +
      `*Projected Monthly Savings:* ${formatNaira(metrics.monthlySavings)}/month (${metrics.savingsPercent}%)%0A` +
      `*Annual Savings:* ${formatNaira(metrics.annualSavings)}/year%0A` +
      `*Estimated Payback Period:* ${metrics.paybackMonths} Months%0A` +
      `*CO2 Avoided:* ${metrics.metricTonsCo2Avoided} Tons/year%0A` +
      `*Ref Code:* ${proposalGenerated || "SFE-FEASIBILITY"}`;
    window.open(`https://wa.me/2348139784331?text=${text}`, "_blank");
  };

  return (
    <div className={`relative ${embedded ? "" : "py-10 md:py-16"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        {!embedded && (
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-4">
              <Sparkles className="w-4 h-4 text-[var(--energy-green)]" />
              <span className="text-xs font-semibold tracking-[0.2em] text-[var(--muted-foreground)] uppercase">
                EXECUTIVE ROI CALCULATOR
              </span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-[var(--electric)]">
              CALCULATE YOUR <span className="text-gradient-green">DIESEL SAVINGS</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[var(--muted-foreground)] max-w-xl mx-auto">
              Simulate instant fuel savings, conversion payback timeline, and operational cost reduction for your commercial generators.
            </p>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 glass-card p-6 sm:p-8 space-y-6 rounded-3xl border border-white/10">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-display font-bold text-lg text-[var(--electric)] flex items-center gap-2">
                <Zap className="w-5 h-5 text-[var(--energy-green)]" /> Facility Parameters
              </h3>
              <span className="text-[11px] font-mono font-bold text-[var(--energy-green)] px-2.5 py-1 rounded-full bg-[var(--energy-green)]/10">
                LIVE ADMIN RATES
              </span>
            </div>

            {/* Generator Size Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-[var(--muted-foreground)]">
                  Generator Capacity
                </label>
                <span className="font-display font-bold text-base text-[var(--electric)]">
                  {kva} <span className="text-xs font-normal text-[var(--muted-foreground)]">kVA</span>
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={2500}
                step={50}
                value={kva}
                onChange={(e) => setKva(Number(e.target.value))}
                className="w-full accent-[var(--energy-green)] cursor-pointer h-2 bg-white/10 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-[var(--muted-foreground)] mt-1">
                <span>50 kVA</span>
                <span>500 kVA</span>
                <span>1,250 kVA</span>
                <span>2,500 kVA</span>
              </div>
            </div>

            {/* Daily Hours Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-[var(--muted-foreground)]">
                  Daily Operating Run-Time
                </label>
                <span className="font-display font-bold text-base text-[var(--electric)]">
                  {hoursPerDay} <span className="text-xs font-normal text-[var(--muted-foreground)]">Hours/day</span>
                </span>
              </div>
              <input
                type="range"
                min={4}
                max={24}
                step={1}
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
                className="w-full accent-[var(--cng-blue)] cursor-pointer h-2 bg-white/10 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-[var(--muted-foreground)] mt-1">
                <span>4 hrs (Peak backup)</span>
                <span>14 hrs (Standard)</span>
                <span>24 hrs (Continuous)</span>
              </div>
            </div>

            {/* Operational Days Per Month */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-[var(--muted-foreground)]">
                  Operating Days / Month
                </label>
                <span className="font-display font-bold text-base text-[var(--electric)]">
                  {daysPerMonth} <span className="text-xs font-normal text-[var(--muted-foreground)]">Days</span>
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={31}
                step={1}
                value={daysPerMonth}
                onChange={(e) => setDaysPerMonth(Number(e.target.value))}
                className="w-full accent-[#ff9f0a] cursor-pointer h-2 bg-white/10 rounded-lg"
              />
            </div>

            {/* Gas Substitution Rate Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-[var(--muted-foreground)]">
                  CNG Gas Substitution Rate
                </label>
                <span className="font-display font-bold text-base text-[var(--energy-green)]">
                  {substitutionRate}% <span className="text-xs font-normal text-[var(--muted-foreground)]">Gas</span>
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={75}
                step={5}
                value={substitutionRate}
                onChange={(e) => setSubstitutionRate(Number(e.target.value))}
                className="w-full accent-[var(--energy-green)] cursor-pointer h-2 bg-white/10 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-[var(--muted-foreground)] mt-1">
                <span>50% (Conservative)</span>
                <span>65% (Optimal)</span>
                <span>75% (Maximum Safe)</span>
              </div>
            </div>

            {/* Live Tariff Summary Box */}
            <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-2 text-xs">
              <div className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
                Grounded Tariff References
              </div>
              <div className="flex justify-between items-center text-[var(--electric)]">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Fuel className="w-3.5 h-3.5 text-[#ff9f0a]" /> Certified AGO Diesel:
                </span>
                <span className="font-mono font-bold">₦{dieselPrice.toLocaleString()} / Litre</span>
              </div>
              <div className="flex justify-between items-center text-[var(--electric)]">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Flame className="w-3.5 h-3.5 text-[var(--cng-blue)]" /> Virtual Pipeline CNG:
                </span>
                <span className="font-mono font-bold">₦{cngPrice.toLocaleString()} / SCM</span>
              </div>
              <p className="text-[10px] text-[var(--muted-foreground)] pt-1 border-t border-white/5">
                Tariffs governed by SmartFix Procurement Desk. Delivered with digital flowmeter certification.
              </p>
            </div>
          </div>

          {/* Results Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Big Headline Metric Card */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[var(--energy-green)]/30 bg-gradient-to-br from-black/90 via-[var(--energy-green)]/[0.06] to-transparent relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--energy-green)] opacity-[0.08] blur-[80px] pointer-events-none" />

              <div className="relative">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--energy-green)]">
                    PROJECTED MONTHLY BOTTOM-LINE SAVINGS
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--energy-green)] text-[var(--obsidian)]">
                    {metrics.savingsPercent}% REDUCTION
                  </span>
                </div>

                <div className="font-display font-extrabold text-4xl sm:text-6xl text-[var(--electric)] tracking-tight my-3">
                  ₦{Math.round(metrics.monthlySavings).toLocaleString()}
                  <span className="text-lg font-normal text-[var(--muted-foreground)]"> / month</span>
                </div>

                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed max-w-xl">
                  By substituting {substitutionRate}% of your {kva} kVA diesel consumption with SmartFix Virtual Pipeline CNG, you avoid burning{" "}
                  <strong className="text-[var(--electric)]">{metrics.dieselLitersSaved.toLocaleString()} Litres of AGO</strong> each month.
                </p>
              </div>
            </div>

            {/* 3 Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-card p-5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--muted-foreground)] mb-1">
                  <TrendingDown className="w-4 h-4 text-[var(--energy-green)]" /> Annual Savings
                </div>
                <div className="font-display font-bold text-xl sm:text-2xl text-[var(--energy-green)]">
                  ₦{Math.round(metrics.annualSavings / 1000000).toLocaleString()}M
                </div>
                <div className="text-[10px] text-[var(--muted-foreground)] mt-0.5">Per operational year</div>
              </div>

              <div className="glass-card p-5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--muted-foreground)] mb-1">
                  <Clock className="w-4 h-4 text-[var(--cng-blue)]" /> Estimated Payback
                </div>
                <div className="font-display font-bold text-xl sm:text-2xl text-[var(--electric)]">
                  {metrics.paybackMonths} <span className="text-sm font-normal text-[var(--muted-foreground)]">Months</span>
                </div>
                <div className="text-[10px] text-[var(--muted-foreground)] mt-0.5">
                  CAPEX ~₦{Math.round(metrics.estimatedCapex / 1000000).toFixed(1)}M
                </div>
              </div>

              <div className="glass-card p-5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--muted-foreground)] mb-1">
                  <Leaf className="w-4 h-4 text-emerald-400" /> Carbon Offset
                </div>
                <div className="font-display font-bold text-xl sm:text-2xl text-emerald-400">
                  {metrics.metricTonsCo2Avoided} <span className="text-sm font-normal text-[var(--muted-foreground)]">Tons</span>
                </div>
                <div className="text-[10px] text-[var(--muted-foreground)] mt-0.5">CO₂ avoided annually</div>
              </div>
            </div>

            {/* Comparison Visual Breakdown */}
            <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
              <h4 className="font-display font-semibold text-sm text-[var(--electric)]">
                Monthly Fuel Cost Comparison
              </h4>

              {/* 100% Diesel */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--muted-foreground)] flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" /> 100% AGO Diesel Baseline
                  </span>
                  <span className="font-mono font-bold text-red-400">
                    ₦{Math.round(metrics.baselineMonthlySpend).toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500/80 rounded-full w-full" />
                </div>
              </div>

              {/* SmartFix Dual-Fuel */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--muted-foreground)] flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--energy-green)]" /> SmartFix Dual-Fuel (CNG + Pilot AGO)
                  </span>
                  <span className="font-mono font-bold text-[var(--energy-green)]">
                    ₦{Math.round(metrics.newMonthlySpend).toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--energy-green)] rounded-full transition-all duration-500"
                    style={{ width: `${100 - metrics.savingsPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-[var(--muted-foreground)]">
                <span>Monthly Fuel Burn: {metrics.monthlyDieselLiters.toLocaleString()} L</span>
                <span>CNG Skid Required: {metrics.scmGasRequired.toLocaleString()} SCM</span>
              </div>
            </div>

            {/* CTA Bar */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setShowProposalModal(true)}
                className="flex-1 btn-magnetic px-6 py-4 rounded-2xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[var(--energy-green)]/10"
              >
                <FileText className="w-4 h-4" /> Generate Feasibility Pack & Quote
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={shareToWhatsApp}
                className="px-6 py-4 rounded-2xl glass-panel text-sm font-semibold text-[var(--electric)] hover:text-[#25D366] flex items-center justify-center gap-2 transition-colors"
              >
                <Share2 className="w-4 h-4 text-[#25D366]" /> Share on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========== PROPOSAL GENERATOR MODAL ========== */}
      {showProposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowProposalModal(false)} />
          <div className="relative z-10 w-full max-w-lg glass-card p-6 md:p-8 rounded-3xl border border-white/10">
            {proposalGenerated ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-[var(--energy-green)] text-[var(--obsidian)] flex items-center justify-center mx-auto mb-4 glow-green">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-2xl text-[var(--electric)]">
                  Executive Pack Ready
                </h3>
                <p className="text-xs font-mono text-[var(--energy-green)] mt-1">
                  PROJECT ID: {proposalGenerated}
                </p>
                <div className="p-4 rounded-2xl glass-panel border border-white/10 my-6 text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">Facility:</span>
                    <span className="font-semibold text-[var(--electric)]">{clientCompany || clientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">Generator:</span>
                    <span className="font-semibold text-[var(--electric)]">{kva} kVA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">Projected Monthly Savings:</span>
                    <span className="font-bold text-[var(--energy-green)] font-mono">
                      ₦{Math.round(metrics.monthlySavings).toLocaleString()} / mo
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">Payback Timeline:</span>
                    <span className="font-semibold text-[var(--cng-blue)]">{metrics.paybackMonths} Months</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={shareToWhatsApp}
                    className="w-full py-3.5 rounded-xl bg-[#25D366] text-black font-bold text-sm flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" /> Send Direct to SmartFix Engineering Desk
                  </button>
                  <a
                    href={`/track-project?id=${proposalGenerated}`}
                    className="w-full py-3 rounded-xl glass-panel text-xs font-semibold text-[var(--electric)] hover:text-[var(--energy-green)]"
                  >
                    Track Feasibility Pack in Portal →
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleGenerateProposal} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="font-display font-bold text-lg text-[var(--electric)]">
                    Generate Executive Proposal
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowProposalModal(false)}
                    className="text-xs text-[var(--muted-foreground)] hover:text-white"
                  >
                    Close
                  </button>
                </div>

                <p className="text-xs text-[var(--muted-foreground)]">
                  Receive a customized engineering feasibility audit for your {kva} kVA setup showing projected monthly savings of ₦{Math.round(metrics.monthlySavings / 1000000)}M.
                </p>

                <div>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Engr. Babatunde Lawal"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] text-[#f5f5f7] border border-white/10 text-sm outline-none focus:border-[var(--energy-green)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                    Company / Facility Name
                  </label>
                  <input
                    type="text"
                    value={clientCompany}
                    onChange={(e) => setClientCompany(e.target.value)}
                    placeholder="e.g. Crown Flour Mills / Eko Atlantic Towers"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] text-[#f5f5f7] border border-white/10 text-sm outline-none focus:border-[var(--energy-green)]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="0803 123 4567"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] text-[#f5f5f7] border border-white/10 text-sm outline-none focus:border-[var(--energy-green)]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                      Facility City / State
                    </label>
                    <input
                      type="text"
                      value={clientLocation}
                      onChange={(e) => setClientLocation(e.target.value)}
                      placeholder="Ikeja, Lagos"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] text-[#f5f5f7] border border-white/10 text-sm outline-none focus:border-[var(--energy-green)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                    Email (for formal PDF copy)
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="operations@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141417] text-[#f5f5f7] border border-white/10 text-sm outline-none focus:border-[var(--energy-green)]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3.5 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-sm flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> {isSubmitting ? "Generating..." : "Generate Feasibility Pack"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
