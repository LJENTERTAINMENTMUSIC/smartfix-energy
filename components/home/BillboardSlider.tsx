import { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Zap, Flame, Wrench, Sun, Battery, Gauge } from "lucide-react";
import { useCatalog, formatNaira } from "@/lib/catalog";

/* Service promos — always shown alongside featured products */
type Promo = {
  eyebrow: string;
  title: string;
  copy: string;
  cta: string;
  to: string;
  icon: typeof Zap;
  accent: string; // css var name for glow
  badge?: string;
};

const SERVICE_PROMOS: Promo[] = [
  {
    eyebrow: "CNG CONVERSION",
    title: "Cut fuel costs by up to 60%",
    copy: "Convert your vehicle or fleet to compressed natural gas. Cleaner, cheaper, engineered for Nigerian roads.",
    cta: "Check My Vehicle",
    to: "/cng",
    icon: Flame,
    accent: "var(--energy-green)",
    badge: "Trending",
  },
  {
    eyebrow: "SOLAR & BATTERY",
    title: "Power that works when the grid doesn't",
    copy: "Residential, commercial and industrial solar PV with inverter and battery storage. Silent, reliable energy.",
    cta: "Design My Solar System",
    to: "/solar",
    icon: Sun,
    accent: "var(--cng-blue)",
  },
  {
    eyebrow: "HYBRID ENERGY",
    title: "One intelligent energy system",
    copy: "Combine CNG, solar, battery, grid and generator with smart load management. Designed around your operation.",
    cta: "Design My System",
    to: "/hybrid-energy",
    icon: Battery,
    accent: "var(--energy-green)",
    badge: "New",
  },
  {
    eyebrow: "ENERGY AUDIT",
    title: "Stop guessing where your money goes",
    copy: "We audit generator consumption, grid usage, load profile and efficiency — then show you exactly what to fix.",
    cta: "Book Energy Audit",
    to: "/energy-audit",
    icon: Gauge,
    accent: "var(--cng-blue)",
  },
  {
    eyebrow: "MAINTENANCE",
    title: "When power stops, business stops",
    copy: "Preventive and emergency servicing for generators, CNG systems, solar and batteries. 24/7 technical support.",
    cta: "Book Technical Service",
    to: "/maintenance",
    icon: Wrench,
    accent: "var(--energy-green)",
  },
];

type Slide =
  | { kind: "promo"; promo: Promo }
  | { kind: "product"; id: string; name: string; category: string; price: number | null; promoLabel?: string; accent: string };

