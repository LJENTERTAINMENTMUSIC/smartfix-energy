import { useState } from "react";
import { Link } from "react-router-dom";
import { Layers, ArrowRight, Lightbulb, Battery, Factory, Grid3x3, MapPin, Clock, DollarSign, Gauge, Home, Building2, Warehouse } from "lucide-react";

const propertyTypes = [
  { icon: Home, label: "Residential" },
  { icon: Building2, label: "Commercial" },
  { icon: Warehouse, label: "Industrial" },
  { icon: Factory, label: "Institutional" },
];

const nigerianStates = ["Lagos", "Ogun", "Oyo", "FCT (Abuja)", "Rivers", "Kano", "Other"];

export default function HybridEnergy() {
  const [propertyType, setPropertyType] = useState("");
  const [bill, setBill] = useState("");
  const [genCapacity, setGenCapacity] = useState("");
  const [diesel, setDiesel] = useState("");
  const [hours, setHours] = useState("");
  const [state, setState] = useState("");
  const [load, setLoad] = useState("");
  const [showResult, setShowResult] = useState(false);

  const canGenerate = propertyType && bill && (genCapacity || diesel);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[40vh] flex items-center overflow-hidden pt-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-[var(--energy-green)] opacity-[0.06] blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[var(--cng-blue)] opacity-[0.05] blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 w-full">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-6">
              <Link to="/" className="hover:text-[var(--energy-green)] transition-colors">Home</Link>
              <span>/</span><span className="text-[var(--energy-green)]">Hybrid Energy</span>
            </div>
            <div className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-6 reveal">
              <Layers className="w-3.5 h-3.5 text-[var(--energy-green)]" />
              <span className="text-xs font-medium tracking-[0.15em] text-[var(--muted-foreground)]">HYBRID ENERGY DESIGNER</span>
            </div>
            <h1 className="font-display font-bold text-4xl md:text-6xl leading-[0.95] tracking-tight reveal reveal-delay-1">
              <span className="text-gradient-light">DESIGN YOUR</span>
              <br /><span className="text-gradient-green">INTELLIGENT ENERGY SYSTEM</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base text-[var(--muted-foreground)] leading-relaxed reveal reveal-delay-2">
              Tell us about your current energy setup. We'll generate a preliminary profile showing how a
              hybrid system — solar, battery, CNG generator and grid — could transform your energy economics.
            </p>
            <p className="mt-3 text-xs text-[var(--muted-foreground)] opacity-70">
              Preliminary estimates only — not engineering certification.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="section-padding pt-4 relative">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="glass-card p-6 md:p-8">
            <h2 className="font-display font-semibold text-lg text-[var(--electric)] mb-6">Your Current Energy Setup</h2>

            {/* Property type */}
            <div className="mb-5">
              <label className="text-xs text-[var(--muted-foreground)] mb-2 block">Property Type</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {propertyTypes.map((pt) => (
                  <button key={pt.label} onClick={() => setPropertyType(pt.label)}
                    className={`flex flex-col items-center gap-2 px-3 py-3 rounded-lg border text-xs font-medium transition-all ${
                      propertyType === pt.label ? "bg-[var(--energy-green)] text-[var(--obsidian)] border-[var(--energy-green)]" : "glass-panel text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--electric)]"}`}>
                    <pt.icon className="w-5 h-5" /> {pt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> Average Monthly Electricity Bill</label>
                <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] text-sm">₦</span>
                  <input type="number" value={bill} onChange={(e) => setBill(e.target.value)} placeholder="e.g. 150000" className="w-full pl-7 pr-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--electric)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--energy-green)] outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block flex items-center gap-1.5"><Factory className="w-3.5 h-3.5" /> Generator Capacity (KVA)</label>
                <input type="number" value={genCapacity} onChange={(e) => setGenCapacity(e.target.value)} placeholder="e.g. 50" className="w-full px-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--electric)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--energy-green)] outline-none" />
              </div>
              <div>
                <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> Monthly Diesel Consumption (Litres)</label>
                <input type="number" value={diesel} onChange={(e) => setDiesel(e.target.value)} placeholder="e.g. 800" className="w-full px-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--electric)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--energy-green)] outline-none" />
              </div>
              <div>
                <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Generator Operating Hours / Day</label>
                <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="e.g. 8" className="w-full px-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--electric)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--energy-green)] outline-none" />
              </div>
              <div>
                <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Location (State)</label>
                <select value={state} onChange={(e) => setState(e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--electric)] focus:border-[var(--energy-green)] outline-none">
                  <option value="">Select state</option>
                  {nigerianStates.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block flex items-center gap-1.5"><Gauge className="w-3.5 h-3.5" /> Estimated Load (kW)</label>
                <input type="number" value={load} onChange={(e) => setLoad(e.target.value)} placeholder="e.g. 30" className="w-full px-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--electric)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--energy-green)] outline-none" />
              </div>
            </div>

            <button onClick={() => setShowResult(true)} disabled={!canGenerate}
              className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold btn-magnetic glow-green disabled:opacity-30 disabled:cursor-not-allowed">
              Generate Energy Profile <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Result */}
          {showResult && canGenerate && (
            <div className="mt-6 glass-card p-6 md:p-8 reveal">
              <div className="flex items-center gap-2 mb-6">
                <Lightbulb className="w-5 h-5 text-[var(--energy-green)]" />
                <h2 className="font-display font-semibold text-lg text-[var(--electric)]">Your Energy Profile</h2>
                <span className="text-xs text-[var(--muted-foreground)] ml-auto">Preliminary Estimate</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Current system */}
                <div className="glass-panel rounded-xl p-5">
                  <p className="text-xs text-[var(--muted-foreground)] mb-2">Current Energy System</p>
                  <p className="font-display font-semibold text-sm text-[var(--electric)] mb-3">Grid + Diesel Generator</p>
                  <div className="space-y-1.5 text-xs text-[var(--muted-foreground)]">
                    {bill && <p>Monthly Bill: <span className="text-[var(--electric)]">₦{parseInt(bill).toLocaleString()}</span></p>}
                    {genCapacity && <p>Generator: <span className="text-[var(--electric)]">{genCapacity} KVA</span></p>}
                    {diesel && <p>Diesel: <span className="text-[var(--electric)]">{diesel} L/month</span></p>}
                    {hours && <p>Runtime: <span className="text-[var(--electric)]">{hours} hrs/day</span></p>}
                  </div>
                </div>

                {/* Potential system */}
                <div className="glass-panel rounded-xl p-5 border border-[var(--energy-green)]/20">
                  <p className="text-xs text-[var(--energy-green)] mb-2">Potential System</p>
                  <p className="font-display font-semibold text-sm text-[var(--electric)] mb-3">Solar + Battery + CNG Generator + Grid</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 text-[var(--energy-green)]"><Lightbulb className="w-3 h-3" /> Solar PV Generation</div>
                    <div className="flex items-center gap-1.5 text-[var(--cng-blue)]"><Battery className="w-3 h-3" /> Battery Storage</div>
                    <div className="flex items-center gap-1.5 text-[var(--energy-green)]"><Factory className="w-3 h-3" /> CNG Generator</div>
                    <div className="flex items-center gap-1.5 text-[var(--muted-foreground)]"><Grid3x3 className="w-3 h-3" /> Grid Connection</div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="glass-panel rounded-xl p-5">
                  <p className="text-xs text-[var(--cng-blue)] mb-2">Recommended Assessment</p>
                  <p className="font-display font-semibold text-sm text-[var(--electric)] mb-3">Professional Site Survey</p>
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                    A SmartFix energy engineer should visit your site to conduct a detailed load assessment,
                    solar potential analysis and system design.
                  </p>
                </div>
              </div>

              <Link to="/request-quote" className="group mt-6 w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[var(--cng-blue)] text-white font-bold btn-magnetic glow-blue">
                Request Professional Energy Assessment <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
