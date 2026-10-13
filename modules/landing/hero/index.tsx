"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ArrowDown, BadgeCheck, MapPin } from "lucide-react"
import { cn } from "cn"
import { TONES, type Tone } from "@/components/landing/feature-card"
import { StoreButtons } from "@/components/landing/store-buttons"
import { STORE_LINKS } from "../constants"
import { PEOPLE, type Person } from "../people"
import { useIsDesktop } from "../use-is-desktop"
import CityMap from "./city-map"

const EASE = [0.22, 1, 0.36, 1] as const
const CYCLE_MS = 2600

type Point = { x: number, y: number }

type Match = {
  /** Finishes the headline: "Find your ___". */
  word: string
  person: Person
  category: string
  tone: Tone
  /** Pin position in percent of the hero, on wide and on narrow screens. */
  desktop: Point
  mobile: Point
}

/** Where "you" are on the map. Matches are drawn round it. */
const YOU = { desktop: { x: 73, y: 50 }, mobile: { x: 50, y: 27 } }

const MATCHES: Match[] = [
  { word: "co-founder", person: PEOPLE.kemi, category: "Business", tone: "sky", desktop: { x: 60, y: 22 }, mobile: { x: 21, y: 15 } },
  { word: "gym buddy", person: PEOPLE.tobi, category: "Friendship", tone: "blush", desktop: { x: 86, y: 22 }, mobile: { x: 79, y: 13 } },
  { word: "producer", person: PEOPLE.david, category: "Talents", tone: "peach", desktop: { x: 87, y: 70 }, mobile: { x: 79, y: 36 } },
  { word: "plus-one", person: PEOPLE.amara, category: "Social", tone: "lilac", desktop: { x: 57, y: 76 }, mobile: { x: 21, y: 38 } },
  { word: "mentor", person: PEOPLE.seun, category: "Business", tone: "sky", desktop: { x: 72, y: 86 }, mobile: { x: 56, y: 44 } },
  { word: "squad", person: PEOPLE.zara, category: "General", tone: "mint", desktop: { x: 93, y: 45 }, mobile: { x: 47, y: 9 } },
]

const pinStyle = (match: { desktop: Point, mobile: Point }) =>
  ({
    "--mx": `${match.mobile.x}%`,
    "--my": `${match.mobile.y}%`,
    "--dx": `${match.desktop.x}%`,
    "--dy": `${match.desktop.y}%`,
  }) as React.CSSProperties

/** Positions a child at a pin's point, switching layout at the lg breakpoint. */
const PIN_POSITION = "absolute left-(--mx) top-(--my) lg:left-(--dx) lg:top-(--dy) -translate-x-1/2 -translate-y-1/2"

/** The viewer's own pin, with radar rings rippling out from it. */
const YouPin = () => (
  <div className={PIN_POSITION} style={pinStyle(YOU)}>
    <div className="relative flex items-center justify-center">
      {[0, 1, 2].map((ring) => (
        <motion.span
          key={ring}
          className="absolute size-24 rounded-full border border-brand-soft/60"
          initial={{ scale: 0.3, opacity: 0.8 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 4.5, repeat: Infinity, delay: ring * 1.5, ease: "easeOut" }}
        />
      ))}
      <motion.span
        aria-hidden
        className="absolute size-[26rem] rounded-full bg-[conic-gradient(from_0deg,rgba(192,132,252,0.28),transparent_22%)]"
        animate={{ rotate: 360 }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
      />
      <span className="relative flex size-14 items-center justify-center rounded-full bg-brand-gradient shadow-[0_0_0_8px_rgba(255,255,255,0.12),0_0_40px_rgba(236,72,153,0.8)]">
        <span className="font-display text-sm font-bold text-white">You</span>
      </span>
    </div>
  </div>
)

const PersonPin = ({ match, active }: { match: Match, active: boolean }) => (
  <div className={cn(PIN_POSITION, active ? "z-20" : "z-10")} style={pinStyle(match)}>
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: active ? 1 : 0.55, scale: active ? 1 : 0.72 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="relative flex flex-col items-center"
    >
      <span className={cn("rounded-full p-[3px] transition-colors", active ? "bg-brand-gradient" : "bg-white/40")}>
        <Image src={match.person.photo} alt="" width={128} height={128} className="size-16 rounded-full object-cover ring-2 ring-bg-primary" />
      </span>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.9 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="absolute top-full mt-2 flex w-max flex-col items-center gap-1 rounded-2xl bg-white px-3 py-2 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)]"
          >
            <span className="flex items-center gap-1 text-sm font-semibold text-ink-title">
              {match.person.name}, {match.person.age}
              <BadgeCheck className="size-4 fill-ink-verified text-white" aria-label="Verified" />
            </span>
            <span className="flex items-center gap-1.5">
              <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", TONES[match.tone])}>{match.category}</span>
              <span className="flex items-center gap-0.5 text-[11px] text-ink-meta">
                <MapPin className="size-3 text-brand" aria-hidden />
                {match.person.distance}
              </span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  </div>
)

/** The dashed "link up" drawn from you to the highlighted person. */
const LinkLine = ({ to, desktop }: { to: Match, desktop: boolean }) => {
  const from = desktop ? YOU.desktop : YOU.mobile
  const end = desktop ? to.desktop : to.mobile

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="link-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#EC4899" />
          <stop offset="1" stopColor="#C084FC" />
        </linearGradient>
      </defs>
      <motion.line
        key={to.word}
        x1={from.x}
        y1={from.y}
        x2={end.x}
        y2={end.y}
        stroke="url(#link-line)"
        strokeWidth="2.5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
      />
    </svg>
  )
}

