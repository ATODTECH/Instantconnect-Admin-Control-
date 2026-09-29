import type { FilterOption } from "@/components/shared/filter-select"
import type { FilterTab } from "@/components/shared/filter-tabs"
import type { Tone } from "@/lib/tones"
import { CATEGORIES } from "./mock-data"

export const PAGE_SIZE = 8

export const fmtDate = (d: Date | null) =>
  d === null ? "Ongoing" : d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })

export const fmtRevenue = (v: number) => (v === 0 ? "Free" : `NGN ${v.toLocaleString("en-US")}`)

export const STATUS_TONE: Record<EventStatus, Tone> = {
  Upcoming: "success",
  Ongoing: "warning",
  Past: "neutral",
}

export const TYPE_TONE: Record<EventType, Tone> = {
  Paid: "slate",
  Free: "info",
}

export type EventTab = EventStatus | "All Events"

export const TABS: readonly FilterTab<EventTab>[] = [
  { label: "All Events", value: "All Events" },
  { label: "Upcoming", value: "Upcoming" },
  { label: "Ongoing", value: "Ongoing" },
  { label: "Past", value: "Past" },
]

export const TYPE_FILTER: readonly FilterOption<EventType>[] = [
  { label: "All Types" },
  { label: "Paid", value: "Paid" },
  { label: "Free", value: "Free" },
]

export const CATEGORY_FILTER: readonly FilterOption<EventCategory>[] = [
  { label: "All Categories" },
  ...CATEGORIES.map((category) => ({ label: category, value: category })),
]

export type DateRange = "next-30" | "next-90" | "last-30" | "last-90" | "last-180"

export const DATE_FILTER: readonly FilterOption<DateRange>[] = [
  { label: "All time" },
  { label: "Next 30 days", value: "next-30" },
  { label: "Next 3 months", value: "next-90" },
  { label: "Last 30 days", value: "last-30" },
  { label: "Last 3 months", value: "last-90" },
  { label: "Last 6 months", value: "last-180" },
]

/** Days from the anchor date: positive ranges look ahead, negative ones back. */
export const DATE_WINDOW: Record<DateRange, [number, number]> = {
  "next-30": [0, 30],
  "next-90": [0, 90],
  "last-30": [-30, 0],
  "last-90": [-90, 0],
  "last-180": [-180, 0],
}
