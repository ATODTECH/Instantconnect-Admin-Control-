"use client"

import { MotionConfig } from "motion/react"

/** Visitors who ask for reduced motion get the content without the movement. */
export const MotionProvider = ({ children }: { children: React.ReactNode }) => (
  <MotionConfig reducedMotion="user">{children}</MotionConfig>
)
