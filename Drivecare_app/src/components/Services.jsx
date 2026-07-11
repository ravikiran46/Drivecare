import { Droplets, Sparkles, Wrench, ShieldCheck } from "lucide-react";

const services = [
  {
    icon: Droplets,
    name: "Express Wash",
    price: "₹499",
    time: "45 min",
    desc: "Foam wash, tyre polish, interior vacuum and dashboard shine — at your parking spot.",
    features: ["Exterior foam wash", "Tyre & rim polish", "Interior vacuum"],
  },
  {
    icon: Sparkles,
    name: "Premium Detail",
    price: "₹1,999",
    time: "3 hrs",
    desc: "Deep interior detail, ceramic-grade wax and paint decontamination at our studio.",
    features: [
      "Clay bar treatment",
      "Ceramic wax coat",
      "Leather conditioning",
    ],
    featured: true,
  },
  {
    icon: Wrench,
    name: "Full Service",
    price: "₹3,499",
    time: "Same day",
    desc: "Oil, filters, brakes and multi-point inspection by certified mechanics.",
    features: ["30-point inspection", "OEM parts", "Digital service report"],
  },
  {
    icon: ShieldCheck,
    name: "Doorstep Insurance Check",
    price: "Free",
    time: "20 min",
    desc: "Complimentary safety and insurance review with every booking above ₹999.",
    features: ["Tyre pressure check", "Fluid top-up", "Battery health"],
  },
];

export default function Services() {
  return (
    <section id="services" className="relative py-24">
      <div className="px-6 mx-auto max-w-7xl">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-medium tracking-widest uppercase text-primary-glow">
            What we do
          </p>
          <h2 className="mt-3 text-4xl font-semibold md:text-5xl">
            One app. Every kind of care your car deserves.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Pick a service, choose a slot, unlock your door. We handle the rest
            — and bring your car back better than you left it.
          </p>
        </div>

        <div className="grid gap-6 mt-16 md:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div
              key={s.name}
              className={`group relative flex flex-col rounded-3xl border p-6 transition ${
                s.featured
                  ? "border-primary/40 bg-gradient-card shadow-glow"
                  : "border-border bg-surface hover:-translate-y-1 hover:border-primary/30"
              }`}
            >
              {s.featured && (
                <span className="absolute px-3 py-1 text-xs font-medium rounded-full -top-3 right-6 bg-gradient-primary text-primary-foreground shadow-glow">
                  Most loved
                </span>
              )}
              <span className="grid w-12 h-12 place-items-center rounded-2xl bg-primary/15 text-primary-glow">
                <s.icon className="w-5 h-5" />
              </span>
              <h3 className="mt-5 text-xl font-semibold">{s.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {s.time} · from
              </p>
              <p className="text-3xl font-semibold font-display">{s.price}</p>
              <p className="mt-3 text-sm text-muted-foreground">{s.desc}</p>
              <ul className="pt-4 mt-5 space-y-2 text-sm border-t border-border">
                {s.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-glow" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
