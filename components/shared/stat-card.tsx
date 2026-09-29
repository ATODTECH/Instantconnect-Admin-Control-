import { cn } from "cn"
import { Skeleton } from "@/components/ui/skeleton"
import { TONE_STYLES, type Tone } from "@/lib/tones"

const CARD = "flex flex-col justify-between gap-4 h-full min-h-29.25 p-6 rounded-2xl border-[0.5px] border-[#E4E7EC] bg-neutral-white"

interface StatCardProps {
  title: string
  value: React.ReactNode
  /** Colours the dot beside the title. Ignored when `aside` is given. */
  tone?: Tone
  /** Replaces the dot, e.g. with a percentage change badge. */
  aside?: React.ReactNode
  note?: { label: string, tone: Tone }
  /** `inline` puts the note beside the value, `below` under it. */
  noteLayout?: "inline" | "below"
  /** Full value for a tooltip when the displayed one is abbreviated. */
  valueTitle?: string
  className?: string
}

export const StatCard = ({ title, value, tone = "brand", aside, note, noteLayout = "below", valueTitle, className }: StatCardProps) => (
  <div className={cn(CARD, className)}>
    <div className="flex justify-between items-center w-full gap-2">
      <span className="text-sm font-medium text-neutral-light-400">{title}</span>
      {aside ?? <span aria-hidden className={cn("shrink-0 rounded-full h-2 w-2", TONE_STYLES[tone].dot)} />}
    </div>
    <div className={cn("flex min-w-0", noteLayout === "inline" ? "items-end gap-4" : "flex-col items-start gap-2")}>
      <span title={valueTitle} className="w-full truncate text-[2rem] font-bold leading-[100%] text-neutral-light-600">
        {value}
      </span>
      {note && (
        <span className={cn("shrink-0 truncate rounded-sm px-1.5 py-0.5 text-[11px] font-semibold", TONE_STYLES[note.tone].chip)}>
          {note.label}
        </span>
      )}
    </div>
  </div>
)

export const StatCardSkeleton = ({ className }: { className?: string }) => (
  <div aria-hidden className={cn(CARD, className)}>
    <div className="flex justify-between items-center w-full">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-2 w-2 rounded-full" />
    </div>
    <Skeleton className="h-8 w-28" />
  </div>
)
