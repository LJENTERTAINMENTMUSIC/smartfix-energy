import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import QuoteForm from "@/components/quote/QuoteForm";

export default function Quote() {
  return (
    <section className="relative min-h-[80vh] py-8">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-6">
          <Link to="/" className="hover:text-[var(--energy-green)] transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-[var(--energy-green)] pulse-ring" />
            <span className="text-xs font-medium tracking-[0.15em] text-[var(--muted-foreground)]">
              REQUEST A QUOTE
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl md:text-5xl leading-tight tracking-tight">
            <span className="text-gradient-light">WHAT DO YOU</span>{" "}
            <span className="text-gradient-green">NEED?</span>
          </h1>
          <p className="mt-4 text-sm text-[var(--muted-foreground)] max-w-lg mx-auto">
            Tell us about your energy requirement. Whether it's CNG conversion, generators, solar,
            hybrid systems or maintenance — we'll design the right solution.
          </p>
        </div>

        {/* Form */}
        <QuoteForm />
      </div>
    </section>
  );
}
