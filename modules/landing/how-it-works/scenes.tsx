"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import { BadgeCheck, CalendarClock, Check, MapPin, ShieldCheck, UserPlus } from "lucide-react"
import { cn } from "cn"
import type { HowItWorksKey } from "../constants"
import { Avatar, PEOPLE } from "../people"

const EASE = [0.22, 1, 0.36, 1] as const
const IN_VIEW = { once: true, amount: 0.5 } as const

/** Three profiles that fan out from a stack, the front one ready to connect. */
const DiscoverScene = () => {
  const cards = [
    { person: PEOPLE.david, rotate: -14, x: -90 },
    { person: PEOPLE.kemi, rotate: 12, x: 90 },
    { person: PEOPLE.amara, rotate: -2, x: 0 },
  ]

  return (
    <div className="relative flex h-80 w-full items-center justify-center">
      {cards.map(({ person, rotate, x }, i) => (
        <motion.div
          key={person.name}
          initial={{ rotate: 0, x: 0, y: 20, opacity: 0 }}
          whileInView={{ rotate, x, y: 0, opacity: 1 }}
          viewport={IN_VIEW}
          transition={{ delay: 0.15 * i, type: "spring", stiffness: 140, damping: 16 }}
          className="absolute aspect-3/4 w-44 overflow-hidden rounded-3xl border-2 border-ink-title bg-ink-title shadow-[6px_6px_0_0_#141417] sm:w-48"
        >
          <Image src={person.photo} alt="" fill sizes="200px" className="object-cover" />
          <div className="absolute inset-0 bg-linear-to-b from-transparent from-50% to-black/80" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3 text-white">
            <div className="flex flex-col">
              <span className="flex items-center gap-1 text-sm font-semibold">
                {person.name}, {person.age} <BadgeCheck className="size-3.5 fill-ink-verified text-white" aria-hidden />
              </span>
              <span className="flex items-center gap-0.5 text-[11px] text-white/75">
                <MapPin className="size-3" aria-hidden /> {person.distance}
              </span>
            </div>
            {i === cards.length - 1 && (
              <motion.span
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: 1 }}
                className="flex size-9 items-center justify-center rounded-full bg-brand-gradient"
              >
                <UserPlus className="size-4" aria-hidden />
              </motion.span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

const MESSAGES = [
  { text: "Saw you shoot on film too 📸", mine: false },
  { text: "Yes!! Portra all month. You?", mine: true },
  { text: "Photo walk at Freedom Park, Saturday?", mine: false },
  { text: "I'm in. Let's link up 🙌", mine: true },
]

/** The conversation types itself out, one bubble at a time. */
const ChatScene = () => (
  <div className="flex w-full max-w-sm flex-col gap-2.5 rounded-3xl border-2 border-ink-title bg-white p-4 shadow-[6px_6px_0_0_#141417]">
    <div className="flex items-center gap-2.5 border-b border-ink-border pb-3">
      <Avatar src={PEOPLE.amara.photo} size={36} online />
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-ink-title">Amara</span>
        <span className="text-xs text-ink-online">Online · 800 m away</span>
      </div>
    </div>
    {MESSAGES.map((message, i) => (
      <motion.span
        key={message.text}
        initial={{ opacity: 0, y: 12, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={IN_VIEW}
        transition={{ delay: 0.3 + i * 0.55, duration: 0.4, ease: EASE }}
        className={cn(
          "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm",
          message.mine ? "origin-bottom-right self-end rounded-br-sm bg-brand text-white" : "origin-bottom-left self-start rounded-bl-sm bg-[#F4F3F5] text-ink-title",
        )}
      >
        {message.text}
      </motion.span>
    ))}
  </div>
)

const SLOTS = ["Sat 10 AM", "Sat 2 PM", "Sun 11 AM"]

/** A meetup proposal, its time slot being picked and then confirmed. */
const PlanScene = () => {
  const [picked, setPicked] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setPicked((i) => (i + 1) % SLOTS.length), 1800)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="w-full max-w-sm overflow-hidden rounded-3xl border-2 border-ink-title bg-white shadow-[6px_6px_0_0_#141417]">
      <div className="relative h-36">
        <Image src="/landing/place-freedom-park.jpg" alt="" fill sizes="384px" className="object-cover" />
        <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-brand-deep">
          <CalendarClock className="size-3.5" aria-hidden /> Meetup proposal
        </span>
      </div>
      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-col">
          <span className="font-semibold text-ink-title">Freedom Park, Lagos Island</span>
          <span className="text-xs text-ink-meta">Photo walk · 3.4 km away</span>
        </div>
        <div className="flex gap-2">
          {SLOTS.map((slot, i) => (
            <span
              key={slot}
              className={cn(
                "relative rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-300",
                picked === i ? "text-white" : "text-ink-muted ring-1 ring-ink-border",
              )}
            >
              {picked === i && <motion.span layoutId="slot-pill" className="absolute inset-0 rounded-full bg-brand" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
              <span className="relative">{slot}</span>
            </span>
          ))}
        </div>
        <span className="flex h-11 items-center justify-center rounded-full bg-ink-title text-sm font-semibold text-white">Confirm meetup</span>
      </div>
    </div>
  )
}

const CODE = ["4", "8", "2", "7"]

/** Four digits land, then the arrival is confirmed. */
const VerifyScene = () => (
  <div className="flex w-full max-w-sm flex-col items-center gap-5 rounded-3xl border-2 border-ink-title bg-white p-6 shadow-[6px_6px_0_0_#141417]">
    <div className="flex items-center gap-3">
      <Avatar src={PEOPLE.amara.photo} size={44} />
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={IN_VIEW}
        transition={{ duration: 0.8, ease: EASE }}
        className="h-0.5 w-16 origin-left border-t-2 border-dashed border-brand"
      />
      <Avatar src={PEOPLE.tobi.photo} size={44} />
    </div>
    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-meta">Amara&apos;s code</span>
    <div className="flex gap-2">
      {CODE.map((digit, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: -20, rotateX: 90 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={IN_VIEW}
          transition={{ delay: 0.4 + i * 0.18, duration: 0.5, ease: EASE }}
          className="flex h-16 w-13 items-center justify-center rounded-2xl border-2 border-ink-title bg-brand-surface-subtle font-display text-3xl font-bold text-ink-title"
        >
          {digit}
        </motion.span>
      ))}
    </div>
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={IN_VIEW}
      transition={{ delay: 1.4, type: "spring", stiffness: 260, damping: 16 }}
      className="flex items-center gap-2 rounded-full bg-ink-verified px-4 py-2 text-sm font-semibold text-white"
    >
      <Check className="size-4" strokeWidth={3} aria-hidden /> Arrival verified
    </motion.span>
    <span className="flex items-center gap-1.5 text-xs text-ink-meta">
      <ShieldCheck className="size-3.5 text-ink-verified" aria-hidden /> Your safety circle has been told
    </span>
  </div>
)

export const SCENES: Record<HowItWorksKey, () => React.JSX.Element> = {
  discover: DiscoverScene,
  chat: ChatScene,
  plan: PlanScene,
  verify: VerifyScene,
}

