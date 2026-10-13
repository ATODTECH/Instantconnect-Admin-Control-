"use client"

import { useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react"
import { Menu, X } from "lucide-react"
import { cn } from "cn"
import { BrandLogo } from "@/components/brand/brand-logo"
import { Container } from "@/components/landing/section"
import { ROUTES } from "@/lib/routes"
import { NAV_LINKS } from "../constants"

/** Transparent over the hero's gradient, frosted white once the page scrolls. */
const Navbar = () => {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24))

  const solid = scrolled || open

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        solid ? "bg-white/85 shadow-[0_1px_0_0_rgba(20,20,23,0.06)] backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <Container className="flex h-18 items-center justify-between gap-6">
        <Link href={ROUTES.home} aria-label="InstantLinkUp home" onClick={() => setOpen(false)}>
          <BrandLogo tone={solid ? "dark" : "light"} />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                solid ? "text-ink-muted hover:bg-brand-surface-subtle hover:text-brand-deep" : "text-white/85 hover:bg-white/10 hover:text-white",
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#download"
            className={cn(
              "hidden h-11 items-center rounded-full px-5 text-sm font-semibold transition-all sm:inline-flex",
              solid ? "bg-brand text-white hover:bg-brand-deep" : "bg-white text-brand-deep hover:bg-brand-surface",
            )}
          >
            Get the app
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className={cn("flex size-11 items-center justify-center rounded-full lg:hidden", solid ? "text-ink-title hover:bg-brand-surface-subtle" : "text-white hover:bg-white/10")}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-ink-border lg:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-base font-medium text-ink-title hover:bg-brand-surface-subtle">
                  {link.label}
                </a>
              ))}
              <a href="#download" onClick={() => setOpen(false)} className="mt-2 rounded-full bg-brand py-3 text-center text-sm font-semibold text-white">
                Get the app
              </a>
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
