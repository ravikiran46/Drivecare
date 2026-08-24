import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "@/components/Login";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Drive Care" },
      {
        name: "description",
        content:
          "Sign in to Drive Care to book doorstep car wash & service, track your ride, and manage your bookings.",
      },
    ],
  }),
  component: LoginPage,
});
