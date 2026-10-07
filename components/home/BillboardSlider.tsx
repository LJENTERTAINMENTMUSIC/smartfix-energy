import { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Flame,
  Sun,
  Battery,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useCatalog, formatNaira } from "@/lib/catalog";

type Promo = {
  eyebrow: string;
  title: string;
  copy: string;
  cta: string;
  to: string;
  altCta: string;
  altTo: string;
  icon: typeof Zap;
  accent: string;
  badge?: string;
  aiBadge: string;
  specs: string[];
  image: string;
};

const SERVICE_PROMOS: Promo[] = [
  {
    eyebrow: "CNG CONVERSION & FLEET POWER",
    title: "Cut fuel costs by up to 60% with CNG",
    copy: "Full conversion of commercial vehicles, SUVs, and enterprise fleets to natural gas. High-pressure 200-bar certified tanks, precision dual-fuel ECU calibration, and Lagos engineering support.",
    cta: "Check My Vehicle",
    to: "/cng",
    altCta: "Request Fleet Quote",
    altTo: "/request-quote",
    icon: Flame,
    accent: "var(--energy-green)",
    badge: "High Savings",
    aiBadge: "AI Fleet Sizing & Fuel Telematics",
    specs: [
      "Up to 60% Fuel Reduction",
      "200-Bar Tested Tanks",
      "Dual-Fuel Intelligent ECU",
      "Lagos & Interstate Support",
    ],
    image: "/images/products/cng-conversion.jpg",
  },
  {
    eyebrow: "INDUSTRIAL GENERATORS & PRIME POWER",
    title: "Heavy-duty soundproof prime & standby power",
    copy: "Engineered generator sets from 15kVA to 2,500kVA featuring genuine Cummins, Perkins, and Baudouin powertrains with smart ATS synchronisation and dual-fuel CNG compatibility.",
    cta: "Explore Power Store",
    to: "/generators",
    altCta: "Request Sizing Quote",
    altTo: "/request-quote",
    icon: Zap,
    accent: "var(--cng-blue)",
    badge: "In Stock",
    aiBadge: "AI Load Balancing & Power Monitoring",
    specs: [
      "15kVA to 2,500kVA Ratings",
      "Super Silent Enclosure",
      "Dual-Fuel CNG Ready",
      "Immediate Lagos Stock",
    ],
    image: "/images/products/industrial-generators.jpg",
  },
  {
    eyebrow: "COMMERCIAL SOLAR & BATTERY STORAGE",
    title: "Silent power that works when the grid fails",
    copy: "Tier-1 monocrystalline solar PV arrays and high-capacity LiFePO4 battery banks. Zero fuel expenses, silent continuous uptime, and 25-year panel performance for corporate facilities.",
    cta: "Design Solar System",
    to: "/solar",
    altCta: "Book Energy Audit",
    altTo: "/energy-audit",
    icon: Sun,
    accent: "var(--energy-green)",
    badge: "Zero Diesel",
    aiBadge: "AI Solar Irradiance & Yield Forecasting",
    specs: [
      "Tier-1 Monocrystalline PV",
      "LiFePO4 6000+ Cycles",
      "Zero Fuel Expenses",
      "25-Yr Panel Warranty",
    ],
    image: "/images/products/solar-battery.jpg",
  },
  {
    eyebrow: "SMART HYBRID MICROGRID COMMAND",
    title: "One unified intelligent energy strategy",
    copy: "Seamlessly blend CNG, solar, lithium battery, grid, and generator power. Sub-second ATS auto-switching, peak-shaving, and cloud telemetry dashboard for lowest cost of energy.",
    cta: "Design Hybrid System",
    to: "/hybrid-energy",
    altCta: "Speak to Specialist",
    altTo: "/contact",
    icon: Battery,
    accent: "var(--cng-blue)",
    badge: "Smart Microgrid",
    aiBadge: "AI Autonomous Microgrid Dispatch",
    specs: [
      "0.8s ATS Auto-Switch",
      "Smart Peak-Shaving",
      "Live Cloud Telemetry",
      "Lowest Total Cost of Energy",
    ],
    image: "/images/products/smart-energy-command.jpg",
  },
];

type Slide =
  | { kind: "promo"; promo: Promo }
  | {
      kind: "product";
      id: string;
      name: string;
      category: string;
      price: number | null;
      promoLabel?: string;
      accent: string;
      image: string;
      specs: string[];
      aiBadge: string;
    };

