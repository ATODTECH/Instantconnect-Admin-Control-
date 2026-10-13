"use client"

import { useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "motion/react"
import { CalendarDays, Heart, MapPin, MessageSquare, Pin, Star } from "lucide-react"
import { cn } from "cn"
import { IconBadge } from "@/components/landing/feature-card"
import { RevealGroup, RevealItem } from "@/components/landing/reveal"
import { Section } from "@/components/landing/section"
import { SectionHeading } from "@/components/landing/section-heading"
import { EXPLORE_FEATURES } from "../constants"
import { Avatar, PEOPLE } from "../people"

type ExploreKey = (typeof EXPLORE_FEATURES)[number]["key"]

const EventPreview = () => (
  <div className="relative mt-2 overflow-hidden rounded-2xl ring-1 ring-ink-border">
    <div className="relative h-44">
      <Image src="/landing/place-cafe-bloom.jpg" alt="" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
      <span className="absolute left-3 top-3 flex flex-col items-center rounded-xl bg-white px-2.5 py-1 leading-none text-ink-title">
        <span className="text-[10px] font-semibold uppercase text-brand">Sat</span>
        <span className="text-lg font-bold">18</span>
      </span>
      <div className="absolute inset-x-3 bottom-3 flex items-end justify-between text-white">
        <div className="flex flex-col">
          <span className="text-base font-semibold">Founders&apos; Brunch</span>
          <span className="flex items-center gap-1 text-xs text-white/80"><MapPin className="size-3" aria-hidden /> Café Bloom, Victoria Island</span>
        </div>
        <div className="flex -space-x-2">
          {[PEOPLE.kemi, PEOPLE.seun, PEOPLE.tobi].map((person) => (
            <Avatar key={person.name} src={person.photo} size={26} className="rounded-full ring-2 ring-white" />
          ))}
        </div>
      </div>
    </div>
  </div>
)

const CommunityPreview = () => (
  <div className="mt-2 flex flex-col gap-3 rounded-2xl bg-brand-surface-subtle p-4 ring-1 ring-brand-tint">
    <div className="flex items-center gap-2.5">
      <Avatar src={PEOPLE.zara.photo} size={34} />
      <div className="flex flex-1 flex-col">
        <span className="text-sm font-semibold text-ink-title">Lagos Creatives</span>
        <span className="text-xs text-ink-meta">Zara · 2h</span>
      </div>
      <Pin className="size-4 text-brand" aria-label="Pinned" />
    </div>
    <p className="text-sm leading-relaxed text-ink-body">Golden hour shoot at Tarkwa Bay this Sunday. Bring a friend, all levels welcome ✨</p>
    <div className="flex items-center gap-4 text-xs text-ink-meta">
      <span className="flex items-center gap-1"><Heart className="size-3.5 fill-brand-pink text-brand-pink" aria-hidden /> 48</span>
      <span className="flex items-center gap-1"><MessageSquare className="size-3.5" aria-hidden /> 12 comments</span>
    </div>
  </div>
)

const PLACES = [
  { name: "Café Bloom", kind: "Café", photo: "/landing/place-cafe-bloom.jpg", rating: "4.8" },
  { name: "The Tech Hub", kind: "Coworking", photo: "/landing/place-tech-hub.jpg", rating: "4.7" },
  { name: "Freedom Park", kind: "Outdoors", photo: "/landing/place-freedom-park.jpg", rating: "4.9" },
]

const PlacesPreview = () => (
  <div className="mt-2 grid grid-cols-3 gap-2">
    {PLACES.map((place) => (
      <div key={place.name} className="flex flex-col gap-1.5">
        <div className="relative aspect-4/5 overflow-hidden rounded-xl">
          <Image src={place.photo} alt="" fill sizes="(min-width: 1024px) 12vw, 30vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
          <span className="absolute right-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold text-ink-title">
            <Star className="size-2.5 fill-[#F59E0B] text-[#F59E0B]" aria-hidden /> {place.rating}
          </span>
        </div>
        <span className="truncate text-xs font-semibold text-ink-title">{place.name}</span>
        <span className="-mt-1 text-[11px] text-ink-meta">{place.kind}</span>
      </div>
    ))}
  </div>
)

const ChatPreview = () => (
  <div className="mt-2 flex flex-col gap-2">
    <span className="flex items-center gap-2 self-start text-xs text-ink-meta">
      <Avatar src={PEOPLE.seun.photo} size={22} online /> Seun · Startup lawyer · 950 m
    </span>
    <span className="max-w-[80%] self-start rounded-2xl rounded-bl-sm bg-[#F4F3F5] px-3.5 py-2 text-sm text-ink-title">Saw you&apos;re going to Founders&apos; Brunch too 👋</span>
    <span className="max-w-[80%] self-end rounded-2xl rounded-br-sm bg-brand px-3.5 py-2 text-sm text-white">I am! Need a co-founder with legal chops 😅</span>
    <span className="max-w-[80%] self-start rounded-2xl rounded-bl-sm bg-[#F4F3F5] px-3.5 py-2 text-sm text-ink-title">Coffee before the event?</span>
    <span className="max-w-[80%] self-end rounded-2xl rounded-br-sm bg-brand px-3.5 py-2 text-sm text-white">Yes! 10am at Café Bloom?</span>
    <span className="flex items-center gap-1.5 self-end rounded-full bg-brand-surface px-3 py-1.5 text-xs font-semibold text-brand-deep">
      <CalendarDays className="size-3.5" aria-hidden /> Meetup confirmed · Sat 10:00
    </span>
  </div>
)

const PREVIEWS: Record<ExploreKey, () => React.JSX.Element> = {
  events: EventPreview,
  communities: CommunityPreview,
  places: PlacesPreview,
  chat: ChatPreview,
}

/** Panel fills, after the app's category tones. */
const PANEL_TONES: Record<ExploreKey, string> = {
  events: "bg-tone-peach",
  communities: "bg-tone-lilac",
  places: "bg-tone-blush",
  chat: "bg-tone-sky",
}

type Feature = (typeof EXPLORE_FEATURES)[number]

const PanelBody = ({ feature }: { feature: Feature }) => {
  const Preview = PREVIEWS[feature.key]

  return (
    <div className="flex h-full flex-col gap-5">
      <div className="flex flex-col items-start gap-4 sm:flex-row">
        <IconBadge icon={feature.icon} tone={feature.tone} className="border-2 border-ink-title" />
        <div className="flex flex-col gap-1.5">
          <h3 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink-title sm:text-3xl">{feature.title}</h3>
          <p className="max-w-md text-[0.95rem] leading-relaxed text-ink-body">{feature.body}</p>
        </div>
      </div>
      <div className="mt-auto rounded-3xl border-2 border-ink-title bg-white p-4 shadow-[5px_5px_0_0_#141417]">
        <Preview />
      </div>
    </div>
  )
}

/**
 * Wide screens: a row of panels, one open at a time. Closed panels show their
 * name running up the side; hovering or focusing one opens it.
 */
const Accordion = () => {
  const [open, setOpen] = useState<ExploreKey>(EXPLORE_FEATURES[0].key)

  return (
    <div className="mt-14 hidden h-[36rem] gap-3 lg:flex">
      {EXPLORE_FEATURES.map((feature) => {
        const isOpen = open === feature.key

        return (
          <motion.div
            key={feature.key}
            layout
            onMouseEnter={() => setOpen(feature.key)}
            onFocus={() => setOpen(feature.key)}
            transition={{ type: "spring", stiffness: 200, damping: 28 }}
            style={{ flex: isOpen ? 5 : 1 }}
            className={cn("relative min-w-0 overflow-hidden rounded-[2rem] border-2 border-ink-title shadow-[6px_6px_0_0_#141417]", PANEL_TONES[feature.key])}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-label={feature.title}
              onClick={() => setOpen(feature.key)}
              className={cn("absolute inset-0 z-10", isOpen && "pointer-events-none")}
            />
            <AnimatePresence initial={false} mode="popLayout">
              {isOpen ? (
                <motion.div
                  key="open"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.15 } }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                  className="absolute inset-0 w-[min(46rem,62vw)] p-8"
                >
                  <PanelBody feature={feature} />
                </motion.div>
              ) : (
                <motion.div
                  key="closed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-between py-8"
                >
                  <IconBadge icon={feature.icon} tone={feature.tone} className="border-2 border-ink-title" />
                  <span className="rotate-180 whitespace-nowrap font-display text-5xl font-extrabold tracking-[-0.04em] text-ink-title/85 [writing-mode:vertical-rl]">
                    {feature.label}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}

const Explore = () => (
  <Section id="explore">
    <SectionHeading
      eyebrow="Connect beyond the swipe"
      title={<>One app for your whole <span className="text-brand-gradient">social life</span></>}
      description="Events, communities, great places to meet and conversations that go somewhere, all in one place."
    />

    <Accordion />

    {/* Narrow screens: every panel open, stacked. */}
    <RevealGroup className="mt-12 flex flex-col gap-5 lg:hidden">
      {EXPLORE_FEATURES.map((feature) => (
        <RevealItem key={feature.key}>
          <div className={cn("rounded-[2rem] border-2 border-ink-title p-6 shadow-[6px_6px_0_0_#141417]", PANEL_TONES[feature.key])}>
            <PanelBody feature={feature} />
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  </Section>
)

export default Explore
