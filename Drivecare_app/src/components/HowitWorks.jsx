import { CalendarCheck, KeyRound, Car, BadgeCheck } from "lucide-react";

const steps = [
  {
    icon: CalendarCheck,
    title: "Book in 30 seconds",
    desc: "Choose a service, pick a slot, and share your address. Instant pricing, no hidden fees.",
  },
  {
    icon: KeyRound,
    title: "Handover at your door",
    desc: "A background-verified partner arrives on time, verifies your booking via OTP and takes over.",
  },
  {
    icon: Car,
    title: "Track every meter",
    desc: "Live GPS on your partner and your car. Get photos before, during, and after service.",
  },
  {
    icon: BadgeCheck,
    title: "Delivered spotless",
    desc: "Your car returns freshly detailed with a digital service report — parked exactly where it was.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="px-6 mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1fr,2fr]">
          <div>
            <p className="text-sm font-medium tracking-widest uppercase text-primary-glow">
              How it works
            </p>
            <h2 className="mt-3 text-4xl font-semibold md:text-5xl">
              Four steps. Zero stress.
            </h2>
            <p className="mt-4 text-muted-foreground">
              From the tap that books your service to the click that unlocks
              your freshly cleaned car — every step is transparent and insured.
            </p>
          </div>

          <ol className="relative pl-8 space-y-6 border-l border-border">
            {steps.map((s, i) => (
              <li key={s.title} className="relative">
                <span className="absolute -left-[41px] top-1 grid h-8 w-8 place-items-center rounded-full border border-border bg-surface text-xs font-semibold text-primary-glow">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="p-6 border rounded-2xl border-border bg-gradient-card">
                  <div className="flex items-center gap-3">
                    <span className="grid w-10 h-10 place-items-center rounded-xl bg-primary/15 text-primary-glow">
                      <s.icon className="w-5 h-5" />
                    </span>
                    <h3 className="text-lg font-semibold">{s.title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
