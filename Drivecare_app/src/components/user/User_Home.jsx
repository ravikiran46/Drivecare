import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  MapPin,
  Plus,
} from "lucide-react";
// import { clearUser, getBookings, setUser } from "@/lib/bookings";
import propTypes from "prop-types";
import useAuth from "@/components/Context/useAuth";

export default function User_Home() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  // const [user, setUserState] = useState(null);
  // const [editing, setEditing] = useState(false);
  // const [form, setForm] = useState({ name: "", email: "" }); // for edditing account details
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    // setUserState(user);
    // setForm(user);  for edditing account details
    // setBookings(getBookings());
  }, [navigate, user]);

  // function signOut() {
  //   clearUser();
  //   navigate({ to: "/" });
  // }

  // function saveAccount() {
  //   if (!form.name.trim() || !form.email.trim()) {
  //     toast.error("Name and email are required.");
  //     return;
  //   }
  //   setUser(form); // for editing account details
  //   // setUserState(form);
  //   setEditing(false);
  //   toast.success("Account details updated.");
  // }

  if (!user || bookings === null) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center text-muted-foreground">
          Loading your dashboard…
        </div>
      </main>
    );
  }

  const upcoming = bookings.filter((b) => b.status !== "completed");
  const completed = bookings.filter((b) => b.status === "completed");
  const firstName = user.name?.split(" ")[0] || "there";

  return (
    <main className="min-h-screen bg-background text-foreground">
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
              {bookings.length === 0
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
            {bookings.length === 0 ? (
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

          {/* Sidebar — merged account + stats + editable settings */}
          {/* <aside className="space-y-6">
            <div
              id="account"
              className="rounded-3xl border border-border bg-gradient-card p-6 shadow-elegant"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-primary">
                    Account
                  </p>
                  {!editing && (
                    <>
                      <p className="mt-3 font-semibold">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </>
                  )}
                </div>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground"
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditing(false);
                      // setForm(user);  for editing account details
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground"
                  >
                    <X className="h-3 w-3" /> Cancel
                  </button>
                )}
              </div>

              {editing && (
                <div className="mt-4 space-y-3">
                  <label className="block">
                    <span className="text-xs font-medium text-muted-foreground">
                      Full name
                    </span>
                    <input
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="mt-1 h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium text-muted-foreground">
                      Email
                    </span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="mt-1 h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
                    />
                  </label>
                  <button
                    onClick={saveAccount}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:-translate-y-0.5"
                  >
                    <Save className="h-4 w-4" /> Save changes
                  </button>
                </div>
              )} */}

          <div className="mt-5 grid grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-surface text-center">
            <Stat label="Total" value={bookings.length} />
            <Stat label="Upcoming" value={upcoming.length} />
            <Stat label="Done" value={completed.length} />
          </div>
        </div>
        {/* </aside> */}
        {/* </div> */}
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
            <p className="font-semibold">{b.service.name}</p>
            <p className="text-xs text-muted-foreground">
              #{b.id} · {b.address.car || "Your car"}
            </p>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-accent-teal" /> {b.slot}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-accent-teal" />
                {b.address.city}
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
          <p className="mt-2 font-display text-lg font-semibold">
            {b.service.price}
          </p>
        </div>
      </div>
      {b.status !== "completed" && (
        <div className="mt-4 flex justify-end border-t border-border pt-4">
          <Link
            to="/track"
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
      name: propTypes.string.isRequired,
      price: propTypes.string.isRequired,
    }).isRequired,
    address: propTypes.shape({
      car: propTypes.string,
      city: propTypes.string.isRequired,
    }).isRequired,
    slot: propTypes.string.isRequired,
    createdAt: propTypes.string.isRequired,
    status: propTypes.oneOf(["scheduled", "in_progress", "completed"])
      .isRequired,
  }).isRequired,
  muted: propTypes.bool,
};
