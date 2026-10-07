import { Search, Wrench, Package, Settings2, CheckCircle, Activity, TrendingUp } from "lucide-react";

const steps = [
  { icon: Search, title: "ASSESS", desc: "Understand the requirement" },
  { icon: Wrench, title: "ENGINEER", desc: "Develop the appropriate technical solution" },
  { icon: Package, title: "SOURCE", desc: "Procure suitable equipment" },
  { icon: Settings2, title: "INSTALL", desc: "Deploy professionally" },
  { icon: CheckCircle, title: "COMMISSION", desc: "Test and hand over" },
  { icon: Activity, title: "MANAGE", desc: "Maintain and optimize" },
  { icon: TrendingUp, title: "UPGRADE", desc: "Modernize as requirements evolve" },
];

export default function WhySmartFix() {
  return (
    <section id="about" className="section-padding relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-6">
            <span className="text-xs font-medium tracking-[0.15em] text-[var(--cng-blue)]">
              WHY SMARTFIX
            </span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-5xl leading-tight tracking-tight">
            <span className="text-gradient-light">WE DON'T JUST SELL</span>{" "}
            <span className="text-gradient-green">EQUIPMENT.</span>
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-base text-[var(--muted-foreground)] leading-relaxed">
            We design the solution around the client's operation — from assessment through to
            long-term optimization and upgrade.
          </p>
        </div>

        {/* Process flow */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-8 left-[7%] right-[7%] h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 md:gap-6">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="glass-card p-5 text-center group reveal"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="relative w-12 h-12 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full bg-[var(--energy-green)] opacity-10 group-hover:opacity-20 transition-opacity" />
                  <div className="relative w-full h-full rounded-full bg-[rgba(0,217,127,0.08)] border border-[var(--border)] flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-[var(--energy-green)]" />
                  </div>
                </div>
                <h3 className="font-display font-bold text-sm tracking-wider text-[var(--electric)] mb-1">
                  {step.title}
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] leading-snug">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Full chain display */}
        <div className="mt-10 glass-panel rounded-xl px-6 py-4 text-center">
          <p className="text-sm md:text-base font-display font-medium text-[var(--muted-foreground)] tracking-wide">
            ASSESS <span className="text-[var(--energy-green)] mx-1">→</span> DESIGN{" "}
            <span className="text-[var(--energy-green)] mx-1">→</span> PROCURE{" "}
            <span className="text-[var(--energy-green)] mx-1">→</span> INSTALL{" "}
            <span className="text-[var(--energy-green)] mx-1">→</span> COMMISSION{" "}
            <span className="text-[var(--energy-green)] mx-1">→</span> OPERATE{" "}
            <span className="text-[var(--energy-green)] mx-1">→</span> MAINTAIN{" "}
            <span className="text-[var(--energy-green)] mx-1">→</span> UPGRADE
          </p>
        </div>
      </div>
    </section>
  );
}
