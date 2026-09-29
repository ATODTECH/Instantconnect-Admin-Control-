import { cn } from "cn"
import { TONE_STYLES, type Tone } from "@/lib/tones"

/** A titled block inside a detail panel. */
export const DetailSection = ({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) => (
  <section className={className}>
    <h4 className="mb-1.5 text-xs font-semibold uppercase text-primary">{title}</h4>
    {children}
  </section>
)

/** One "label: value" line; shows "Not provided" when the value is empty. */
export const DetailRow = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="flex justify-between gap-2 border-b-[.5px] border-b-[#F4F3F5] py-2.5 text-sm text-neutral-light-300">
    <span className="font-medium">{label}</span>
    <span className="text-right font-semibold text-neutral-light-500">{children ?? "Not provided"}</span>
  </div>
)

interface MetricTileProps {
  label: string
  value: React.ReactNode
  note?: { label: string, tone: Tone }
  className?: string
}

/** A small figure in a detail panel, e.g. members or posts this week. */
export const MetricTile = ({ label, value, note, className }: MetricTileProps) => (
  <div className={cn("flex min-h-20.5 flex-col gap-1 rounded-xl border border-primary-border bg-[#FAF9FB] p-3", className)}>
    <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-light-300">{label}</span>
    <span className="text-xl font-bold tracking-wide text-neutral-light-600">{value}</span>
    {note && <span className={cn("text-[11px] font-medium", TONE_STYLES[note.tone].text)}>{note.label}</span>}
  </div>
)
