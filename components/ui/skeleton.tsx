import { cn } from "cn"

/** Brand-tinted placeholder; the sweep stops for people who asked for less motion. */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn(
        "rounded-md bg-brand-surface bg-[linear-gradient(90deg,transparent_0%,var(--color-brand-surface-subtle)_50%,transparent_100%)] bg-size-[200%_100%] bg-no-repeat animate-shimmer motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