export default function BillboardSlider() {
  const { products } = useCatalog();

  const slides = useMemo<Slide[]>(() => {
    // Featured + promo products mapped with category images
    const productSlides: Slide[] = products
      .filter((p) => p.featured || p.promo)
      .slice(0, 4)
      .map((p) => {
        let fallbackImg = "/images/products/industrial-generators.jpg";
        if (p.category.toLowerCase().includes("cng")) {
          fallbackImg = "/images/products/cng-conversion.jpg";
        } else if (
          p.category.toLowerCase().includes("solar") ||
          p.category.toLowerCase().includes("battery")
        ) {
          fallbackImg = "/images/products/solar-battery.jpg";
        }

        return {
          kind: "product",
          id: p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          promoLabel: p.promoLabel || "Available Now",
          accent: p.category.includes("CNG") ? "var(--energy-green)" : "var(--cng-blue)",
          image: p.image || fallbackImg,
          aiBadge: "SmartFix Certified Equipment",
          specs: [
            p.capacity || "Industrial Grade",
            p.fuel || "CNG / Diesel Powertrain",
            p.application || "Continuous Duty",
            p.availability || "In Stock",
          ],
        };
      });

    const promoSlides: Slide[] = SERVICE_PROMOS.map((promo) => ({ kind: "promo", promo }));

    // Interleave: Lead with top promo, then products, then remaining promos
    const out: Slide[] = [];
    if (promoSlides[0]) out.push(promoSlides[0]);
    if (productSlides[0]) out.push(productSlides[0]);
    out.push(...promoSlides.slice(1));
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

  // Auto-advance
  useEffect(() => {
    if (!emblaApi) return;
    const id = setInterval(() => emblaApi.scrollNext(), 6500);
    return () => clearInterval(id);
  }, [emblaApi]);

  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  return (
    <section className="relative py-10 md:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header with counter and controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 glass-panel rounded-full px-3.5 py-1.5 mb-3">
              <span className="w-2 h-2 rounded-full bg-[var(--energy-green)] pulse-ring" />
              <span className="text-xs font-semibold tracking-[0.18em] text-[var(--muted-foreground)]">
                SMARTFIX CINEMATIC SHOWCASE
              </span>
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight">
              <span className="text-gradient-light">Engineered Energy Systems</span>{" "}
              <span className="text-gradient-green">&amp; Hardware</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-medium text-[var(--muted-foreground)] px-3 py-1 rounded-full glass-panel">
              {String(selected + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </span>
            <div className="flex gap-2">
              <button
                onClick={prev}
                aria-label="Previous slide"
                className="press-scale w-10 h-10 rounded-full glass-panel border border-[var(--border)] flex items-center justify-center text-[var(--electric)] hover:text-[var(--energy-green)] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                aria-label="Next slide"
                className="press-scale w-10 h-10 rounded-full glass-panel border border-[var(--border)] flex items-center justify-center text-[var(--electric)] hover:text-[var(--energy-green)] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel viewport */}
        <div className="overflow-hidden rounded-3xl" ref={emblaRef}>
          <div className="flex">
            {slides.map((slide, i) => {
              if (slide.kind === "promo") {
                const { promo } = slide;
                const Icon = promo.icon;
                return (
                  <div className="flex-[0_0_100%] min-w-0 px-1" key={`promo-${i}`}>
                    <div
                      className="relative overflow-hidden rounded-3xl glass-card border border-white/10 p-5 sm:p-8 lg:p-10 min-h-[480px] md:min-h-[520px] flex flex-col justify-between"
                      style={{ boxShadow: `0 28px 70px -25px ${promo.accent}` }}
                    >
                      {/* Ambient background glow */}
                      <div
                        className="absolute -top-32 -right-24 w-96 h-96 rounded-full blur-[140px] opacity-20 pointer-events-none"
                        style={{ background: promo.accent }}
                      />

                      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center h-full">
                        {/* Left column: Copy & Specs */}
                        <div className="lg:col-span-7 flex flex-col justify-between order-2 lg:order-1">
                          <div>
                            {/* Eyebrow and AI pill */}
                            <div className="flex flex-wrap items-center gap-2.5 mb-4">
                              <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{
                                  background: `color-mix(in srgb, ${promo.accent} 15%, transparent)`,
                                }}
                              >
                                <Icon className="w-4 h-4" style={{ color: promo.accent }} />
                              </div>
                              <span className="text-xs font-bold tracking-[0.2em] text-[var(--muted-foreground)] uppercase">
                                {promo.eyebrow}
                              </span>
                              {promo.badge && (
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--energy-green)] text-[var(--obsidian)]">
                                  {promo.badge}
                                </span>
                              )}
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide border border-white/10 bg-white/5 text-[var(--electric)]">
                                <Sparkles className="w-3 h-3 text-[var(--energy-green)]" />
                                <span>{promo.aiBadge}</span>
                              </div>
                            </div>

                            {/* Title */}
                            <h3 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight text-[var(--electric)]">
                              {promo.title}
                            </h3>

                            {/* Subtitle / Copy */}
                            <p className="mt-3 text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed max-w-xl">
                              {promo.copy}
                            </p>

                            {/* Spec chips */}
                            <div className="grid grid-cols-2 gap-2 mt-5 max-w-xl">
                              {promo.specs.map((spec) => (
                                <div
                                  key={spec}
                                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-[var(--electric)]"
                                >
                                  <span
                                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                    style={{ background: promo.accent }}
                                  />
                                  <span className="truncate font-medium">{spec}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex flex-wrap items-center gap-3 mt-6 sm:mt-8 pt-4 border-t border-white/5">
                            <Link
                              to={promo.to}
                              className="btn-magnetic inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-[var(--obsidian)] shadow-lg hover:opacity-95 transition-all"
                              style={{ background: promo.accent }}
                            >
                              {promo.cta}
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                              to={promo.altTo}
                              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-[var(--electric)] glass-panel hover:text-[var(--energy-green)] transition-all"
                            >
                              {promo.altCta}
                            </Link>
                          </div>
                        </div>

                        {/* Right column: Cinematic Product Image */}
                        <div className="lg:col-span-5 relative order-1 lg:order-2">
                          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 group shadow-2xl bg-[#0d0f12]">
                            <img
                              src={promo.image}
                              alt={promo.title}
                              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                              loading="eager"
                            />
                            {/* Dark gradient mask */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10 pointer-events-none" />

                            {/* Top badge */}
                            <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md bg-black/60 text-[var(--electric)] border border-white/10 shadow-lg">
                              <ShieldCheck className="w-3.5 h-3.5 text-[var(--energy-green)]" />
                              SmartFix Certified
                            </div>

                            {/* Bottom telemetry overlay */}
                            <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl backdrop-blur-md bg-black/70 border border-white/10 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[var(--energy-green)] animate-ping" />
                                <span className="text-[11px] font-mono text-white/90 font-medium">
                                  LIVE TELEMETRY
                                </span>
                              </div>
                              <span className="text-[11px] font-mono text-[var(--muted-foreground)]">
                                LAGOS · 2026
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // Product slide
              return (
                <div className="flex-[0_0_100%] min-w-0 px-1" key={`prod-${slide.id}`}>
                  <div
                    className="relative overflow-hidden rounded-3xl glass-card border border-white/10 p-5 sm:p-8 lg:p-10 min-h-[480px] md:min-h-[520px] flex flex-col justify-between"
                    style={{ boxShadow: `0 28px 70px -25px ${slide.accent}` }}
                  >
                    {/* Ambient background glow */}
                    <div
                      className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full blur-[140px] opacity-20 pointer-events-none"
                      style={{ background: slide.accent }}
                    />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center h-full">
                      {/* Left: Product details */}
                      <div className="lg:col-span-7 flex flex-col justify-between order-2 lg:order-1">
                        <div>
                          <div className="flex flex-wrap items-center gap-2.5 mb-4">
                            <span className="text-xs font-bold tracking-[0.2em] text-[var(--muted-foreground)] uppercase">
                              POWER STORE · {slide.category}
                            </span>
                            {slide.promoLabel && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--cng-blue)] text-white">
                                {slide.promoLabel}
                              </span>
                            )}
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide border border-white/10 bg-white/5 text-[var(--electric)]">
                              <Sparkles className="w-3 h-3 text-[var(--cng-blue)]" />
                              <span>{slide.aiBadge}</span>
                            </div>
                          </div>

                          <h3 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight text-[var(--electric)]">
                            {slide.name}
                          </h3>

                          {/* Price Tag */}
                          <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-xs text-[var(--muted-foreground)]">Commercial Price:</span>
                            <span className="font-display font-bold text-2xl sm:text-3xl text-[var(--electric)]">
                              {formatNaira(slide.price)}
                            </span>
                          </div>

                          {/* Spec chips */}
                          <div className="grid grid-cols-2 gap-2 mt-5 max-w-xl">
                            {slide.specs.map((spec) => (
                              <div
                                key={spec}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-[var(--electric)]"
                              >
                                <span
                                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                  style={{ background: slide.accent }}
                                />
                                <span className="truncate font-medium">{spec}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center gap-3 mt-6 sm:mt-8 pt-4 border-t border-white/5">
                          <Link
                            to="/generators"
                            className="btn-magnetic inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-[var(--obsidian)] shadow-lg hover:opacity-95 transition-all"
                            style={{ background: slide.accent }}
                          >
                            View in Power Store
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                          <Link
                            to="/request-quote"
                            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-[var(--electric)] glass-panel hover:text-[var(--energy-green)] transition-all"
                          >
                            Request Official Quote
                          </Link>
                        </div>
                      </div>

                      {/* Right: Product image */}
                      <div className="lg:col-span-5 relative order-1 lg:order-2">
                        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 group shadow-2xl bg-[#0d0f12]">
                          <img
                            src={slide.image}
                            alt={slide.name}
                            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                            loading="eager"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10 pointer-events-none" />

                          <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md bg-black/60 text-[var(--electric)] border border-white/10 shadow-lg">
                            <ShieldCheck className="w-3.5 h-3.5 text-[var(--cng-blue)]" />
                            Hardware Verified
                          </div>

                          <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl backdrop-blur-md bg-black/70 border border-white/10 flex items-center justify-between text-xs">
                            <span className="font-mono text-[11px] text-white/90">
                              STOCK: READY FOR DEPLOYMENT
                            </span>
                            <span className="font-mono text-[11px] text-[var(--energy-green)]">
                              ● ACTIVE
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots navigation */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="h-2 rounded-full transition-all duration-300 cursor-pointer"
              style={{
                width: selected === i ? 36 : 10,
                background: selected === i ? "var(--energy-green)" : "rgba(255, 255, 255, 0.15)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
