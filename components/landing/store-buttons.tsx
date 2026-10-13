import { cn } from "cn"

const AppleGlyph = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.65.8-3.33.8-.7 0-1.75-.78-2.88-.76-1.48.02-2.85.86-3.61 2.19-1.54 2.67-.4 6.62 1.1 8.79.74 1.06 1.61 2.25 2.75 2.2 1.1-.04 1.52-.71 2.86-.71 1.33 0 1.71.71 2.87.69 1.19-.02 1.94-1.07 2.66-2.14.85-1.23 1.19-2.43 1.21-2.49-.03-.01-2.31-.89-2.33-3.53ZM14.2 6.13c.6-.74 1.01-1.75.9-2.77-.87.04-1.94.59-2.56 1.32-.56.64-1.05 1.69-.92 2.68.98.08 1.97-.49 2.58-1.23Z" />
  </svg>
)

const PlayGlyph = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path d="M3.6 2.3 13.4 12l-9.8 9.7c-.35-.2-.6-.6-.6-1.1V3.4c0-.5.25-.9.6-1.1Z" fill="#32BBFF" />
    <path d="m16.8 8.6-3.4 3.4-9.8-9.7c.3-.17.68-.2 1.05 0l12.15 6.3Z" fill="#00F076" />
    <path d="M16.8 15.4 4.65 21.7c-.37.2-.75.17-1.05 0l9.8-9.7 3.4 3.4Z" fill="#FF3A44" />
    <path d="m20.3 10.4-3.5-1.8-3.4 3.4 3.4 3.4 3.5-1.8c.9-.48.9-2.72 0-3.2Z" fill="#FFD109" />
  </svg>
)

const STORES = {
  apple: { Glyph: AppleGlyph, overline: "Download on the", label: "App Store" },
  google: { Glyph: PlayGlyph, overline: "Get it on", label: "Google Play" },
} as const

export type Store = keyof typeof STORES

interface StoreButtonProps {
  store: Store
  /** The listing. Without one the badge reads "Coming soon" and is not a link. */
  href?: string | null
  /** `light` is a white badge for dark or gradient surfaces. */
  tone?: "light" | "dark"
  className?: string
}

export const StoreButton = ({ store, href, tone = "dark", className }: StoreButtonProps) => {
  const { Glyph, overline, label } = STORES[store]
  const classes = cn(
    "group inline-flex h-14 items-center gap-3 rounded-2xl px-5 transition-all duration-300",
    tone === "dark"
      ? "bg-ink-title text-neutral-white hover:bg-black"
      : "bg-neutral-white text-ink-title shadow-[0_10px_30px_-10px_rgba(20,20,23,0.35)] hover:-translate-y-0.5",
    !href && "cursor-default",
    className,
  )
  const content = (
    <>
      <Glyph className="size-7 shrink-0" />
      <span className="flex flex-col items-start leading-none">
        <span className="text-[11px] font-medium opacity-70">{href ? overline : "Coming soon to"}</span>
        <span className="mt-1 text-lg font-semibold tracking-tight">{label}</span>
      </span>
    </>
  )

  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className={classes}>{content}</a>
  ) : (
    <span className={classes} aria-label={`${label}, coming soon`}>{content}</span>
  )
}

interface StoreButtonsProps {
  links: Record<Store, string | null>
  tone?: "light" | "dark"
  className?: string
}

export const StoreButtons = ({ links, tone, className }: StoreButtonsProps) => (
  <div className={cn("flex flex-wrap items-center gap-3", className)}>
    <StoreButton store="apple" href={links.apple} tone={tone} />
    <StoreButton store="google" href={links.google} tone={tone} />
  </div>
)
