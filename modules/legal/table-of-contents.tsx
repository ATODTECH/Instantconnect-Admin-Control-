"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { ChevronDown } from "lucide-react"
import { cn } from "cn"
import type { LegalHeading } from "@/lib/legal"

/** The last heading scrolled above the reading line, a quarter of the way down the screen. */
const useActiveHeading = (headings: LegalHeading[]) => {
  const [active, setActive] = useState(headings[0]?.id)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * 0.25
      let current = headings[0]?.id
      for (const heading of headings) {
        const el = document.getElementById(heading.id)
        if (el && el.getBoundingClientRect().top <= line) current = heading.id
      }
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [headings])

  return active
}

/** `marker` names the sliding active bar, so the wide and narrow lists animate apart. */
const Links = ({ headings, active, marker, onNavigate }: { headings: LegalHeading[], active?: string, marker: string, onNavigate?: () => void }) => (
  <ol className="flex flex-col">
    {headings.map((heading) => {
      const isActive = heading.id === active

      return (
        <li key={heading.id} className="relative">
          {isActive && <motion.span layoutId={marker} className="absolute inset-y-1 left-0 w-1 rounded-full bg-brand-gradient" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
          <a
            href={`#${heading.id}`}
            onClick={onNavigate}
            className={cn("block py-1.5 pl-4 text-sm leading-snug transition-colors", isActive ? "font-semibold text-ink-title" : "text-ink-meta hover:text-ink-title")}
          >
            {heading.title}
          </a>
        </li>
      )
    })}
  </ol>
)

/** A sticky list of sections on wide screens, a collapsible one on narrow screens. */
export const TableOfContents = ({ headings }: { headings: LegalHeading[] }) => {
  const active = useActiveHeading(headings)
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav aria-label="On this page" className="hidden lg:block">
        <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.14em] text-ink-meta">On this page</span>
        <Links headings={headings} active={active} marker="toc-wide" />
      </nav>

      <nav aria-label="On this page" className="rounded-2xl ring-1 ring-ink-border lg:hidden">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-center justify-between px-4 py-3.5 text-sm font-semibold text-ink-title"
        >
          On this page
          <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden />
        </button>
        {open && (
          <div className="border-t border-ink-border px-1 py-2">
            <Links headings={headings} active={active} marker="toc-narrow" onNavigate={() => setOpen(false)} />
          </div>
        )}
      </nav>
    </>
  )
}
