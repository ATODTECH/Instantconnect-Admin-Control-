import type { FilterOption } from "@/components/shared/filter-select"
import type { FilterTab } from "@/components/shared/filter-tabs"
import type { Tone } from "@/lib/tones"
import type { AdminEventCounts, AdminEventStatus, AdminEventType, AdminEventWindow } from "@/types/admin-events"

export type EventTab = AdminEventStatus | "all"

export const STATUS_LABELS: Record<AdminEventStatus, { label: string, tone: Tone }> = {
  upcoming: { label: "Upcoming", tone: "success" },
  ongoing: { label: "Ongoing", tone: "warning" },
  past: { label: "Past", tone: "neutral" },
}

export const eventTabs = (counts?: AdminEventCounts): FilterTab<EventTab>[] => [
  { label: "All Events", value: "all", count: counts?.all },
  { label: "Upcoming", value: "upcoming", count: counts?.upcoming },
  { label: "Ongoing", value: "ongoing", count: counts?.ongoing },
  { label: "Past", value: "past", count: counts?.past },
]

export const TYPE_FILTER: readonly FilterOption<AdminEventType>[] = [
  { label: "All Types" },
  { label: "Paid", value: "paid" },
  { label: "Free", value: "free" },
]

export const WINDOW_FILTER: readonly FilterOption<AdminEventWindow>[] = [
  { label: "All time" },
  { label: "Next 30 days", value: "next30d" },
  { label: "Next 3 months", value: "next90d" },
  { label: "Last 30 days", value: "last30d" },
  { label: "Last 3 months", value: "last90d" },
  { label: "Last 6 months", value: "last180d" },
]

const DAY = new Intl.DateTimeFormat("en-NG", { day: "2-digit", month: "short", year: "numeric", timeZone: "Africa/Lagos" })
const TIME = new Intl.DateTimeFormat("en-NG", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Africa/Lagos" })

export const formatDay = (iso: string) => DAY.format(new Date(iso))
export const formatTime = (iso: string) => TIME.format(new Date(iso))

const NAIRA = new Intl.NumberFormat("en-NG", { maximumFractionDigits: 2 })

/** Kobo in, the full figure out: "Free" for zero. */
export const formatPrice = (minor: number) => (minor === 0 ? "Free" : `NGN ${NAIRA.format(minor / 100)}`)
