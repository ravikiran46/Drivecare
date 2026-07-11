import { ShieldCheck, UserCheck, FileCheck, Sparkles } from "lucide-react";
import detailer from "@/assets/detailer.jpg";

const pillars = [
  {
    icon: UserCheck,
    title: "Background-verified partners",
    desc: "Every partner clears a police verification and hands-on skill assessment before joining.",
  },
  {
    icon: ShieldCheck,
    title: "₹10L in-transit insurance",
    desc: "Your car is fully insured the moment we take over — for every kilometre, every wash.",
  },
  {
    icon: FileCheck,
    title: "Digital service reports",
    desc: "Photo evidence, condition notes, and a signed digital report for every visit.",
  },
  {
    icon: Sparkles,
    title: "Zero-damage guarantee",
    desc: "If we scratch it, we repair it — no arguments, no paperwork loops.",
  },
];

export default function Trust() {
  return (
    <section className="relative py-24">
      <div className="px-6 mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[2rem] border border-border bg-gradient-card">
          <div className="grid gap-0 lg:grid-cols-[1.1fr,1fr]">
            <div className="p-10 lg:p-14">
              <p className="text-sm font-medium tracking-widest uppercase text-primary-glow">
                Trust by design
              </p>
              <h2 className="mt-3 text-4xl font-semibold md:text-5xl">
                Handing over your keys should feel safe. We make sure it is.
              </h2>
              <p className="max-w-xl mt-4 text-muted-foreground">
                Drive Care was built by car owners tired of guessing what
                happens to their car once it leaves the driveway. Every
                safeguard below is default, not an add-on.
              </p>

              <div className="grid gap-5 mt-10 sm:grid-cols-2">
                {pillars.map((p) => (
                  <div key={p.title} className="flex gap-3">
                    <span className="grid mt-1 h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary-glow">
                      <p.icon className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold">{p.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {p.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[380px] lg:min-h-0">
              <img
                src={detailer}
                alt="Drive Care partner detailing a car interior"
                width={1200}
                height={1200}
                loading="lazy"
                className="absolute inset-0 object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/10 to-transparent lg:from-background/60" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
