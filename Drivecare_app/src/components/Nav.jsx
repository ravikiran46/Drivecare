import {
  Car,
  LogOut,
  LayoutDashboard,
  UserRound,
  Settings,
  CalendarPlus,
} from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { homeFor } from "@/lib/auth";
import useAuth from "@/components/Context/useAuth";
import PropTypes from "prop-types";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  function signOut() {
    logout();
    setMenuOpen(false);
    navigate({ to: "/" });
  }

  const initials = (user?.name || user?.email || "?")
    .split(/[\s@]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  const home = user ? homeFor(user.role) : "/";

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to={home} className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-glow">
            <Car className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Drive<span className="text-gradient">Care</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="hidden rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground transition hover:bg-surface-elevated sm:inline-flex"
            >
              Admin console
            </Link>
          )}
          {user?.role === "agent" && (
            <Link
              to="/agent"
              className="hidden rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground transition hover:bg-surface-elevated sm:inline-flex"
            >
              My jobs
            </Link>
          )}
          {(!user || user.role === "user") && (
            <Link
              to="/book"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow transition hover:-translate-y-0.5"
            >
              <CalendarPlus className="h-4 w-4" />
              Book a wash
            </Link>
          )}

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-glow transition hover:-translate-y-0.5"
                aria-label="Account"
              >
                {initials || <UserRound className="h-4 w-4" />}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-border bg-card shadow-elegant">
                  <div className="border-b border-border px-4 py-3">
                    <p className="truncate text-sm font-semibold">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                    <span className="mt-2 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium capitalize text-primary">
                      {user.role}
                    </span>
                  </div>
                  <div className="p-1">
                    <MenuItem
                      icon={LayoutDashboard}
                      label="Dashboard"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate({ to: homeFor(user.role) });
                      }}
                    />
                    <MenuItem
                      icon={Settings}
                      label="Account settings"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate({ to: "/account" });
                      }}
                    />
                    <MenuItem
                      icon={LogOut}
                      label="Sign out"
                      onClick={signOut}
                      danger
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground transition hover:bg-surface-elevated"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function MenuItem({ icon: Icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition hover:bg-surface ${
        danger ? "text-destructive" : "text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

MenuItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  danger: PropTypes.bool,
};
