import { cn } from "cn"

interface PhoneFrameProps {
  children: React.ReactNode
  className?: string
  /** Classes for the screen inside the bezel, e.g. its background. */
  screenClassName?: string
}

/**
 * A device bezel at the mobile design frame's 393x852 proportions. Size it
 * with a width class; the height follows.
 */
export const PhoneFrame = ({ children, className, screenClassName }: PhoneFrameProps) => (
  <div
    className={cn(
      "relative aspect-393/852 rounded-[2.75rem] bg-ink-title p-2.5 shadow-[0_40px_80px_-20px_rgba(76,29,149,0.45),inset_0_0_0_1.5px_rgba(255,255,255,0.12)]",
      className,
    )}
  >
    <div className={cn("relative h-full w-full overflow-hidden rounded-[2.2rem] bg-neutral-white", screenClassName)}>
      <div aria-hidden className="absolute left-1/2 top-2.5 z-30 h-6 w-[32%] -translate-x-1/2 rounded-full bg-ink-title" />
      {children}
    </div>
  </div>
)
