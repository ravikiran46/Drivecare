import { createFileRoute } from "@tanstack/react-router";
import { TrackPage } from "@/components/user/Track";
export const Route = createFileRoute("/track/$bookingId")({
  head: ({ params }) => ({
    meta: [
      { title: "Live tracking — Drive Care" },
      {
        name: "description",
        content:
          "Follow your Drive Care partner and your car live. GPS updates, photo checkpoints, OTP handover and smart alerts.",
      },
      { property: "og:title", content: "Live tracking — Drive Care" },
      {
        property: "og:description",
        content:
          "Real-time GPS, ETA and photo checkpoints so you always know exactly where your car is.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/track" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `/track/${params.bookingId}` }],
  }),
  component: TrackPage,
});
