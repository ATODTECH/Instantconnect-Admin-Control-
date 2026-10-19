import { useId } from "react"
import { cn } from "cn"
import { BRAND_PURPLE, HEAD_GRADIENT, HEAD_RADIUS, HEADS, MARK_BODY_PATH, MARK_VIEW_BOX } from "./logo-paths"

interface LogoMarkProps {
  className?: string
  /**
   * `color` is the approved logo on its own; `tile` sets it on a white rounded
   * square for dark surfaces; `white` is a flat mark for photos and gradients.
   */
  variant?: "color" | "tile" | "white"
  /** The accessible name. Pass "" when a wordmark beside it already names the brand. */
  title?: string
}

/**
 * The InstantLinkUp mark: two people, their bodies joined in an "ic". Kept in
 * sync with `public/brand/logo-mark.svg`.
 */
export const LogoMark = ({ className, variant = "color", title = "InstantLinkUp" }: LogoMarkProps) => {
  const gradient = `${useId()}-head`
  const isWhite = variant === "white"
  const a11y = title ? { role: "img", "aria-label": title } : { "aria-hidden": true }

  const svg = (
    <svg viewBox={MARK_VIEW_BOX} className={variant === "tile" ? "size-[72%]" : className} {...(variant === "tile" ? { "aria-hidden": true } : a11y)}>
      {!isWhite && (
        <defs>
          <linearGradient id={gradient} x1="0.05" y1="0.3" x2="0.95" y2="0.7">
            {HEAD_GRADIENT.map(({ offset, color }) => (
              <stop key={offset} offset={offset} stopColor={color} />
            ))}
          </linearGradient>
        </defs>
      )}
      {HEADS.map(({ cx, cy }) => (
        <circle key={cx} cx={cx} cy={cy} r={HEAD_RADIUS} fill={isWhite ? "#FFFFFF" : `url(#${gradient})`} />
      ))}
      <path d={MARK_BODY_PATH} fill={isWhite ? "#FFFFFF" : BRAND_PURPLE} />
    </svg>
  )

  if (variant !== "tile") return svg

  return (
    <span className={cn("inline-flex shrink-0 items-center justify-center rounded-[27%] bg-white", className)} {...a11y}>
      {svg}
    </span>
  )
}
