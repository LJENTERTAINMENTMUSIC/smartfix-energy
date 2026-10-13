import React, { useState, useMemo } from "react";
import {
  Building2,
  Zap,
  Flame,
  Sun,
  BatteryCharging,
  DollarSign,
  TrendingDown,
  ShieldCheck,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Info,
  Layers,
  VolumeX,
  Clock,
  HelpCircle,
} from "lucide-react";
import { formatNaira } from "@/lib/catalog";
import { pricingStore, PRICE_CODES, usePricing } from "@/lib/pricingStore";
import { toast } from "sonner";

interface EstatePreset {
  name: string;
  units: number;
  type: string;
  desc: string;
}

const PRESETS: EstatePreset[] = [
  {
    name: "Boutique Gated Community",
    units: 60,
    type: "Luxury Villas",
    desc: "Private cul-de-sac with 60 high-demand luxury detached homes.",
  },
  {
    name: "Mid-Size Residential Estate",
    units: 250,
    type: "Duplexes & Terraces",
    desc: "Standard gated residential estate with club house and streetlights.",
  },
  {
    name: "Large Mixed-Use Estate",
    units: 650,
    type: "Mixed Residential & Commercial",
    desc: "650 residential units, shopping complex, central waterworks, schools.",
  },
  {
    name: "Mega Masterplanned City",
    units: 1500,
    type: "High-Density City Estate",
    desc: "1,500+ apartments, towers, and commercial infrastructure.",
  },
];

