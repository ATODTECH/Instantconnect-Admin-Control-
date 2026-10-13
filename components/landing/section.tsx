import { cn } from "cn"

/** The page's content column: centred, capped and padded the same everywhere. */
export const Container = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("mx-auto w-full max-w-7xl px-5 sm:px-8", className)}>{children}</div>
)

interface SectionProps {
  id?: string
  children: React.ReactNode
  className?: string
  /** Classes for the inner `Container`, for sections that need a narrower column. */
  containerClassName?: string
}

/** A full-width band of the landing page with its own anchor and spacing. */
export const Section = ({ id, children, className, containerClassName }: SectionProps) => (
  <section id={id} className={cn("relative scroll-mt-20 py-20 sm:py-28", className)}>
    <Container className={containerClassName}>{children}</Container>
  </section>
)
