import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  LayoutDashboard,
  FolderGit2,
  Package,
  Fuel,
  Wrench,
  CreditCard,
  FileText,
  BarChart3,
  Users,
  Settings,
  Bell,
  MapPin,
  Phone,
  Mail,
  ShieldAlert,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  LogOut,
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
  Flame,
  Zap,
  Cpu,
  Truck,
  RotateCcw,
  Check,
  Building,
  UserCheck,
  ShieldCheck,
  Download,
  Calendar,
  Layers,
  HelpCircle,
} from "lucide-react";
import {
  portalStorage,
  type CustomerProfile,
  type PortalProject,
  type PortalOrder,
  type RecurringSupply,
  type CustomerAsset,
  type ServiceTicket,
  type PortalInvoice,
  type PortalQuote,
  type PortalContract,
  type NotificationItem,
  type TeamMember,
} from "@/lib/portalData";
import { useCatalog, formatNaira } from "@/lib/catalog";
import { toast } from "sonner";
import { SMARTFIX_CONTACT } from "@/lib/contact";

import ReportIssueModal from "@/components/portal/ReportIssueModal";
import OrderFuelModal from "@/components/portal/OrderFuelModal";
import PayInvoiceModal from "@/components/portal/PayInvoiceModal";
import AssetDetailModal from "@/components/portal/AssetDetailModal";
import PortalSupportChat from "@/components/portal/PortalSupportChat";

type PortalTab =
  | "overview"
  | "projects"
  | "orders"
  | "assets"
  | "billing"
  | "energy"
  | "team"
  | "settings";

