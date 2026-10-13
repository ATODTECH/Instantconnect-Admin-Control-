"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { PEOPLE } from "../screens/parts"

type Ring = {
  /** Diameter as a share of the hero's phone column. */
  size: string
  duration: number
  reverse?: boolean
  avatars: { src: string, angle: number, px: number }[]
}

/**
 * The onboarding slide's orbit, at hero scale: people circling the phone on
 * two dashed rings, each avatar counter-rotated so it stays upright.
 */
const RINGS: Ring[] = [
  {
    size: "min(30rem, 108vw)",
    duration: 60,
    avatars: [
      { src: PEOPLE.zara.photo, angle: 20, px: 52 },
      { src: PEOPLE.seun.photo, angle: 150, px: 44 },
      { src: PEOPLE.amara.photo, angle: 260, px: 38 },
    ],
  },
  {
    size: "min(40rem, 140vw)",
    duration: 90,
    reverse: true,
    avatars: [
      { src: PEOPLE.david.photo, angle: 80, px: 46 },
      { src: PEOPLE.kemi.photo, angle: 210, px: 40 },
      { src: PEOPLE.tobi.photo, angle: 320, px: 34 },
    ],
  },
]

const Orbit = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
    {RINGS.map((ring, r) => {
      const turn = ring.reverse ? -360 : 360

      return (
        <motion.div
          key={r}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1, rotate: turn }}
          transition={{
            opacity: { duration: 1, delay: 0.4 + r * 0.2 },
            scale: { duration: 1.2, delay: 0.4 + r * 0.2, ease: [0.22, 1, 0.36, 1] },
            rotate: { duration: ring.duration, repeat: Infinity, ease: "linear" },
          }}
          className="absolute rounded-full border-2 border-dashed border-white/35"
          style={{ width: ring.size, height: ring.size }}
        >
          {ring.avatars.map((avatar) => (
            <div
              key={avatar.src}
              className="absolute left-1/2 top-1/2"
              style={{ transform: `rotate(${avatar.angle}deg) translateY(calc(${ring.size} / -2)) rotate(${-avatar.angle}deg)` }}
            >
              <div className="-translate-x-1/2 -translate-y-1/2">
                <motion.div animate={{ rotate: -turn }} transition={{ duration: ring.duration, repeat: Infinity, ease: "linear" }}>
                  <Image
                    src={avatar.src}
                    alt=""
                    width={avatar.px * 2}
                    height={avatar.px * 2}
                    className="rounded-full object-cover ring-[3px] ring-white shadow-xl"
                    style={{ width: avatar.px, height: avatar.px }}
                  />
                </motion.div>
              </div>
            </div>
          ))}
        </motion.div>
      )
    })}
  </div>
)

export default Orbit
