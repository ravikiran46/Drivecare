import { Check, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

const plans = [
  {
    name: "Essential",
    price: "₹499",
    period: "per wash",
    tagline: "Perfect for a quick doorstep refresh.",
    features: [
      "Foam exterior wash",
      "Tyre & rim polish",
      "Interior vacuum",
      "Dashboard shine",
      "Free doorstep pickup",
    ],
    cta: "Book Essential",
  },
  {
    name: "Care+",
    price: "₹1,299",
    period: "per month",
    tagline: "4 washes + priority slots. Most popular.",
    features: [
      "4 Essential washes a month",
      "Priority booking slots",
      "Free interior fragrance",
      "10% off detailing",
      "Live tracking on every ride",
    ],
    cta: "Start Care+",
    featured: true,
  },
  {
    name: "Concierge",
    price: "₹3,999",
    period: "per month",
    tagline: "Unlimited care for enthusiasts and fleets.",
    features: [
      "Unlimited washes",
      "Monthly premium detail",
      "Quarterly full service",
      "Dedicated partner",
      "24/7 support & insurance boost",
    ],
    cta: "Go Concierge",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-24">
      <div className="px-6 mx-auto max-w-7xl">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-medium tracking-widest uppercase text-primary">
            Pricing
          </p>
          <h2 className="mt-3 text-4xl font-semibold md:text-5xl">
            Simple plans. <span className="text-gradient">No surprises.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Pay per wash or subscribe and save. Cancel anytime — no lock-in, no
            hidden charges, no drama.
          </p>
        </div>

        <div className="grid gap-6 mt-16 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative flex flex-col rounded-3xl border p-8 transition ${
                p.featured
                  ? "border-primary/40 bg-gradient-card shadow-glow lg:-translate-y-3"
                  : "border-border bg-card shadow-soft hover:-translate-y-1"
              }`}
            >
              {p.featured && (
                <span className="absolute flex items-center gap-1 px-3 py-1 text-xs font-medium -translate-x-1/2 rounded-full -top-3 left-1/2 bg-gradient-primary text-primary-foreground shadow-glow">
                  <Sparkles className="w-3 h-3" /> Most loved
                </span>
              )}
              <h3 className="text-xl font-semibold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
              <div className="flex items-baseline gap-2 mt-6">
                <span className="text-5xl font-semibold font-display text-ink">
                  {p.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {p.period}
                </span>
              </div>
              <ul className="flex-1 pt-6 mt-6 space-y-3 text-sm border-t border-border">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-accent/25 text-accent-teal">
                      <Check className="w-3 h-3" />
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/login"
                className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                  p.featured
                    ? "bg-gradient-primary text-primary-foreground shadow-glow hover:-translate-y-0.5"
                    : "border border-border bg-surface text-foreground hover:bg-surface-elevated"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-10 text-xs text-center text-muted-foreground">
          Prices shown are indicative for sedans. Final quote confirmed at
          booking. All plans include full in-transit insurance.
        </p>
      </div>
    </section>
  );
}
