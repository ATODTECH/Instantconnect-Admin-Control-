import { cn } from "cn"
import { Badge } from "@/components/ui/badge"
import { TONE_STYLES, type Tone } from "@/lib/tones"

interface StatusBadgeProps {
  tone: Tone
  children: React.ReactNode
  className?: string
}

/** The coloured chip for any status, type or category in a table or panel. */
export const StatusBadge = ({ tone, children, className }: StatusBadgeProps) => (
  <Badge className={cn("h-6 rounded-md px-2.5 text-[11px] font-semibold", TONE_STYLES[tone].chip, className)}>
    {children}
  </Badge>
)
