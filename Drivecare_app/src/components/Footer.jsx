import { ArrowRight, Car } from "lucide-react";
import { FaInstagram, FaXTwitter, FaFacebook } from "react-icons/fa6";
import { Link } from "@tanstack/react-router";

export default function CtaFooter() {
  return (
    <>
      <section id="book" className="relative py-24">
        <div className="max-w-6xl px-6 mx-auto">
          <div className="relative overflow-hidden rounded-[2rem] border border-primary/30 bg-gradient-card p-10 text-center shadow-glow md:p-16">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[70%] -translate-x-1/2 rounded-full bg-gradient-primary opacity-30 blur-3xl" />
            <p className="text-sm font-medium tracking-widest uppercase text-primary">
              Ready when you are
            </p>
            <h2 className="relative max-w-2xl mx-auto mt-4 text-4xl font-semibold md:text-5xl">
              Give your car the care it&apos;s been waiting for.
            </h2>
            <p className="relative max-w-xl mx-auto mt-4 text-muted-foreground">
              First wash is on us for new users. No card required to book — pay
              only after your car is delivered back.
            </p>
            <div className="relative flex flex-wrap justify-center gap-4 mt-8">
              <Link
                to="/login"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:-translate-y-0.5"
              >
                Book my free wash
                <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
              </Link>
              <a
                href="#services"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium transition border rounded-full border-border bg-surface text-foreground hover:bg-surface-elevated"
              >
                Explore services
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="grid gap-10 px-6 mx-auto max-w-7xl py-14 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-glow">
                <Car className="w-5 h-5 text-primary-foreground" />
              </span>
              <span className="text-lg font-semibold font-display">
                Drive<span className="text-primary-glow">Care</span>
              </span>
            </div>
            <p className="max-w-sm mt-4 text-sm text-muted-foreground">
              Doorstep car wash, detailing and service — with live tracking,
              insurance, and a zero-damage guarantee.
            </p>
            <div className="flex gap-3 mt-6">
              {[FaInstagram, FaXTwitter, FaFacebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid transition border rounded-full h-9 w-9 place-items-center border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  aria-label="Social link"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold">Company</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Partners
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">Support</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#faq" className="hover:text-foreground">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Insurance
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="flex flex-col items-center justify-between gap-2 px-6 py-6 mx-auto text-xs max-w-7xl text-muted-foreground md:flex-row">
            <p>© {new Date().getFullYear()} Drive Care. All rights reserved.</p>
            <p>Made with care for cars in India.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
