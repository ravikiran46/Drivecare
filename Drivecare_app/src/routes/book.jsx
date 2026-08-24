import { createFileRoute } from "@tanstack/react-router";
import Booking from "@/components/user/Booking";
export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book a doorstep car wash — Drive Care" },
      {
        name: "description",
        content:
          "Book a doorstep car wash, detail or full service in under a minute. Choose a slot, share your address, we handle the rest.",
      },
      {
        property: "og:title",
        content: "Book a doorstep car wash — Drive Care",
      },
      {
        property: "og:description",
        content:
          "Choose a service, pick a slot, and we'll pick up, care for and deliver your car back — with live tracking.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/book" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/book" }],
  }),
  component: Booking,
});
