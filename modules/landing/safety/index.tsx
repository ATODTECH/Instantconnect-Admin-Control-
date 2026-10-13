"use client"

import { motion } from "motion/react"
import { Check, ShieldCheck } from "lucide-react"
import { FeatureCard } from "@/components/landing/feature-card"
import { Reveal, RevealGroup, RevealItem } from "@/components/landing/reveal"
import { Section } from "@/components/landing/section"
import { SectionHeading } from "@/components/landing/section-heading"
import { SAFETY_FEATURES } from "../constants"
import { Avatar, PEOPLE } from "../screens/parts"

const CODE = ["4", "8", "2", "7"]

/** The code handshake: each digit drops in, then the match is confirmed. */
const CodeHandshake = () => (
  <Reveal className="relative overflow-hidden rounded-[2rem] bg-brand-gradient p-8 sm:p-10">
    <div aria-hidden className="absolute -right-20 -top-20 size-72 rounded-full bg-white/15 blur-2xl" />
    <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex max-w-md flex-col gap-3">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/25">
          <ShieldCheck className="size-3.5" aria-hidden /> Our difference
        </span>
        <h3 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">Swap codes. Know it&apos;s them.</h3>
        <p className="text-base leading-relaxed text-white/85">
          When you meet, you each read out a one-time code from your phone and the other enters it. A match proves the person in front of you is the
          person you&apos;ve been chatting to, and lets your safety circle know you&apos;ve arrived.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 rounded-3xl bg-white/12 p-6 ring-1 ring-white/25 backdrop-blur">
        <div className="flex items-center gap-3">
          <Avatar src={PEOPLE.amara.photo} size={40} />
          <span className="h-px w-10 border-t-2 border-dashed border-white/60" />
          <Avatar src={PEOPLE.tobi.photo} size={40} />
        </div>
        <div className="flex gap-2">
          {CODE.map((digit, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: -16, rotateX: 90 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex h-16 w-13 items-center justify-center rounded-xl bg-white text-3xl font-bold text-ink-title shadow-lg"
            >
              {digit}
            </motion.span>
          ))}
        </div>
        <motion.span
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.1, type: "spring", stiffness: 260, damping: 18 }}
          className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-ink-verified"
        >
          <Check className="size-4" strokeWidth={3} aria-hidden /> Both arrivals verified
        </motion.span>
      </div>
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

    <div className="relative mt-14">
      <CodeHandshake />
    </div>

    <RevealGroup className="relative mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {SAFETY_FEATURES.map((feature) => (
        <RevealItem key={feature.title}>
          <FeatureCard icon={feature.icon} title={feature.title} body={feature.body} surface="dark" />
        </RevealItem>
      ))}
    </RevealGroup>
  </Section>
)

export default Safety
