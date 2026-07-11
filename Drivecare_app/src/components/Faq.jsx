import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Is my car really safe while it's with your partner?",
    a: "Yes. Every partner is background-verified, and your car is covered by ₹10L in-transit insurance from pickup to drop. You also get live GPS, photo checkpoints, and OTP-based handover — so nothing happens without your consent.",
  },
  {
    q: "How does the pickup and drop actually work?",
    a: "You book a slot in the app. A verified partner arrives at your address, verifies a one-time code with you, and drives your car to our detailing hub. Once done, they return the car to the exact spot — with photos and a digital report.",
  },
  {
    q: "Can I track my car live?",
    a: "Absolutely. From the moment your partner takes over, you'll see live GPS of your car and the partner, ETA updates, and instant alerts if the car moves outside the expected route.",
  },
  {
    q: "What if something goes wrong?",
    a: "We stand by a zero-damage guarantee. If any issue occurs, we repair it — fully covered — and our support team is one tap away, 24/7.",
  },
  {
    q: "Which cities are you live in?",
    a: "Drive Care currently operates across Bangalore, Mumbai, Delhi NCR, Hyderabad, and Pune, with more cities rolling out every month.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="py-24">
      <div className="max-w-3xl px-6 mx-auto">
        <div className="text-center">
          <p className="text-sm font-medium tracking-widest uppercase text-primary-glow">
            FAQ
          </p>
          <h2 className="mt-3 text-4xl font-semibold md:text-5xl">
            Everything you&apos;d want to ask.
          </h2>
        </div>

        <Accordion type="single" collapsible className="mt-12 space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="px-5 border rounded-2xl border-border bg-surface"
            >
              <AccordionTrigger className="text-base font-medium text-left hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
