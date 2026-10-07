import { MessageSquareText, Cpu, PackageCheck, Truck, ShieldCheck, RefreshCw } from "lucide-react";

const STEPS = [
  {
    num: "01",
    title: "TELL US",
    subtitle: "One single intake",
    desc: "Tell SmartFix what you need once. Speak with our AI Concierge, upload generator nameplates or vehicle details.",
    icon: MessageSquareText,
    accent: "var(--energy-green)",
  },
  {
    num: "02",
    title: "WE ANALYSE",
    subtitle: "AI + Engineering Sizing",
    desc: "Our automated engineering workforce analyses load profile, fuel consumption, and models the highest-ROI solution.",
    icon: Cpu,
    accent: "var(--cng-blue)",
  },
  {
    num: "03",
    title: "WE PREPARE",
    subtitle: "Materials & Project Pack",
    desc: "Every component is allocated, verified, and packed. Required tools, PPE, and safety documentation are generated.",
    icon: PackageCheck,
    accent: "#ff9f0a",
  },
  {
    num: "04",
    title: "WE COME TO YOU",
    subtitle: "Certified field engineers",
    desc: "Our certified technicians arrive on site with the approved Field Team Pack and barcode-verified materials.",
    icon: Truck,
    accent: "var(--energy-green)",
  },
  {
    num: "05",
    title: "WE DELIVER",
    subtitle: "Installation & Commissioning",
    desc: "Precision gas-leak testing, dual-fuel calibration, ATS synchronisation, and safety compliance certification.",
    icon: ShieldCheck,
    accent: "var(--cng-blue)",
  },
  {
    num: "06",
    title: "WE STAY WITH YOU",
    subtitle: "Fuel & 24/7 Operations",
    desc: "Scheduled CNG and diesel fuel replenishment, live telemetry monitoring, preventive maintenance, and support.",
    icon: RefreshCw,
    accent: "var(--electric)",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-14 md:py-24 border-b border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-[var(--energy-green)] pulse-ring" />
            <span className="text-xs font-semibold tracking-[0.18em] text-[var(--muted-foreground)] uppercase">
              THE SMARTFIX OPERATING SYSTEM
            </span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-[var(--electric)]">
            HOW IT WORKS
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed">
            From initial enquiry to permanent energy delivery. No repeated questions, no lost materials, no disconnected departments.
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="group relative rounded-3xl glass-card border border-white/10 p-6 sm:p-7 flex flex-col justify-between hover:border-white/20 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-2xl font-bold tracking-tight text-[var(--muted-foreground)]/50 group-hover:text-[var(--energy-green)] transition-colors">
                      {step.num}
                    </span>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: `color-mix(in srgb, ${step.accent} 15%, transparent)`,
                        color: step.accent,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-lg text-[var(--electric)]">
                    {step.title}
                  </h3>
                  <p className="text-xs font-semibold tracking-wider uppercase text-[var(--muted-foreground)] mt-0.5 mb-3">
                    {step.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
