"use client"

import { motion, type Variants } from "motion/react"
import { cn } from "cn"

const EASE = [0.22, 1, 0.36, 1] as const

const ITEM: Variants = {
  hidden: { opacity: 0, y: 28 },
  shown: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay } }),
}

interface RevealProps {
  children: React.ReactNode
  className?: string
  /** Seconds to wait once the block scrolls into view. */
  delay?: number
  as?: "div" | "li" | "span"
}

/** Fades and lifts its children in the first time they scroll into view. */
export const Reveal = ({ children, className, delay = 0, as = "div" }: RevealProps) => {
  const Comp = motion[as]

  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      variants={ITEM}
      custom={delay}
    >
      {children}
    </Comp>
  )
}

interface RevealGroupProps {
  children: React.ReactNode
  className?: string
  /** Seconds between one child and the next. */
  stagger?: number
  as?: "div" | "ul"
}

/** Reveals each `RevealItem` inside it in turn. */
export const RevealGroup = ({ children, className, stagger = 0.08, as = "div" }: RevealGroupProps) => {
  const Comp = motion[as]

  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      variants={{ hidden: {}, shown: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </Comp>
  )
}

export const RevealItem = ({ children, className, as = "div" }: Omit<RevealProps, "delay">) => {
  const Comp = motion[as]

  return (
    <Comp className={cn(className)} variants={ITEM}>
      {children}
    </Comp>
  )
}
