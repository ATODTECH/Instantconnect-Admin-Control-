"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { Check, ShieldCheck } from "lucide-react"
import { FeatureCard } from "@/components/landing/feature-card"
import { PhoneFrame } from "@/components/landing/phone-frame"
import { Reveal, RevealGroup, RevealItem } from "@/components/landing/reveal"
import { Section } from "@/components/landing/section"
import { SectionHeading } from "@/components/landing/section-heading"
import { SAFETY_FEATURES } from "../constants"
import { Avatar, PEOPLE } from "../people"

const CODE = ["4", "8", "2", "7"]

/** What the glass phone shows: the viewer's code, then the other side confirming it. */
const GlassScreen = () => (
  <div className="flex h-full flex-col px-4 pb-6 pt-12 text-white">
    <span className="text-center text-[11px] font-medium text-white/80">Meetup with Tobi · Freedom Park</span>
    <span className="mt-6 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">Your one-time code</span>
    <div className="mt-3 flex justify-center gap-1.5">
      {CODE.map((digit, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: -16, rotateX: 90 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 + i * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex h-13 w-10 items-center justify-center rounded-xl bg-white/20 font-display text-2xl font-bold ring-1 ring-white/40 backdrop-blur-md"
        >
          {digit}
        </motion.span>
      ))}
    </div>
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 1.3, duration: 0.5 }}
      className="mt-auto flex items-center gap-2.5 rounded-2xl bg-white/90 p-2.5 text-ink-title backdrop-blur"
    >
      <Avatar src={PEOPLE.tobi.photo} size={32} />
      <div className="flex flex-1 flex-col">
        <span className="text-[11px] font-semibold leading-tight">Tobi confirmed you arrived</span>
        <span className="text-[10px] text-ink-meta">10:04 AM</span>
      </div>
      <span className="flex size-6 items-center justify-center rounded-full bg-ink-verified">
        <Check className="size-3.5 text-white" strokeWidth={3} aria-hidden />
      </span>
    </motion.div>
  </div>
)

/**
 * The arrival code, drawn the way it's used: a phone held up in the real
 * world. A glass outline over a photo, after trueflutter's hero.
 */
const CodeHandshake = () => (
  <Reveal className="grid items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
    <div className="flex flex-col gap-5">
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-soft ring-1 ring-white/15">
        <ShieldCheck className="size-3.5" aria-hidden /> Only on InstantLinkUp
      </span>
      <h3 className="font-display text-4xl font-bold leading-[1.02] tracking-[-0.03em] text-white sm:text-5xl">
        Swap codes.
        <br />
        <span className="text-brand-gradient">Know it&apos;s them.</span>
      </h3>
      <p className="max-w-md text-base leading-relaxed text-ic-muted sm:text-lg">
        When you meet, you each read out a one-time code and the other enters it. A match proves the person in front of you is the person you&apos;ve
        been chatting to, and tells your safety circle you&apos;ve arrived.
      </p>
      <ul className="mt-2 flex flex-col gap-3">
        {["Codes work once, in person, around the meetup time", "Five wrong tries and the code burns", "Your circle hears when you arrive and when it ends"].map((point) => (
          <li key={point} className="flex items-start gap-3 text-[0.95rem] text-white/85">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand">
              <Check className="size-3 text-white" strokeWidth={3} aria-hidden />
            </span>
            {point}
          </li>
        ))}
      </ul>
    </div>

    <div className="relative h-[34rem] overflow-hidden rounded-[2.5rem] sm:h-[38rem]">
      <Image src="/landing/card-back-right.jpg" alt="A woman looking out over the city at dusk" fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-black/10" />
      <div className="absolute inset-y-8 right-6 sm:right-12">
        <PhoneFrame variant="glass" className="h-full w-auto">
          <GlassScreen />
        </PhoneFrame>
      </div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="absolute bottom-8 left-6 flex items-center gap-2.5 rounded-2xl bg-white p-3 pr-4 shadow-xl"
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-tone-mint">
          <ShieldCheck className="size-4.5 text-ink-verified" aria-hidden />
        </span>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-ink-title">Safety circle notified</span>
          <span className="text-[11px] text-ink-meta">Mum and Ada know you&apos;re there</span>
        </div>
      </motion.div>
    </div>
  </Reveal>
)

const Safety = () => (
  <Section id="safety" className="overflow-hidden bg-bg-primary">
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-brand/25 blur-[120px]" />

    <SectionHeading
      tone="dark"
      eyebrow="Safety, built in"
      title={<>Meeting strangers shouldn&apos;t feel like a <span className="text-brand-gradient">gamble</span></>}
      description="Other apps leave safety to you once the chat ends. Ours is designed around the meetup itself, from the first message to getting home."
      className="relative"
    />

    <div className="relative mt-16">
      <CodeHandshake />
    </div>

    <RevealGroup className="relative mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {SAFETY_FEATURES.map((feature) => (
        <RevealItem key={feature.title}>
          <FeatureCard icon={feature.icon} title={feature.title} body={feature.body} surface="dark" />
        </RevealItem>
      ))}
    </RevealGroup>
  </Section>
)

export default Safety
