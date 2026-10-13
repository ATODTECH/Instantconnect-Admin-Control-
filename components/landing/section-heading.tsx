import { cn } from "cn"
import { Reveal } from "./reveal"

interface SectionHeadingProps {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  align?: "left" | "center"
  /** `dark` sets light text for sections on the navy surface. */
  tone?: "light" | "dark"
  className?: string
}

export const SectionHeading = ({ eyebrow, title, description, align = "center", tone = "light", className }: SectionHeadingProps) => (
  <Reveal className={cn("flex flex-col gap-4", align === "center" ? "mx-auto max-w-2xl items-center text-center" : "max-w-xl items-start", className)}>
    {eyebrow && (
      <span
        className={cn(
          "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]",
          tone === "dark" ? "bg-white/10 text-brand-soft" : "bg-brand-surface text-brand-deep",
        )}
      >
        {eyebrow}
      </span>
    )}
    <h2
      className={cn(
        "text-balance text-3xl font-bold leading-[1.1] tracking-tight sm:text-5xl",
        tone === "dark" ? "text-neutral-white" : "text-ink-title",
      )}
    >
      {title}
    </h2>
    {description && (
      <p className={cn("text-pretty text-base leading-relaxed sm:text-lg", tone === "dark" ? "text-ic-muted" : "text-ink-muted")}>
        {description}
      </p>
    )}
  </Reveal>
)
