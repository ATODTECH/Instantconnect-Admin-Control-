import { cn } from "cn"

interface MarqueeProps {
  items: readonly string[]
  className?: string
  /** Drawn between items. */
  separator?: React.ReactNode
}

/** An endless strip of words. The list is doubled so the loop has no seam. */
export const Marquee = ({ items, className, separator = "✦" }: MarqueeProps) => (
  <div className={cn("relative flex overflow-hidden mask-[linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]", className)}>
    <div className="flex w-max shrink-0 animate-marquee items-center motion-reduce:animate-none">
      {[...items, ...items].map((item, i) => (
        <span key={i} className="flex items-center" aria-hidden={i >= items.length}>
          <span className="whitespace-nowrap px-6">{item}</span>
          <span className="text-brand-soft">{separator}</span>
        </span>
      ))}
    </div>
  </div>
)
