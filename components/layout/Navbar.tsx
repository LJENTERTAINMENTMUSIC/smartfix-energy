import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "@/components/layout/Logo";

const navLinks = [
  { label: "Solutions", path: "/#solutions" },
  { label: "CNG", path: "/cng" },
  { label: "Generators", path: "/generators" },
  { label: "Fuel", path: "/fuel" },
  { label: "Solar", path: "/solar" },
  { label: "Hybrid", path: "/hybrid-energy" },
  { label: "Track Project", path: "/track" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl">
        <div className="glass-nav rounded-2xl px-4 md:px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" onClick={() => setOpen(false)}>
            <Logo size={36} />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === link.path.split("/")[1] && link.path !== "/#"
                    ? "text-[var(--energy-green)]"
                    : "text-[var(--muted-foreground)] hover:text-[var(--electric)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-2">
            <Link
              to="/request-quote"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--energy-green)] text-[var(--obsidian)] text-sm font-semibold btn-magnetic glow-green"
            >
              Get a Quote
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-lg text-[var(--electric)] hover:bg-[var(--muted)]"
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden mt-2 glass-nav rounded-2xl p-4 reveal">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--electric)] hover:bg-[var(--muted)]"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/request-quote"
                onClick={() => setOpen(false)}
                className="mt-2 px-4 py-3 rounded-lg bg-[var(--energy-green)] text-[var(--obsidian)] text-sm font-semibold text-center"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        )}
      </nav>
      {/* Spacer to offset fixed nav */}
      <div className="h-20" />
    </>
  );
}
