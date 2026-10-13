import { useId } from "react"

interface LogoMarkProps {
  className?: string
  /** `gradient` is the app tile; `white` is a flat mark for photos and gradients. */
  variant?: "gradient" | "white"
  /** The accessible name. Pass "" when a wordmark beside it already names the brand. */
  title?: string
}

/**
 * The InstantLinkUp mark: a location pin, for meeting people nearby, holding
 * two interlocked rings, for the link up. Kept in sync with
 * `public/brand/logo-mark.svg`.
 */
export const LogoMark = ({ className, variant = "gradient", title = "InstantLinkUp" }: LogoMarkProps) => {
  const id = useId()
  const tile = `${id}-tile`
  const ring = `${id}-ring`
  const isWhite = variant === "white"

  return (
    <svg viewBox="0 0 48 48" className={className} {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true })}>
      <defs>
        <linearGradient id={tile} x1="48" y1="48" x2="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F67B58" />
          <stop offset="0.3" stopColor="#EC4899" />
          <stop offset="0.6" stopColor="#CE41B5" />
          <stop offset="1" stopColor="#9333EA" />
        </linearGradient>
        <linearGradient id={ring} x1="14" y1="16" x2="34" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#9333EA" />
          <stop offset="1" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      {!isWhite && <rect width="48" height="48" rx="13" fill={`url(#${tile})`} />}
      <path
        d="M24 39.5c-.5 0-11.5-9.6-11.5-18.6a11.5 11.5 0 0 1 23 0c0 9-11 18.6-11.5 18.6Z"
        fill="#FFFFFF"
      />
      <g fill="none" strokeWidth="2.6" stroke={isWhite ? "#9333EA" : `url(#${ring})`}>
        <circle cx="20.6" cy="20.8" r="4.4" />
        <circle cx="27.4" cy="20.8" r="4.4" />
        {/* Lift the left ring back over the right one where they cross at the top, so they interlock. */}
        <path d="M22.8 16.99A4.4 4.4 0 0 1 24.73 19.3" stroke="#FFFFFF" strokeWidth="5" />
        <path d="M22.8 16.99A4.4 4.4 0 0 1 24.73 19.3" strokeLinecap="round" />
      </g>
    </svg>
  )
}
