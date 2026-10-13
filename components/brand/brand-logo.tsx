import { cn } from "cn"
import { LogoMark } from "./logo-mark"

export const BRAND_NAME = "InstantLinkUp"

interface BrandLogoProps {
  /** `light` for light text on dark or gradient surfaces. */
  tone?: "light" | "dark"
  size?: "sm" | "md" | "lg"
  className?: string
}

const SIZES = {
  sm: { mark: "size-7", text: "text-lg" },
  md: { mark: "size-9", text: "text-[1.4rem]" },
  lg: { mark: "size-12", text: "text-3xl" },
} as const

/** The mark beside the wordmark, set in the mobile app's Abyssinica SIL. */
export const BrandLogo = ({ tone = "dark", size = "md", className }: BrandLogoProps) => (
  <span className={cn("inline-flex items-center gap-2.5", className)}>
    <LogoMark
      title=""
      className={cn(
        "shrink-0 rounded-[27%] drop-shadow-[0_4px_12px_rgba(147,51,234,0.35)]",
        // On the gradient the tile needs an edge to stand off it.
        tone === "light" && "ring-2 ring-white/50",
        SIZES[size].mark,
      )}
    />
    <span className={cn("font-brand leading-none tracking-[-0.01em]", SIZES[size].text, tone === "light" ? "text-neutral-white" : "text-ink-title")}>
      Instant<span className={tone === "light" ? "text-neutral-white" : "text-brand"}>LinkUp</span>
    </span>
  </span>
)
