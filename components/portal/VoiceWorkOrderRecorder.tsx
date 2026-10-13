import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  FileText,
  Clock,
  Wrench,
  Cpu,
  ShieldCheck,
  Send,
} from "lucide-react";
import { toast } from "sonner";

export interface FieldVoiceReport {
  id: string;
  projectId: string;
  technicianName: string;
  facility: string;
  durationSeconds: number;
  transcription: string;
  extractedFindings: {
    equipment: string;
    stage: string;
    metricsVerified: string[];
    actionRequired: string;
  };
  recordedAt: string;
}

const SAMPLE_DEMO_TRANSCRIPT =
  "SmartFix Field Operations update. Lead Engineer David on site at Victoria Island facility. We have completed the high-pressure gas train integrity test at 250 bar for 45 minutes with zero leak drop. Venturi gas mixer has been torqued onto the Perkins 500kVA intake. Engine control unit wiring is completed and exhaust gas temperature sensors calibrated. Cleared for pre-commissioning dual-fuel ignition.";

interface VoiceWorkOrderRecorderProps {
  projectId?: string;
  facilityName?: string;
  onReportSaved?: (report: FieldVoiceReport) => void;
}

export default function VoiceWorkOrderRecorder({
  projectId = "SFE-FUL-9538",
  facilityName = "Titan Industries Lagos",
  onReportSaved,
}: VoiceWorkOrderRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioReady, setAudioReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  const [report, setReport] = useState<FieldVoiceReport | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer while recording
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = () => {
    setAudioReady(false);
    setTranscript("");
    setReport(null);
    setRecordingSeconds(0);
    setIsRecording(true);
    toast.info("Microphone active — speaking field observation...");
  };

  const stopRecording = () => {
    setIsRecording(false);
    setAudioReady(true);
    setIsProcessing(true);

    // Simulate AI speech-to-text and technical entity extraction
    setTimeout(() => {
      const finalTranscript = SAMPLE_DEMO_TRANSCRIPT;
      setTranscript(finalTranscript);

      const parsedReport: FieldVoiceReport = {
        id: `VOR-${Date.now().toString().slice(-4)}`,
        projectId,
        technicianName: "Engr. David O. (Field Lead)",
        facility: facilityName,
        durationSeconds: Math.max(12, recordingSeconds),
        transcription: finalTranscript,
        extractedFindings: {
          equipment: "Perkins 500kVA Industrial Generator",
          stage: "Gas Train Integrity & Pre-Commissioning",
          metricsVerified: [
            "250 Bar Nitrogen & Gas Pressure Test: PASSED",
            "Zero pressure drop over 45 minutes",
            "Venturi mixer torque verified",
            "EGT dual thermocouple sensors calibrated",
          ],
          actionRequired: "Clear project pack for final dual-fuel ignition and sign off commissioning certificate",
        },
        recordedAt: new Date().toLocaleTimeString() + " · " + new Date().toLocaleDateString(),
      };

      setReport(parsedReport);
      setIsProcessing(false);
      toast.success("Voice memo transcribed and structured by SmartFix AI!");
      if (onReportSaved) onReportSaved(parsedReport);
    }, 1200);
  };

  const handleReset = () => {
    setIsRecording(false);
    setRecordingSeconds(0);
    setAudioReady(false);
    setTranscript("");
    setReport(null);
  };

  return (
    <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Mic className="w-4 h-4 text-[var(--energy-green)]" />
            <h3 className="font-display font-bold text-lg text-[var(--electric)]">
              Field Technician Voice Work-Orders
            </h3>
          </div>
          <p className="text-xs text-[var(--muted-foreground)]">
            Record spoken site inspection notes, gas test observations, and commissioning logs.
          </p>
        </div>

        <div className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[var(--electric)]">
          Target: {projectId} · {facilityName}
        </div>
      </div>

      {/* Recording Interface */}
      <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col items-center justify-center text-center space-y-4">
        {/* Animated Waveform / Pulse Mic Button */}
        <div className="relative">
          {isRecording && (
            <>
              <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
              <div className="absolute -inset-4 rounded-full border border-red-500/30 animate-pulse" />
            </>
          )}

          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? "bg-red-500 text-white shadow-xl shadow-red-500/40"
                : "bg-[var(--energy-green)] text-[var(--obsidian)] shadow-lg shadow-[var(--energy-green)]/20 hover:scale-105"
            }`}
          >
            {isRecording ? (
              <Square className="w-8 h-8 fill-current" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </button>
        </div>

        {/* Status text */}
        <div>
          <div className="font-display font-bold text-base text-[var(--electric)]">
            {isRecording ? "Listening to Field Observations..." : audioReady ? "Audio Memo Captured" : "Tap Mic to Record Audio Memo"}
          </div>
          <div className="text-xs font-mono text-[var(--muted-foreground)] mt-1">
            {isRecording ? (
              <span className="text-red-400 font-bold">
                REC 00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds} / 02:00
              </span>
            ) : audioReady ? (
              "Audio ready · Processed with SmartFix Speech AI"
            ) : (
              "Spoken voice notes are automatically transcribed into structured field work-orders"
            )}
          </div>
        </div>

        {/* Reset button if ready */}
        {audioReady && (
          <button
            onClick={handleReset}
            className="text-xs text-[var(--muted-foreground)] hover:text-white inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Record new memo
          </button>
        )}
      </div>

      {/* AI Processing Spinner */}
      {isProcessing && (
        <div className="p-5 rounded-2xl glass-panel border border-[var(--cng-blue)]/30 text-center space-y-2">
          <div className="w-6 h-6 border-2 border-[var(--cng-blue)] border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-xs font-semibold text-[var(--electric)]">
            Transcribing voice & extracting engineering parameters...
          </div>
        </div>
      )}

      {/* Structured Field Report Display */}
      {report && (
        <div className="p-5 rounded-2xl glass-panel border border-[var(--energy-green)]/30 bg-[var(--energy-green)]/[0.02] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--energy-green)]" />
              <span className="font-display font-bold text-sm text-[var(--electric)]">
                Structured Field Work Order #{report.id}
              </span>
            </div>
            <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
              {report.recordedAt}
            </span>
          </div>

          {/* Raw Transcript */}
          <div>
            <div className="text-[10px] font-mono text-[var(--muted-foreground)] uppercase mb-1">
              VOICE MEMO TRANSCRIPT
            </div>
            <p className="text-xs text-[var(--electric)] italic bg-black/40 p-3 rounded-xl border border-white/5 leading-relaxed">
              "{report.transcription}"
            </p>
          </div>

          {/* Extracted Technical Entities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl glass-panel border border-white/5 space-y-1">
              <span className="text-[10px] text-[var(--muted-foreground)] block">Equipment Inspected</span>
              <span className="font-semibold text-[var(--electric)]">{report.extractedFindings.equipment}</span>
            </div>
            <div className="p-3 rounded-xl glass-panel border border-white/5 space-y-1">
              <span className="text-[10px] text-[var(--muted-foreground)] block">Workflow Milestone</span>
              <span className="font-semibold text-[var(--cng-blue)]">{report.extractedFindings.stage}</span>
            </div>
          </div>

          {/* Metrics Checked */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-[var(--muted-foreground)] uppercase font-mono block">
              VERIFIED ENGINEERING METRICS
            </span>
            <div className="space-y-1">
              {report.extractedFindings.metricsVerified.map((metric, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[var(--electric)]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--energy-green)] shrink-0" />
                  <span>{metric}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Required */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
            <span className="text-[10px] text-amber-400 font-bold block uppercase mb-0.5">
              AUTOMATIC WORK ORDER DISPATCH
            </span>
            <span className="text-[var(--muted-foreground)]">{report.extractedFindings.actionRequired}</span>
          </div>

          {/* Sync Button */}
          <button
            onClick={() => {
              toast.success(`Voice Work Order #${report.id} synced to Project Pack & Admin Command Center!`);
            }}
            className="w-full py-3 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-xs flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5" /> Sync to Active Project Pack & Lead Queue
          </button>
        </div>
      )}
    </div>
  );
}
