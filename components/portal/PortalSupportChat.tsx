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
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  FileCheck,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  type CustomerProfile,
  type PortalProject,
  type PortalOrder,
  type CustomerAsset,
  type PortalInvoice,
} from "@/lib/portalData";
import {
  knowledgeEngine,
  type OrchestrationResult,
  type SpecialistAgentType,
} from "@/lib/smartfixKnowledgeEngine";
import { SMARTFIX_CONTACT } from "@/lib/contact";
import { toast } from "sonner";

interface PortalSupportChatProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CustomerProfile;
  projects: PortalProject[];
  orders: PortalOrder[];
  assets?: CustomerAsset[];
  invoices?: PortalInvoice[];
}

interface ChatMsg {
  id: string;
  sender: "ai" | "user" | "human";
  text: string;
  time: string;
  agent?: SpecialistAgentType;
  confidenceScore?: number;
  confidenceLevel?: "HIGH" | "GOOD" | "CAUTION" | "ESCALATE";
  citations?: { id: string; title: string; source: string; version: string; reviewDate: string }[];
  isEmergency?: boolean;
  extractedFacts?: { key: string; value: string }[];
  feedbackGiven?: boolean;
}

const AGENT_LABELS: Record<SpecialistAgentType, { name: string; color: string }> = {
  CustomerCareAgent: { name: "Client Care Specialist", color: "var(--energy-green)" },
  SalesAgent: { name: "Commercial & Energy Solutions Desk", color: "var(--energy-green)" },
  EngineeringAgent: { name: "Power Systems & Dual-Fuel Lead", color: "var(--cng-blue)" },
  ComplianceAgent: { name: "NMDPRA & Regulatory Officer", color: "#a855f7" },
  HSEAgent: { name: "Rapid HSE & Safety Containment Desk", color: "#ef4444" },
  FuelAgent: { name: "AGO & Virtual Pipeline Fuel Logistics", color: "#f59e0b" },
  ServiceAgent: { name: "Mobile Diagnostics & Technical Field Unit", color: "var(--cng-blue)" },
  FinanceAgent: { name: "Settlement & Accounts Receivable Lead", color: "var(--energy-green)" },
  ProjectAgent: { name: "Milestone & BOM Project Manager", color: "var(--cng-blue)" },
  ExecutiveAgent: { name: "SmartFix Executive Office Desk", color: "var(--electric)" },
};

