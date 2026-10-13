import Link from "next/link"
import { BrandLogo } from "@/components/brand/brand-logo"
import { Container } from "@/components/landing/section"
import { ROUTES } from "@/lib/routes"
import { CONTACT_EMAIL, NAV_LINKS } from "../constants"

const Footer = () => (
  <footer className="border-t border-ink-border bg-neutral-white">
    <Container className="flex flex-col gap-12 py-14">
      <div className="flex flex-col justify-between gap-10 md:flex-row">
        <div className="flex max-w-xs flex-col gap-4">
          <Link href={ROUTES.home} aria-label="InstantLinkUp home">
            <BrandLogo />
          </Link>
          <p className="text-sm leading-relaxed text-ink-muted">Meet real people near you, for friendship, business, talent and everything social. Safely.</p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:gap-20">
          <nav aria-label="Footer" className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-meta">Product</span>
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="text-sm text-ink-muted transition-colors hover:text-brand">{link.label}</a>
            ))}
          </nav>
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-meta">Company</span>
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm text-ink-muted transition-colors hover:text-brand">Contact us</a>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-3 border-t border-ink-border pt-8 text-xs text-ink-meta sm:flex-row">
        <span>© {new Date().getFullYear()} InstantLinkUp. All rights reserved.</span>
        <span>Made with 💜 in Lagos</span>
      </div>
    </Container>
  </footer>
)

export default Footer
