import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard, Package, Users, Plus, Pencil, Trash2, Tag, Star, X,
  TrendingUp, Boxes, Flame, AlertCircle, RotateCcw, Check, LogOut,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell,
} from "recharts";
import { toast } from "sonner";
import {
  useCatalog, catalog, CATEGORIES, formatNaira,
  type Product, type Availability, type LeadStatus,
} from "@shared/catalog";

/* ------------------------------------------------------------------ */

type Tab = "overview" | "products" | "sales";

const inputCls =
  "w-full rounded-lg bg-[var(--graphite)] border border-[var(--border)] px-3 py-2 text-sm text-[var(--electric)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--energy-green)] focus:ring-2 focus:ring-[rgba(0,217,127,0.15)] transition-all [color-scheme:dark]";
const labelCls = "block text-xs font-medium text-[var(--muted-foreground)] mb-1.5";

const AVAILABILITIES: Availability[] = ["In Stock", "Made to Order", "Pre-Order"];
const LEAD_STATUSES: LeadStatus[] = ["Hot", "Qualified", "Information"];

const PIE_COLORS = ["#00d97f", "#00a8ff", "#8a8a8e"];

/* ------------------------------------------------------------------ */
/*  Product editor modal                                               */
/* ------------------------------------------------------------------ */

const emptyProduct: Omit<Product, "id"> = {
  name: "", category: CATEGORIES[0], capacity: "", fuel: "Diesel",
  application: "", availability: "In Stock", price: null, stock: 0, sold: 0,
  promo: false, promoLabel: "", featured: false,
};

