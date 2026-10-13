"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react"
import { MapPin } from "lucide-react"
import { cn } from "cn"
import { Reveal } from "@/components/landing/reveal"
import { HOW_IT_WORKS } from "../constants"
import { useIsDesktop } from "../use-is-desktop"
import { SCENES } from "./scenes"

type Step = (typeof HOW_IT_WORKS)[number]

/** Each stop on the journey gets one of the app's category tones. */
const PANEL_TONES = ["bg-tone-lilac", "bg-tone-sky", "bg-tone-peach", "bg-tone-mint"]

const Panel = ({ step, index }: { step: Step, index: number }) => {
  const Scene = SCENES[step.key]

  return (
    <article
      className={cn(
        "relative grid w-full shrink-0 items-center gap-8 overflow-hidden rounded-[2.5rem] border-2 border-ink-title p-7 shadow-[8px_8px_0_0_#141417] sm:p-10",
        "lg:h-[min(62vh,560px)] lg:w-[min(80vw,1080px)] lg:grid-cols-[1fr_1.1fr] lg:px-14 lg:py-10",
        PANEL_TONES[index],
      )}
    >
      <div className="relative flex flex-col gap-4 lg:[@media(max-height:640px)]:gap-2">
        <span
          aria-hidden
          className="font-display text-[6rem] font-extrabold leading-[0.8] tracking-[-0.06em] text-transparent [-webkit-text-stroke:2px_#141417] lg:text-[7.5rem] lg:[@media(max-height:640px)]:text-[4.5rem]"
        >
          {step.step}
        </span>
        <h3 className="font-display text-3xl font-bold leading-[1.05] tracking-[-0.03em] text-ink-title sm:text-[2.6rem] lg:[@media(max-height:640px)]:text-3xl">{step.title}</h3>
        <p className="max-w-md text-base leading-relaxed text-ink-body sm:text-lg">{step.body}</p>
      </div>
      {/* Short laptop screens get a smaller scene so the panel still fits. */}
      <div className="relative flex items-center justify-center lg:[@media(max-height:780px)]:scale-[0.8] lg:[@media(max-height:640px)]:scale-[0.62]">
        <Scene />
      </div>
    </article>
  )
}

/** The dashed road the panels ride along, with a milestone under each one. */
const Road = ({ passed }: { passed: number }) => (
  <div aria-hidden className="absolute inset-x-0 bottom-0 h-1 border-t-[3px] border-dashed border-ink-title/25">
    {HOW_IT_WORKS.map((step, i) => (
      <span
        key={step.key}
        className={cn(
          "absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] transition-colors duration-500",
          i < passed ? "border-ink-title bg-brand" : "border-ink-title/30 bg-neutral-white",
        )}
        style={{ left: `calc(${i} * (min(80vw, 1080px) + 2.5rem) + min(80vw, 1080px) / 2 + 8vw)` }}
      />
    ))}
  </div>
)

/** Wide screens: the section pins and the panels drive sideways past a travelling pin. */
const Journey = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)
  const [reached, setReached] = useState(0)
  const [passed, setPassed] = useState(0)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  const x = useTransform(progress, [0, 1], [0, -distance])
  const bar = useTransform(progress, [0, 1], ["0%", "100%"])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    window.addEventListener("resize", measure)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [])

  useMotionValueEvent(progress, "change", (value) => {
    setReached(Math.min(HOW_IT_WORKS.length - 1, Math.floor(value * HOW_IT_WORKS.length * 0.999)))
  })

  // A milestone lights once the travelling pin, fixed at 8vw, has rolled over it.
  useMotionValueEvent(x, "change", (offset) => {
    const panel = Math.min(window.innerWidth * 0.8, 1080)
    setPassed(Math.max(0, Math.floor((-offset - panel / 2) / (panel + 40)) + 1))
  })

  return (
    <div ref={sectionRef} className="relative h-[420vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center gap-8 overflow-hidden pt-16 [@media(max-height:640px)]:gap-4 [@media(max-height:640px)]:pt-8">
        <div className="mx-auto flex w-full max-w-7xl items-end justify-between gap-8 px-8">
          <div className="flex flex-col gap-3">
            <span className="w-fit rounded-full bg-brand-surface px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-deep">How it works</span>
            <h2 className="font-display text-5xl font-bold leading-none tracking-[-0.04em] text-ink-title xl:text-6xl">
              From <span className="text-brand-gradient">&ldquo;hey&rdquo;</span> to hello.
            </h2>
          </div>
          <div className="flex w-56 flex-col items-end gap-2">
            <span className="font-display text-2xl font-bold tabular-nums text-ink-title">
              0{reached + 1}
              <span className="text-ink-placeholder"> / 0{HOW_IT_WORKS.length}</span>
            </span>
            <span className="h-1.5 w-full overflow-hidden rounded-full bg-brand-surface">
              <motion.span className="block h-full rounded-full bg-brand-gradient" style={{ width: bar }} />
            </span>
          </div>
        </div>

        <div className="relative pb-10">
          <motion.div ref={trackRef} style={{ x }} className="relative flex w-max gap-10 pl-[8vw] pr-[10vw]">
            {HOW_IT_WORKS.map((step, i) => (
              <Panel key={step.key} step={step} index={i} />
            ))}
            <div className="absolute inset-x-0 -bottom-10">
              <Road passed={passed} />
            </div>
          </motion.div>

          {/* The traveller stays put while the road slides beneath it. */}
          <motion.div
            aria-hidden
            className="absolute bottom-0 left-[8vw] z-10 -translate-x-1/2 translate-y-1/2"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="flex size-11 items-center justify-center rounded-full border-2 border-ink-title bg-brand-gradient shadow-[3px_3px_0_0_#141417]">
              <MapPin className="size-5 text-white" aria-hidden />
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

/** Narrow screens: the same panels, stacked. */
const Stack = () => (
  <div className="mx-auto flex max-w-2xl flex-col gap-8 px-5 py-20 sm:px-8">
    <Reveal className="flex flex-col gap-3">
      <span className="w-fit rounded-full bg-brand-surface px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-deep">How it works</span>
      <h2 className="font-display text-4xl font-bold leading-none tracking-[-0.04em] text-ink-title sm:text-5xl">
        From <span className="text-brand-gradient">&ldquo;hey&rdquo;</span> to hello.
      </h2>
    </Reveal>
    {HOW_IT_WORKS.map((step, i) => (
      <Reveal key={step.key}>
        <Panel step={step} index={i} />
      </Reveal>
    ))}
  </div>
)

const HowItWorks = () => {
  const desktop = useIsDesktop()

  return (
    <section id="how-it-works" className="relative scroll-mt-0 bg-neutral-white">
      {desktop ? <Journey /> : <Stack />}
    </section>
  )
}

export default HowItWorks
