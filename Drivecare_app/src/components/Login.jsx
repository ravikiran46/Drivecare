import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import propTypes from "prop-types";
import { Car, Mail, User, KeyRound, ArrowRight, Loader2 } from "lucide-react";
import instance from "@/components/api/api_Instance";
import useAuth from "@/components/Context/useAuth";

LoginPage.propTypes = {
  children: propTypes.node,
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState } = useForm({
    defaultValues: { name: "", email: "" },
  });
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, isloading, user } = useAuth();
  const formData = watch();

  useEffect(() => {
    if (!isloading && user) {
      navigate({ to: "/dashboard" });
    }
    if (!isOtpSent) return;
    if (countdown <= 0) {
      setCanResendOtp(true);
      return;
    }
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [isOtpSent, countdown, isloading, user, navigate]);

  async function sendOtp(data) {
    setLoading(true);
    try {
      const res = await instance.post("/login", data);
      toast.success(`OTP sent to ${data.email}`);
      if (res.status == 200 || res.status == 201) {
        setIsOtpSent(true);
        setCountdown(30);
        setCanResendOtp(false);
      }
    } catch (e) {
      toast.error(e?.response?.data?.msg ?? "Failed to send OTP. Try again.");
      console.log(e?.response?.data?.msg ?? "Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(data) {
    if (otp.length < 4) return toast.error("Enter the OTP sent to your email.");
    setLoading(true);
    try {
      const res = await instance.post("/verifyotp", { email: data.email, otp });
      login(res.data.token);
      toast.success("Welcome back!");
      navigate({ to: "/dashboard" });
    } catch (e) {
      toast.error(e?.response?.data?.msg ?? "Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function resendOtp() {
    if (!formData.name || !formData.email) {
      return toast.error("Name and email are required to resend OTP.");
    }
    await sendOtp(formData);
  }

  async function googleLogin() {
    // Wire this to your backend:
    //   window.location.href = `${API_BASE}/auth/google`;
    // or use @react-oauth/google:
    //   <GoogleLogin onSuccess={(cred) => instance.post("/auth/google", { credential: cred.credential })} />
    toast("Redirecting to Google…", { icon: "🔐" });
  }

  const onSubmit = (data) => (isOtpSent ? verifyOtp(data) : sendOtp(data));

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-hero px-6 py-10">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(oklch(0.20_0.03_260/0.05)_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Top bar */}
      <header className="absolute left-0 right-0 top-0 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-glow">
            <Car className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Drive<span className="text-gradient">Care</span>
          </span>
        </Link>
        <Link
          to="/"
          className="text-sm text-muted-foreground transition hover:text-foreground"
        >
          ← Back to site
        </Link>
      </header>

      {/* Centered card */}
      <section className="relative w-full max-w-md">
        <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-warm opacity-20 blur-2xl" />
        <div className="rounded-3xl border border-border bg-card/90 p-8 shadow-elegant backdrop-blur-xl">
          <div className="text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary shadow-glow">
              <Car className="h-6 w-6 text-primary-foreground" />
            </span>
            <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight">
              Welcome to Drive<span className="text-gradient">Care</span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in or create your account in seconds.
            </p>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={googleLogin}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-full border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground shadow-soft transition hover:-translate-y-0.5 hover:bg-surface-elevated"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            or with email
            <div className="h-px flex-1 bg-border" />
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <Field
              icon={User}
              placeholder="Full name"
              autoComplete="name"
              disabled={isOtpSent}
              {...register("name", { required: "Name is required" })}
              error={formState.errors.name?.message}
            />

            <Field
              icon={Mail}
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              disabled={isOtpSent}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                  message: "Enter a valid email",
                },
              })}
              error={formState.errors.email?.message}
            />

            {isOtpSent && (
              <div className="space-y-2">
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 6-digit OTP"
                    className="h-12 w-full rounded-xl border border-border bg-surface pl-10 pr-3 text-center font-mono text-lg tracking-[0.4em] text-foreground shadow-soft outline-none transition placeholder:font-sans placeholder:tracking-normal placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15"
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Sent to{" "}
                    <span className="text-foreground">{formData.email}</span>
                  </span>
                  {canResendOtp ? (
                    <button
                      type="button"
                      onClick={resendOtp}
                      className="font-medium text-primary hover:underline"
                    >
                      Resend OTP
                    </button>
                  ) : (
                    <span className="text-muted-foreground">
                      Resend in {countdown}s
                    </span>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-glow transition hover:-translate-y-0.5 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {isOtpSent ? "Verify & continue" : "Send OTP"}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </>
              )}
            </button>

            {isOtpSent && (
              <button
                type="button"
                onClick={() => {
                  setIsOtpSent(false);
                  setOtp("");
                  setCountdown(30);
                }}
                className="w-full text-center text-xs text-muted-foreground hover:text-foreground"
              >
                ← Use a different email
              </button>
            )}
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing you agree to our{" "}
            <a href="#" className="text-foreground hover:underline">
              Terms
            </a>{" "}
            &{" "}
            <a href="#" className="text-foreground hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}

/* -------- helpers -------- */

const Field = forwardRef(
  ({ icon: Icon, error, className = "", ...props }, ref) => (
    <div>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={ref}
          {...props}
          className={`h-12 w-full rounded-xl border border-border bg-surface pl-10 pr-3 text-sm text-foreground shadow-soft outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
        />
      </div>
      {error && <p className="mt-1 pl-1 text-xs text-destructive">{error}</p>}
    </div>
  ),
);
Field.displayName = "Field";

Field.propTypes = {
  icon: propTypes.elementType,
  error: propTypes.string,
  className: propTypes.string,
};

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1-3.31 0-6-2.74-6-6.1S8.69 6 12 6c1.88 0 3.14.8 3.86 1.48l2.63-2.53C16.83 3.4 14.66 2.4 12 2.4 6.68 2.4 2.4 6.68 2.4 12S6.68 21.6 12 21.6c6.93 0 9.6-4.86 9.6-7.35 0-.5-.05-.87-.12-1.25H12z"
      />
      <path
        fill="#34A853"
        d="M3.88 7.62l3.2 2.35C7.98 8.14 9.83 6.9 12 6.9V3.3c-3.35 0-6.24 1.92-8.12 4.32z"
        opacity=".9"
      />
      <path
        fill="#4A90E2"
        d="M12 21.6c2.55 0 4.7-.84 6.27-2.28l-3.06-2.37c-.83.56-1.94.95-3.21.95-2.47 0-4.56-1.66-5.31-3.9l-3.16 2.44C4.94 19.62 8.2 21.6 12 21.6z"
        opacity=".9"
      />
      <path
        fill="#FBBC05"
        d="M21.6 12c0-.5-.05-.87-.12-1.25H12v3.9h5.5c-.27 1.55-1.72 3.15-3.29 3.7l3.06 2.37c1.84-1.7 3.13-4.24 3.13-8.72z"
        opacity=".9"
      />
    </svg>
  );
}
