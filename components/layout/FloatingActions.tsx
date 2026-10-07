import { Link } from "react-router-dom";
import { Sparkles, MessageCircle, FileText } from "lucide-react";
import { SMARTFIX_CONTACT } from "@/lib/contact";

export default function FloatingActions() {
  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-3">
      {/* AI Concierge (future) */}
      <button
        className="group relative w-12 h-12 rounded-full bg-[var(--energy-green)] flex items-center justify-center btn-magnetic pulse-ring"
        aria-label="Ask SmartFix Energy AI"
        title="Ask SmartFix Energy AI"
      >
        <Sparkles className="w-5 h-5 text-[var(--obsidian)]" />
        <span className="absolute right-full mr-3 whitespace-nowrap text-xs font-medium text-[var(--electric)] glass-panel px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Ask Energy AI
        </span>
      </button>

      {/* WhatsApp */}
      <a
        href={SMARTFIX_CONTACT.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center btn-magnetic"
        aria-label="WhatsApp SmartFix"
        title="WhatsApp SmartFix"
      >
        <MessageCircle className="w-5 h-5 text-white" />
        <span className="absolute right-full mr-3 whitespace-nowrap text-xs font-medium text-[var(--electric)] glass-panel px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          WhatsApp
        </span>
      </a>

      {/* Quote */}
      <Link
        to="/request-quote"
        className="group relative w-12 h-12 rounded-full bg-[var(--cng-blue)] flex items-center justify-center btn-magnetic glow-blue"
        aria-label="Get a quote"
        title="Get a Quote"
      >
        <FileText className="w-5 h-5 text-white" />
        <span className="absolute right-full mr-3 whitespace-nowrap text-xs font-medium text-[var(--electric)] glass-panel px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Get a Quote
        </span>
      </Link>
    </div>
  );
}
