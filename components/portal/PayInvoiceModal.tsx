import React, { useState } from "react";
import {
  X,
  CreditCard,
  Building,
  CheckCircle2,
  Lock,
  ArrowRight,
  Download,
  FileCheck,
  ShieldCheck,
} from "lucide-react";
import { portalStorage, type PortalInvoice } from "@/lib/portalData";
import { toast } from "sonner";
import { formatNaira } from "@/lib/catalog";

interface PayInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: PortalInvoice | null;
  onPaymentSuccess: (invoiceId: string) => void;
}

export default function PayInvoiceModal({
  isOpen,
  onClose,
  invoice,
  onPaymentSuccess,
}: PayInvoiceModalProps) {
  const [method, setMethod] = useState<"card" | "transfer">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [txnRef, setTxnRef] = useState("");

  if (!isOpen || !invoice) return null;

  const handlePay = () => {
    setIsProcessing(true);
    const ref = `SFE-PAY-${Math.floor(100000 + Math.random() * 900000)}`;

    setTimeout(() => {
      // Update invoice in storage
      const allInvoices = portalStorage.getInvoices();
      const updated = allInvoices.map((inv) =>
        inv.id === invoice.id
          ? { ...inv, status: "PAID" as const, paidDate: new Date().toISOString().split("T")[0] }
          : inv
      );
      portalStorage.saveInvoices(updated);

      // Add notification
      const notifs = portalStorage.getNotifications();
      notifs.unshift({
        id: `NOTIF-${Date.now()}`,
        title: "Payment Confirmed",
        message: `₦${invoice.amount.toLocaleString()} for ${invoice.invoiceNumber} has been received and verified.`,
        category: "Payment",
        timestamp: "Just now",
        read: false,
        linkTab: "billing",
      });
      portalStorage.saveNotifications(notifs);

      setIsProcessing(false);
      setTxnRef(ref);
      setPaymentSuccess(true);
      onPaymentSuccess(invoice.id);
      toast.success(`Payment authorized! Transaction Ref: ${ref}`);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0e1013] border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#14161b]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--energy-green)]/15 text-[var(--energy-green)] border border-[var(--energy-green)]/30 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-[var(--electric)]">
                Secure Energy Payment Terminal
              </h3>
              <p className="text-[11px] text-[var(--muted-foreground)]">
                Encrypted Merchant Settlement &amp; Instant Receipt
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

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-5">
          {!paymentSuccess ? (
            <>
              {/* Invoice Summary */}
              <div className="p-4 rounded-2xl glass-card border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-xs text-[var(--muted-foreground)]">
                  <span>Invoice Reference:</span>
                  <span className="font-mono text-white font-bold">{invoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-[var(--muted-foreground)]">
                  <span>Scope / Category:</span>
                  <span className="text-[var(--electric)] font-medium">{invoice.description}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-white/5">
                  <span className="text-[var(--electric)]">Total Amount Due:</span>
                  <span className="text-xl text-[var(--energy-green)] font-mono">{formatNaira(invoice.amount)}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold text-[var(--muted-foreground)] mb-2 uppercase tracking-wider">
                  Select Channel
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMethod("card")}
                    className={`p-3.5 rounded-xl border text-left text-xs font-medium cursor-pointer transition-all ${
                      method === "card"
                        ? "bg-[var(--energy-green)]/15 border-[var(--energy-green)] text-[var(--electric)]"
                        : "glass-panel text-[var(--muted-foreground)]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className="w-4 h-4 text-[var(--energy-green)]" />
                      <span className="font-bold">Card / Paystack</span>
                    </div>
                    <span className="text-[11px] text-[var(--muted-foreground)]">Mastercard, Visa, Verve</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod("transfer")}
                    className={`p-3.5 rounded-xl border text-left text-xs font-medium cursor-pointer transition-all ${
                      method === "transfer"
                        ? "bg-[var(--cng-blue)]/15 border-[var(--cng-blue)] text-[var(--electric)]"
                        : "glass-panel text-[var(--muted-foreground)]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Building className="w-4 h-4 text-[var(--cng-blue)]" />
                      <span className="font-bold">Virtual Account</span>
                    </div>
                    <span className="text-[11px] text-[var(--muted-foreground)]">Direct NIBSS Instant Pay</span>
                  </button>
                </div>
              </div>

              {method === "transfer" ? (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">Bank Name:</span>
                    <span className="font-bold text-white">Zenith Bank / Providus</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">Account Name:</span>
                    <span className="font-bold text-white">SmartFix Innovative Services Ltd</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">Virtual Account No:</span>
                    <span className="font-mono font-bold text-[var(--energy-green)] text-sm">1019 448 291</span>
                  </div>
                  <p className="text-[11px] text-[var(--muted-foreground)] pt-1 border-t border-white/5">
                    Transfers settle automatically within 60 seconds.
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl glass-panel text-xs text-[var(--muted-foreground)] flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-[var(--energy-green)] flex-shrink-0" />
                  <span>256-bit encrypted card checkout via CBN-licensed payment gateway.</span>
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-sm btn-magnetic glow-green cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? "Verifying Transaction..." : `Authorize Payment · ${formatNaira(invoice.amount)} →`}
              </button>
            </>
          ) : (
            /* Success confirmation */
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-[var(--energy-green)] text-[var(--obsidian)] flex items-center justify-center mx-auto glow-green">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="text-xs font-mono font-bold text-[var(--energy-green)] uppercase tracking-widest">
                PAYMENT CONFIRMED &amp; VERIFIED
              </span>
              <h3 className="font-display font-bold text-2xl text-[var(--electric)]">
                {formatNaira(invoice.amount)}
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] max-w-sm mx-auto">
                Payment has been credited to your SmartFix account. Your invoice status is now updated to <strong>PAID</strong>.
              </p>

              <div className="p-4 rounded-2xl glass-card border border-white/10 text-left text-xs space-y-2 max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">Transaction Ref:</span>
                  <span className="font-mono text-white font-bold">{txnRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">Invoice Settled:</span>
                  <span className="font-mono text-[var(--energy-green)]">{invoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">Timestamp:</span>
                  <span className="text-white">{new Date().toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-xs sm:text-sm btn-magnetic"
                >
                  Done &amp; View Ledger
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