/** "Find your ___", the blank cycling through what people come here for. */
const RotatingWord = ({ word }: { word: string }) => (
  <span className="relative inline-flex overflow-hidden pb-2 align-bottom">
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={word}
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        exit={{ y: "-100%", opacity: 0 }}
        transition={{ duration: 0.55, ease: EASE }}
        className="text-brand-gradient whitespace-nowrap"
      >
        {word}
      </motion.span>
    </AnimatePresence>
    <svg viewBox="0 0 300 12" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-3 w-full" aria-hidden>
      <path d="M2 9 C 60 2 120 2 180 6 S 270 10 298 4" fill="none" stroke="#EC4899" strokeWidth="3" strokeLinecap="round" />
    </svg>
  </span>
)

const intro = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE, delay },
})

const Hero = () => {
  const [index, setIndex] = useState(0)
  const reduceMotion = useReducedMotion()
  const desktop = useIsDesktop()
  const active = MATCHES[index]

  useEffect(() => {
    if (reduceMotion) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % MATCHES.length), CYCLE_MS)
    return () => clearInterval(timer)
  }, [reduceMotion])

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-bg-primary lg:min-h-[max(100svh,720px)]">
      {/* The city at night, with brand light pooling round where you are. */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <CityMap className="absolute inset-0 h-full w-full" />
        <div className="absolute left-1/2 top-[27%] size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/30 blur-[120px] lg:left-[73%] lg:top-1/2" />
        <div className="absolute inset-0 bg-linear-to-t from-bg-primary via-bg-primary/70 to-transparent lg:bg-linear-to-r lg:via-bg-primary/60" />
      </div>

      {/* The map's people, linked to you one at a time. */}
      <div className="absolute inset-0 -z-0">
        <LinkLine to={active} desktop={desktop} />
        <YouPin />
        {MATCHES.map((match) => (
          <PersonPin key={match.word} match={match} active={match === active} />
        ))}
      </div>

      <div className="relative mx-auto mt-auto flex w-full max-w-7xl flex-col px-5 pb-12 pt-[57svh] sm:px-8 lg:my-auto lg:pb-24 lg:pt-36">
        <div className="flex max-w-2xl flex-col items-start">
          <motion.span {...intro(0.1)} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white/90 ring-1 ring-white/15 backdrop-blur">
            How far? 👋 <span className="text-brand-soft">Your people dey nearby.</span>
          </motion.span>

          <motion.h1 {...intro(0.2)} className="mt-6 font-display text-[3.1rem] font-bold leading-[0.95] tracking-[-0.045em] text-white sm:text-7xl xl:text-[5.75rem]">
            Find your
            <br />
            <RotatingWord word={active.word} />
            <br />
            around the corner.
          </motion.h1>

          <motion.p {...intro(0.35)} className="mt-7 max-w-lg text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
            Real, verified people near you for business, friendship, talent or tonight&apos;s plans. Chat, pick a spot, and meet with arrival codes
            that prove it&apos;s really them.
          </motion.p>

          <motion.div {...intro(0.5)} className="mt-9 flex flex-wrap items-center gap-3">
            <StoreButtons links={STORE_LINKS} tone="light" />
          </motion.div>

          <motion.a
            {...intro(0.65)}
            href="#how-it-works"
            className="group mt-10 hidden items-center gap-3 text-sm font-medium text-white/60 transition-colors hover:text-white lg:inline-flex"
          >
            <span className="flex size-10 items-center justify-center rounded-full ring-1 ring-white/20 transition-colors group-hover:bg-white/10">
              <ArrowDown className="size-4 animate-bounce" aria-hidden />
            </span>
            See how a link up works
          </motion.a>
        </div>
      </div>
    </section>
  )
}

export default Hero
