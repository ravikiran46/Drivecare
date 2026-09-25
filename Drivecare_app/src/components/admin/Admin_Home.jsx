import { useEffect, useState } from "react";
import {
  Clock,
  Plus,
  Sparkles,
  Trash2,
  Save,
  Users,
  ToggleLeft,
  ToggleRight,
  UserCog,
  CalendarCheck,
  CircleDot,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Nav";
import {
  useCreateSlots,
  useDeleteSlots,
  useSlots,
  useUpdateSlots,
} from "@/lib/slots";

import {
  useCreateService,
  useServices,
  useUpdateService,
  useDeleteService,
} from "@/lib/services";
import { useAllBookings, useUpdateBookingStatus } from "@/lib/bookings";
import { useRoleGuard } from "@/components/Context/useRoleGuard";
import propTypes from "prop-types";

function AdminPage() {
  const guarded = useRoleGuard(["admin"]);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState("bookings");

  const { data: services = [], isLoading: ServicesLoading } = useServices();
  const { data: slots = [], isLoading: SlotsLoading } = useSlots();
  const { data: bookings = [], isLoading: BookingsLoading } = useAllBookings();

  useEffect(() => {
    if (!guarded) return;
    setReady(true);
  }, [guarded]);

  if (!ready) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-6xl px-6 py-24 text-center text-muted-foreground">
          Checking access…
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="bg-hero">
        <div className="mx-auto max-w-6xl px-6 pb-8 pt-12">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Admin console
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
            Operations control
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Services and slots you publish here appear instantly in the customer
            booking flow.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              icon={CalendarCheck}
              label="Total bookings"
              value={bookings.length}
            />
            <Stat
              icon={CircleDot}
              label="In progress"
              value={bookings.filter((b) => b.status === "in_progress").length}
            />
            <Stat
              icon={CheckCircle2}
              label="Completed"
              value={bookings.filter((b) => b.status === "completed").length}
            />
            <Stat icon={UserCog} label="Active partners" value={0} />
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {[
              ["bookings", "Bookings", Users],
              ["agents", "Partners", UserCog],
              ["services", "Services", Sparkles],
              ["slots", "Time slots", Clock],
            ].map(([id, label, Icon]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                  tab === id
                    ? "bg-gradient-primary text-primary-foreground shadow-glow"
                    : "border border-border bg-surface text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-6xl px-6">
          {tab === "services" &&
            (ServicesLoading ? (
              <Loading label="Loading services…" />
            ) : (
              <ServicesPanel services={services} />
            ))}

          {tab === "slots" &&
            (SlotsLoading ? (
              <Loading label="Loading time slots…" />
            ) : (
              <SlotsPanel slots={slots} />
            ))}

          {tab === "bookings" &&
            (BookingsLoading ? (
              <Loading label="Loading bookings…" />
            ) : (
              <BookingsPanel bookings={bookings} />
            ))}
        </div>
      </section>
    </main>
  );
}

function Loading({ label }) {
  return (
    <p className="rounded-2xl border border-dashed border-border bg-surface p-6 text-sm text-muted-foreground">
      {label}
    </p>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-soft backdrop-blur">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" /> {label}
      </div>
      <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
    </div>
  );
}

function ServicesPanel({ services }) {
  const blank = { service_name: "", price: "", time: "", details: "" };
  const [draft, setDraft] = useState(blank);
  const createService = useCreateService();

  async function add() {
    if (!draft.service_name || !draft.price) {
      toast.error("Name and price are required.");
      return;
    }
    try {
      await createService.mutateAsync(draft);
      setDraft(blank);
      toast.success("Service published.");
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
      <div className="space-y-4">
        {services.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border bg-surface p-6 text-sm text-muted-foreground">
            No services yet — add your first one.
          </p>
        )}
        {services.map((s) => (
          <ServiceRow key={s._id} service={s} />
        ))}
      </div>

      <aside className="h-fit rounded-3xl border border-border bg-gradient-card p-6 shadow-elegant">
        <p className="text-xs font-medium uppercase tracking-widest text-primary">
          New service
        </p>
        <div className="mt-4 space-y-3">
          <Input
            label="Name"
            value={draft.service_name}
            onChange={(v) => setDraft({ ...draft, service_name: v })}
          />
          <Input
            label="Price"
            value={draft.price}
            onChange={(v) => setDraft({ ...draft, price: v })}
          />
          <Input
            label="Duration"
            value={draft.time}
            onChange={(v) => setDraft({ ...draft, time: v })}
          />
          <Input
            label="Description"
            value={draft.details}
            onChange={(v) => setDraft({ ...draft, details: v })}
          />
          <button
            onClick={add}
            disabled={createService.isPending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            {createService.isPending ? "Publishing…" : "Add service"}
          </button>
        </div>
      </aside>
    </div>
  );
}

function ServiceRow({ service }) {
  const [form, setForm] = useState(service);
  const updateService = useUpdateService();
  const deleteService = useDeleteService();
  useEffect(() => setForm(service), [service]);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="grid gap-3 sm:grid-cols-3">
        <Input
          label="Name"
          value={form.service_name}
          onChange={(v) => setForm({ ...form, service_name: v })}
        />
        <Input
          label="Price"
          value={form.price}
          onChange={(v) => setForm({ ...form, price: v })}
        />
        <Input
          label="Duration"
          value={form.time}
          onChange={(v) => setForm({ ...form, time: v })}
        />
        <div className="sm:col-span-3">
          <Input
            label="Description"
            value={form.details}
            onChange={(v) => setForm({ ...form, details: v })}
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={async () => {
            try {
              await updateService.mutateAsync({ id: service._id, data: form });
              toast.success("Service updated.");
            } catch (e) {
              toast.error(e.message);
            }
          }}
          disabled={updateService.isPending}
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
        >
          <Save className="h-3.5 w-3.5" />{" "}
          {updateService.isPending ? "Saving…" : "Save"}
        </button>
        <button
          onClick={async () => {
            try {
              await deleteService.mutateAsync(service._id);
              toast.success("Service removed.");
            } catch (e) {
              toast.error(e.message);
            }
            toast.success("Service removed.");
          }}
          disabled={deleteService.isPending}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-xs text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </button>
      </div>
    </div>
  );
}

function SlotsPanel({ slots }) {
  const [slot, setSlot] = useState("");
  const createTimeSlot = useCreateSlots();
  const updateTimeSlot = useUpdateSlots();
  const deleteTimeSlot = useDeleteSlots();

  async function add() {
    if (!slot.trim()) {
      toast.error("Enter a slot label.");
      return;
    }
    try {
      await createTimeSlot({ slot: slot.trim(), isactive: true });
      setSlot("");
      toast.success("Slot published.");
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
      <div className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
        {slots.length === 0 && (
          <p className="p-6 text-sm text-muted-foreground">
            No time slots yet.
          </p>
        )}
        {slots.map((t) => (
          <div key={t._id} className="flex items-center gap-4 p-4">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <Clock className="h-4 w-4" />
            </span>
            <p className="font-medium">{t.slot}</p>
            <button
              onClick={async () => {
                try {
                  await updateTimeSlot.mutateAsync({
                    id: t._id,
                    data: { isactive: !t.isactive },
                  });
                  toast.success("Slot updated.");
                } catch (e) {
                  toast.error(e.message);
                }
              }}
              disabled={updateTimeSlot.isPending}
              className={`ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                t.isactive
                  ? "bg-accent/25 text-accent-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {t.isactive ? (
                <ToggleRight className="h-4 w-4" />
              ) : (
                <ToggleLeft className="h-4 w-4" />
              )}
              {t.isactive ? "Active" : "Inactive"}
            </button>
            <button
              onClick={async () => {
                try {
                  await deleteTimeSlot.mutateAsync(t._id);
                  toast.success("Slot removed.");
                } catch (e) {
                  toast.error(e.message);
                }
              }}
              className="rounded-full border border-border bg-surface p-2 text-destructive"
              aria-label="Delete slot"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      <aside className="h-fit rounded-3xl border border-border bg-gradient-card p-6 shadow-elegant">
        <p className="text-xs font-medium uppercase tracking-widest text-primary">
          New time slot
        </p>
        <div className="mt-4 space-y-3">
          <Input
            label="Slot label"
            value={slot}
            onChange={setSlot}
            placeholder="10:20PM"
          />
          <button
            onClick={add}
            disabled={createTimeSlot.isPending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" />{" "}
            {createTimeSlot.isPending ? "Publishing…" : "Add slot"}
          </button>
        </div>
      </aside>
    </div>
  );
}

function BookingsPanel({ bookings }) {
  const updateBooking = useUpdateBookingStatus();

  if (bookings.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border bg-surface p-6 text-sm text-muted-foreground">
        No bookings yet.
      </p>
    );
  }
  return (
    <div className="space-y-4">
      {bookings.map((b) => (
        <div
          key={b._id}
          className="rounded-2xl border border-border bg-card p-5 shadow-soft"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-semibold">
                {b.service_Id.service_name}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  #{b._id}
                </span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {b.user_Id.name} · {b.user_Id.mobileno}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {b.time} · {b.address}
              </p>
            </div>
            <p className="font-display text-lg font-semibold">
              {b.service_Id?.price}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4">
            <select
              value={b.status}
              onChange={async (e) => {
                try {
                  await updateBooking.mutateAsync({
                    id: b._id,
                    status: e.target.value,
                  });
                } catch (error) {
                  console.error("Error updating booking:", error);
                }
              }}
              disabled={updateBooking.isPending}
              className="h-9 rounded-xl border border-border bg-surface px-3 text-xs"
            >
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

function Input({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
      />
    </label>
  );
}

Input.propTypes = {
  label: propTypes.string,
  value: propTypes.oneOfType([propTypes.string, propTypes.number]),
  onChange: propTypes.func,
  placeholder: propTypes.string,
};

Stat.propTypes = {
  icon: propTypes.elementType,
  label: propTypes.string,
  value: propTypes.oneOfType([propTypes.string, propTypes.number]),
};

BookingsPanel.propTypes = {
  bookings: propTypes.arrayOf(
    propTypes.shape({
      _id: propTypes.string.isRequired,
      service_Id: propTypes.shape({
        service_name: propTypes.string.isRequired,
        price: propTypes.number.isRequired,
      }).isRequired,
      address: propTypes.string.isRequired,
      time: propTypes.string.isRequired,
      status: propTypes.oneOf(["scheduled", "in_progress", "completed"])
        .isRequired,
      agentEmail: propTypes.string,
    }),
  ).isRequired,
};
SlotsPanel.propTypes = {
  slots: propTypes.arrayOf(
    propTypes.shape({
      _id: propTypes.string.isRequired,
      slot: propTypes.string.isRequired,
      isactive: propTypes.bool.isRequired,
    }),
  ).isRequired,
};
ServiceRow.propTypes = {
  service: propTypes.shape({
    _id: propTypes.string.isRequired,
    service_name: propTypes.string.isRequired,
    price: propTypes.number.isRequired,
    time: propTypes.string,
    details: propTypes.string,
  }).isRequired,
};
ServicesPanel.propTypes = {
  services: propTypes.arrayOf(
    propTypes.shape({
      _id: propTypes.string.isRequired,
      service_name: propTypes.string.isRequired,
      price: propTypes.number.isRequired,
      time: propTypes.string,
      details: propTypes.string,
    }),
  ).isRequired,
};

Loading.propTypes = {
  label: propTypes.string.isRequired,
};

export default AdminPage;