export default function CustomerPortal() {
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as PortalTab) || "overview";

  // Data states
  const [profile, setProfile] = useState<CustomerProfile>(portalStorage.getProfile());
  const [activeTab, setActiveTab] = useState<PortalTab>(initialTab);
  const [projects, setProjects] = useState<PortalProject[]>(portalStorage.getProjects());
  const [orders, setOrders] = useState<PortalOrder[]>(portalStorage.getOrders());
  const [recurring, setRecurring] = useState<RecurringSupply[]>(portalStorage.getRecurring());
  const [assets, setAssets] = useState<CustomerAsset[]>(portalStorage.getAssets());
  const [tickets, setTickets] = useState<ServiceTicket[]>(portalStorage.getTickets());
  const [invoices, setInvoices] = useState<PortalInvoice[]>(portalStorage.getInvoices());
  const [quotes, setQuotes] = useState<PortalQuote[]>(portalStorage.getQuotes());
  const [contracts, setContracts] = useState<PortalContract[]>(portalStorage.getContracts());
  const [notifications, setNotifications] = useState<NotificationItem[]>(portalStorage.getNotifications());
  const [team, setTeam] = useState<TeamMember[]>(portalStorage.getTeam());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(portalStorage.isLoggedIn());

  // Modal controls
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showFuelModal, setShowFuelModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<PortalInvoice | null>(null);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<CustomerAsset | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  // Search & Filter filters
  const [assetFilter, setAssetFilter] = useState<string>("All");
  const [projectSearch, setProjectSearch] = useState<string>("");
  const [docSearch, setDocSearch] = useState<string>("");

  // Sync with catalog leads from Supabase
  const { leads } = useCatalog();

  useEffect(() => {
    // When leads load from Supabase, look for leads matching this customer
    if (leads && leads.length > 0) {
      const customerLeads = leads.filter(
        (l: any) =>
          l.email?.toLowerCase().includes("olalekan") ||
          l.email?.toLowerCase().includes("ljentertainment") ||
          l.phone?.replace(/[^0-9]/g, "").includes("08139784331")
      );
      if (customerLeads.length > 0) {
        // Automatically ensure customer project records exist
        const updatedProjects = portalStorage.getProjects();
        customerLeads.forEach((cl: any) => {
          const match = cl.service?.match(/\[([A-Z0-9-]+)\]/);
          const id = match ? match[1] : `SFE-PRJ-${cl.id?.slice(0, 4).toUpperCase()}`;
          if (!updatedProjects.some((p) => p.id === id)) {
            updatedProjects.unshift({
              id,
              name: cl.service?.replace(/\[[A-Z0-9-]+\]\s*/, "") || "Integrated Energy Project",
              type: cl.service?.toLowerCase().includes("fuel")
                ? "Bulk Fuel Supply"
                : cl.service?.toLowerCase().includes("gen")
                ? "Generator Conversion"
                : "CNG Vehicle Conversion",
              location: cl.location || "Lagos, Nigeria",
              siteId: "SITE-01",
              startDate: new Date(cl.created_at || Date.now()).toISOString().split("T")[0],
              expectedCompletion: "In Engineering Review",
              stage: "ENGINEERING",
              progressPercent: 45,
              assignedTeam: ["Engr. Sarah D.", "Engr. Tunde A."],
              projectManager: "Engr. Tunde A.",
              materialsStatus: "Staging BOM (12/12 Allocated)",
              bomCount: { allocated: 12, total: 12 },
              cost: cl.value || 8500000,
              paidAmount: Math.round((cl.value || 8500000) * 0.5),
              milestones: [
                { step: "REQUEST RECEIVED", status: "completed", date: "Verified" },
                { step: "ASSESSMENT", status: "completed", date: "Verified" },
                { step: "ENGINEERING", status: "current", date: "In Progress" },
                { step: "APPROVAL", status: "pending" },
                { step: "PROCUREMENT", status: "pending" },
                { step: "SITE PREPARATION", status: "pending" },
                { step: "INSTALLATION", status: "pending" },
                { step: "TESTING", status: "pending" },
                { step: "COMMISSIONING", status: "pending" },
                { step: "HANDOVER", status: "pending" },
                { step: "SERVICE", status: "pending" },
              ],
              documents: [{ name: "Project Specification Dossier.pdf", size: "1.4 MB", date: "Recent", type: "PDF" }],
            });
          }
        });
        setProjects([...updatedProjects]);
        portalStorage.saveProjects(updatedProjects);
      }
    }
  }, [leads]);

  // Derived Stats
  const stats = useMemo(() => {
    const activeProjects = projects.filter((p) => p.stage !== "COMPLETED");
    const openOrders = orders.filter((o) => o.status !== "DELIVERED" && o.status !== "COMPLETED");
    const pendingInvoices = invoices.filter((i) => i.status === "PENDING" || i.status === "OVERDUE");
    const pendingAmount = pendingInvoices.reduce((s, i) => s + i.amount, 0);
    const dueMaintenance = assets.filter((a) => a.status === "Maintenance Due").length;
    const openTicketsCount = tickets.filter((t) => t.status !== "RESOLVED" && t.status !== "CLOSED").length;
    return {
      activeProjectsCount: activeProjects.length,
      openOrdersCount: openOrders.length,
      pendingAmount,
      dueMaintenance,
      openTicketsCount,
      totalAssets: assets.length,
    };
  }, [projects, orders, invoices, assets, tickets]);

  const activeSite = useMemo(() => {
    return profile.sites.find((s) => s.id === profile.activeSiteId) || profile.sites[0];
  }, [profile]);

  const unreadNotifs = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // Handlers
  const handleSiteChange = (siteId: string) => {
    const updated = { ...profile, activeSiteId: siteId };
    setProfile(updated);
    portalStorage.saveProfile(updated);
    toast.success(`Active facility switched to ${profile.sites.find((s) => s.id === siteId)?.name}`);
  };

  const handleToggleRecurring = (id: string) => {
    const updated = recurring.map((r) =>
      r.id === id ? { ...r, status: r.status === "ACTIVE" ? ("PAUSED" as const) : ("ACTIVE" as const) } : r
    );
    setRecurring(updated);
    portalStorage.saveRecurring(updated);
    toast.info("Recurring supply schedule updated");
  };

  const handleQuoteAction = (quoteId: string, action: "ACCEPTED" | "REVISION_REQUESTED" | "DECLINED") => {
    const updated = quotes.map((q) => (q.id === quoteId ? { ...q, status: action } : q));
    setQuotes(updated);
    portalStorage.saveQuotes(updated);
    if (action === "ACCEPTED") {
      toast.success("Quote accepted! SmartFix contract generation initiated.");
    } else if (action === "REVISION_REQUESTED") {
      toast.info("Revision requested. Project manager will contact you with updated terms.");
    } else {
      toast.warning("Quote declined.");
    }
  };

  const handleLoginDemo = () => {
    portalStorage.login();
    setIsLoggedIn(true);
    toast.success("Welcome to My SmartFix Portal, Olalekan!");
  };

  const handleLogout = () => {
    portalStorage.logout();
    setIsLoggedIn(false);
    toast.info("Signed out of My SmartFix");
  };

  // If logged out, render sleek authentication gateway
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen py-16 px-4 flex items-center justify-center relative">
        <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl glass-card border border-white/10 shadow-2xl relative z-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[var(--energy-green)]/15 border border-[var(--energy-green)]/30 flex items-center justify-center mx-auto mb-5">
            <Zap className="w-7 h-7 text-[var(--energy-green)]" />
          </div>
          <span className="text-xs font-mono font-bold text-[var(--energy-green)] uppercase tracking-widest">
            SMARTFIX ENERGY OS
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--electric)] mt-1 mb-2">
            My SmartFix Portal
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mb-6">
            Secure client account for projects, fuel logistics, telemetry, assets, and invoices.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleLoginDemo}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-sm btn-magnetic glow-green cursor-pointer"
            >
              Sign In as Olalekan Jimoh (LJ Entertainment)
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
                <span className="px-2 bg-[#0e1013] text-[var(--muted-foreground)]">or email / phone access</span>
              </div>
            </div>
            <input
              type="text"
              placeholder="Corporate Email or WhatsApp Phone"
              defaultValue="ljentertainmentmusic@gmail.com"
              className="w-full px-4 py-3 rounded-xl bg-[#14161b] text-white border border-white/10 text-xs sm:text-sm outline-none focus:border-[var(--energy-green)]"
            />
            <input
              type="password"
              placeholder="Password or OTP Code"
              defaultValue="••••••••••••"
              className="w-full px-4 py-3 rounded-xl bg-[#14161b] text-white border border-white/10 text-xs sm:text-sm outline-none focus:border-[var(--energy-green)]"
            />
            <button
              onClick={handleLoginDemo}
              className="w-full py-3 rounded-xl glass-panel text-xs sm:text-sm font-semibold text-[var(--electric)] hover:text-white cursor-pointer"
            >
              Verify OTP &amp; Access Facility Account
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-[var(--muted-foreground)]">
            <a href={SMARTFIX_CONTACT.whatsapp} target="_blank" rel="noreferrer" className="hover:text-[var(--energy-green)]">
              Support Desk
            </a>
            <span className="font-mono text-[11px]">256-Bit Encrypted OS</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 md:py-12 pb-24 md:pb-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* ================================================================== */}
        {/*  TOP BAR: GREETING, SITE SWITCHER, PROFILE & NOTIFICATIONS        */}
        {/* ================================================================== */}
        <div className="glass-card p-5 sm:p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--energy-green)] to-[var(--cng-blue)] flex items-center justify-center font-bold text-lg text-[var(--obsidian)] flex-shrink-0 shadow-lg">
              {profile.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[var(--energy-green)] uppercase tracking-wider">
                  ACTIVE CLIENT PORTAL
                </span>
                <span className="w-2 h-2 rounded-full bg-[var(--energy-green)] animate-pulse" />
              </div>
              <h1 className="font-display font-bold text-xl sm:text-2xl text-[var(--electric)]">
                Good day, {profile.name}
              </h1>
              <p className="text-xs text-[var(--muted-foreground)]">
                {profile.company} · {profile.businessType}
              </p>
            </div>
          </div>

          {/* Quick Facility / Site Switcher & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#14161b] border border-white/10 text-xs">
              <MapPin className="w-3.5 h-3.5 text-[var(--cng-blue)] flex-shrink-0" />
              <select
                aria-label="Active Facility Site"
                value={profile.activeSiteId}
                onChange={(e) => handleSiteChange(e.target.value)}
                className="bg-transparent text-white border-0 outline-none text-xs font-semibold cursor-pointer max-w-[190px] truncate"
              >
                {profile.sites.map((s) => (
                  <option key={s.id} value={s.id} className="bg-[#14161b] text-white">
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-[var(--electric)] hover:text-[var(--energy-green)] relative cursor-pointer"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-[10px] flex items-center justify-center">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#111317] border border-white/15 p-4 shadow-2xl z-50 animate-in fade-in space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-bold text-[var(--electric)] uppercase tracking-wider">
                      Facility Notifications ({unreadNotifs})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const readAll = notifications.map((n) => ({ ...n, read: true }));
                        setNotifications(readAll);
                        portalStorage.saveNotifications(readAll);
                        toast.success("All marked as read");
                      }}
                      className="text-[11px] text-[var(--energy-green)] hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          if (n.linkTab) setActiveTab(n.linkTab as PortalTab);
                          setShowNotifMenu(false);
                        }}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                          !n.read ? "bg-[var(--energy-green)]/10 border-[var(--energy-green)]/30 text-white" : "glass-panel border-white/5 text-[var(--muted-foreground)]"
                        }`}
                      >
                        <div className="flex justify-between font-bold mb-0.5 text-[var(--electric)]">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-[var(--muted-foreground)] font-mono">{n.timestamp}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI Concierge Chat Trigger */}
            <button
              type="button"
              onClick={() => setShowChatModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--energy-green)]/15 border border-[var(--energy-green)]/30 text-[var(--energy-green)] font-bold text-xs hover:bg-[var(--energy-green)]/25 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Ask AI Copilot</span>
            </button>

            {/* Logout button */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-[var(--muted-foreground)] hover:text-red-400 cursor-pointer"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================================================================== */}
        {/*  QUICK ACTIONS BAR: "WHAT DO YOU NEED TODAY?"                     */}
        {/* ================================================================== */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-mono font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
              WHAT DO YOU NEED TODAY?
            </span>
            <span className="text-[11px] text-[var(--muted-foreground)] hidden sm:inline">
              Instant Dispatch &amp; Operations Routing
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <button
              type="button"
              onClick={() => setShowIssueModal(true)}
              className="p-4 rounded-2xl glass-card border border-white/10 hover:border-[var(--energy-green)]/50 transition-all text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-[var(--energy-green)]/15 text-[var(--energy-green)] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <Wrench className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-[var(--electric)]">Request Repair</div>
              <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">Report issue &amp; AI triage</p>
            </button>

            <button
              type="button"
              onClick={() => setShowFuelModal(true)}
              className="p-4 rounded-2xl glass-card border border-white/10 hover:border-[#ff9f0a]/50 transition-all text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-[#ff9f0a]/15 text-[#ff9f0a] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <Fuel className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-[var(--electric)]">Order Fuel</div>
              <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">AGO Diesel &amp; CNG Skid</p>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("projects")}
              className="p-4 rounded-2xl glass-card border border-white/10 hover:border-[var(--cng-blue)]/50 transition-all text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-[var(--cng-blue)]/15 text-[var(--cng-blue)] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <FolderGit2 className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-[var(--electric)]">Track Project</div>
              <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">12-Stage live pipeline</p>
            </button>

            <button
              type="button"
              onClick={() => {
                const firstPending = invoices.find((i) => i.status === "PENDING" || i.status === "OVERDUE") || invoices[0];
                setSelectedInvoice(firstPending || null);
                setShowPayModal(true);
              }}
              className="p-4 rounded-2xl glass-card border border-white/10 hover:border-[var(--energy-green)]/50 transition-all text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-[var(--energy-green)]/15 text-[var(--energy-green)] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-[var(--electric)]">Make Payment</div>
              <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">Instant Paystack receipt</p>
            </button>

            <button
              type="button"
              onClick={() => setShowChatModal(true)}
              className="p-4 rounded-2xl glass-card border border-white/10 hover:border-[var(--electric)]/50 transition-all text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-[var(--electric)]">Contact Support</div>
              <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">AI Copilot &amp; Specialists</p>
            </button>

            <button
              type="button"
              onClick={() => setShowIssueModal(true)}
              className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 hover:border-red-500 transition-all text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-4 h-4 animate-pulse" />
              </div>
              <div className="font-bold text-xs text-red-300">Emergency Desk</div>
              <p className="text-[10px] text-red-400/80 mt-0.5">Power &amp; gas safety triage</p>
            </button>
          </div>
        </div>

        {/* ================================================================== */}
        {/*  NAVIGATION TABS (DESKTOP & SCROLLABLE BAR)                       */}
        {/* ================================================================== */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-white/10 text-xs sm:text-sm font-semibold">
          {[
            { id: "overview", label: "Dashboard", icon: LayoutDashboard },
            { id: "projects", label: `Projects (${stats.activeProjectsCount})`, icon: FolderGit2 },
            { id: "orders", label: `Orders & Fuel (${stats.openOrdersCount})`, icon: Package },
            { id: "assets", label: `Assets & Service (${stats.totalAssets})`, icon: Cpu },
            { id: "billing", label: "Invoices & Quotes", icon: CreditCard },
            { id: "energy", label: "Energy Analytics", icon: BarChart3 },
            { id: "team", label: "Team & Sites", icon: Users },
            { id: "settings", label: "Account Settings", icon: Settings },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as PortalTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-[var(--energy-green)] text-[var(--obsidian)] shadow-md font-bold"
                    : "text-[var(--muted-foreground)] hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* ================================================================== */}
        {/*  TAB 1: OVERVIEW DASHBOARD                                         */}
        {/* ================================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              <div className="p-4 rounded-2xl glass-card border border-white/10">
                <span className="text-[11px] text-[var(--muted-foreground)] block">Active Projects</span>
                <span className="text-2xl font-bold font-mono text-[var(--energy-green)]">{stats.activeProjectsCount}</span>
                <span className="text-[10px] text-[var(--muted-foreground)] block mt-0.5">In Engineering/Staging</span>
              </div>
              <div className="p-4 rounded-2xl glass-card border border-white/10">
                <span className="text-[11px] text-[var(--muted-foreground)] block">Open Orders</span>
                <span className="text-2xl font-bold font-mono text-[var(--cng-blue)]">{stats.openOrdersCount}</span>
                <span className="text-[10px] text-[var(--muted-foreground)] block mt-0.5">1 En Route to Site</span>
              </div>
              <div className="p-4 rounded-2xl glass-card border border-white/10">
                <span className="text-[11px] text-[var(--muted-foreground)] block">Maintenance Status</span>
                <span className="text-2xl font-bold font-mono text-amber-400">{stats.dueMaintenance} Due</span>
                <span className="text-[10px] text-[var(--muted-foreground)] block mt-0.5">Cummins 150kVA set</span>
              </div>
              <div className="p-4 rounded-2xl glass-card border border-white/10">
                <span className="text-[11px] text-[var(--muted-foreground)] block">Pending Payments</span>
                <span className="text-lg sm:text-xl font-bold font-mono text-[var(--electric)]">{formatNaira(stats.pendingAmount)}</span>
                <span className="text-[10px] text-amber-400 block mt-0.5">1 Invoice Awaiting</span>
              </div>
              <div className="p-4 rounded-2xl glass-card border border-white/10">
                <span className="text-[11px] text-[var(--muted-foreground)] block">Open Issues</span>
                <span className="text-2xl font-bold font-mono text-purple-400">{stats.openTicketsCount}</span>
                <span className="text-[10px] text-[var(--muted-foreground)] block mt-0.5">Technician Assigned</span>
              </div>
              <div className="p-4 rounded-2xl glass-card border border-white/10">
                <span className="text-[11px] text-[var(--muted-foreground)] block">Registered Assets</span>
                <span className="text-2xl font-bold font-mono text-white">{stats.totalAssets}</span>
                <span className="text-[10px] text-[var(--energy-green)] block mt-0.5">All telemetry active</span>
              </div>
            </div>

            {/* Live In-Transit Fuel Delivery Telemetry Card */}
            {orders.some((o) => o.status === "ON THE WAY") && (
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#171a21] to-[#121b22] border border-[var(--cng-blue)]/40 relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--cng-blue)]/15 border border-[var(--cng-blue)]/30 flex items-center justify-center text-[var(--cng-blue)] flex-shrink-0">
                      <Truck className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[var(--cng-blue)] uppercase tracking-wider">
                          LIVE LOGISTICS DISPATCH · TANKER IN TRANSIT
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[var(--cng-blue)]/20 text-[var(--cng-blue)] text-[10px] font-bold">
                          ON THE WAY
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-lg text-[var(--electric)] mt-0.5">
                        {orders.find((o) => o.status === "ON THE WAY")?.items}
                      </h3>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        Tanker: <strong className="text-white font-mono">{orders.find((o) => o.status === "ON THE WAY")?.tankerReg}</strong> · Driver: {orders.find((o) => o.status === "ON THE WAY")?.driverName} ({orders.find((o) => o.status === "ON THE WAY")?.driverPhone})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[11px] text-[var(--muted-foreground)] block">Expected Arrival Window:</span>
                      <span className="text-sm font-bold font-mono text-[var(--energy-green)]">
                        {orders.find((o) => o.status === "ON THE WAY")?.estimatedArrival}
                      </span>
                    </div>
                    <a
                      href={`tel:${orders.find((o) => o.status === "ON THE WAY")?.driverPhone}`}
                      className="px-4 py-2.5 rounded-xl bg-[var(--cng-blue)] text-white font-bold text-xs inline-flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call Driver
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Dual Grid: Active Projects & Chronological Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Active Projects Spotlight */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg text-[var(--electric)]">
                    Active Energy Projects &amp; Deployments
                  </h3>
                  <button
                    onClick={() => setActiveTab("projects")}
                    className="text-xs font-semibold text-[var(--energy-green)] hover:underline flex items-center gap-1"
                  >
                    View All ({projects.length}) <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3.5">
                  {projects.slice(0, 2).map((p) => (
                    <div key={p.id} className="p-5 rounded-2xl glass-card border border-white/10 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-[var(--energy-green)] px-2 py-0.5 rounded bg-[var(--energy-green)]/10">
                              {p.id}
                            </span>
                            <span className="text-xs text-[var(--muted-foreground)] font-medium">· {p.type}</span>
                          </div>
                          <h4 className="font-bold text-base text-[var(--electric)] mt-1">{p.name}</h4>
                          <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[var(--cng-blue)]" /> {p.location}
                          </p>
                        </div>
                        <div className="sm:text-right">
                          <span className="text-xs px-3 py-1 rounded-full bg-[var(--energy-green)]/15 text-[var(--energy-green)] font-bold">
                            STAGE: {p.stage}
                          </span>
                          <span className="text-[11px] font-mono text-[var(--muted-foreground)] block mt-1">
                            {p.progressPercent}% Completed
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[var(--energy-green)] to-[var(--cng-blue)] transition-all duration-500"
                          style={{ width: `${p.progressPercent}%` }}
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between text-xs text-[var(--muted-foreground)] border-t border-white/5 pt-3 gap-2">
                        <span>Materials: <strong className="text-white">{p.materialsStatus}</strong></span>
                        <span>Manager: <strong className="text-white">{p.projectManager}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Recent Activity Timeline */}
              <div className="space-y-4">
                <h3 className="font-display font-bold text-lg text-[var(--electric)]">
                  My Activity Timeline
                </h3>
                <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-4 text-xs">
                  <div className="space-y-3.5">
                    <div className="flex gap-3 pb-3 border-b border-white/5">
                      <div className="w-7 h-7 rounded-full bg-[var(--cng-blue)]/20 text-[var(--cng-blue)] flex items-center justify-center flex-shrink-0">
                        <Truck className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-bold text-white">Fuel Delivery Dispatched</div>
                        <p className="text-[11px] text-[var(--muted-foreground)]">10,000L AGO tanker departed depot towards Victoria Island.</p>
                        <span className="text-[10px] text-[var(--muted-foreground)] font-mono">10:42 AM Today</span>
                      </div>
                    </div>

                    <div className="flex gap-3 pb-3 border-b border-white/5">
                      <div className="w-7 h-7 rounded-full bg-[var(--energy-green)]/20 text-[var(--energy-green)] flex items-center justify-center flex-shrink-0">
                        <Wrench className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-bold text-white">Technician Scheduled</div>
                        <p className="text-[11px] text-[var(--muted-foreground)]">Engr. Babatunde K. assigned to Cummins 150kVA RPM diagnostics.</p>
                        <span className="text-[10px] text-[var(--muted-foreground)] font-mono">09:15 AM Today</span>
                      </div>
                    </div>

                    <div className="flex gap-3 pb-3 border-b border-white/5">
                      <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                        <CreditCard className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-bold text-white">Payment Received</div>
                        <p className="text-[11px] text-[var(--muted-foreground)]">₦5,100,000 for Perkins Dual-Fuel Milestone 2 confirmed.</p>
                        <span className="text-[10px] text-[var(--muted-foreground)] font-mono">Yesterday</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                        <Zap className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-bold text-white">Solar Commissioning Finalized</div>
                        <p className="text-[11px] text-[var(--muted-foreground)]">50kWp Solar Microgrid handed over at Ikeja Media Hub.</p>
                        <span className="text-[10px] text-[var(--muted-foreground)] font-mono">Sep 30, 2026</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/*  TAB 2: MY PROJECTS (FULL 12-STAGE LIFECYCLE)                     */}
        {/* ================================================================== */}
        {activeTab === "projects" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-bold text-2xl text-[var(--electric)]">
                  My SmartFix Energy Projects
                </h2>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                  Single source of truth from intake and engineering to testing, commissioning, and handover.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowChatModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-xs btn-magnetic glow-green"
              >
                Request New Engineering Project +
              </button>
            </div>

            {/* Project List */}
            <div className="space-y-6">
              {projects.map((p) => {
                const stagesList = [
                  "REQUEST RECEIVED",
                  "ASSESSMENT",
                  "ENGINEERING",
                  "APPROVAL",
                  "PROCUREMENT",
                  "SITE PREPARATION",
                  "INSTALLATION",
                  "TESTING",
                  "COMMISSIONING",
                  "HANDOVER",
                  "SERVICE",
                ];
                const currentStageIdx = stagesList.indexOf(p.stage);

                return (
                  <div key={p.id} className="p-6 md:p-8 rounded-3xl glass-card border border-white/10 space-y-6">
                    {/* Project Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[var(--energy-green)] px-2.5 py-1 rounded bg-[var(--energy-green)]/15 border border-[var(--energy-green)]/30">
                            {p.id}
                          </span>
                          <span className="text-xs font-semibold text-[var(--cng-blue)]">
                            {p.type}
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-xl text-[var(--electric)] mt-1">
                          {p.name}
                        </h3>
                        <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-[var(--cng-blue)]" /> {p.location}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <div className="text-left md:text-right">
                          <span className="text-xs px-3 py-1 rounded-full bg-[var(--energy-green)] text-[var(--obsidian)] font-bold">
                            {p.stage}
                          </span>
                          <span className="text-xs font-mono text-[var(--muted-foreground)] block mt-1">
                            Started {p.startDate} · Target {p.expectedCompletion}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delay Notice Banner if applicable */}
                    {p.isDelayed && p.delayNotice && (
                      <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 space-y-1.5">
                        <div className="flex items-center gap-2 font-bold text-amber-400">
                          <AlertTriangle className="w-4 h-4" /> Operational Schedule Advisory: DELAYED
                        </div>
                        <p><strong>Reason:</strong> {p.delayNotice.reason}</p>
                        <p><strong>Impact &amp; Revised Date:</strong> {p.delayNotice.impact} · New Target: {p.delayNotice.newExpectedDate}</p>
                        <p><strong>SmartFix Action:</strong> {p.delayNotice.smartfixAction}</p>
                      </div>
                    )}

                    {/* 12-Stage Visual Lifecycle Progress Pipeline */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
                          PROJECT LIFECYCLE ROADMAP
                        </span>
                        <span className="text-xs font-mono font-bold text-[var(--energy-green)]">
                          {p.progressPercent}% Completed
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-11 gap-1.5">
                        {stagesList.map((st, idx) => {
                          const isDone = idx < currentStageIdx;
                          const isCurrent = idx === currentStageIdx;
                          return (
                            <div
                              key={st}
                              className={`p-2 rounded-xl text-center text-[10px] font-semibold border transition-all ${
                                isCurrent
                                  ? "bg-[var(--energy-green)] text-[var(--obsidian)] border-[var(--energy-green)] shadow-md"
                                  : isDone
                                  ? "bg-[var(--energy-green)]/15 border-[var(--energy-green)]/30 text-[var(--energy-green)]"
                                  : "glass-panel border-white/5 text-[var(--muted-foreground)]"
                              }`}
                            >
                              <div className="text-[8px] font-mono opacity-80 mb-0.5">0{idx + 1}</div>
                              <span className="block truncate">{st.split(" ")[0]}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Project Specifications & Team */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3.5 rounded-2xl glass-card border border-white/5">
                        <span className="text-[var(--muted-foreground)] block">BOM Material Allocation:</span>
                        <span className="font-bold text-white mt-0.5 block">{p.materialsStatus}</span>
                      </div>
                      <div className="p-3.5 rounded-2xl glass-card border border-white/5">
                        <span className="text-[var(--muted-foreground)] block">Assigned Project Manager:</span>
                        <span className="font-bold text-[var(--energy-green)] mt-0.5 block">{p.projectManager}</span>
                      </div>
                      <div className="p-3.5 rounded-2xl glass-card border border-white/5">
                        <span className="text-[var(--muted-foreground)] block">Contract Value &amp; Settlement:</span>
                        <span className="font-bold text-white mt-0.5 block font-mono">
                          {formatNaira(p.paidAmount)} / {formatNaira(p.cost)}
                        </span>
                      </div>
                    </div>

                    {/* Verified Documents */}
                    {p.documents.length > 0 && (
                      <div className="border-t border-white/5 pt-4">
                        <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider block mb-2">
                          Project Documents &amp; Engineering Reports ({p.documents.length})
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {p.documents.map((doc, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => toast.success(`Downloading ${doc.name}...`)}
                              className="px-3 py-2 rounded-xl glass-panel text-xs text-[var(--electric)] hover:text-[var(--energy-green)] inline-flex items-center gap-2 cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5 text-[var(--energy-green)]" />
                              <span>{doc.name}</span>
                              <span className="text-[10px] text-[var(--muted-foreground)]">({doc.size})</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/*  TAB 3: MY ORDERS & FUEL HUB                                      */}
        {/* ================================================================== */}
        {activeTab === "orders" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-bold text-2xl text-[var(--electric)]">
                  Orders &amp; Fuel Logistics Centre
                </h2>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                  Track bulk AGO diesel deliveries, virtual pipeline CNG shipments, and recurring supply cycles.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowFuelModal(true)}
                className="px-5 py-3 rounded-xl bg-[#ff9f0a] text-[var(--obsidian)] font-bold text-xs sm:text-sm shadow-xl hover:opacity-95 cursor-pointer"
              >
                + New Fuel Order / Scheduled Delivery
              </button>
            </div>

            {/* Recurring Supply Schedules Card */}
            <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-[#ff9f0a]" />
                  <h3 className="font-display font-bold text-lg text-[var(--electric)]">
                    Recurring Fuel Replenishment Schedules
                  </h3>
                </div>
                <span className="text-xs font-mono text-[var(--muted-foreground)]">
                  Continuous Generator &amp; Fleet Uptime
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recurring.map((rec) => (
                  <div key={rec.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-mono font-bold text-[#ff9f0a]">{rec.id}</span>
                        <h4 className="font-bold text-sm text-[var(--electric)] mt-0.5">{rec.quantity} · {rec.fuelType}</h4>
                        <p className="text-xs text-[var(--muted-foreground)]">{rec.siteName}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rec.status === "ACTIVE" ? "bg-[var(--energy-green)]/15 text-[var(--energy-green)]" : "bg-white/10 text-white/40"
                      }`}>
                        {rec.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-[var(--muted-foreground)] border-t border-white/5 pt-2">
                      <div>Cycle: <strong className="text-white">{rec.frequency}</strong></div>
                      <div>Next Dispatch: <strong className="text-[var(--energy-green)]">{rec.nextDeliveryDate}</strong></div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs font-mono text-[var(--muted-foreground)]">
                        Est: {formatNaira(rec.estimatedMonthlySpend)} / month
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleRecurring(rec.id)}
                        className="px-3 py-1.5 rounded-lg glass-panel text-xs text-[var(--electric)] hover:text-white cursor-pointer"
                      >
                        {rec.status === "ACTIVE" ? "Pause Schedule" : "Resume Schedule"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* All Orders Table */}
            <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
              <h3 className="font-display font-bold text-lg text-[var(--electric)]">
                All Completed &amp; Active Orders
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-[var(--muted-foreground)] uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-3">Order ID</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3">Type &amp; Description</th>
                      <th className="py-3 px-3">Volume</th>
                      <th className="py-3 px-3">Amount</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-3 font-mono font-bold text-[var(--energy-green)]">{o.id}</td>
                        <td className="py-3 px-3 text-[var(--muted-foreground)]">{o.date}</td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-[var(--electric)]">{o.items}</div>
                          <div className="text-[10px] text-[var(--muted-foreground)]">{o.deliveryAddress}</div>
                        </td>
                        <td className="py-3 px-3 font-mono text-white">{o.quantity}</td>
                        <td className="py-3 px-3 font-mono text-[var(--energy-green)]">{formatNaira(o.totalPrice)}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            o.status === "ON THE WAY"
                              ? "bg-[var(--cng-blue)]/20 text-[var(--cng-blue)]"
                              : o.status === "DELIVERED"
                              ? "bg-[var(--energy-green)]/15 text-[var(--energy-green)]"
                              : "bg-white/10 text-white/60"
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => toast.success(`Official delivery manifest for ${o.id} downloaded.`)}
                            className="px-3 py-1.5 rounded-lg glass-panel text-[11px] text-[var(--electric)] hover:text-[var(--energy-green)]"
                          >
                            Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/*  TAB 4: MY ASSETS, REPAIRS & MAINTENANCE                          */}
        {/* ================================================================== */}
        {activeTab === "assets" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-bold text-2xl text-[var(--electric)]">
                  My Equipment, Fleet &amp; Power Assets
                </h2>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                  Registered SmartFix asset passports, telemetry runtimes, maintenance cycles, and repair tickets.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-xs btn-magnetic glow-green"
                >
                  Report Issue on Asset +
                </button>
              </div>
            </div>

            {/* Asset Category Filters */}
            <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
              {["All", "Generators", "Vehicles", "Solar & Battery"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setAssetFilter(cat)}
                  className={`px-3.5 py-2 rounded-xl font-medium cursor-pointer transition-colors ${
                    assetFilter === cat
                      ? "bg-white/15 text-white font-bold"
                      : "glass-panel text-[var(--muted-foreground)] hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Asset Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assets
                .filter((a) => (assetFilter === "All" ? true : a.category === assetFilter))
                .map((a) => (
                  <div
                    key={a.id}
                    onClick={() => {
                      setSelectedAsset(a);
                      setShowAssetModal(true);
                    }}
                    className="p-5 rounded-3xl glass-card border border-white/10 hover:border-[var(--energy-green)]/40 transition-all cursor-pointer space-y-4 group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[var(--energy-green)] px-2.5 py-0.5 rounded bg-[var(--energy-green)]/15">
                            {a.id}
                          </span>
                          <span className="text-xs text-[var(--cng-blue)] font-semibold">{a.category}</span>
                        </div>
                        <h3 className="font-bold text-base text-[var(--electric)] mt-1.5 group-hover:text-[var(--energy-green)] transition-colors">
                          {a.name}
                        </h3>
                        <p className="text-xs text-[var(--muted-foreground)]">{a.manufacturer} · {a.model}</p>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        a.status === "Operational"
                          ? "bg-[var(--energy-green)]/15 text-[var(--energy-green)]"
                          : "bg-amber-400/15 text-amber-400"
                      }`}>
                        {a.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs py-2 border-y border-white/5 text-[var(--muted-foreground)]">
                      <div>Rating: <strong className="text-white block font-mono">{a.capacity}</strong></div>
                      <div>Runtime: <strong className="text-white block font-mono">{a.runningHours.toLocaleString()} hrs</strong></div>
                      <div>Next Service: <strong className="text-amber-400 block font-mono">{a.nextServiceDate}</strong></div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-[var(--muted-foreground)]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[var(--cng-blue)]" /> {a.location}
                      </span>
                      <span className="text-[var(--energy-green)] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Asset Passport →
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            {/* Active Service Tickets Section */}
            <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-[var(--electric)]">
                  Active Service Tickets &amp; Field Repairs ({tickets.length})
                </h3>
                <span className="text-xs font-mono text-[var(--energy-green)]">
                  Live Dispatch SLA: Active
                </span>
              </div>

              <div className="space-y-3">
                {tickets.map((t) => (
                  <div key={t.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-400/10">
                            {t.ticketNumber}
                          </span>
                          <span className="text-xs text-[var(--muted-foreground)]">{t.assetName}</span>
                        </div>
                        <h4 className="font-bold text-sm text-[var(--electric)] mt-1">{t.issueCategory} · {t.description}</h4>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[var(--cng-blue)]/20 text-[var(--cng-blue)] text-xs font-bold whitespace-nowrap">
                        {t.status}
                      </span>
                    </div>

                    {t.assignedTechnician && (
                      <div className="p-3 rounded-xl glass-panel text-xs flex flex-col sm:flex-row justify-between gap-2">
                        <span>Technician: <strong className="text-white">{t.assignedTechnician.name}</strong> ({t.assignedTechnician.role})</span>
                        <span className="text-[var(--energy-green)] font-mono font-bold">Arrival Window: {t.assignedTechnician.arrivalWindow}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/*  TAB 5: BILLING, INVOICES, QUOTES & CONTRACTS                     */}
        {/* ================================================================== */}
        {activeTab === "billing" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-bold text-2xl text-[var(--electric)]">
                  Commercial Ledger, Invoices &amp; Quotes
                </h2>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                  256-bit encrypted settlement terminal, verified receipts, and active energy agreements.
                </p>
              </div>
            </div>

            {/* Invoices List */}
            <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
              <h3 className="font-display font-bold text-lg text-[var(--electric)]">
                Invoices &amp; Payment History
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-[var(--muted-foreground)] uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-3">Invoice No.</th>
                      <th className="py-3 px-3">Description</th>
                      <th className="py-3 px-3">Amount</th>
                      <th className="py-3 px-3">Due Date</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-3 font-mono font-bold text-white">{inv.invoiceNumber}</td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-[var(--electric)]">{inv.description}</div>
                          <span className="text-[10px] text-[var(--muted-foreground)]">{inv.category}</span>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-[var(--energy-green)]">
                          {formatNaira(inv.amount)}
                        </td>
                        <td className="py-3 px-3 text-[var(--muted-foreground)]">{inv.dueDate}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            inv.status === "PAID"
                              ? "bg-[var(--energy-green)]/15 text-[var(--energy-green)]"
                              : "bg-amber-400/15 text-amber-400"
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {inv.status !== "PAID" ? (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedInvoice(inv);
                                setShowPayModal(true);
                              }}
                              className="px-3.5 py-1.5 rounded-lg bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-xs btn-magnetic cursor-pointer"
                            >
                              Pay Now
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => toast.success(`Official PDF receipt for ${inv.invoiceNumber} downloaded.`)}
                              className="px-3 py-1.5 rounded-lg glass-panel text-[11px] text-[var(--electric)] hover:text-white cursor-pointer"
                            >
                              Download Receipt
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Active Quotes Section */}
            <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
              <h3 className="font-display font-bold text-lg text-[var(--electric)]">
                Proposals &amp; Active Quotes ({quotes.length})
              </h3>

              <div className="space-y-4">
                {quotes.map((q) => (
                  <div key={q.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-mono text-xs font-bold text-[var(--energy-green)]">{q.quoteNumber}</span>
                        <h4 className="font-bold text-base text-[var(--electric)] mt-0.5">{q.scope}</h4>
                        <span className="text-xs text-[var(--muted-foreground)]">Valid until {q.validUntil}</span>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-lg font-bold font-mono text-[var(--energy-green)]">{formatNaira(q.totalAmount)}</span>
                        <span className={`block text-[10px] font-bold ${q.status === "ACCEPTED" ? "text-[var(--energy-green)]" : "text-amber-400"}`}>
                          {q.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl glass-panel text-xs text-[var(--muted-foreground)] space-y-1">
                      <span className="font-bold text-white block">Commercial Terms:</span>
                      <p>{q.terms}</p>
                    </div>

                    {q.status === "PENDING_REVIEW" && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleQuoteAction(q.id, "ACCEPTED")}
                          className="px-4 py-2 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-xs btn-magnetic"
                        >
                          Accept Proposal &amp; Contract
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuoteAction(q.id, "REVISION_REQUESTED")}
                          className="px-4 py-2 rounded-xl glass-panel text-xs text-white"
                        >
                          Request Scope Revision
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuoteAction(q.id, "DECLINED")}
                          className="px-4 py-2 rounded-xl glass-panel text-xs text-[var(--muted-foreground)] hover:text-red-400"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Master Agreements & Contracts */}
            <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
              <h3 className="font-display font-bold text-lg text-[var(--electric)]">
                Active Energy Supply &amp; Maintenance Contracts ({contracts.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contracts.map((c) => (
                  <div key={c.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <span className="font-mono font-bold text-[var(--cng-blue)]">{c.contractNumber}</span>
                      <span className="px-2 py-0.5 rounded-full bg-[var(--energy-green)]/15 text-[var(--energy-green)] text-[10px] font-bold">
                        {c.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-[var(--electric)]">{c.title}</h4>
                    <p className="text-[var(--muted-foreground)]">Commitment: <strong className="text-white">{c.monthlyCommitment}</strong></p>
                    <p className="text-[var(--muted-foreground)]">Period: {c.startDate} to {c.endDate}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/*  TAB 6: MY ENERGY (ANALYTICS)                                      */}
        {/* ================================================================== */}
        {activeTab === "energy" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div>
              <h2 className="font-display font-bold text-2xl text-[var(--electric)]">
                My Energy Consumption &amp; Savings Telemetry
              </h2>
              <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                Live metrics on diesel substitution, CNG virtual pipeline delivery, and solar microgrid yield.
              </p>
            </div>

            {/* Savings Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c1f17] via-[#11171d] to-[#0e1013] border border-[var(--energy-green)]/30 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-bold text-[var(--energy-green)] uppercase tracking-widest">
                    CUMULATIVE ENERGY COST REDUCTION
                  </span>
                  <h3 className="font-display font-bold text-3xl sm:text-4xl text-[var(--electric)] mt-1">
                    ₦14,850,000 Saved
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-md mt-1">
                    Through Perkins dual-fuel conversion (52% diesel reduction) and 50kWp rooftop solar peak-shaving.
                  </p>
                </div>
                <div className="p-4 rounded-2xl glass-card border border-white/10 text-right">
                  <span className="text-xs text-[var(--muted-foreground)] block">CO2 Equivalent Avoided:</span>
                  <span className="text-2xl font-bold font-mono text-[var(--cng-blue)]">38.4 Metric Tonnes</span>
                </div>
              </div>
            </div>

            {/* Interactive SVG Bar Visualizer */}
            <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
              <h3 className="font-display font-bold text-lg text-[var(--electric)]">
                Monthly Fuel Mix (Litres of Diesel Equivalent)
              </h3>
              <p className="text-xs text-[var(--muted-foreground)]">
                Transitioning from 100% pure AGO diesel to hybrid CNG virtual pipeline and solar daylight microgrid.
              </p>

              {/* Responsive SVG Chart */}
              <div className="h-64 w-full pt-4">
                <svg className="w-full h-full" viewBox="0 0 500 200">
                  <defs>
                    <linearGradient id="cngGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00d97f" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#00d97f" stopOpacity="0.2" />
                    </linearGradient>
                    <linearGradient id="dieselGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ff9f0a" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#ff9f0a" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.06)" />
                  <line x1="40" y1="70" x2="480" y2="70" stroke="rgba(255,255,255,0.06)" />
                  <line x1="40" y1="120" x2="480" y2="120" stroke="rgba(255,255,255,0.06)" />
                  <line x1="40" y1="170" x2="480" y2="170" stroke="rgba(255,255,255,0.1)" />

                  {/* June */}
                  <rect x="70" y="40" width="30" height="130" fill="url(#dieselGrad)" rx="4" />
                  <text x="85" y="190" textAnchor="middle" fill="#8a8a8e" fontSize="10">June</text>

                  {/* July */}
                  <rect x="150" y="55" width="30" height="115" fill="url(#dieselGrad)" rx="4" />
                  <text x="165" y="190" textAnchor="middle" fill="#8a8a8e" fontSize="10">July</text>

                  {/* August (Dual Fuel begins) */}
                  <rect x="230" y="90" width="30" height="80" fill="url(#dieselGrad)" rx="4" />
                  <rect x="230" y="50" width="30" height="38" fill="url(#cngGrad)" rx="4" />
                  <text x="245" y="190" textAnchor="middle" fill="#8a8a8e" fontSize="10">Aug</text>

                  {/* September (Solar added) */}
                  <rect x="310" y="110" width="30" height="60" fill="url(#dieselGrad)" rx="4" />
                  <rect x="310" y="65" width="30" height="42" fill="url(#cngGrad)" rx="4" />
                  <text x="325" y="190" textAnchor="middle" fill="#8a8a8e" fontSize="10">Sep</text>

                  {/* October (Target State) */}
                  <rect x="390" y="125" width="30" height="45" fill="url(#dieselGrad)" rx="4" />
                  <rect x="390" y="70" width="30" height="52" fill="url(#cngGrad)" rx="4" />
                  <text x="405" y="190" textAnchor="middle" fill="#00d97f" fontSize="10" fontWeight="bold">Oct (Now)</text>
                </svg>
              </div>

              <div className="flex justify-center gap-6 text-xs pt-2">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#ff9f0a]" /> Diesel Base Runtime
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[var(--energy-green)]" /> CNG &amp; Solar Clean Substitution
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/*  TAB 7: TEAM & SITES                                              */}
        {/* ================================================================== */}
        {activeTab === "team" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div>
              <h2 className="font-display font-bold text-2xl text-[var(--electric)]">
                Multiple Facility Sites &amp; Team Permissions
              </h2>
              <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                Grant role-based access to facility operations, finance managers, and site dispatchers.
              </p>
            </div>

            {/* Registered Sites */}
            <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-[var(--electric)]">
                  Registered Operational Locations ({profile.sites.length})
                </h3>
                <button
                  type="button"
                  onClick={() => toast.info("Site onboarding wizard initiated")}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white font-bold cursor-pointer"
                >
                  + Add Site
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {profile.sites.map((s) => (
                  <div key={s.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-[var(--cng-blue)] font-bold">{s.id}</span>
                      {s.isPrimary && (
                        <span className="px-2 py-0.5 rounded bg-[var(--energy-green)]/15 text-[var(--energy-green)] text-[10px] font-bold">
                          Primary HQ
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-[var(--electric)]">{s.name}</h4>
                    <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[var(--muted-foreground)]" /> {s.location}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Members */}
            <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-[var(--electric)]">
                  Authorized Team Access ({team.length})
                </h3>
                <button
                  type="button"
                  onClick={() => toast.info("Invite link generated")}
                  className="px-3.5 py-1.5 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] text-xs font-bold cursor-pointer"
                >
                  Invite Team Member +
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-[var(--muted-foreground)] uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-3">Name</th>
                      <th className="py-3 px-3">Email Address</th>
                      <th className="py-3 px-3">Assigned Role</th>
                      <th className="py-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {team.map((m) => (
                      <tr key={m.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-3 font-bold text-white">{m.name}</td>
                        <td className="py-3 px-3 font-mono text-[var(--muted-foreground)]">{m.email}</td>
                        <td className="py-3 px-3 text-[var(--energy-green)] font-medium">{m.role}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            m.status === "Active" ? "bg-[var(--energy-green)]/15 text-[var(--energy-green)]" : "bg-white/10 text-white/50"
                          }`}>
                            {m.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/*  TAB 8: ACCOUNT & SECURITY SETTINGS                               */}
        {/* ================================================================== */}
        {activeTab === "settings" && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-display font-bold text-2xl text-[var(--electric)]">
                Account &amp; Security Settings
              </h2>
              <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                Manage contact details, emergency escalations, and notification channels.
              </p>
            </div>

            <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
              <h3 className="font-bold text-sm text-[var(--electric)] uppercase tracking-wider border-b border-white/5 pb-2">
                Facility &amp; Billing Profile
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[var(--muted-foreground)] block mb-1">Company / Entity</label>
                  <input
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#14161b] text-white border border-white/10 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[var(--muted-foreground)] block mb-1">Primary Official Email</label>
                  <input
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#14161b] text-white border border-white/10 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[var(--muted-foreground)] block mb-1">Direct Phone / WhatsApp</label>
                  <input
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#14161b] text-white border border-white/10 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[var(--muted-foreground)] block mb-1">Preferred Channel</label>
                  <select
                    value={profile.preferredChannel}
                    onChange={(e) => setProfile({ ...profile, preferredChannel: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#14161b] text-white border border-white/10 outline-none"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Email">Official Email</option>
                    <option value="Phone">Phone Call</option>
                    <option value="In-App">In-App Notification</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    portalStorage.saveProfile(profile);
                    toast.success("Profile saved successfully!");
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-xs btn-magnetic"
                >
                  Save Profile Updates
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================================================================== */}
      {/*  MOBILE-FIRST FIXED BOTTOM NAVIGATION BAR (< 768px)               */}
      {/* ================================================================== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0e1013]/95 backdrop-blur-lg border-t border-white/10 px-2 py-2 flex items-center justify-around shadow-2xl">
        {[
          { id: "overview", label: "Home", icon: LayoutDashboard },
          { id: "projects", label: "Projects", icon: FolderGit2 },
          { id: "orders", label: "Orders", icon: Fuel },
          { id: "assets", label: "Service", icon: Wrench },
          { id: "billing", label: "Billing", icon: CreditCard },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as PortalTab)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer ${
                isActive ? "text-[var(--energy-green)]" : "text-[var(--muted-foreground)] hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-semibold">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================================================================== */}
      {/*  MODAL SUB-ENGINES                                                 */}
      {/* ================================================================== */}
      <ReportIssueModal
        isOpen={showIssueModal}
        onClose={() => setShowIssueModal(false)}
        assets={assets}
        onTicketCreated={(ticket) => {
          setTickets([ticket, ...tickets]);
          setActiveTab("assets");
        }}
      />

      <OrderFuelModal
        isOpen={showFuelModal}
        onClose={() => setShowFuelModal(false)}
        profile={profile}
        onOrderPlaced={(order) => {
          setOrders([order, ...orders]);
          setActiveTab("orders");
        }}
      />

      <PayInvoiceModal
        isOpen={showPayModal}
        onClose={() => setShowPayModal(false)}
        invoice={selectedInvoice}
        onPaymentSuccess={(id) => {
          setInvoices((prev) =>
            prev.map((inv) => (inv.id === id ? { ...inv, status: "PAID" as const } : inv))
          );
        }}
      />

      <AssetDetailModal
        isOpen={showAssetModal}
        onClose={() => setShowAssetModal(false)}
        asset={selectedAsset}
        onRequestService={() => {
          setShowIssueModal(true);
        }}
      />

      <PortalSupportChat
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        profile={profile}
        projects={projects}
        orders={orders}
        assets={assets}
        invoices={invoices}
      />
    </div>
  );
}
