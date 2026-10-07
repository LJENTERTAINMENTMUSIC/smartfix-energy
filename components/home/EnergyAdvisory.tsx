import { useState } from "react";
import { Sparkles, HelpCircle, Check, ArrowRight, Zap, Flame, Sun, Fuel } from "lucide-react";
import { Link } from "react-router-dom";

export default function EnergyAdvisory({ onOpenConcierge }: { onOpenConcierge?: () => void }) {
  const [facility, setFacility] = useState("Commercial / Office");
  const [spend, setSpend] = useState("₦2,000,000 - ₦5,000,000");
  const [pain, setPain] = useState("Excessive Diesel Cost");

  const facilities = ["Manufacturing / Factory", "Hotel / Hospitality", "Commercial / Office", "Logistics & Fleet", "Healthcare / Hospital", "Residential Estate"];
  const spends = ["Under ₦1,000,000", "₦1,000,000 - ₦5,000,000", "₦5,000,000 - ₦20,000,000", "₦20,000,000+"];
  const pains = ["Excessive Diesel Cost", "Unreliable Grid Power", "Frequent Generator Breakdowns", "Fleet Fuel Losses"];

  return (
    <section className="relative py-14 md:py-20 border-b border-white/5 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl glass-card border border-white/10 p-6 sm:p-10 md:p-14 relative overflow-hidden">
          {/* Background radial highlight */}
          <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[var(--energy-green)] opacity-15 blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[var(--cng-blue)] opacity-15 blur-[120px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Interactive Advisor */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 glass-panel rounded-full px-3.5 py-1.5 mb-4">
                <HelpCircle className="w-3.5 h-3.5 text-[var(--energy-green)]" />
                <span className="text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                  NOT SURE WHAT YOU NEED?
                </span>
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight text-[var(--electric)]">
                LET SMARTFIX DESIGN THE BEST SOLUTION
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
                You don't need to know the engineering or technical specifications yet. Answer 3 quick operational questions, and our energy intelligence models the highest-ROI strategy.
              </p>

              {/* Questions Form */}
              <div className="mt-6 space-y-4">
                {/* 1. Facility Type */}
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider block mb-2">
                    1. Facility or Operation Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {facilities.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFacility(f)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          facility === f
                            ? "bg-[var(--energy-green)] text-[var(--obsidian)] font-bold shadow-md"
                            : "glass-panel text-[var(--electric)]/80 hover:text-[var(--electric)]"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Monthly Fuel Spend */}
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider block mb-2">
                    2. Estimated Monthly Fuel Spend (Diesel / Petrol)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {spends.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSpend(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          spend === s
                            ? "bg-[var(--cng-blue)] text-white font-bold shadow-md"
                            : "glass-panel text-[var(--electric)]/80 hover:text-[var(--electric)]"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Primary Pain Point */}
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider block mb-2">
                    3. Biggest Energy Challenge
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {pains.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPain(p)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          pain === p
                            ? "bg-white text-[var(--obsidian)] font-bold shadow-md"
                            : "glass-panel text-[var(--electric)]/80 hover:text-[var(--electric)]"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Recommendation Preview */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl glass-card border border-white/10 p-6 bg-[#0e1014]/90 shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--energy-green)]" />
                    <span className="text-xs font-bold tracking-wider text-[var(--electric)] uppercase">
                      RECOMMENDED SOLUTION
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--energy-green)]/15 text-[var(--energy-green)] border border-[var(--energy-green)]/30">
                    AI OPTIMIZED
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <Flame className="w-5 h-5 text-[var(--energy-green)] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-[var(--electric)]">Generator CNG Dual-Fuel Conversion</p>
                      <p className="text-[11px] text-[var(--muted-foreground)]">Cuts baseline fuel OPEX by 45% - 60% with automated gas substitution.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <Sun className="w-5 h-5 text-[var(--cng-blue)] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-[var(--electric)]">Rooftop Solar &amp; LiFePO4 Peak-Shaving</p>
                      <p className="text-[11px] text-[var(--muted-foreground)]">Absorbs daytime load silently, minimizing generator runtime hours.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <Fuel className="w-5 h-5 text-[#ff9f0a] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-[var(--electric)]">Automated Diesel + CNG Fuel Replenishment</p>
                      <p className="text-[11px] text-[var(--muted-foreground)]">Guaranteed fuel security with scheduled delivery and tank sensors.</p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--energy-green)]/10 border border-[var(--energy-green)]/20 mb-5">
                  <p className="text-xs font-mono text-[var(--energy-green)] font-semibold">
                    ESTIMATED ROI: 4.8 MONTHS PAYBACK
                  </p>
                  <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">
                    Based on {spend} fuel spend across {facility.toLowerCase()}.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onOpenConcierge}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-xs sm:text-sm btn-magnetic glow-green cursor-pointer shadow-lg hover:opacity-95"
                >
                  Generate My Custom Energy Project Pack
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
