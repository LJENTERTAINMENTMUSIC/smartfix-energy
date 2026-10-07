import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, MessageCircle, FileText } from "lucide-react";
import { SMARTFIX_CONTACT } from "@/lib/contact";
import SmartFixConciergeModal from "@/components/concierge/SmartFixConciergeModal";

export default function FloatingActions() {
  const [showConcierge, setShowConcierge] = useState(false);

  return (
    <>
      <div className="fixed right-3 sm:right-5 bottom-4 sm:bottom-6 z-50 flex flex-col gap-3 items-end">
        {/* 1. Primary: SMARTFIX AI */}
        <button
          onClick={() => setShowConcierge(true)}
          className="group relative flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-xs sm:text-sm shadow-2xl btn-magnetic pulse-ring hover:scale-105 transition-transform cursor-pointer"
          aria-label="SmartFix AI — Tell us what you need"
          title="SmartFix AI — Tell us what you need"
        >
          <Sparkles className="w-5 h-5 flex-shrink-0" />
          <span className="hidden sm:inline font-display">SmartFix AI</span>
          <span className="text-[10px] font-mono hidden md:inline opacity-80">· Tell us what you need</span>
          
          {/* Mobile hover pill */}
          <span className="sm:hidden absolute right-full mr-3 whitespace-nowrap text-xs font-semibold text-[var(--electric)] glass-panel px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            SmartFix AI · Tell us what you need
          </span>
        </button>

        {/* 2. Secondary: WhatsApp */}
        <a
          href={SMARTFIX_CONTACT.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-full bg-[#25D366] text-white font-medium text-xs shadow-xl btn-magnetic hover:scale-105 transition-transform"
          aria-label="WhatsApp — Talk to SmartFix"
          title="WhatsApp — Talk to SmartFix"
        >
          <MessageCircle className="w-4 h-4 flex-shrink-0" />
          <span className="hidden sm:inline">WhatsApp</span>
          <span className="absolute right-full mr-3 whitespace-nowrap text-xs font-semibold text-[var(--electric)] glass-panel px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            WhatsApp · Talk to SmartFix
          </span>
        </a>

        {/* 3. Tertiary: My Project */}
        <Link
          to="/track"
          className="group relative flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-full bg-[var(--cng-blue)] text-white font-medium text-xs shadow-xl btn-magnetic glow-blue hover:scale-105 transition-transform"
          aria-label="My Project — Track project / documents / quote"
          title="My Project — Track project / documents / quote"
        >
          <FileText className="w-4 h-4 flex-shrink-0" />
          <span className="hidden sm:inline">My Project</span>
          <span className="absolute right-full mr-3 whitespace-nowrap text-xs font-semibold text-[var(--electric)] glass-panel px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            My Project · Track project / documents / quote
          </span>
        </Link>
      </div>

      {/* Embedded Concierge Modal */}
      <SmartFixConciergeModal
        isOpen={showConcierge}
        onClose={() => setShowConcierge(false)}
      />
    </>
  );
}
