import { useState } from "react";
import Hero from "@/components/home/Hero";
import ServiceSelector from "@/components/home/ServiceSelector";
import EnergyAdvisory from "@/components/home/EnergyAdvisory";
import HowItWorks from "@/components/home/HowItWorks";
import BillboardSlider from "@/components/home/BillboardSlider";
import Solutions from "@/components/home/Solutions";
import WhySmartFix from "@/components/home/WhySmartFix";
import FinalCTA from "@/components/home/FinalCTA";
import SmartFixConciergeModal from "@/components/concierge/SmartFixConciergeModal";
import { Truck, Factory, Hotel, HeartPulse, Building2, Briefcase, Landmark, Wheat } from "lucide-react";

const industries = [
  { icon: Truck, label: "Transport & Logistics" },
  { icon: Factory, label: "Manufacturing" },
  { icon: Hotel, label: "Hospitality" },
  { icon: HeartPulse, label: "Healthcare" },
  { icon: Building2, label: "Real Estate" },
  { icon: Briefcase, label: "Corporate" },
  { icon: Landmark, label: "Government" },
  { icon: Wheat, label: "Agriculture" },
];

function Industries() {
  return (
    <section id="industries" className="section-padding relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-6">
            <span className="text-xs font-medium tracking-[0.15em] text-[var(--cng-blue)]">
              INDUSTRIES
            </span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-5xl leading-tight tracking-tight">
            <span className="text-gradient-light">ENGINEERED FOR</span>{" "}
            <span className="text-gradient-green">REAL-WORLD OPERATIONS</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {industries.map((ind, i) => (
            <div
              key={ind.label}
              className="glass-card p-5 flex flex-col items-center text-center gap-3 reveal"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="w-10 h-10 rounded-lg bg-[rgba(0,168,255,0.08)] flex items-center justify-center">
                <ind.icon className="w-5 h-5 text-[var(--cng-blue)]" />
              </div>
              <span className="text-sm font-medium text-[var(--electric)]">{ind.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [showConcierge, setShowConcierge] = useState(false);

  return (
    <>
      <Hero />
      <ServiceSelector onOpenConcierge={() => setShowConcierge(true)} />
      <BillboardSlider />
      <EnergyAdvisory onOpenConcierge={() => setShowConcierge(true)} />
      <HowItWorks />
      <Solutions />
      <WhySmartFix />
      <Industries />
      <FinalCTA />

      {/* Global AI Concierge Modal */}
      <SmartFixConciergeModal
        isOpen={showConcierge}
        onClose={() => setShowConcierge(false)}
      />
    </>
  );
}
