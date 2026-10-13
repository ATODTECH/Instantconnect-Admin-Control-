"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "motion/react"
import { BadgeCheck, MapPin, ShieldCheck, UserPlus } from "lucide-react"
import { Container } from "@/components/landing/section"
import { PhoneFrame } from "@/components/landing/phone-frame"
import { StoreButtons } from "@/components/landing/store-buttons"
import { STORE_LINKS } from "../constants"
import { DiscoverScreen } from "../screens"
import { PEOPLE } from "../screens/parts"
import Orbit from "./orbit"

const EASE = [0.22, 1, 0.36, 1] as const

const intro = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: EASE, delay },
})

const STACK = [PEOPLE.amara, PEOPLE.tobi, PEOPLE.kemi, PEOPLE.david]

/** A small card that bobs beside the phone, introduced after the phone lands. */
const FloatingChip = ({ children, className, delay, drift = 10 }: { children: React.ReactNode, className: string, delay: number, drift?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1, y: [0, -drift, 0] }}
    transition={{
      opacity: { delay, duration: 0.5 },
      scale: { delay, duration: 0.5, ease: EASE },
      y: { delay: delay + 0.5, duration: 5, repeat: Infinity, ease: "easeInOut" },
    }}
    className={className}
  >
    {children}
  </motion.div>
)

const Hero = () => {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, 140])
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -60])

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-brand-gradient pb-24 pt-32 sm:pt-36 lg:pb-32">
      {/* Soft light and a fine grid for depth on the flat gradient. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 -top-40 size-[36rem] rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -bottom-48 right-0 size-[32rem] rounded-full bg-brand-orange/40 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-size-[56px_56px] mask-[radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>

      <Container className="grid items-center gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-8">
        <motion.div style={{ y: copyY }} className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <motion.span {...intro(0)} className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white ring-1 ring-white/25 backdrop-blur">
            <MapPin className="size-3.5" aria-hidden /> Now launching in Lagos
          </motion.span>

          <motion.h1 {...intro(0.1)} className="mt-6 text-balance text-[2.75rem] font-bold leading-[1.02] tracking-[-0.03em] text-white sm:text-6xl xl:text-7xl">
            Meet real people
            <br />
            near you. <span className="font-brand font-normal italic tracking-normal">Right now.</span>
          </motion.h1>

          <motion.p {...intro(0.2)} className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/85 sm:text-lg">
            Friends, business partners, creatives and plans for tonight, all around the corner. Connect, chat, pick a spot together, and
            meet up with arrival codes that prove it&apos;s really them.
          </motion.p>

          <motion.div {...intro(0.3)} className="mt-9">
            <StoreButtons links={STORE_LINKS} tone="light" className="justify-center lg:justify-start" />
          </motion.div>

          <motion.div {...intro(0.4)} className="mt-9 flex items-center gap-3">
            <div className="flex -space-x-2.5">
              {STACK.map((person) => (
                <Image key={person.name} src={person.photo} alt="" width={80} height={80} className="size-9 rounded-full object-cover ring-2 ring-white/70" />
              ))}
            </div>
            <p className="text-left text-sm leading-snug text-white/85">
              <span className="font-semibold text-white">Verified profiles.</span>
              <br />
              Safety-checked meetups.
            </p>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: phoneY }} className="relative mx-auto flex w-full max-w-md items-center justify-center py-10">
          <Orbit />

          <motion.div
            initial={{ opacity: 0, y: 80, rotate: -4 }}
            animate={{ opacity: 1, y: 0, rotate: -4 }}
            transition={{ duration: 1, ease: EASE, delay: 0.2 }}
            className="relative z-10"
          >
            <PhoneFrame className="w-[17.5rem] sm:w-[18.5rem]">
              <DiscoverScreen />
            </PhoneFrame>
          </motion.div>

          <FloatingChip delay={1.1} className="absolute -left-2 top-[22%] z-20 sm:-left-10">
            <div className="flex items-center gap-2.5 rounded-2xl bg-white p-2.5 pr-4 shadow-[0_20px_40px_-12px_rgba(76,29,149,0.45)]">
              <Image src={PEOPLE.kemi.photo} alt="" width={72} height={72} className="size-9 rounded-full object-cover" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-ink-title">Kemi wants to connect</span>
                <span className="text-[11px] text-ink-meta">Business · 2.4 km away</span>
              </div>
              <span className="ml-1 flex size-7 items-center justify-center rounded-full bg-brand text-white">
                <UserPlus className="size-3.5" aria-hidden />
              </span>
            </div>
          </FloatingChip>

          <FloatingChip delay={1.4} drift={14} className="absolute -right-2 bottom-[18%] z-20 sm:-right-8">
            <div className="flex items-center gap-2.5 rounded-2xl bg-white p-2.5 pr-4 shadow-[0_20px_40px_-12px_rgba(76,29,149,0.45)]">
              <span className="flex size-9 items-center justify-center rounded-full bg-tone-mint">
                <ShieldCheck className="size-4.5 text-ink-verified" aria-hidden />
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-ink-title">Arrival verified</span>
                <span className="text-[11px] text-ink-meta">Code 4827 matched</span>
              </div>
            </div>
          </FloatingChip>

          <FloatingChip delay={1.7} drift={8} className="absolute right-4 top-[6%] z-20 hidden sm:block">
            <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-ink-title shadow-lg">
              <BadgeCheck className="size-4 fill-ink-verified text-white" aria-hidden /> ID verified
            </span>
          </FloatingChip>
        </motion.div>
      </Container>

      {/* A curved hem into the white page below. */}
      <div aria-hidden className="absolute inset-x-0 -bottom-px h-16 bg-neutral-white [clip-path:ellipse(75%_100%_at_50%_100%)]" />
    </section>
  )
}

export default Hero
