import { Star } from "lucide-react";

const items = [
  {
    quote:
      "I booked at midnight for a 7 AM pickup. The partner arrived early, sent photos, and my car was back by lunch shining like new.",
    name: "Priya Menon",
    role: "Mercedes GLA owner",
  },
  {
    quote:
      "Live tracking is a game-changer. My wife could see exactly where the car was the entire time. That's the trust factor.",
    name: "Kabir Shah",
    role: "Range Rover Evoque",
  },
  {
    quote:
      "Full service, spotless interior, and a proper digital report. Feels like a concierge for my car.",
    name: "Meera Iyer",
    role: "Hyundai Creta",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24">
      <div className="px-6 mx-auto max-w-7xl">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-medium tracking-widest uppercase text-primary-glow">
            Loved by drivers
          </p>
          <h2 className="mt-3 text-4xl font-semibold md:text-5xl">
            The kind of care people write home about.
          </h2>
        </div>

        <div className="grid gap-6 mt-14 md:grid-cols-3">
          {items.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col p-6 border rounded-3xl border-border bg-surface"
            >
              <div className="flex items-center gap-1 text-primary-glow">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <blockquote className="flex-1 mt-4 text-base leading-relaxed">
                “{t.quote}”
              </blockquote>
              <figcaption className="pt-4 mt-6 border-t border-border">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
