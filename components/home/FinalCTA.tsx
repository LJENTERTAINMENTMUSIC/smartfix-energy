import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, MessageCircle } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden section-padding">
      {/* Glow accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--energy-green)] opacity-[0.06] blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center">
        <h2 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight reveal">
          <span className="text-gradient-light">YOUR ENERGY SYSTEM</span>
          <br />
          <span className="text-gradient-green">CAN WORK SMARTER.</span>
        </h2>

        <p className="mt-8 max-w-2xl mx-auto text-base md:text-lg text-[var(--muted-foreground)] leading-relaxed reveal reveal-delay-1">
          Whether you're converting one vehicle, powering a factory, managing a fleet or designing
          an integrated energy system —
        </p>

        <p className="mt-4 font-display font-bold text-2xl md:text-4xl text-[var(--electric)] reveal reveal-delay-2">
          SMARTFIX IS READY.
        </p>

        {/* CTAs */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 reveal reveal-delay-3">
          <Link
            to="/request-quote"
            className="group inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-semibold btn-magnetic glow-green"
          >
            Get a Quote
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="inline-flex items-center gap-2 px-7 py-4 rounded-xl glass-card text-[var(--electric)] font-medium">
            <Sparkles className="w-5 h-5 text-[var(--energy-green)]" />
            Talk to Energy AI
          </button>
          <a
            href="https://wa.me/2348139784331"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-xl glass-card text-[var(--electric)] font-medium"
          >
            <MessageCircle className="w-5 h-5 text-[#25D366]" />
            WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
}
