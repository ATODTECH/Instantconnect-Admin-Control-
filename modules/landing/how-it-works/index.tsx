"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useInView } from "motion/react"
import { cn } from "cn"
import { PhoneFrame } from "@/components/landing/phone-frame"
import { Section } from "@/components/landing/section"
import { SectionHeading } from "@/components/landing/section-heading"
import { HOW_IT_WORKS, type HowItWorksKey } from "../constants"
import { SCREENS } from "../screens"

type Step = (typeof HOW_IT_WORKS)[number]

/** One step of the story. Reports itself as active once its text reaches the middle of the viewport. */
const StepBlock = ({ step, active, onActive }: { step: Step, active: boolean, onActive: (key: HowItWorksKey) => void }) => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" })
  const Screen = SCREENS[step.key]

  useEffect(() => {
    if (inView) onActive(step.key)
  }, [inView, onActive, step.key])

  return (
    <div className="flex flex-col gap-8 lg:min-h-[80vh] lg:justify-center">
      <div ref={ref} className={cn("flex flex-col gap-4 transition-opacity duration-500", active ? "lg:opacity-100" : "lg:opacity-30")}>
        <span className="font-brand text-6xl leading-none text-brand-gradient">{step.step}</span>
        <h3 className="text-3xl font-bold tracking-tight text-ink-title sm:text-4xl">{step.title}</h3>
        <p className="max-w-md text-lg leading-relaxed text-ink-muted">{step.body}</p>
      </div>
      {/* On small screens each step carries its own phone; wide screens share the sticky one. */}
      <PhoneFrame className="mx-auto w-[16.5rem] lg:hidden">
        <Screen />
      </PhoneFrame>
    </div>
  )
}

const HowItWorks = () => {
  const [active, setActive] = useState<HowItWorksKey>(HOW_IT_WORKS[0].key)
  const index = HOW_IT_WORKS.findIndex((step) => step.key === active)
  const Screen = SCREENS[active]

  return (
    <Section id="how-it-works" className="bg-linear-to-b from-neutral-white via-brand-surface-subtle to-neutral-white">
      <SectionHeading
        eyebrow="How it works"
        title={<>From <span className="text-brand-gradient">&ldquo;hey&rdquo;</span> to hello, in four steps</>}
        description="Every connection on InstantLinkUp is built to end in a real, safe meetup, not an endless chat."
      />

      <div className="mt-16 grid gap-20 lg:mt-8 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-24 lg:gap-0">
          {HOW_IT_WORKS.map((step) => (
            <StepBlock key={step.key} step={step} active={step.key === active} onActive={setActive} />
          ))}
        </div>

        <div className="relative hidden lg:block">
          <div className="sticky top-0 flex h-screen items-center justify-center">
            <div aria-hidden className="absolute size-[30rem] rounded-full bg-brand-gradient opacity-20 blur-3xl" />

            <div className="absolute left-0 top-1/2 flex -translate-y-1/2 flex-col gap-3">
              {HOW_IT_WORKS.map((step, i) => (
                <span key={step.key} className="relative h-12 w-1 overflow-hidden rounded-full bg-brand-tint">
                  <motion.span
                    className="absolute inset-x-0 top-0 rounded-full bg-brand"
                    animate={{ height: i <= index ? "100%" : "0%" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </span>
              ))}
            </div>

            <PhoneFrame className="relative w-[19rem]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 40, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -40, scale: 0.96 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Screen />
                </motion.div>
              </AnimatePresence>
            </PhoneFrame>
          </div>
        </div>
      </div>
    </Section>
  )
}

export default HowItWorks
