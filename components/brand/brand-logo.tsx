import { cn } from "cn"
import { LogoMark } from "./logo-mark"
import { BRAND_PURPLE, WORDMARK_PATH, WORDMARK_VIEW_BOX } from "./logo-paths"

export const BRAND_NAME = "InstantLinkUp"

interface BrandLogoProps {
  /** `light` for a white logo on dark or gradient surfaces. */
  tone?: "light" | "dark"
  size?: "sm" | "md" | "lg"
  className?: string
}

const SIZES = {
  sm: { mark: "size-8", text: "h-[1.15rem]" },
  md: { mark: "size-10", text: "h-6" },
  lg: { mark: "size-14", text: "h-8" },
} as const

/** The approved mark beside the approved wordmark, for horizontal spaces. */
export const BrandLogo = ({ tone = "dark", size = "md", className }: BrandLogoProps) => (
  <span role="img" aria-label={BRAND_NAME} className={cn("inline-flex items-center gap-2", className)}>
    <LogoMark title="" variant={tone === "light" ? "white" : "color"} className={cn("shrink-0", SIZES[size].mark)} />
    <svg viewBox={WORDMARK_VIEW_BOX} aria-hidden className={cn("w-auto", SIZES[size].text)}>
      <path d={WORDMARK_PATH} fill={tone === "light" ? "#FFFFFF" : BRAND_PURPLE} />
    </svg>
  </span>
)
