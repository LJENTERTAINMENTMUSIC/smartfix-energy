import { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, Plus, Check, Package, Tag } from "lucide-react";
import BillboardSlider from "@/components/home/BillboardSlider";
import { useCatalog, CATEGORIES, formatNaira } from "@/lib/catalog";

const filters = ["All", ...CATEGORIES];

export default function Generators() {
  const { products } = useCatalog();
  const [active, setActive] = useState("All");
  const [enquiry, setEnquiry] = useState<string[]>([]);

  const filtered = active === "All" ? products : products.filter((p) => p.category === active);

  const toggleEnquiry = (name: string) => {
    setEnquiry((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
  };

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[36vh] flex items-center overflow-hidden pt-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-[var(--cng-blue)] opacity-[0.06] blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 w-full">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-6">
              <Link to="/" className="hover:text-[var(--energy-green)] transition-colors">Home</Link>
              <span>/</span><span className="text-[var(--energy-green)]">Power Store</span>
            </div>
            <div className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-6 reveal">
              <Zap className="w-3.5 h-3.5 text-[var(--cng-blue)]" />
              <span className="text-xs font-medium tracking-[0.15em] text-[var(--muted-foreground)]">SMARTFIX POWER STORE</span>
            </div>
            <h1 className="font-display font-bold text-4xl md:text-6xl leading-[0.95] tracking-tight reveal reveal-delay-1">
              <span className="text-gradient-light">POWER STORE</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base text-[var(--muted-foreground)] leading-relaxed reveal reveal-delay-2">
              Diesel, industrial, standby, prime, silent, portable and CNG generators. Plus ATS, control
              panels, switchgear, parts and accessories.
            </p>
          </div>
        </div>
      </section>

      {/* Billboard slider — product & service ads */}
      <BillboardSlider />

      {/* Category filter */}
      <section className="relative py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-wrap gap-2">
            {filters.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-3.5 py-2 rounded-full text-xs font-medium border transition-all ${
                  active === cat
                    ? "bg-[var(--energy-green)] text-[var(--obsidian)] border-[var(--energy-green)]"
                    : "glass-panel text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--electric)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="section-padding pt-4 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Enquiry bar */}
          {enquiry.length > 0 && (
            <div className="glass-panel rounded-xl px-4 py-3 mb-6 flex items-center justify-between">
              <span className="text-sm text-[var(--electric)]">{enquiry.length} item(s) in enquiry list</span>
              <Link to="/request-quote" className="text-sm font-semibold text-[var(--energy-green)] hover:underline">
                Submit Enquiry →
              </Link>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="glass-card p-12 text-center text-[var(--muted-foreground)]">
              No products in this category yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((product, i) => (
                <div key={product.id} className="glass-card p-5 reveal relative" style={{ animationDelay: `${i * 0.06}s` }}>
                  {product.promo && (
                    <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[var(--energy-green)] text-[var(--obsidian)]">
                      <Tag className="w-3 h-3" />
                      {product.promoLabel || "Promo"}
                    </span>
                  )}

                  {/* Product image placeholder */}
                  <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-[var(--graphite)] to-[var(--obsidian)] border border-[var(--border)] flex items-center justify-center mb-4">
                    <Package className="w-10 h-10 text-[var(--muted-foreground)] opacity-40" />
                  </div>

                  <h3 className="font-display font-semibold text-sm text-[var(--electric)] mb-1">{product.name}</h3>

                  {/* Price */}
                  <div className="mb-3">
                    {product.price != null ? (
                      <span className="font-display text-xl font-bold text-[var(--energy-green)]">
                        {formatNaira(product.price)}
                      </span>
                    ) : (
                      <span className="text-sm text-[var(--cng-blue)] font-medium">Price on request</span>
                    )}
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                    <div><span className="text-[var(--muted-foreground)]">Capacity: </span><span className="text-[var(--electric)]">{product.capacity}</span></div>
                    <div><span className="text-[var(--muted-foreground)]">Fuel: </span><span className="text-[var(--electric)]">{product.fuel}</span></div>
                    <div><span className="text-[var(--muted-foreground)]">Application: </span><span className="text-[var(--electric)]">{product.application}</span></div>
                    <div>
                      <span className="text-[var(--muted-foreground)]">Status: </span>
                      <span className={
                        product.availability === "In Stock"
                          ? "text-[var(--energy-green)]"
                          : product.availability === "Pre-Order"
                          ? "text-[var(--silver)]"
                          : "text-[var(--cng-blue)]"
                      }>
                        {product.availability}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link to="/request-quote" className="flex-1 text-center px-3 py-2 rounded-lg bg-[var(--energy-green)] text-[var(--obsidian)] text-xs font-semibold btn-magnetic">
                      {product.price != null ? "Order / Enquire" : "Request Price"}
                    </Link>
                    <button
                      onClick={() => toggleEnquiry(product.name)}
                      aria-label={enquiry.includes(product.name) ? "Remove from enquiry" : "Add to enquiry"}
                      className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                        enquiry.includes(product.name)
                          ? "bg-[var(--cng-blue)] text-white border-[var(--cng-blue)]"
                          : "glass-panel text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--electric)]"
                      }`}
                    >
                      {enquiry.includes(product.name) ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="mt-6 text-xs text-center text-[var(--muted-foreground)]">
            Prices are indicative. Contact us for full catalog, volume pricing and availability.
          </p>
        </div>
      </section>
    </>
  );
}