export default function BillboardSlider() {
  const { products } = useCatalog();

  const slides = useMemo<Slide[]>(() => {
    // Featured + promo products first, then all service promos interleaved
    const productSlides: Slide[] = products
      .filter((p) => p.featured || p.promo)
      .slice(0, 6)
      .map((p) => ({
        kind: "product",
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        promoLabel: p.promoLabel,
        accent: p.category === "CNG Generators" ? "var(--energy-green)" : "var(--cng-blue)",
      }));

    const promoSlides: Slide[] = SERVICE_PROMOS.map((promo) => ({ kind: "promo", promo }));

    // Lead with one strong product ad, then services, then remaining products
    const out: Slide[] = [];
    if (productSlides[0]) out.push(productSlides[0]);
    out.push(...promoSlides);
    out.push(...productSlides.slice(1));
    return out;
  }, [products]);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Auto-advance (manual, since the autoplay plugin isn't installed)
  useEffect(() => {
    if (!emblaApi) return;
    const id = setInterval(() => emblaApi.scrollNext(), 5500);
    return () => clearInterval(id);
  }, [emblaApi]);

  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  return (
    <section className="relative py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="inline-flex items-center gap-2 glass-panel rounded-full px-3.5 py-1.5 mb-3">
              <Zap className="w-3.5 h-3.5 text-[var(--energy-green)]" />
              <span className="text-xs font-medium tracking-[0.15em] text-[var(--muted-foreground)]">
                SMARTFIX BILLBOARD
              </span>
            </div>
            <h2 className="font-display font-bold text-2xl md:text-4xl tracking-tight">
              <span className="text-gradient-light">Ads, Products &amp; Promotions</span>
            </h2>
          </div>
          <div className="hidden md:flex gap-2">
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="press-scale w-11 h-11 rounded-full glass-panel border border-[var(--border)] flex items-center justify-center text-[var(--electric)] hover:text-[var(--energy-green)] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="press-scale w-11 h-11 rounded-full glass-panel border border-[var(--border)] flex items-center justify-center text-[var(--electric)] hover:text-[var(--energy-green)] transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
          <div className="flex">
            {slides.map((slide, i) => {
              if (slide.kind === "promo") {
                const { promo } = slide;
                const Icon = promo.icon;
                return (
                  <div className="flex-[0_0_100%] min-w-0 px-1" key={`promo-${i}`}>
                    <div
                      className="relative overflow-hidden rounded-2xl glass-card p-8 md:p-12 min-h-[320px] md:min-h-[360px] flex flex-col justify-between"
                      style={{ boxShadow: `0 24px 60px -30px ${promo.accent}` }}
                    >
                      <div
                        className="absolute -top-24 -right-16 w-72 h-72 rounded-full blur-[120px] opacity-25 pointer-events-none"
                        style={{ background: promo.accent }}
                      />
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center"
                            style={{ background: `color-mix(in srgb, ${promo.accent} 14%, transparent)` }}
                          >
                            <Icon className="w-5 h-5" style={{ color: promo.accent }} />
                          </div>
                          <span className="text-xs font-semibold tracking-[0.2em] text-[var(--muted-foreground)]">
                            {promo.eyebrow}
                          </span>
                          {promo.badge && (
                            <span className="ml-auto text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[var(--energy-green)] text-[var(--obsidian)]">
                              {promo.badge}
                            </span>
                          )}
                        </div>
                        <h3 className="font-display font-bold text-3xl md:text-5xl leading-[1.02] tracking-tight text-[var(--electric)] max-w-3xl">
                          {promo.title}
                        </h3>
                        <p className="mt-4 max-w-2xl text-sm md:text-base text-[var(--muted-foreground)] leading-relaxed">
                          {promo.copy}
                        </p>
                      </div>
                      <div className="relative z-10 mt-8">
                        <Link
                          to={promo.to}
                          className="btn-magnetic inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-[var(--obsidian)]"
                          style={{ background: promo.accent }}
                        >
                          {promo.cta}
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }

              // Product slide
              return (
                <div className="flex-[0_0_100%] min-w-0 px-1" key={`prod-${slide.id}`}>
                  <div
                    className="relative overflow-hidden rounded-2xl glass-card p-8 md:p-12 min-h-[320px] md:min-h-[360px] flex flex-col justify-between"
                    style={{ boxShadow: `0 24px 60px -30px ${slide.accent}` }}
                  >
                    <div
                      className="absolute -bottom-24 -left-16 w-80 h-80 rounded-full blur-[130px] opacity-20 pointer-events-none"
                      style={{ background: slide.accent }}
                    />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-xs font-semibold tracking-[0.2em] text-[var(--muted-foreground)]">
                          POWER STORE · {slide.category.toUpperCase()}
                        </span>
                        {slide.promoLabel && (
                          <span className="ml-auto text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[var(--cng-blue)] text-white">
                            {slide.promoLabel}
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-bold text-3xl md:text-5xl leading-[1.02] tracking-tight text-[var(--electric)] max-w-3xl">
                        {slide.name}
                      </h3>
                      <p className="mt-4 text-sm md:text-base text-[var(--muted-foreground)]">
                        Available now ·{" "}
                        <span className="font-display text-2xl md:text-3xl text-[var(--electric)]">
                          {formatNaira(slide.price)}
                        </span>
                      </p>
                    </div>
                    <div className="relative z-10 mt-8">
                      <Link
                        to="/generators"
                        className="btn-magnetic inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-[var(--obsidian)]"
                        style={{ background: slide.accent }}
                      >
                        View in Power Store
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: selected === i ? 28 : 8,
                background: selected === i ? "var(--energy-green)" : "var(--border)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
