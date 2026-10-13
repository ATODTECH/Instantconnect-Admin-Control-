import type { LucideIcon } from "lucide-react"
import { cn } from "cn"

export type Tone = "peach" | "sky" | "mint" | "blush" | "lilac"

/** The mobile app's category tones: a pale disc with a tinted icon. */
export const TONES: Record<Tone, string> = {
  peach: "bg-tone-peach text-tone-peach-icon",
  sky: "bg-tone-sky text-tone-sky-icon",
  mint: "bg-tone-mint text-tone-mint-icon",
  blush: "bg-tone-blush text-tone-blush-icon",
  lilac: "bg-tone-lilac text-tone-lilac-icon",
}

interface IconBadgeProps {
  icon: LucideIcon
  tone?: Tone
  /** `glass` is a translucent badge for the navy and gradient surfaces. */
  variant?: "tone" | "glass"
  className?: string
}

export const IconBadge = ({ icon: Icon, tone = "lilac", variant = "tone", className }: IconBadgeProps) => (
  <span
    className={cn(
      "inline-flex size-12 shrink-0 items-center justify-center rounded-2xl",
      variant === "glass" ? "bg-white/10 text-brand-soft ring-1 ring-white/15" : TONES[tone],
      className,
    )}
  >
    <Icon className="size-5.5" strokeWidth={2} aria-hidden />
  </span>
)

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  body: string
  tone?: Tone
  /** `dark` for cards on the navy safety section. */
  surface?: "light" | "dark"
  className?: string
  children?: React.ReactNode
}

export const FeatureCard = ({ icon, title, body, tone, surface = "light", className, children }: FeatureCardProps) => (
  <div
    className={cn(
      "group relative flex h-full flex-col gap-4 overflow-hidden rounded-3xl p-6 transition-all duration-300 sm:p-7",
      surface === "dark"
        ? "bg-white/[0.04] ring-1 ring-white/10 hover:bg-white/[0.07]"
        : "bg-neutral-white ring-1 ring-ink-border hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(147,51,234,0.35)]",
      className,
    )}
  >
    <IconBadge icon={icon} tone={tone} variant={surface === "dark" ? "glass" : "tone"} />
    <div className="flex flex-col gap-2">
      <h3 className={cn("text-lg font-semibold tracking-tight", surface === "dark" ? "text-neutral-white" : "text-ink-title")}>{title}</h3>
      <p className={cn("text-[0.95rem] leading-relaxed", surface === "dark" ? "text-ic-muted" : "text-ink-muted")}>{body}</p>
    </div>
    {children}
  </div>
)
