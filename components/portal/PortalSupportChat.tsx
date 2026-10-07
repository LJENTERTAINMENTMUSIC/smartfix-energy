import React, { useState } from "react";
import {
  X,
  Send,
  Sparkles,
  UserCheck,
  PhoneCall,
  MessageSquare,
  Bot,
  User,
  ShieldCheck,
} from "lucide-react";
import { type CustomerProfile, type PortalProject, type PortalOrder } from "@/lib/portalData";
import { SMARTFIX_CONTACT } from "@/lib/contact";
import { toast } from "sonner";

interface PortalSupportChatProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CustomerProfile;
  projects: PortalProject[];
  orders: PortalOrder[];
}

interface ChatMsg {
  sender: "ai" | "user" | "human";
  text: string;
  time: string;
}

export default function PortalSupportChat({
  isOpen,
  onClose,
  profile,
  projects,
  orders,
}: PortalSupportChatProps) {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      sender: "ai",
      text: `Hello ${profile.name}! I am your SmartFix Dedicated Energy Copilot. I have full context on ${profile.company}, including your ${projects.length} active projects and live fuel logistics. How can I assist you right now?`,
      time: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [humanRequested, setHumanRequested] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!input.trim()) return;
    const userText = input.trim();
    const newMsgs: ChatMsg[] = [...messages, { sender: "user", text: userText, time: "Just now" }];
    setMessages(newMsgs);
    setInput("");

    // Contextual AI replies
    setTimeout(() => {
      const lower = userText.toLowerCase();
      let reply = "I have noted this in your client file. A dedicated account engineer is monitoring your request.";

      if (lower.includes("fuel") || lower.includes("diesel") || lower.includes("tanker") || lower.includes("order")) {
        const liveOrder = orders.find((o) => o.status === "ON THE WAY" || o.status === "CONFIRMED");
        if (liveOrder) {
          reply = `Your ${liveOrder.type} order (${liveOrder.quantity}) is currently "${liveOrder.status}". Tanker ${liveOrder.tankerReg || "LAG-782-KT"} is assigned to driver ${liveOrder.driverName || "Capt. Ibrahim"} with estimated arrival: ${liveOrder.estimatedArrival || "today"}.`;
        } else {
          reply = `You have ${orders.length} total orders on record. You can order scheduled bulk AGO diesel or virtual pipeline CNG anytime from your Fuel tab.`;
        }
      } else if (lower.includes("project") || lower.includes("status") || lower.includes("generator") || lower.includes("stage")) {
        const topProject = projects[0];
        if (topProject) {
          reply = `Project ${topProject.id} (${topProject.name}) is at stage: ${topProject.stage} (${topProject.progressPercent}% complete). Materials Status: ${topProject.materialsStatus}. Assigned Project Manager is ${topProject.projectManager}.`;
        }
      } else if (lower.includes("invoice") || lower.includes("balance") || lower.includes("pay") || lower.includes("receipt")) {
        reply = "You can view your active invoices and settle payments with instant automated receipts directly under the 'Billing & Invoices' tab in your portal.";
      } else if (lower.includes("technician") || lower.includes("repair") || lower.includes("noise") || lower.includes("leak") || lower.includes("service")) {
        reply = "I can immediately log a Service Ticket and dispatch our mobile engineering response unit. Would you like me to open the Service Triage form for your facility?";
      }

      setMessages((prev) => [...prev, { sender: "ai", text: reply, time: "Just now" }]);
    }, 700);
  };

  const handleEscalateToHuman = () => {
    setHumanRequested(true);
    setMessages((prev) => [
      ...prev,
      {
        sender: "human",
        text: `Escalation received! Your complete facility profile, project logs, and conversation history have been transmitted to Engr. Tunde A. at our Senior Client Desk. You can connect instantly below.`,
        time: "Just now",
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0e1013] border border-white/10 rounded-3xl shadow-2xl flex flex-col h-[600px] max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#14161b]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--energy-green)]/15 border border-[var(--energy-green)]/30 flex items-center justify-center">
              <Bot className="w-5 h-5 text-[var(--energy-green)]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-sm sm:text-base text-[var(--electric)]">
                  SmartFix Client Copilot
                </h3>
                <span className="w-2 h-2 rounded-full bg-[var(--energy-green)] animate-pulse" />
              </div>
              <p className="text-[11px] text-[var(--muted-foreground)]">
                Omnichannel AI Support · {profile.company}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full glass-panel flex items-center justify-center text-[var(--muted-foreground)] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  m.sender === "user"
                    ? "bg-[var(--energy-green)] text-[var(--obsidian)] font-medium rounded-tr-none"
                    : m.sender === "human"
                    ? "bg-[var(--cng-blue)]/20 border border-[var(--cng-blue)]/40 text-[var(--electric)] rounded-tl-none font-medium"
                    : "bg-white/[0.04] border border-white/5 text-[var(--electric)] rounded-tl-none"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {humanRequested && (
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-wrap gap-2 items-center justify-between">
              <span className="text-xs text-[var(--muted-foreground)]">
                Live Engineer Line: <strong>Engr. Tunde A.</strong>
              </span>
              <div className="flex gap-2">
                <a
                  href={`https://wa.me/2348139784331?text=${encodeURIComponent(
                    `Hello Engr. Tunde, I am ${profile.name} (${profile.company}). I requested assistance via My SmartFix Portal regarding my energy projects.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[var(--energy-green)] text-[var(--obsidian)] text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Desk
                </a>
                <a
                  href={`tel:${SMARTFIX_CONTACT.phone1Intl}`}
                  className="px-3 py-1.5 rounded-lg glass-panel text-xs text-white inline-flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[var(--cng-blue)]" /> Call Desk
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls & Input */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-[#14161b] space-y-2">
          {!humanRequested && (
            <div className="flex justify-between items-center px-1">
              <span className="text-[11px] text-[var(--muted-foreground)]">Need a direct technical conversation?</span>
              <button
                type="button"
                onClick={handleEscalateToHuman}
                className="text-[11px] font-bold text-[var(--cng-blue)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" /> Speak to a Human Specialist →
              </button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask anything about projects, fuel, repairs, or billing..."
              className="flex-1 px-4 py-3 rounded-xl bg-[#0e1013] text-[#f5f5f7] border border-white/10 text-xs sm:text-sm placeholder:text-[var(--muted-foreground)] focus:border-[var(--energy-green)] outline-none"
            />
            <button
              type="button"
              onClick={handleSend}
              className="w-11 h-11 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
