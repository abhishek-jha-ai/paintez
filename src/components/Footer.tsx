import { navLinks, services } from "@/config/content";
import { emailHref, phoneHref, siteConfig } from "@/config/site";
import { InstagramIcon } from "./Icon";
import { Logo } from "./LogoMark";
import { TrackedLink } from "./TrackedLink";

export function Footer() {
  const tel = phoneHref();
  const mail = emailHref();
  return (
    <footer className="bg-navy-950 pb-28 pt-14 text-white md:pb-10">
      <div className="container-page">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo tone="light" />
            <p className="mt-4 max-w-xs text-[0.95rem] leading-relaxed text-white/70">
              Professional painters in {siteConfig.city}, {siteConfig.state}. Interior, exterior and cabinet painting for your home.
            </p>
          </div>
          <nav aria-label="Footer">
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-teal-400">Explore</h2>
            <ul className="mt-4 grid gap-2.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-white/80 hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-teal-400">Services</h2>
            <ul className="mt-4 grid gap-2.5">
              {services.map((s) => (
                <li key={s.id}>
                  <a href="#services" className="text-white/80 hover:text-white">
                    {s.id === "more" ? "Trim, Doors & More" : s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-teal-400">Get in touch</h2>
            <ul className="mt-4 grid gap-2.5 text-white/80">
              <li>{siteConfig.serviceArea}</li>
              {tel ? (
                <li>
                  <TrackedLink href={tel} event="phone_clicked" location="footer" className="hover:text-white">
                    {siteConfig.phone}
                  </TrackedLink>
                </li>
              ) : null}
              {mail ? (
                <li>
                  <TrackedLink href={mail} event="email_clicked" location="footer" className="hover:text-white">
                    {siteConfig.email}
                  </TrackedLink>
                </li>
              ) : null}
              {siteConfig.instagram ? (
                <li>
                  <TrackedLink
                    href={siteConfig.instagram}
                    event="instagram_clicked"
                    location="footer"
                    external
                    className="inline-flex items-center gap-2 hover:text-white"
                  >
                    <InstagramIcon className="h-4 w-4" /> Instagram
                  </TrackedLink>
                </li>
              ) : null}
              <li>
                <a href="#quote" className="font-semibold text-teal-400 hover:text-teal-200">
                  Get a Free Quote →
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.businessName}. All rights reserved.
          </p>
          {siteConfig.demoMode ? <p className="text-white/45">{siteConfig.demoLabel}</p> : null}
        </div>
      </div>
    </footer>
  );
}