function ProductModal({
  open, initial, onClose,
}: {
  open: boolean;
  initial: Product | null;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<Product, "id">>(emptyProduct);
  const [key, setKey] = useState(0);

  // Reset the form each time the modal opens (new or editing a product)
  useEffect(() => {
    if (open) {
      setForm(initial ? { ...initial } : { ...emptyProduct });
      setKey((k) => k + 1);
    }
  }, [open, initial]);

  if (!open) return null;

  const set = <K extends keyof Omit<Product, "id">>(k: K, v: Omit<Product, "id">[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const save = () => {
    if (!form.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (initial) {
      catalog.updateProduct(initial.id, form);
      toast.success("Product updated");
    } else {
      catalog.addProduct(form);
      toast.success("Product added to Power Store");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        key={key}
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card p-6 md:p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-xl text-[var(--electric)]">
            {initial ? "Edit Product" : "Add Product"}
          </h3>
          <button onClick={onClose} className="press-scale w-9 h-9 rounded-full glass-panel flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--electric)]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="pf-name" className={labelCls}>Product name</label>
            <input id="pf-name" name="name" autoComplete="off" className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Perkins 150KVA Diesel Generator" />
          </div>
          <div>
            <label htmlFor="pf-category" className={labelCls}>Category</label>
            <select id="pf-category" name="category" className={inputCls} value={form.category} onChange={(e) => set("category", e.target.value as string)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="pf-application" className={labelCls}>Application</label>
            <input id="pf-application" name="application" autoComplete="off" className={inputCls} value={form.application} onChange={(e) => set("application", e.target.value)} placeholder="e.g. Industrial" />
          </div>
          <div>
            <label htmlFor="pf-capacity" className={labelCls}>Capacity</label>
            <input id="pf-capacity" name="capacity" autoComplete="off" className={inputCls} value={form.capacity} onChange={(e) => set("capacity", e.target.value)} placeholder="e.g. 150 KVA" />
          </div>
          <div>
            <label htmlFor="pf-fuel" className={labelCls}>Fuel</label>
            <input id="pf-fuel" name="fuel" autoComplete="off" className={inputCls} value={form.fuel} onChange={(e) => set("fuel", e.target.value)} placeholder="Diesel / CNG / —" />
          </div>
          <div>
            <label htmlFor="pf-price" className={labelCls}>Price (₦) — leave blank for "on request"</label>
            <input
              id="pf-price"
              name="price"
              autoComplete="off"
              className={inputCls}
              type="number"
              min={0}
              value={form.price ?? ""}
              onChange={(e) => set("price", e.target.value === "" ? null : Number(e.target.value))}
              placeholder="e.g. 9850000"
            />
          </div>
          <div>
            <label htmlFor="pf-availability" className={labelCls}>Availability</label>
            <select id="pf-availability" name="availability" className={inputCls} value={form.availability} onChange={(e) => set("availability", e.target.value as Availability)}>
              {AVAILABILITIES.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="pf-stock" className={labelCls}>Stock on hand</label>
            <input id="pf-stock" name="stock" autoComplete="off" className={inputCls} type="number" min={0} value={form.stock} onChange={(e) => set("stock", Number(e.target.value))} />
          </div>
          <div>
            <label htmlFor="pf-sold" className={labelCls}>Units sold (lifetime)</label>
            <input id="pf-sold" name="sold" autoComplete="off" className={inputCls} type="number" min={0} value={form.sold} onChange={(e) => set("sold", Number(e.target.value))} />
          </div>
          <div className="md:col-span-2 flex flex-wrap items-center gap-6 pt-2">
            <label className="inline-flex items-center gap-2 text-sm text-[var(--electric)] cursor-pointer">
              <input id="pf-promo" name="promo" type="checkbox" checked={form.promo} onChange={(e) => set("promo", e.target.checked)} className="w-4 h-4 accent-[var(--energy-green)]" />
              <Tag className="w-4 h-4 text-[var(--energy-green)]" /> On promotion
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-[var(--electric)] cursor-pointer">
              <input id="pf-featured" name="featured" type="checkbox" checked={!!form.featured} onChange={(e) => set("featured", e.target.checked)} className="w-4 h-4 accent-[var(--cng-blue)]" />
              <Star className="w-4 h-4 text-[var(--cng-blue)]" /> Feature on billboard
            </label>
            {form.promo && (
              <input id="pf-promolabel" name="promoLabel" autoComplete="off" aria-label="Promo label" className={inputCls + " max-w-[200px]"} value={form.promoLabel || ""} onChange={(e) => set("promoLabel", e.target.value)} placeholder="Promo label (e.g. 10% Off)" />
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full text-sm font-medium glass-panel border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--electric)] transition-colors">
            Cancel
          </button>
          <button onClick={save} className="press-scale inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold bg-[var(--energy-green)] text-[var(--obsidian)]">
            <Check className="w-4 h-4" /> {initial ? "Save changes" : "Add product"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  KPI card                                                           */
/* ------------------------------------------------------------------ */

function Kpi({ icon: Icon, label, value, sub, accent }: {
  icon: typeof Package; label: string; value: string; sub?: string; accent: string;
}) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `color-mix(in srgb, ${accent} 14%, transparent)` }}>
          <Icon className="w-5 h-5" style={{ color: accent }} />
        </div>
        <span className="text-xs font-medium tracking-wide text-[var(--muted-foreground)]">{label}</span>
      </div>
      <div className="font-display font-bold text-2xl text-[var(--electric)]">{value}</div>
      {sub && <div className="text-xs text-[var(--muted-foreground)] mt-1">{sub}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Admin page                                                         */
/* ------------------------------------------------------------------ */

export default function Admin({ onSignOut }: { onSignOut?: () => void }) {
  const { products, leads } = useCatalog();
  const [tab, setTab] = useState<Tab>("overview");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  /* ---- derived stats ---- */
  const stats = useMemo(() => {
    const inventoryValue = products.reduce((s, p) => s + (p.price ?? 0) * p.stock, 0);
    const promoCount = products.filter((p) => p.promo).length;
    const featuredCount = products.filter((p) => p.featured).length;
    const lowStock = products.filter((p) => p.availability === "In Stock" && p.stock <= 3);
    const hotLeads = leads.filter((l) => l.status === "Hot");
    const pipelineValue = leads.reduce((s, l) => s + l.value, 0);
    const totalUnitsSold = products.reduce((s, p) => s + p.sold, 0);
    const revenue = products.reduce((s, p) => s + (p.price ?? 0) * p.sold, 0);
    return { inventoryValue, promoCount, featuredCount, lowStock, hotLeads, pipelineValue, totalUnitsSold, revenue };
  }, [products, leads]);

  const revenueByCategory = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => {
      const r = (p.price ?? 0) * p.sold;
      map.set(p.category, (map.get(p.category) ?? 0) + r);
    });
    return [...map.entries()]
      .map(([name, value]) => ({ name: name.replace(" Generators", "").replace(" Generator", ""), value: Math.round(value / 1000000) }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [products]);

  const pipelineByStatus = useMemo(() => {
    const counts: Record<LeadStatus, number> = { Hot: 0, Qualified: 0, Information: 0 };
    leads.forEach((l) => { counts[l.status]++; });
    return LEAD_STATUSES.map((s) => ({ name: s, value: counts[s] }));
  }, [leads]);

  const openNew = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (p: Product) => { setEditing(p); setModalOpen(true); };

  const removeProduct = (p: Product) => {
    catalog.deleteProduct(p.id);
    toast.success(`Deleted "${p.name}"`);
  };

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    catalog.updateLead(id, { status });
    toast.success("Lead status updated");
  };

  const removeLead = (id: string) => {
    catalog.deleteLead(id);
    toast.success("Lead removed");
  };

  const tabs: { id: Tab; label: string; icon: typeof Package }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "sales", label: "Sales & Leads", icon: Users },
  ];

  return (
    <div className="relative min-h-screen cinematic-bg pt-6 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 glass-panel rounded-full px-3.5 py-1.5 mb-4">
              <LayoutDashboard className="w-3.5 h-3.5 text-[var(--energy-green)]" />
              <span className="text-xs font-medium tracking-[0.15em] text-[var(--muted-foreground)]">ADMIN · COMMAND CENTER</span>
            </div>
            <h1 className="font-display font-bold text-3xl md:text-5xl tracking-tight">
              <span className="text-gradient-light">Power Store</span>{" "}
              <span className="text-gradient-green">Admin</span>
            </h1>
            <p className="mt-2 text-sm text-[var(--muted-foreground)] max-w-xl">
              Manage products, pricing, promotions and sales leads for the SmartFix Energy Power Store.
            </p>
          </div>
          <div className="flex gap-2">
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="press-scale inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium glass-panel border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--electric)]"
              >
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            )}
            <button
              onClick={() => { catalog.reset(); toast.success("Catalog reset to sample data"); }}
              className="press-scale inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium glass-panel border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--electric)]"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button
              onClick={openNew}
              className="press-scale inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-[var(--energy-green)] text-[var(--obsidian)]"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-[var(--border)] overflow-x-auto">
          {tabs.map((t) => {
            const Icon = t.icon;
            const on = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                  on
                    ? "border-[var(--energy-green)] text-[var(--electric)]"
                    : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--electric)]"
                }`}
              >
                <Icon className="w-4 h-4" /> {t.label}
              </button>
            );
          })}
        </div>

        {/* ---------------- OVERVIEW ---------------- */}
        {tab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Kpi icon={Package} label="Products" value={String(products.length)} sub={`${stats.featuredCount} on billboard`} accent="var(--cng-blue)" />
              <Kpi icon={Tag} label="On promotion" value={String(stats.promoCount)} sub="active promos" accent="var(--energy-green)" />
              <Kpi icon={Boxes} label="Inventory value" value={formatNaira(stats.inventoryValue)} sub={`${stats.totalUnitsSold} units sold lifetime`} accent="var(--cng-blue)" />
              <Kpi icon={Flame} label="Hot leads" value={String(stats.hotLeads.length)} sub={`${formatNaira(stats.pipelineValue)} pipeline`} accent="var(--energy-green)" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-5">
                  <TrendingUp className="w-4 h-4 text-[var(--energy-green)]" />
                  <h3 className="font-display font-semibold text-[var(--electric)]">Revenue by category (₦m)</h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueByCategory} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: "#8a8a8e", fontSize: 11 }} axisLine={false} tickLine={false} interval={0} angle={-18} height={54} textAnchor="end" />
                      <YAxis tick={{ fill: "#8a8a8e", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        cursor={{ fill: "rgba(255,255,255,0.04)" }}
                        contentStyle={{ background: "#141417", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#f5f5f7" }}
                        formatter={(v: any) => [`₦${Number(v)}m`, "Revenue"]}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {revenueByCategory.map((_, i) => (
                          <Cell key={i} fill={i % 2 ? "#00a8ff" : "#00d97f"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Users className="w-4 h-4 text-[var(--cng-blue)]" />
                  <h3 className="font-display font-semibold text-[var(--electric)]">Leads by qualification</h3>
                </div>
                <div className="h-64 flex items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pipelineByStatus} dataKey="value" nameKey="name" innerRadius={54} outerRadius={88} paddingAngle={3}>
                        {pipelineByStatus.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} stroke="none" />)}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: "#141417", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#f5f5f7" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 pr-2 -ml-4">
                    {pipelineByStatus.map((d, i) => (
                      <div key={d.name} className="flex items-center gap-2 text-xs">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                        <span className="text-[var(--muted-foreground)]">{d.name}</span>
                        <span className="text-[var(--electric)] font-semibold">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {stats.lowStock.length > 0 && (
              <div className="glass-card p-5 border-l-2 border-l-[var(--energy-green)]">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-[var(--energy-green)]" />
                  <h3 className="font-display font-semibold text-[var(--electric)] text-sm">Low stock alerts</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {stats.lowStock.map((p) => (
                    <span key={p.id} className="text-xs px-3 py-1.5 rounded-full glass-panel border border-[var(--border)] text-[var(--muted-foreground)]">
                      {p.name} · <span className="text-[var(--energy-green)]">{p.stock} left</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------------- PRODUCTS ---------------- */}
        {tab === "products" && (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-[var(--muted-foreground)] border-b border-[var(--border)]">
                    <th className="px-5 py-3 font-medium">Product</th>
                    <th className="px-5 py-3 font-medium">Category</th>
                    <th className="px-5 py-3 font-medium">Price</th>
                    <th className="px-5 py-3 font-medium">Stock</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium text-center">Promo</th>
                    <th className="px-5 py-3 font-medium text-center">Billboard</th>
                    <th className="px-5 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                      <td className="px-5 py-3">
                        <div className="text-[var(--electric)] font-medium">{p.name}</div>
                        <div className="text-xs text-[var(--muted-foreground)]">{p.capacity} · {p.fuel}</div>
                      </td>
                      <td className="px-5 py-3 text-[var(--muted-foreground)] whitespace-nowrap">{p.category}</td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        {p.price != null
                          ? <span className="text-[var(--energy-green)] font-semibold">{formatNaira(p.price)}</span>
                          : <span className="text-[var(--muted-foreground)] text-xs">On request</span>}
                      </td>
                      <td className="px-5 py-3">
                        <span className={p.stock <= 3 ? "text-[var(--energy-green)]" : "text-[var(--electric)]"}>{p.stock}</span>
                        <span className="text-xs text-[var(--muted-foreground)] ml-1">/ {p.sold} sold</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap ${
                          p.availability === "In Stock" ? "bg-[rgba(0,217,127,0.12)] text-[var(--energy-green)]"
                          : p.availability === "Pre-Order" ? "bg-[rgba(138,138,142,0.15)] text-[var(--silver)]"
                          : "bg-[rgba(0,168,255,0.12)] text-[var(--cng-blue)]"
                        }`}>{p.availability}</span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <button
                          onClick={() => { catalog.togglePromo(p.id); toast.success(p.promo ? "Promo removed" : "Marked as promo"); }}
                          className={`press-scale w-8 h-8 rounded-lg inline-flex items-center justify-center transition-colors ${
                            p.promo ? "bg-[var(--energy-green)] text-[var(--obsidian)]" : "glass-panel text-[var(--muted-foreground)] hover:text-[var(--electric)]"
                          }`}
                          aria-label="Toggle promotion"
                        >
                          <Tag className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <button
                          onClick={() => { catalog.toggleFeatured(p.id); toast.success(p.featured ? "Removed from billboard" : "Added to billboard"); }}
                          className={`press-scale w-8 h-8 rounded-lg inline-flex items-center justify-center transition-colors ${
                            p.featured ? "bg-[var(--cng-blue)] text-white" : "glass-panel text-[var(--muted-foreground)] hover:text-[var(--electric)]"
                          }`}
                          aria-label="Toggle billboard feature"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => openEdit(p)} className="press-scale w-8 h-8 rounded-lg glass-panel text-[var(--muted-foreground)] hover:text-[var(--electric)] inline-flex items-center justify-center" aria-label="Edit">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => removeProduct(p)} className="press-scale w-8 h-8 rounded-lg glass-panel text-[var(--muted-foreground)] hover:text-red-400 inline-flex items-center justify-center" aria-label="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------- SALES & LEADS ---------------- */}
        {tab === "sales" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Kpi icon={Flame} label="Hot leads" value={String(stats.hotLeads.length)} accent="var(--energy-green)" />
              <Kpi icon={Users} label="Total leads" value={String(leads.length)} accent="var(--cng-blue)" />
              <Kpi icon={TrendingUp} label="Pipeline value" value={formatNaira(stats.pipelineValue)} accent="var(--energy-green)" />
            </div>

            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-[var(--muted-foreground)] border-b border-[var(--border)]">
                      <th className="px-5 py-3 font-medium">Customer</th>
                      <th className="px-5 py-3 font-medium">Requirement</th>
                      <th className="px-5 py-3 font-medium">Location</th>
                      <th className="px-5 py-3 font-medium">Budget</th>
                      <th className="px-5 py-3 font-medium">Value</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((l) => (
                      <tr key={l.id} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                        <td className="px-5 py-3 text-[var(--electric)] font-medium whitespace-nowrap">{l.name}</td>
                        <td className="px-5 py-3 text-[var(--muted-foreground)] whitespace-nowrap">{l.service}</td>
                        <td className="px-5 py-3 text-[var(--muted-foreground)] whitespace-nowrap">{l.location}</td>
                        <td className="px-5 py-3 text-[var(--muted-foreground)] whitespace-nowrap">{l.budget}</td>
                        <td className="px-5 py-3 text-[var(--energy-green)] font-semibold whitespace-nowrap">{formatNaira(l.value)}</td>
                        <td className="px-5 py-3">
                          <select
                            aria-label={`Lead status for ${l.name}`}
                            name="leadStatus"
                            value={l.status}
                            onChange={(e) => updateLeadStatus(l.id, e.target.value as LeadStatus)}
                            className={`text-xs px-2.5 py-1.5 rounded-full border-0 focus:outline-none cursor-pointer font-medium ${
                              l.status === "Hot" ? "bg-[rgba(0,217,127,0.15)] text-[var(--energy-green)]"
                              : l.status === "Qualified" ? "bg-[rgba(0,168,255,0.15)] text-[var(--cng-blue)]"
                              : "bg-[rgba(138,138,142,0.18)] text-[var(--silver)]"
                            }`}
                          >
                            {LEAD_STATUSES.map((s) => <option key={s} value={s} className="text-[var(--electric)] bg-[var(--graphite)]">{s}</option>)}
                          </select>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button onClick={() => removeLead(l.id)} className="press-scale w-8 h-8 rounded-lg glass-panel text-[var(--muted-foreground)] hover:text-red-400 inline-flex items-center justify-center" aria-label="Delete lead">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {leads.length === 0 && (
                      <tr><td colSpan={7} className="px-5 py-10 text-center text-[var(--muted-foreground)]">No leads yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-xs text-[var(--muted-foreground)] text-center">
              Lead capture from the public forms (conversion wizard &amp; quote requests) will flow here
              automatically once the backend pipeline is connected.
            </p>
          </div>
        )}
      </div>

      <ProductModal open={modalOpen} initial={editing} onClose={() => setModalOpen(false)} />
    </div>
  );
}
