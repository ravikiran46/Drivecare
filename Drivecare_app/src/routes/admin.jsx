import { createFileRoute } from "@tanstack/react-router";
import AdminPage from "@/components/admin/Admin_Home";
export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin console — Drive Care" },
      {
        name: "description",
        content:
          "Manage Drive Care services, time slots, bookings and partner assignments.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});
