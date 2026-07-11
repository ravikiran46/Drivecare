import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Car, Menu } from "lucide-react";

const links = [
  { label: "Services", href: "/#services", type: "hash" },
  { label: "How it works", href: "/#how", type: "hash" },
  { label: "Pricing", href: "/#pricing", type: "hash" },
  { label: "FAQ", href: "/#faq", type: "hash" },
];

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <div className="flex items-center justify-between h-16 px-6 mx-auto max-w-7xl">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-glow">
            <Car className="w-5 h-5 text-primary-foreground" />
          </span>
          <span className="text-lg font-semibold tracking-tight font-display">
            Drive<span className="text-gradient">Care</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="items-center hidden gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm transition-colors text-muted-foreground hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right‑side actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="inline-flex items-center rounded-full bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow transition hover:-translate-y-0.5"
          >
            Book a wash
          </Link>
          <button
            className="grid border rounded-full h-9 w-9 place-items-center border-border md:hidden"
            onClick={() => setIsMenuOpen((o) => !o)}
            aria-label="Menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="flex flex-col px-6 py-3 mx-auto max-w-7xl">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setIsMenuOpen(false)}
                className="py-2 text-sm text-muted-foreground"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
