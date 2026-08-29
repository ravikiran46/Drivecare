import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  ArrowLeft,
  ArrowRight,
  Car,
  Check,
  Clock,
  Droplets,
  MapPin,
  Shield,
  Sparkles,
  Wrench,
} from "lucide-react";
import { useCreateBooking } from "@/lib/bookings";
import { useServices } from "@/lib/services";
import { useSlots } from "@/lib/slots";
import useAuth from "@/components/Context/useAuth";
import { getSlotDate } from "@/lib/utils";

const steps = ["Service", "Slot", "Address", "Confirm"];
const iconMap = {
  express: Droplets,
  premium: Sparkles,
  full: Wrench,
};

const timeMap = {
  express: "45 min",
  premium: "3 hrs",
  full: "Same day",
};

const FALLBACK_SLOTS = [
  "Today · 4:00 PM",
  "Today · 6:00 PM",
  "Tomorrow · 8:00 AM",
  "Tomorrow · 10:00 AM",
  "Tomorrow · 2:00 PM",
  "Tomorrow · 5:00 PM",
];

export default function BookPage() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const createBooking = useCreateBooking();
  const {
    data: servicesData,
    isLoading: servicesLoading,
    error: servicesError,
  } = useServices({
    enabled: !!token,
  });

  const {
    data: slotsData,
    isLoading: slotsLoading,
    error: slotsError,
  } = useSlots({
    enabled: !!token,
  });

  const services =
    servicesData?.data?.map((s) => ({
      id: s._id,
      name: s.service_name,
      price: `₹${s.price}`,
      time: timeMap[s.category] || "—",
      desc: s.details,
      category: s.category,
      icon: iconMap[s.category] || Car,
      imgURL: s.imgURL,
    })) || [];

  let slots = [];
  if (slotsData?.data?.length) {
    slots = slotsData.data.map((s) => s.slot || s);
  } else {
    slots = FALLBACK_SLOTS;
  }

  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    line: "",
    city: "Bangalore",
    car: "",
  });

  useEffect(() => {
    if (services.length && !selectedService) {
      setSelectedService(services[0]);
    }
  }, [services]);

  useEffect(() => {
    if (slots.length && !selectedSlot) {
      setSelectedSlot(slots[0]);
    }
  }, [slots]);

  const canNext =
    (step === 0 && !!selectedService) ||
    (step === 1 && !!selectedSlot) ||
    (step === 2 &&
      address.name &&
      address.phone &&
      address.line &&
      address.car) ||
    step === 3;

  const handleConfirm = () => {
    const date = getSlotDate(selectedSlot);
    createBooking.mutate(
      {
        user_Id: user.id,
        service_Id: selectedService.id,
        total_price: selectedService.price.slice(1),
        date: date,
        time: selectedSlot,
        vehicle: address.car,
        address: `${address.line}, ${address.city}`,
      },
      {
        onSuccess: () => {
          navigate({ to: "/dashboard" });
        },
        onError: (error) => {
          console.error("Booking failed:", error);
        },
      },
    );
  };

  if (servicesLoading || slotsLoading) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="flex h-96 items-center justify-center">
          <p className="text-muted-foreground">Loading services and slots…</p>
        </div>
      </main>
    );
  }

  if (servicesError) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="flex h-96 items-center justify-center">
          <p className="text-red-500">
            Failed to load services. Please try again later.
          </p>
        </div>
      </main>
    );
  }

  if (!services.length) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="flex h-96 items-center justify-center">
          <p className="text-muted-foreground">
            No services available right now.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="bg-hero">
        <div className="mx-auto max-w-3xl px-6 pb-8 pt-12 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Book in 30 seconds
          </p>
          <h1 className="mt-3 text-4xl font-semibold md:text-5xl">
            Let&apos;s give your car the{" "}
            <span className="text-gradient">care it deserves</span>.
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            No card required. Pay only after your car is delivered back.
          </p>

          {/* Stepper */}
          <ol className="mx-auto mt-10 flex max-w-2xl items-center justify-between gap-2">
            {steps.map((s, i) => {
              const active = i === step;
              const done = i < step;
              return (
                <li key={s} className="flex flex-1 items-center gap-2">
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-full text-xs font-semibold transition ${
                      done
                        ? "bg-accent text-accent-foreground"
                        : active
                          ? "bg-gradient-primary text-primary-foreground shadow-glow"
                          : "border border-border bg-surface text-muted-foreground"
                    }`}
                  >
                    {done ? <Check className="h-4 w-4" /> : i + 1}
                  </span>
                  <span
                    className={`hidden text-xs sm:inline ${
                      active ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {s}
                  </span>
                  {i < steps.length - 1 && (
                    <span className="h-px flex-1 bg-border" />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[1.6fr,1fr]">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
            {step === 0 && (
              <div>
                <h2 className="text-xl font-semibold">Choose your service</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pick what your car needs today.
                </p>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {services.map((s) => {
                    const selected = selectedService?.id === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSelectedService(s)}
                        className={`group flex flex-col rounded-2xl border p-5 text-left transition ${
                          selected
                            ? "border-primary bg-gradient-card shadow-glow"
                            : "border-border bg-surface hover:border-primary/40"
                        }`}
                      >
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                          <s.icon className="h-5 w-5" />
                        </span>
                        <span className="mt-4 font-semibold">{s.name}</span>
                        <span className="mt-1 text-xs text-muted-foreground">
                          {s.time}
                        </span>
                        <span className="mt-2 font-display text-2xl font-semibold text-ink">
                          {s.price}
                        </span>
                        <span className="mt-2 text-xs text-muted-foreground">
                          {s.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold">Pick a time slot</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your partner will arrive at the start of the slot.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {slots.map((s) => {
                    const selected = s === selectedSlot;
                    return (
                      <button
                        key={s}
                        onClick={() => setSelectedSlot(s)}
                        className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm transition ${
                          selected
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border bg-surface hover:border-primary/40"
                        }`}
                      >
                        <Clock className="h-4 w-4 text-primary" />
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold">Where should we come?</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your details stay private and encrypted.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Full name"
                    value={address.name}
                    onChange={(v) => setAddress({ ...address, name: v })}
                  />
                  <Field
                    label="Phone number"
                    value={address.phone}
                    onChange={(v) => setAddress({ ...address, phone: v })}
                  />
                  <div className="sm:col-span-2">
                    <Field
                      label="Pickup address"
                      value={address.line}
                      onChange={(v) => setAddress({ ...address, line: v })}
                    />
                  </div>
                  <Field
                    label="City"
                    value={address.city}
                    onChange={(v) => setAddress({ ...address, city: v })}
                  />
                  <Field
                    label="Car (make · model)"
                    placeholder="e.g. Honda City"
                    value={address.car}
                    onChange={(v) => setAddress({ ...address, car: v })}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-xl font-semibold">Review your booking</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Everything look good? Tap confirm to lock your slot.
                </p>
                <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-surface">
                  <Row icon={Car} label="Service">
                    {selectedService?.name} · {selectedService?.price}
                  </Row>
                  <Row icon={Clock} label="Slot">
                    {selectedSlot}
                  </Row>
                  <Row icon={MapPin} label="Address">
                    {address.line || "—"}, {address.city}
                  </Row>
                  <Row icon={Shield} label="Coverage">
                    ₹10L in‑transit insurance included
                  </Row>
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground transition hover:bg-surface-elevated disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              {step < steps.length - 1 ? (
                <button
                  onClick={() => canNext && setStep((s) => s + 1)}
                  disabled={!canNext}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleConfirm}
                  disabled={createBooking.isLoading}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {createBooking.isLoading ? "Booking..." : "Confirm booking"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Summary */}
          <aside className="h-fit rounded-3xl border border-border bg-gradient-card p-6 shadow-elegant">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              Order summary
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary">
                {selectedService?.icon ? (
                  <selectedService.icon className="h-5 w-5" />
                ) : (
                  <Car className="h-5 w-5" />
                )}
              </span>
              <div>
                <p className="font-semibold">{selectedService?.name || "—"}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedService?.time || "—"}
                </p>
              </div>
              <p className="ml-auto font-display text-xl font-semibold">
                {selectedService?.price || "₹0"}
              </p>
            </div>
            <div className="mt-6 space-y-3 border-t border-border pt-4 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent-teal" />{" "}
                {selectedSlot || "—"}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent-teal" />
                {address.city || "Bangalore"}
              </p>
              <p className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-accent-teal" />
                Fully insured pickup & drop
              </p>
            </div>
            <p className="mt-6 rounded-xl bg-accent/20 p-3 text-xs text-accent-foreground">
              💚 First wash is on us. You won&apos;t be charged until your car
              is returned.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex text-xs text-muted-foreground hover:text-foreground"
            >
              ← Back to home
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}

// ---------- Helper Components (with PropTypes) ----------
function Field({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

Field.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

function Row({ icon: Icon, label, children }) {
  return (
    <div className="flex items-center gap-4 p-4">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div className="text-sm">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 font-medium">{children}</p>
      </div>
    </div>
  );
}

Row.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
