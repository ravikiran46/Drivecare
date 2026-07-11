import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/Nav";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import Trust from "@/components/Trust";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonial";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is my car really safe while it's with your partner?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every partner is background-verified. Your car is covered by ₹10L in-transit insurance from pickup to drop, plus live GPS, photo checkpoints and OTP-based handover.",
      },
    },
    {
      "@type": "Question",
      name: "How does the pickup and drop work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Book a slot, a verified partner arrives at your address, verifies an OTP with you and takes the car to our studio. Once done they return the car with photos and a digital report.",
      },
    },
    {
      "@type": "Question",
      name: "Can I track my car live?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — live GPS of both partner and car, ETA updates and instant alerts if the car leaves the expected route.",
      },
    },
  ],
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Drive Care",
  description:
    "Doorstep car wash, detailing and service with live tracking and full insurance.",
  areaServed: ["Bangalore", "Mumbai", "Delhi NCR", "Hyderabad", "Pune"],
  priceRange: "₹₹",
  serviceType: "Car wash, detailing and service pickup & drop",
};
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Drive Care — Doorstep Car Wash, Detailing & Service" },
      {
        name: "description",
        content:
          "Book a doorstep car wash, detail or full service in seconds. Vetted partners pick up, care for and deliver your car back — with live tracking and full insurance.",
      },
      {
        property: "og:title",
        content: "Drive Care — Doorstep Car Care with Live Tracking",
      },
      {
        property: "og:description",
        content:
          "Vetted partners, live tracking, insured pickups. Give your car the care it deserves without leaving home.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Drive Care — Doorstep Car Care with Live Tracking",
      },
      {
        name: "twitter:description",
        content:
          "Book a doorstep car wash, detail or full service. Live tracking, vetted partners, full insurance.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(orgJsonLd),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(faqJsonLd),
      },
    ],
  }),
  component: Home,
});
function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Services />
      <HowItWorks />
      <Pricing />
      <Trust />
      <Testimonials />
      <Faq />
      <Footer />
    </main>
  );
}
