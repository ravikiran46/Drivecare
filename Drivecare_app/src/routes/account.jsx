import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
  Save,
  MapPin,
  UserRound,
  Phone,
  Mail,
  Car,
  LogOut,
  BadgeCheck,
  Building2,
  Briefcase,
  CalendarClock,
  Wrench,
  Hash,
  ShieldCheck,
  Award,
  Languages,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Nav";
import useAuth from "@/components/Context/useAuth";
import { useRoleGuard } from "@/components/Context/useRoleGuard";
import { getByPath, setByPath, stripUndefined } from "@/lib/utils";
import { useUpdateCurrentUser } from "@/lib/user";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Account settings — Drive Care" },
      {
        name: "description",
        content:
          "Update your Drive Care profile details, contact number and pickup address.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

const ROLE_LABEL = {
  user: "Customer",
  agent: "Service agent",
  admin: "Administrator",
};

const HEADINGS = {
  user: {
    title: "Your details",
    blurb:
      "Keep your contact and pickup address up to date so partners reach you without a call.",
  },
  agent: {
    title: "Agent details",
    blurb:
      "Keep your skills and contact number current so jobs are routed to the right person.",
  },
  admin: {
    title: "Admin details",
    blurb:
      "Manage the contact and work details attached to your Drive Care console account.",
  },
};

const AVAILABILITY_OPTIONS = [
  { value: "available", label: "Available for jobs" },
  { value: "busy", label: "Busy" },
  { value: "on_leave", label: "On leave" },
  { value: "offline", label: "Offline" },
];

const DEPARTMENT_OPTIONS = [
  { value: "operations", label: "Operations" },
  { value: "support", label: "Customer support" },
  { value: "partners", label: "Partner management" },
  { value: "finance", label: "Finance" },
  { value: "marketing", label: "Marketing" },
  { value: "technology", label: "Technology" },
];

const ACCESS_LEVEL_OPTIONS = [
  { value: "super_admin", label: "Super admin" },
  { value: "manager", label: "Manager" },
  { value: "support", label: "Support" },
  { value: "viewer", label: "Viewer (read-only)" },
];

const SHIFT_OPTIONS = [
  { value: "morning", label: "Morning (8am – 4pm)" },
  { value: "evening", label: "Evening (4pm – 12am)" },
  { value: "night", label: "Night (12am – 8am)" },
  { value: "flexible", label: "Flexible" },
];

const SECTIONS = {
  user: [
    {
      title: "Profile",
      fields: [
        { path: "name", label: "Full name", icon: UserRound, required: true },
        {
          path: "email",
          label: "Email",
          icon: Mail,
          required: true,
          type: "email",
        },
        {
          path: "mobileno",
          label: "Phone number",
          icon: Phone,
          type: "tel",
          inputMode: "numeric",
          pattern: "[0-9]*",
          number: true,
        },
        { path: "car", label: "Car (make · model)", icon: Car },
      ],
    },
    {
      title: "Pickup address",
      fields: [
        { path: "address.line", label: "Address", icon: MapPin, span: 2 },
        { path: "address.city", label: "City", icon: MapPin, readOnly: true },
        {
          path: "address.pincode",
          label: "Pincode",
          icon: MapPin,
          number: true,
          inputMode: "numeric",
          pattern: "[0-9]*",
        },
      ],
    },
  ],

  agent: [
    {
      title: "Agent profile",
      fields: [
        { path: "name", label: "Full name", icon: UserRound, required: true },
        {
          path: "email",
          label: "Email",
          icon: Mail,
          required: true,
          type: "email",
        },
        {
          path: "mobileno",
          label: "Phone number",
          icon: Phone,
          required: true,
          type: "tel",
        },
        {
          path: "agentId",
          label: "Agent ID",
          icon: Hash,
          readOnly: true,
          placeholder: "Assigned by Drive Care",
        },
      ],
    },
    {
      title: "Service details",
      fields: [
        {
          path: "specialization",
          label: "Vehicle types handled",
          icon: Wrench,
          span: 2,
          placeholder: "Hatchback, Sedan, SUV",
        },
        {
          path: "experienceYears",
          label: "Years of experience",
          icon: Award,
          type: "number",
          placeholder: "3",
        },
        {
          path: "certifications",
          label: "Certifications",
          icon: BadgeCheck,
          placeholder: "Bosch trained, AC specialist",
        },
        {
          path: "languages",
          label: "Languages spoken",
          icon: Languages,
          placeholder: "English, Hindi, Kannada",
        },
        {
          path: "availability",
          label: "Availability",
          icon: CalendarClock,
          type: "select",
          options: AVAILABILITY_OPTIONS,
        },
      ],
    },
  ],
  admin: [
    {
      title: "Admin profile",
      fields: [
        { path: "name", label: "Full name", icon: UserRound, required: true },
        {
          path: "email",
          label: "Email",
          icon: Mail,
          required: true,
          type: "email",
        },
        { path: "mobileno", label: "Phone number", icon: Phone, type: "tel" },
        {
          path: "adminId",
          label: "Admin ID",
          icon: Hash,
          readOnly: true,
          placeholder: "Assigned by Drive Care",
        },
      ],
    },
    {
      title: "Work details",
      fields: [
        {
          path: "department",
          label: "Department",
          icon: Building2,
          type: "select",
          options: DEPARTMENT_OPTIONS,
        },
        {
          path: "designation",
          label: "Designation",
          icon: Briefcase,
          placeholder: "Operations Manager",
        },
        {
          path: "accessLevel",
          label: "Access level",
          icon: ShieldCheck,
          type: "select",
          options: ACCESS_LEVEL_OPTIONS,
          readOnly: true,
        },
        {
          path: "shift",
          label: "Preferred shift",
          icon: Clock,
          type: "select",
          options: SHIFT_OPTIONS,
        },
      ],
    },
  ],
};

const DEFAULTS = {
  user: {
    mobileno: "",
    car: "",
    address: { line: "", city: "Bangalore", pincode: "" },
  },
  agent: {
    mobileno: "",
    agentId: "",
    specialization: "",
    experienceYears: "",
    certifications: "",
    languages: "",
    availability: "available",
  },
  admin: {
    mobileno: "",
    adminId: "",
    department: "operations",
    designation: "",
    accessLevel: "support",
    shift: "flexible",
  },
};

function AccountPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  const { setUser } = useAuth();
  const updateUserMutation = useUpdateCurrentUser();

  const guarded = useRoleGuard(["user", "agent", "admin"]);

  useEffect(() => {
    if (!guarded) return;
    const defaults = DEFAULTS[guarded.role] ?? {};
    const merged = { ...defaults, ...stripUndefined(guarded) };

    if (guarded.role === "user") {
      merged.address = {
        line: "",
        pincode: "",
        ...(guarded.address ?? {}),
        city: guarded.address?.city || "Bangalore",
      };
    }

    setForm(merged);
  }, [guarded]);

  const role = form?.role ?? "user";
  const sections = useMemo(() => SECTIONS[role] ?? SECTIONS.user, [role]);
  const headings = HEADINGS[role] ?? HEADINGS.user;

  if (!form) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-3xl px-6 py-24 text-center text-muted-foreground">
          Loading your account…
        </div>
      </main>
    );
  }

  function update(path, value) {
    setForm((prev) => (prev ? setByPath(prev, path, value) : prev));
  }

  function save() {
    if (!form) return;

    const missing = sections
      .flatMap((section) => section.fields)
      .filter((field) => field.required)
      .filter((field) => !getByPath(form, field.path).trim())
      .map((field) => field.label);

    if (missing.length > 0) {
      toast.error(
        `${missing.join(" and ")} ${missing.length > 1 ? "are" : "is"} required.`,
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email ?? "")) {
      toast.error("Enter a valid email address.");
      return;
    }
    if (form.mobileno && !/^[0-9]{10}$/.test(form.mobileno)) {
      console.log(form?.mobileno);
      toast.error("Enter a valid 10-digit phone number.");
      return;
    }

    if (form.address?.pincode && !/^[0-9]{6}$/.test(form.address.pincode)) {
      toast.error("Enter a valid 6-digit pincode.");
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      mobileno: form.mobileno,
      car: form.car,
      address: form.address,
    };

    updateUserMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Account updated successfully.");
      },
      onError: (error) => {
        toast.error(error?.response?.data?.msg || "Failed to update account.");
      },
    });
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="bg-hero">
        <div className="mx-auto max-w-3xl px-6 pb-10 pt-12">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Account settings
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
            {headings.title}
          </h1>
          <p className="mt-2 text-muted-foreground">{headings.blurb}</p>

          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Signed in as {ROLE_LABEL[role] ?? role}
          </span>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-3xl space-y-6 px-6">
          {sections.map((section) => (
            <div
              key={section.title}
              className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8"
            >
              <h2 className="text-lg font-semibold">{section.title}</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {section.fields.map((field) => (
                  <Field
                    key={field.path}
                    icon={field.icon}
                    label={field.label}
                    type={field.type}
                    options={field.options}
                    readOnly={field.readOnly}
                    placeholder={field.placeholder}
                    span={field.span}
                    value={getByPath(form, field.path)}
                    onChange={(v) => update(field.path, v)}
                  />
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button
              onClick={save}
              disabled={updateUserMutation.isPending}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:-translate-y-0.5"
            >
              <Save className="h-4 w-4" />
              {updateUserMutation.isPending ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  onChange,
  type = "text",
  readOnly = false,
  options,
  span,
  placeholder,
  inputMode,
  pattern,
  numeric = false,
}) {
  const inputClass = [
    "h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-3 text-sm outline-none transition",
    "focus:border-primary focus:ring-4 focus:ring-primary/15",
    readOnly ? "cursor-not-allowed text-muted-foreground" : "text-foreground",
  ].join(" ");

  return (
    <label className={`block ${span === 2 ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="relative mt-1">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        {options ? (
          <select
            value={value}
            disabled={readOnly}
            onChange={(e) => onChange(e.target.value)}
            className={`${inputClass} appearance-none`}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            inputMode={numeric ? "numeric" : undefined}
            value={value}
            pattern={pattern}
            readOnly={readOnly}
            placeholder={placeholder}
            onChange={(e) => {
              const value = e.target.value;

              if (numeric) {
                onChange(value.replace(/\D/g, ""));
                return;
              }

              onChange(value);
            }}
            className={inputClass}
          />
        )}
      </div>
    </label>
  );
}

Field.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  readOnly: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
  span: PropTypes.number,
  placeholder: PropTypes.string,
  inputMode: PropTypes.string,
  pattern: PropTypes.string,
  numeric: PropTypes.bool,
};
