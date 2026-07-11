import { ArrowRight, ShieldCheck, MapPin, Star } from "lucide-react";
import { Link } from "@tanstack/react-router";
import heroCar from "@/assets/hero-car.jpg";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(oklch(0.20_0.03_260/0.05)_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="relative grid gap-16 px-6 pt-20 mx-auto max-w-7xl pb-28 lg:grid-cols-2 lg:pt-28">
        <div className="flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs border rounded-full w-fit border-border bg-surface text-muted-foreground shadow-soft">
            <span className="relative grid w-2 h-2 place-items-center">
              <span className="absolute inset-0 rounded-full bg-primary animate-pulse-ring" />
              <span className="relative w-2 h-2 rounded-full bg-primary" />
            </span>
            Doorstep car care · Live tracking · Insured
          </div>

          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Your car, <span className="text-gradient">pampered</span>
            <br />
            at your doorstep.
          </h1>

          <p className="max-w-xl mt-6 text-lg leading-relaxed text-muted-foreground">
            Book a wash, detail or full service in seconds. Our vetted partners
            arrive at your home, take your car with care, and deliver it back
            spotless — while you watch every mile live on the map.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <Link
              to="/login"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:-translate-y-0.5"
            >
              Book your first session
              <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
            </Link>
          </div>

          <dl className="grid max-w-md grid-cols-3 gap-8 mt-12">
            <div>
              <dt className="text-3xl font-semibold font-display text-ink">
                1k+
              </dt>
              <dd className="mt-1 text-xs text-muted-foreground">
                Cars serviced
              </dd>
            </div>
            <div>
              <dt className="text-3xl font-semibold font-display text-ink">
                4.9<span className="text-primary">★</span>
              </dt>
              <dd className="mt-1 text-xs text-muted-foreground">
                Avg. rating
              </dd>
            </div>
            <div>
              <dt className="text-3xl font-semibold font-display text-ink">
                60 min
              </dt>
              <dd className="mt-1 text-xs text-muted-foreground">
                Avg. turnaround
              </dd>
            </div>
          </dl>
        </div>

        {/* Visual */}
        <div className="relative">
          <div className="relative overflow-hidden border rounded-3xl border-border glow-ring">
            <img
              src={heroCar}
              alt="Luxury sedan being detailed by a Drive Care partner"
              width={1600}
              height={1200}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Floating: live tracking */}
          <div className="absolute hidden w-64 p-4 border -left-4 top-8 rounded-2xl border-border bg-card shadow-elegant sm:block animate-float">
            <div className="flex items-center gap-3">
              <span className="grid rounded-full h-9 w-9 place-items-center bg-accent/25">
                <MapPin className="w-4 h-4 text-accent-teal" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Agent en route</p>
                <p className="text-sm font-medium">Rahul · 4 min away</p>
              </div>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div className="w-2/3 h-full rounded-full bg-gradient-primary" />
            </div>
          </div>

          {/* Floating: rating */}
          <div className="absolute hidden w-64 p-4 border -right-2 bottom-8 rounded-2xl border-border bg-card shadow-elegant sm:block">
            <div className="flex items-center gap-1 text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="mt-2 text-sm leading-snug">
              “Picked up, cleaned, delivered — didn&apos;t even leave my couch.”
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Ananya · Bangalore
            </p>
          </div>

          {/* Trust chip */}
          <div className="absolute flex items-center gap-2 px-4 py-2 text-xs -translate-x-1/2 border rounded-full -bottom-4 left-1/2 border-border bg-card shadow-soft">
            <ShieldCheck className="w-4 h-4 text-accent-teal" />
            Fully insured · Background-checked partners
          </div>
        </div>
      </div>
    </section>
  );
}
