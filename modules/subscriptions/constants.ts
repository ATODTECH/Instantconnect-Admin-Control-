import type { FilterOption } from "@/components/shared/filter-select"
import type { FilterTab } from "@/components/shared/filter-tabs"
import type { Tone } from "@/lib/tones"

export const PAGE_SIZE = 8

export const fmtDate = (d: Date | null) =>
  d === null ? "--" : d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })

export const fmtNaira = (amount: number) => `₦${new Intl.NumberFormat("en-NG").format(amount)}`

export const STATUS_TONE: Record<SubscriptionStatus, Tone> = {
  Active: "success",
  Expired: "neutral",
  Failed: "danger",
  Cancelled: "warning",
}

export const PLAN_TONE: Record<Plan, Tone> = {
  Business: "brand",
  Free: "success",
  Premium: "info",
}

export type SubscriptionTab = SubscriptionStatus | "All"

export const TABS: readonly FilterTab<SubscriptionTab>[] = [
  { label: "All", value: "All" },
  { label: "Active", value: "Active" },
  { label: "Expired", value: "Expired" },
  { label: "Failed", value: "Failed" },
  { label: "Cancelled", value: "Cancelled" },
]

export const PLAN_FILTER: readonly FilterOption<Plan>[] = [
  { label: "All plans" },
  { label: "Free", value: "Free" },
  { label: "Premium", value: "Premium" },
  { label: "Business", value: "Business" },
]

export type StartedWithin = "30" | "90" | "180"

export const DATE_FILTER: readonly FilterOption<StartedWithin>[] = [
  { label: "All time" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 3 months", value: "90" },
  { label: "Last 6 months", value: "180" },
]
