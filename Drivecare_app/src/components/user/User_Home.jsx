import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  MapPin,
  Plus,
} from "lucide-react";
import propTypes from "prop-types";
import useAuth from "@/components/Context/useAuth";
import Navbar from "@/components/Nav";
import { useBookings } from "@/lib/bookings";
import { useRoleGuard } from "@/components/Context/useRoleGuard";

export default function User_Home() {
  const { user, token } = useAuth();
  const {
    data: BookingsData,
    isLoading: bookingsLoading,
    error: bookingsError,
  } = useBookings({
    enabled: !!token,
  });
  const guarded = useRoleGuard(["user"]);

  const Bookings =
    BookingsData?.data?.map((b) => ({
      id: b._id,
      service: b.service_Id,
      price: `₹${b.total_price}`,
      slot: b.time,
      desc: b.details,
      category: b.category,
      vehicle: b.vehicle,
      address: b.address,
      city: b.address.split(",")[1].trim(),
      createdAt: b.createdAt,
      status: b.status,
    })) || [];

  if (!guarded || Bookings === null) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-6xl px-6 py-24 text-center text-muted-foreground">
          Loading your dashboard…
        </div>
      </main>
    );
  }

  const upcoming = Bookings.filter((b) => b.status !== "completed");
  const completed = Bookings.filter((b) => b.status === "completed");
  const firstName = user.name?.split(" ")[0] || "there";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      {/* Header */}
      <section className="bg-hero">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-10 pt-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              Your garage
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
              Hi {firstName} 👋
            </h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              {Bookings.length === 0
                ? "Your garage is empty — no bookings yet."
                : `You have ${upcoming.length} upcoming ${upcoming.length === 1 ? "booking" : "bookings"} and ${completed.length} completed.`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/book"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" /> New booking
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[1.7fr,1fr]">
          {/* Bookings */}
          <div className="space-y-6">
            {Bookings.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <div>
                  <h2 className="mb-4 text-lg font-semibold">Upcoming</h2>
                  {upcoming.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-border bg-surface p-6 text-sm text-muted-foreground">
                      No upcoming bookings.{" "}
                      <Link to="/book" className="text-primary hover:underline">
                        Book a new service →
                      </Link>
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {upcoming.map((b) => (
                        <BookingCard key={b.id} b={b} />
                      ))}
                    </div>
                  )}
                </div>

                {completed.length > 0 && (
                  <div>
                    <h2 className="mb-4 text-lg font-semibold">History</h2>
                    <div className="space-y-4">
                      {completed.map((b) => (
                        <BookingCard key={b.id} b={b} muted />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="mt-5 grid grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-surface text-center">
            <Stat label="Total" value={Bookings.length} />
            <Stat label="Upcoming" value={upcoming.length} />
            <Stat label="Done" value={completed.length} />
          </div>
        </div>
      </section>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-card p-10 text-center shadow-elegant">
      <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[2rem] bg-gradient-warm opacity-20 blur-2xl" />
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-primary shadow-glow">
        <Car className="h-8 w-8 text-primary-foreground" />
      </span>
      <h3 className="mt-5 font-display text-2xl font-semibold">
        Your garage is empty
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        You haven&apos;t made any bookings yet.
      </p>
    </div>
  );
}

function BookingCard({ b, muted }) {
  return (
    <div
      className={`rounded-2xl border border-border p-5 shadow-soft transition ${
        muted ? "bg-surface" : "bg-card hover:-translate-y-0.5"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
            <Car className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold">{b.service.service_name}</p>
            <p className="text-xs text-muted-foreground">
              # {b.id} · {b.vehicle || "Your car"}
            </p>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-accent-teal" /> {b.slot}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-accent-teal" />
                {b.city}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-accent-teal" />
                {new Date(b.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <StatusBadge status={b.status} />
          <p className="mt-2 font-display text-lg font-semibold">{b.price}</p>
        </div>
      </div>
      {b.status !== "completed" && (
        <div className="mt-4 flex justify-end border-t border-border pt-4">
          <Link
            to={`/track/${b.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Track live <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    scheduled: {
      label: "Scheduled",
      cls: "bg-accent/25 text-accent-foreground",
    },
    in_progress: { label: "In progress", cls: "bg-primary/15 text-primary" },
    completed: { label: "Completed", cls: "bg-muted text-muted-foreground" },
  };
  const s = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${s.cls}`}
    >
      {status === "completed" && <CheckCircle2 className="h-3 w-3" />}
      {s.label}
    </span>
  );
}

function Stat({ label, value }) {
  return (
    <div className="px-2 py-3">
      <p className="font-display text-lg font-semibold">{value}</p>
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

Stat.propTypes = {
  label: propTypes.string,
  value: propTypes.number,
};

StatusBadge.propTypes = {
  status: propTypes.oneOf(["scheduled", "in_progress", "completed"]),
};

BookingCard.propTypes = {
  b: propTypes.shape({
    id: propTypes.string.isRequired,
    service: propTypes.shape({
      service_name: propTypes.string.isRequired,
    }).isRequired,
    price: propTypes.string.isRequired,
    vehicle: propTypes.string,
    address: propTypes.string,
    city: propTypes.string,
    slot: propTypes.string.isRequired,
    createdAt: propTypes.string.isRequired,
    status: propTypes.oneOf(["scheduled", "in_progress", "completed"])
      .isRequired,
  }).isRequired,
  muted: propTypes.bool,
};