export default function EstateIPPCalculator() {
  const { prices } = usePricing();

  // Inputs
  const [units, setUnits] = useState<number>(250);
  const [dailyGenHours, setDailyGenHours] = useState<number>(16);
  const [estateType, setEstateType] = useState<string>("Duplexes & Terraces");
  const [solarOffsetPercent, setSolarOffsetPercent] = useState<number>(35);
  const [showProposalModal, setShowProposalModal] = useState<boolean>(false);

  // Live admin rate lookups
  const adminDieselPrice = useMemo(() => {
    return pricingStore.getPriceValue(PRICE_CODES.AGO_DIESEL_PER_LITRE, 1250);
  }, [prices]);

  const adminCngPrice = useMemo(() => {
    return pricingStore.getPriceValue(PRICE_CODES.CNG_PER_SCM, 1150);
  }, [prices]);

  const adminIppTariff = useMemo(() => {
    return pricingStore.getPriceValue(PRICE_CODES.IPP_ESTATE_BASE_TARIFF_KWH, 195);
  }, [prices]);

  // Electrical engineering calculation formulas for Nigerian residential estates
  // Diversified peak load per unit:
  // Luxury Villas: ~4.5 kW diversified
  // Duplexes & Terraces: ~3.0 kW diversified
  // Mixed / Apartments: ~2.2 kW diversified
  const diversifiedKwPerUnit = useMemo(() => {
    if (estateType.includes("Luxury")) return 4.5;
    if (estateType.includes("Duplexes")) return 3.2;
    if (estateType.includes("Mixed")) return 2.6;
    return 2.2;
  }, [estateType]);

  // Estate Sizing
  const estimatedPeakLoadKw = Math.round(units * diversifiedKwPerUnit);
  const recommendedGasKva = Math.round((estimatedPeakLoadKw * 1.25) / 50) * 50; // 0.8 PF + 25% safety margin, rounded to 50kVA
  const recommendedSolarKwp = Math.round((estimatedPeakLoadKw * (solarOffsetPercent / 100)) / 10) * 10;
  const recommendedBessKwh = Math.round(estimatedPeakLoadKw * 1.5); // 1.5 hr spinning reserve & peak clipping

  // Daily Energy Consumed (kWh/day)
  // Assuming 55% average load factor over 24 hours (with peak during evenings)
  const averageHourlyKw = estimatedPeakLoadKw * 0.55;
  const dailyKwhConsumed = Math.round(averageHourlyKw * 24);
  const monthlyKwhConsumed = dailyKwhConsumed * 30;

  // Diesel Baseline Cost:
  // Typical diesel gen: 0.28 litres of AGO per kWh generated
  // Cost per kWh on diesel = 0.28 * dieselPrice + ₦45/kWh engine maintenance & lube oil
  const dieselCostPerKwh = Math.round(0.28 * adminDieselPrice + 45);
  const monthlyDieselSpend = Math.round(monthlyKwhConsumed * (dailyGenHours / 24) * dieselCostPerKwh);

  // DisCo Band A Benchmark: ~₦209 / kWh + estimated downtime generator fuel
  const discoBandATariff = 209;

  // SmartFix Estate IPP Cost:
  // Solar generates during the day, gas baseload handles rest
  // Effective IPP tariff to residents: adminIppTariff (e.g. ₦195 / kWh)
  const monthlyIppSpend = Math.round(monthlyKwhConsumed * adminIppTariff);

  // Monthly & Annual Savings compared to current estate diesel reliance
  const monthlySavings = Math.max(0, monthlyDieselSpend - (monthlyIppSpend * (dailyGenHours / 24)));
  const annualSavings = monthlySavings * 12;

  // Per-Home Monthly Savings
  const perHomeMonthlySavings = Math.round(monthlySavings / units);

  // Environmental Metrics
  // Diesel produces ~0.82 kg CO2 per kWh; SmartFix Gas/Solar hybrid produces ~0.38 kg CO2 per kWh
  const annualCo2SavedTons = Math.round(((dailyKwhConsumed * 365 * 0.44) / 1000));

  return (
    <div className="w-full space-y-8">
      {/* Preset Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[var(--energy-green)]" />
            Select Estate Benchmark Template
          </span>
          <span className="text-xs text-[var(--muted-foreground)]">Or customize sliders below</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESETS.map((p) => {
            const isSelected = units === p.units && estateType === p.type;
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => {
                  setUnits(p.units);
                  setEstateType(p.type);
                  toast.info(`Configured for ${p.name} (${p.units} units)`);
                }}
                className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[var(--energy-green)]/15 border-[var(--energy-green)] text-white shadow-lg"
                    : "glass-card border-white/10 hover:border-white/20 text-[var(--muted-foreground)]"
                }`}
              >
                <div className="font-bold text-xs text-[var(--electric)] flex items-center justify-between">
                  <span>{p.name}</span>
                  <span className="text-[11px] font-mono text-[var(--energy-green)]">{p.units} Units</span>
                </div>
                <div className="text-[11px] text-[var(--cng-blue)] font-medium mt-1">{p.type}</div>
                <p className="text-[10px] text-[var(--muted-foreground)] mt-1.5 leading-snug line-clamp-2">
                  {p.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Controls & Results Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Sliders & Variables (7 cols) */}
        <div className="lg:col-span-7 glass-card p-6 md:p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="font-display font-bold text-xl text-[var(--electric)] flex items-center gap-2">
                <Zap className="w-5 h-5 text-[var(--energy-green)]" />
                Estate Parameters &amp; Load Profile
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                Model your gated community's microgrid requirements and economic savings.
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--muted-foreground)] block">
                Calculated Tariff
              </span>
              <span className="text-sm font-bold font-mono text-[var(--energy-green)]">
                ₦{adminIppTariff}/kWh
              </span>
            </div>
          </div>

          {/* Slider 1: Number of Housing Units */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-sm font-semibold">
              <label className="text-[var(--electric)] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[var(--cng-blue)]" />
                Number of Housing Units / Mansions:
              </label>
              <span className="font-mono text-base font-bold text-[var(--energy-green)] bg-[var(--energy-green)]/10 px-3 py-0.5 rounded-lg border border-[var(--energy-green)]/30">
                {units.toLocaleString()} Units
              </span>
            </div>
            <input
              type="range"
              min={30}
              max={2000}
              step={10}
              value={units}
              onChange={(e) => setUnits(Number(e.target.value))}
              className="w-full accent-[var(--energy-green)] h-2 bg-white/10 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[var(--muted-foreground)] font-mono">
              <span>30 (Boutique)</span>
              <span>250 (Mid-Size)</span>
              <span>750 (Large)</span>
              <span>2,000+ (Mega City)</span>
            </div>
          </div>

          {/* Select: Estate Typology */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--electric)] block">
              Estate Architectural Typology:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                "Luxury Villas",
                "Duplexes & Terraces",
                "Mixed Residential & Commercial",
              ].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setEstateType(t)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                    estateType === t
                      ? "bg-[var(--energy-green)] text-[var(--obsidian)] font-bold border-[var(--energy-green)]"
                      : "bg-white/[0.03] text-[var(--muted-foreground)] border-white/10 hover:border-white/20"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Slider 2: Daily Hours Running on Diesel */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-sm font-semibold">
              <label className="text-[var(--electric)] flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Current Diesel Generator Runtime / Day:
              </label>
              <span className="font-mono text-base font-bold text-amber-400 bg-amber-400/10 px-3 py-0.5 rounded-lg border border-amber-400/30">
                {dailyGenHours} Hours / Day
              </span>
            </div>
            <input
              type="range"
              min={4}
              max={24}
              step={1}
              value={dailyGenHours}
              onChange={(e) => setDailyGenHours(Number(e.target.value))}
              className="w-full accent-amber-400 h-2 bg-white/10 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[var(--muted-foreground)] font-mono">
              <span>4h (Standby only)</span>
              <span>12h (Evening + Morning)</span>
              <span>18h (Typical Blackout)</span>
              <span>24h (100% Off-Grid Island)</span>
            </div>
          </div>

          {/* Slider 3: Solar PV Hybrid Offset Ratio */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-sm font-semibold">
              <label className="text-[var(--electric)] flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-300" />
                Rooftop / Carport Solar Hybridization Ratio:
              </label>
              <span className="font-mono text-base font-bold text-amber-300 bg-amber-300/10 px-3 py-0.5 rounded-lg border border-amber-300/30">
                {solarOffsetPercent}% Solar Offset
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              step={5}
              value={solarOffsetPercent}
              onChange={(e) => setSolarOffsetPercent(Number(e.target.value))}
              className="w-full accent-amber-300 h-2 bg-white/10 rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-[var(--muted-foreground)]">
              Solar panels on estate clubhouse, carports, and access roads shave daytime gas consumption by up to 50%.
            </p>
          </div>

          {/* Recommended Microgrid Specifications Badge */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <span className="text-[11px] font-bold text-[var(--energy-green)] uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Engineered Microgrid Architecture for {units} Homes
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                <span className="text-[10px] text-[var(--muted-foreground)] block">Peak Load</span>
                <span className="text-sm font-bold font-mono text-[var(--electric)]">{estimatedPeakLoadKw} kW</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                <span className="text-[10px] text-[var(--cng-blue)] block">Gas Generation</span>
                <span className="text-sm font-bold font-mono text-[var(--cng-blue)]">{recommendedGasKva} kVA</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                <span className="text-[10px] text-amber-300 block">Solar PV Array</span>
                <span className="text-sm font-bold font-mono text-amber-300">{recommendedSolarKwp} kWp</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                <span className="text-[10px] text-purple-300 block">BESS Storage</span>
                <span className="text-sm font-bold font-mono text-purple-300">{recommendedBessKwh} kWh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Returns & PPA Impact (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Main Hero Savings Card */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-[var(--energy-green)]/30 bg-gradient-to-b from-[var(--energy-green)]/10 via-[var(--obsidian)] to-[var(--obsidian)] shadow-2xl relative overflow-hidden space-y-6">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[var(--energy-green)]/20 text-[var(--energy-green)] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                ESTATE SAVINGS PROJECTION
              </span>
              <span className="text-[11px] font-mono text-[var(--muted-foreground)]">Zero CapEx BOOT</span>
            </div>

            <div>
              <span className="text-xs text-[var(--muted-foreground)] block mb-1">
                Projected Annual Estate Savings:
              </span>
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-mono text-gradient-green tracking-tight">
                {formatNaira(annualSavings)}
              </div>
              <p className="text-xs text-[var(--muted-foreground)] mt-1.5 flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5 text-[var(--energy-green)]" />
                Saves approx. <strong className="text-white">{formatNaira(monthlySavings)} / month</strong> across the estate.
              </p>
            </div>

            {/* Per-Home Impact */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[var(--muted-foreground)] uppercase font-mono block">
                  Per Resident Monthly Savings
                </span>
                <span className="text-lg font-bold font-mono text-[var(--energy-green)]">
                  ~{formatNaira(perHomeMonthlySavings)} / home
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[var(--muted-foreground)] block">Tariff Reduction</span>
                <span className="text-sm font-bold text-[var(--cng-blue)]">
                  -{Math.round(((dieselCostPerKwh - adminIppTariff) / dieselCostPerKwh) * 100)}% vs Diesel
                </span>
              </div>
            </div>

            {/* Rate Comparison Bar Chart */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-[var(--electric)] block">
                Cost Per Kilowatt-Hour (₦ / kWh):
              </span>

              {/* Diesel Gen */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-red-400">Current Estate Diesel (@ ₦{adminDieselPrice}/L)</span>
                  <span className="font-bold text-red-400">₦{dieselCostPerKwh}/kWh</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full w-full" />
                </div>
              </div>

              {/* DisCo Band A */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-amber-300">National Grid DisCo Band A (Unreliable)</span>
                  <span className="font-bold text-amber-300">₦{discoBandATariff}/kWh</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${(discoBandATariff / dieselCostPerKwh) * 100}%` }}
                  />
                </div>
              </div>

              {/* SmartFix Estate IPP */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[var(--energy-green)] font-bold">
                    SmartFix 24/7 Island IPP (Gas + Solar)
                  </span>
                  <span className="font-bold text-[var(--energy-green)]">₦{adminIppTariff}/kWh</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--energy-green)] to-[var(--cng-blue)] rounded-full"
                    style={{ width: `${(adminIppTariff / dieselCostPerKwh) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Environmental & Quality of Life */}
            <div className="grid grid-cols-2 gap-3 text-xs border-t border-white/10 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[var(--energy-green)]/15 text-[var(--energy-green)] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-[var(--muted-foreground)] block">Carbon Offset</span>
                  <strong className="text-white">{annualCo2SavedTons} Tons CO₂/yr</strong>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[var(--cng-blue)]/15 text-[var(--cng-blue)] flex items-center justify-center">
                  <VolumeX className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-[var(--muted-foreground)] block">Noise Reduction</span>
                  <strong className="text-white">&lt;56 dB (Whisper)</strong>
                </div>
              </div>
            </div>

            {/* CTA Button to Generate PPA Proposal */}
            <button
              type="button"
              onClick={() => setShowProposalModal(true)}
              className="w-full py-4 rounded-2xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-sm btn-magnetic glow-green flex items-center justify-center gap-2 cursor-pointer shadow-xl"
            >
              <Download className="w-4 h-4" />
              <span>Generate Estate PPA Term Sheet</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/*  ESTATE PROPOSAL & PPA TERM SHEET MODAL                            */}
      {/* ================================================================== */}
      {showProposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl rounded-3xl glass-card border border-[var(--energy-green)]/40 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--energy-green)]/15 text-[var(--energy-green)] flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[var(--energy-green)] uppercase tracking-wider block">
                    SMARTFIX ENERGY OS · COMMERCIAL IPP PACK
                  </span>
                  <h3 className="font-display font-bold text-lg text-[var(--electric)]">
                    Estate IPP Microgrid Term Sheet &amp; Feasibility Pack
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowProposalModal(false)}
                className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-[var(--muted-foreground)] hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Executive Summary */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-xs leading-relaxed text-[var(--muted-foreground)]">
              <p>
                Prepared for the <strong>Estate Executive Committee (EXCO), Resident Association (CDA/HOA), and Facility Management Company</strong>.
              </p>
              <p>
                SmartFix Energy proposes deploying a dedicated <strong>24/7 Island Microgrid</strong> operating under a <strong>Zero-CapEx BOOT (Build-Own-Operate-Transfer)</strong> arrangement. SmartFix provides 100% capital funding for gas generation assets, virtual pipeline skids, solar PV, BESS storage, and anti-tamper STS smart meters.
              </p>
            </div>

            {/* Grid Specifications Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl glass-panel border-white/5">
                <span className="text-[10px] text-[var(--muted-foreground)] block">Estate Scale</span>
                <strong className="text-white text-sm">{units} Housing Units</strong>
              </div>
              <div className="p-3 rounded-xl glass-panel border-white/5">
                <span className="text-[10px] text-[var(--muted-foreground)] block">Estate Typology</span>
                <strong className="text-white text-sm">{estateType}</strong>
              </div>
              <div className="p-3 rounded-xl glass-panel border-white/5">
                <span className="text-[10px] text-[var(--cng-blue)] block">Gas Generation</span>
                <strong className="text-[var(--cng-blue)] text-sm">{recommendedGasKva} kVA</strong>
              </div>
              <div className="p-3 rounded-xl glass-panel border-white/5">
                <span className="text-[10px] text-amber-300 block">Solar Capacity</span>
                <strong className="text-amber-300 text-sm">{recommendedSolarKwp} kWp Array</strong>
              </div>
              <div className="p-3 rounded-xl glass-panel border-white/5">
                <span className="text-[10px] text-purple-300 block">Battery BESS</span>
                <strong className="text-purple-300 text-sm">{recommendedBessKwh} kWh LiFePO4</strong>
              </div>
              <div className="p-3 rounded-xl glass-panel border-white/5">
                <span className="text-[10px] text-[var(--energy-green)] block">Contract Tariff</span>
                <strong className="text-[var(--energy-green)] text-sm">₦{adminIppTariff} / kWh</strong>
              </div>
            </div>

            {/* Financial & Operational Guarantees */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-[var(--electric)] uppercase tracking-wider block">
                Key PPA Commercial Terms:
              </span>
              <ul className="space-y-1.5 text-[var(--muted-foreground)]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--energy-green)] shrink-0 mt-0.5" />
                  <span><strong>Zero Upfront Capital:</strong> Estate pays ₦0 for generators, solar panels, or smart meters.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--energy-green)] shrink-0 mt-0.5" />
                  <span><strong>99.8% Guaranteed Uptime SLA:</strong> Contractually backed with billing credits for any unscheduled outage.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--energy-green)] shrink-0 mt-0.5" />
                  <span><strong>STS Pre-Paid Split Metering:</strong> Zero estate debt or billing disputes; residents vend directly via SmartFix App.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--energy-green)] shrink-0 mt-0.5" />
                  <span><strong>Virtual Pipeline Gas Supply:</strong> Dedicated 200-bar mobile skids decanting automatically on schedule.</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  toast.success("Executive Estate Feasibility Pack downloaded (PDF/DOCX simulation).");
                  setShowProposalModal(false);
                }}
                className="flex-1 py-3 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer hover:brightness-110"
              >
                <Download className="w-4 h-4" />
                <span>Download Executive Feasibility Pack</span>
              </button>
              <a
                href="https://wa.me/2348139784331?text=Hello%20SmartFix%20Energy,%20we%20want%20to%20schedule%20a%20technical%20site%20audit%20and%20PPA%20presentation%20for%20our%20estate."
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-[#25D366]/30"
              >
                <span>Book Site Audit on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
