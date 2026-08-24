import { createFileRoute } from "@tanstack/react-router";
import User_Home from "@/components/user/User_Home";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your dashboard — Drive Care" },
      {
        name: "description",
        content:
          "Manage your Drive Care bookings, track live status, and book a new service.",
      },
    ],
  }),
  component: User_Home,
});