export default function PortalSupportChat({
  isOpen,
  onClose,
  profile,
  projects,
  orders,
  assets = [],
  invoices = [],
}: PortalSupportChatProps) {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: "msg-welcome",
      sender: "ai",
      text: `Good day, ${profile.name}! I am your SmartFix Dedicated Energy Copilot powered by the Deep Knowledge Engine. I have verified real-time context for ${profile.company}, including ${projects.length} active projects, ${orders.length} fuel dispatches, and your registered power assets. How can I assist you with accuracy today?`,
      time: "Just now",
      agent: "CustomerCareAgent",
      confidenceScore: 99,
      confidenceLevel: "HIGH",
      citations: [
        {
          id: "SFE-CORP-001",
          title: "SmartFix Corporate Overview",
          source: "SmartFix Corporate Charter",
          version: "2.4",
          reviewDate: "2027-01-01",
        },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [humanRequested, setHumanRequested] = useState(false);
  const [feedbackPromptId, setFeedbackPromptId] = useState<string | null>(null);
  const [expandedCitations, setExpandedCitations] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const handleSend = () => {
    if (!input.trim()) return;
    const userText = input.trim();
    const userMsgId = `usr-${Date.now()}`;

    const newMsgs: ChatMsg[] = [
      ...messages,
      { id: userMsgId, sender: "user", text: userText, time: "Just now" },
    ];
    setMessages(newMsgs);
    setInput("");

    // Execute Enterprise RAG & Hybrid Knowledge Orchestration
    setTimeout(() => {
      const result: OrchestrationResult = knowledgeEngine.orchestrateResponse(
        userText,
        profile,
        projects,
        orders,
        assets,
        invoices
      );

      const aiMsgId = `ai-${Date.now()}`;
      const aiMsg: ChatMsg = {
        id: aiMsgId,
        sender: "ai",
        text: result.answer,
        time: "Just now",
        agent: result.agent,
        confidenceScore: result.confidenceScore,
        confidenceLevel: result.confidenceLevel,
        citations: result.citations,
        isEmergency: result.isEmergencyAlert,
        extractedFacts: result.extractedFacts,
      };

      setMessages((prev) => [...prev, aiMsg]);

      // If confidence is low or escalation triggered, suggest human escalation automatically
      if (result.escalationTriggered && !result.isEmergencyAlert) {
        toast.info("Your request has also been routed to a senior account specialist.");
      }
    }, 450);
  };

  const handleFeedback = (
    msgId: string,
    helpful: boolean,
    reason?: "Wrong answer" | "Incomplete" | "Didn't understand" | "Outdated" | "Need human" | "Other"
  ) => {
    const targetMsg = messages.find((m) => m.id === msgId);
    if (!targetMsg) return;

    knowledgeEngine.recordFeedback({
      query: "User Query",
      response: targetMsg.text,
      helpful,
      reason,
      customerId: profile.id,
    });

    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, feedbackGiven: true } : m))
    );
    setFeedbackPromptId(null);
    toast.success(helpful ? "Thank you for the verification feedback!" : "Feedback recorded for engineering audit.");
  };

  const handleEscalateToHuman = () => {
    setHumanRequested(true);
    setMessages((prev) => [
      ...prev,
      {
        id: `human-${Date.now()}`,
        sender: "human",
        text: `Escalation received! Your complete facility profile, equipment telemetry, active project packs, and conversation logs have been transmitted to Engr. Tunde A. at our Senior Technical Desk. You can connect immediately below.`,
        time: "Just now",
        agent: "ExecutiveAgent",
        confidenceScore: 100,
        confidenceLevel: "HIGH",
      },
    ]);
  };

  const toggleCitation = (id: string) => {
    setExpandedCitations((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0b0d10] border border-white/10 rounded-3xl shadow-2xl flex flex-col h-[650px] max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#121419]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--energy-green)]/15 border border-[var(--energy-green)]/30 flex items-center justify-center">
              <Bot className="w-5 h-5 text-[var(--energy-green)]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-sm sm:text-base text-[var(--electric)]">
                  SmartFix Enterprise Energy Copilot
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[var(--energy-green)]/15 text-[var(--energy-green)] border border-[var(--energy-green)]/30 font-bold">
                  KNOWLEDGE ENGINE ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-[var(--muted-foreground)]">
                Autonomous where safe · Human when required · {profile.company}
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
            >
              {/* Agent & Confidence Badge */}
              {m.sender === "ai" && m.agent && (
                <div className="flex items-center gap-2 mb-1.5 px-1">
                  <span
                    className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md flex items-center gap-1"
                    style={{
                      background: `color-mix(in srgb, ${AGENT_LABELS[m.agent]?.color || "var(--energy-green)"} 15%, transparent)`,
                      color: AGENT_LABELS[m.agent]?.color || "var(--energy-green)",
                      border: `1px solid color-mix(in srgb, ${AGENT_LABELS[m.agent]?.color || "var(--energy-green)"} 30%, transparent)`,
                    }}
                  >
                    <ShieldCheck className="w-3 h-3" />
                    {AGENT_LABELS[m.agent]?.name || m.agent}
                  </span>
                  {m.confidenceScore !== undefined && (
                    <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
                      {m.confidenceScore}% Confidence · {m.confidenceLevel}
                    </span>
                  )}
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[90%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  m.sender === "user"
                    ? "bg-[var(--energy-green)] text-[var(--obsidian)] font-semibold rounded-tr-none"
                    : m.sender === "human"
                    ? "bg-[var(--cng-blue)]/20 border border-[var(--cng-blue)]/40 text-[var(--electric)] rounded-tl-none font-medium"
                    : m.isEmergency
                    ? "bg-red-950/50 border border-red-500/50 text-red-200 rounded-tl-none"
                    : "bg-[#14171d] border border-white/10 text-[var(--electric)] rounded-tl-none"
                }`}
              >
                {m.isEmergency && (
                  <div className="flex items-center gap-2 mb-2 text-red-400 font-bold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 animate-bounce" />
                    Emergency Containment Directive
                  </div>
                )}

                <div className="whitespace-pre-line">{m.text}</div>

                {/* Emergency Hotline Quick Dial */}
                {m.isEmergency && (
                  <div className="mt-3 pt-3 border-t border-red-500/30 flex gap-2">
                    <a
                      href={`tel:${SMARTFIX_CONTACT.phone1Intl}`}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5" /> Call Rapid Emergency Desk ({SMARTFIX_CONTACT.phone1})
                    </a>
                  </div>
                )}

                {/* Citations & Source Hierarchy */}
                {m.citations && m.citations.length > 0 && !m.isEmergency && (
                  <div className="mt-3 pt-2.5 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => toggleCitation(m.id)}
                      className="flex items-center gap-1.5 text-[11px] text-[var(--cng-blue)] hover:underline cursor-pointer font-medium"
                    >
                      <BookOpen className="w-3 h-3" />
                      {m.citations.length} Verified Citation{m.citations.length > 1 ? "s" : ""}
                      {expandedCitations[m.id] ? (
                        <ChevronUp className="w-3 h-3 ml-1" />
                      ) : (
                        <ChevronDown className="w-3 h-3 ml-1" />
                      )}
                    </button>

                    {expandedCitations[m.id] && (
                      <div className="mt-2 space-y-1.5 pl-2 border-l border-white/10">
                        {m.citations.map((c) => (
                          <div key={c.id} className="text-[10px] text-[var(--muted-foreground)]">
                            <span className="font-mono text-[var(--energy-green)] font-semibold">[{c.id}]</span>{" "}
                            <span className="text-[var(--electric)]">{c.title}</span> (v{c.version}) · Source:{" "}
                            {c.source} · Review: {c.reviewDate}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Feedback Prompt for AI replies */}
              {m.sender === "ai" && !m.feedbackGiven && !m.isEmergency && (
                <div className="flex items-center gap-3 mt-1.5 px-2 text-[10px] text-[var(--muted-foreground)]">
                  <span>Accurate &amp; helpful?</span>
                  <button
                    type="button"
                    onClick={() => handleFeedback(m.id, true)}
                    className="hover:text-[var(--energy-green)] flex items-center gap-1 cursor-pointer transition-colors"
                    title="Yes, accurate"
                  >
                    <ThumbsUp className="w-3 h-3" /> Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackPromptId(feedbackPromptId === m.id ? null : m.id)}
                    className="hover:text-red-400 flex items-center gap-1 cursor-pointer transition-colors"
                    title="No, needs improvement"
                  >
                    <ThumbsDown className="w-3 h-3" /> No
                  </button>
                </div>
              )}

              {/* Feedback reason dropdown */}
              {feedbackPromptId === m.id && (
                <div className="mt-2 p-2.5 rounded-xl bg-[#181a20] border border-white/10 text-xs flex flex-wrap gap-1.5">
                  <span className="w-full text-[10px] text-[var(--muted-foreground)] mb-1">
                    Help us improve: What was the issue?
                  </span>
                  {[
                    "Wrong answer",
                    "Incomplete",
                    "Didn't understand",
                    "Outdated",
                    "Need human",
                    "Other",
                  ].map((reason) => (
                    <button
                      key={reason}
                      onClick={() => handleFeedback(m.id, false, reason as any)}
                      className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[10px] text-[var(--electric)] transition-colors cursor-pointer"
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Live Human Desk Banner when requested */}
          {humanRequested && (
            <div className="p-4 rounded-2xl bg-[#141923] border border-[var(--cng-blue)]/30 flex flex-wrap gap-3 items-center justify-between animate-in fade-in">
              <div>
                <span className="text-xs font-semibold text-[var(--electric)] block">
                  Connected: Engr. Tunde A. (Senior Lead Specialist)
                </span>
                <span className="text-[11px] text-[var(--muted-foreground)]">
                  Direct operations dispatch for {profile.company}
                </span>
              </div>
              <div className="flex gap-2">
                <a
                  href={`https://wa.me/2348139784331?text=${encodeURIComponent(
                    `Hello Engr. Tunde, I am ${profile.name} (${profile.company}). I requested human technical support via My SmartFix Portal regarding our energy operations.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] text-xs font-bold inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Desk
                </a>
                <a
                  href={`tel:${SMARTFIX_CONTACT.phone1Intl}`}
                  className="px-3.5 py-2 rounded-xl glass-panel text-xs text-white inline-flex items-center gap-1.5 hover:bg-white/10 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[var(--cng-blue)]" /> Direct Call
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls & Input */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-[#121419] space-y-2">
          {!humanRequested && (
            <div className="flex justify-between items-center px-1">
              <span className="text-[11px] text-[var(--muted-foreground)]">
                Complex engineering inquiry or bespoke contract?
              </span>
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
              placeholder="Ask anything about projects, fuel, 250hr service, generator specs..."
              className="flex-1 px-4 py-3 rounded-xl bg-[#0b0d10] text-[#f5f5f7] border border-white/10 text-xs sm:text-sm placeholder:text-[var(--muted-foreground)] focus:border-[var(--energy-green)] outline-none"
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
