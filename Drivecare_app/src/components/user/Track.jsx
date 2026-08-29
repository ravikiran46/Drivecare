import PropTypes from "prop-types";
import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Camera,
  Car,
  Check,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Nav";
import { useBookings } from "@/lib/bookings";

const stages = [
  { id: 0, label: "Booked", desc: "Order confirmed & partner assigned" },
  { id: 1, label: "En route", desc: "Rahul is heading to your address" },
  { id: 2, label: "Pickup", desc: "Vehicle handover verified via OTP" },
  { id: 3, label: "Service", desc: "Wash in progress at our studio" },
  { id: 4, label: "Delivered", desc: "Car parked back at your spot" },
];

export const TrackPage = () => {
  const { bookingId } = useParams({ from: "/track/$bookingId" });
  const [stage, setStage] = useState(1);
  const [progress, setProgress] = useState(0.35);

  const {
    data: bookingData,
    isLoading,
    error,
  } = useBookings({
    enabled: !!bookingId,
  });

  const booking = bookingData?.data?.find((b) => b._id === bookingId);

  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => {
        const next = p + 0.008;
        return next > 0.85 ? 0.35 : next;
      });
    }, 120);
    return () => clearInterval(t);
  }, []);

  if (isLoading)
    return <div className="p-10 text-center">Loading tracking details…</div>;
  if (error)
    return (
      <div className="p-10 text-center text-red-500">Error loading booking</div>
    );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              Order #{booking?._id}
            </p>
            <h1 className="mt-2 text-3xl font-semibold md:text-4xl">
              Rahul is on the way with your car care kit.
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              ETA <span className="font-medium text-foreground">4 min</span> ·{" "}
              {booking?.service_Id?.service_name} · Slot{" "}
              {booking?.time.split("*")[1]}
            </p>
          </div>
          <Link
            to="/dashboard"
            className="hidden text-xs text-muted-foreground hover:text-foreground md:inline"
          >
            ← Back to home
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[2fr,1fr]">
          {/* Map */}
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-elegant">
            <div className="relative h-[440px] w-full">
              <MapSvg progress={progress} />
              {/* Overlay chips */}
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                <Chip>
                  <span className="relative grid h-2 w-2 place-items-center">
                    <span className="absolute inset-0 rounded-full bg-primary animate-pulse-ring" />
                    <span className="relative h-2 w-2 rounded-full bg-primary" />
                  </span>
                  Live tracking active
                </Chip>
                <Chip>
                  <Shield className="h-3.5 w-3.5 text-accent-teal" />
                  ₹10L insurance
                </Chip>
              </div>
              <div className="absolute bottom-4 right-4">
                <Chip>
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  0.7 km away
                </Chip>
              </div>
            </div>
            {/* Partner card */}
            <div className="flex flex-wrap items-center gap-4 border-t border-border p-5">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-primary text-primary-foreground font-semibold">
                RS
              </div>
              <div>
                <p className="font-semibold">Rahul Singh</p>
                <p className="text-xs text-muted-foreground">
                  Drive Care partner · 4.9★ · 812 rides
                </p>
              </div>
              <div className="ml-auto flex gap-2">
                <button className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-foreground transition hover:bg-surface-elevated">
                  <MessageCircle className="h-4 w-4" />
                </button>
                <button className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow">
                  <Phone className="h-4 w-4" /> Call
                </button>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <p className="text-xs font-medium uppercase tracking-widest text-primary">
                Journey
              </p>
              <ol className="relative mt-4 space-y-4 border-l-2 border-dashed border-border pl-6">
                {stages.map((s) => {
                  const done = s.id < stage;
                  const active = s.id === stage;
                  return (
                    <li key={s.id} className="relative">
                      <span
                        className={`absolute -left-[33px] top-0.5 grid h-6 w-6 place-items-center rounded-full text-[10px] font-semibold transition ${
                          done
                            ? "bg-accent text-accent-foreground"
                            : active
                              ? "bg-gradient-primary text-primary-foreground shadow-glow"
                              : "border border-border bg-background text-muted-foreground"
                        }`}
                      >
                        {done ? <Check className="h-3 w-3" /> : s.id + 1}
                      </span>
                      <p
                        className={`text-sm font-semibold ${
                          active
                            ? "text-foreground"
                            : done
                              ? "text-foreground"
                              : "text-muted-foreground"
                        }`}
                      >
                        {s.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{s.desc}</p>
                    </li>
                  );
                })}
              </ol>
              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => setStage((s) => Math.max(0, s - 1))}
                  className="flex-1 rounded-full border border-border bg-surface px-3 py-2 text-xs hover:bg-surface-elevated"
                >
                  Prev stage
                </button>
                <button
                  onClick={() =>
                    setStage((s) => Math.min(stages.length - 1, s + 1))
                  }
                  className="flex-1 rounded-full bg-gradient-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
                >
                  Next stage
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-gradient-card p-6 shadow-soft">
              <p className="text-xs font-medium uppercase tracking-widest text-primary">
                Photo checkpoints
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {["Before", "During", "After"].map((label, i) => (
                  <div
                    key={label}
                    className="aspect-square overflow-hidden rounded-xl border border-border bg-surface"
                  >
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
                      <Camera className="h-5 w-5 text-primary" />
                      {label}
                      {i === 0 && (
                        <span className="text-[10px] text-accent-teal">
                          ✓ received
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Snapshots arrive automatically at every stage.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/25 text-accent-teal">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold">Loving Drive Care?</p>
                  <p className="text-xs text-muted-foreground">
                    Refer a friend, both get 1 free wash.
                  </p>
                </div>
              </div>
              <button className="mt-4 w-full rounded-full border border-border bg-surface py-2 text-xs font-medium hover:bg-surface-elevated">
                Share invite link
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

function Chip({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/90 px-3 py-1.5 text-xs font-medium shadow-soft backdrop-blur">
      {children}
    </span>
  );
}

function MapSvg({ progress }) {
  const pathD =
    "M 40 380 C 120 320, 180 300, 220 240 S 340 160, 420 140 S 560 120, 640 80";
  const points = [
    [40, 380],
    [220, 240],
    [420, 140],
    [640, 80],
  ];
  const segIndex = Math.min(
    points.length - 2,
    Math.floor(progress * (points.length - 1)),
  );
  const local = progress * (points.length - 1) - segIndex;
  const [x1, y1] = points[segIndex];
  const [x2, y2] = points[segIndex + 1];
  const cx = x1 + (x2 - x1) * local;
  const cy = y1 + (y2 - y1) * local;

  return (
    <svg
      viewBox="0 0 720 440"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path
            d="M 32 0 L 0 0 0 32"
            fill="none"
            stroke="oklch(0.20 0.03 260 / 0.06)"
            strokeWidth="1"
          />
        </pattern>
        <linearGradient id="route" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="oklch(0.75 0.13 190)" />
          <stop offset="1" stopColor="oklch(0.70 0.19 32)" />
        </linearGradient>
        <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="oklch(0.70 0.19 32 / 0.5)" />
          <stop offset="1" stopColor="oklch(0.70 0.19 32 / 0)" />
        </radialGradient>
      </defs>

      <rect width="720" height="440" fill="oklch(0.98 0.01 75)" />
      <rect width="720" height="440" fill="url(#grid)" />

      {/* Fake streets */}
      <g stroke="oklch(0.20 0.03 260 / 0.08)" strokeWidth="10" fill="none">
        <path d="M 0 300 L 720 300" />
        <path d="M 0 180 L 720 180" />
        <path d="M 200 0 L 200 440" />
        <path d="M 500 0 L 500 440" />
      </g>

      {/* Route base */}
      <path
        d={pathD}
        stroke="oklch(0.20 0.03 260 / 0.15)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      {/* Animated route */}
      <path
        d={pathD}
        stroke="url(#route)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="10 8"
        className="animate-dash"
      />

      {/* Origin (partner start) */}
      <g transform="translate(40, 380)">
        <circle r="10" fill="oklch(0.75 0.13 190)" />
        <circle r="5" fill="white" />
      </g>

      {/* Destination (home) */}
      <g transform="translate(640, 80)">
        <circle r="22" fill="url(#glow)" />
        <circle r="12" fill="oklch(0.70 0.19 32)" />
        <path d="M -5 2 L 0 -5 L 5 2 L 5 6 L -5 6 Z" fill="white" />
      </g>

      {/* Moving car marker */}
      <g transform={`translate(${cx}, ${cy})`}>
        <circle r="26" fill="url(#glow)">
          <animate
            attributeName="r"
            values="20;30;20"
            dur="1.8s"
            repeatCount="indefinite"
          />
        </circle>
        <circle
          r="16"
          fill="white"
          stroke="oklch(0.70 0.19 32)"
          strokeWidth="3"
        />
        <g
          transform="translate(-8, -8)"
          style={{ color: "oklch(0.70 0.19 32)" }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2" />
            <circle cx="6.5" cy="16.5" r="2.5" />
            <circle cx="16.5" cy="16.5" r="2.5" />
          </svg>
        </g>
      </g>
    </svg>
  );
}

Chip.propTypes = {
  children: PropTypes.node.isRequired,
};
MapSvg.propTypes = {
  progress: PropTypes.number.isRequired,
};
