import type { FilterOption } from "@/components/shared/filter-select"
import type { FilterTab } from "@/components/shared/filter-tabs"
import type { Tone } from "@/lib/tones"
import { CATEGORIES } from "./mock-data"

export const PAGE_SIZE = 8

export const fmtDate = (d: Date | null) =>
  d === null ? "--" : d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })

export const STATUS_TONE: Record<CommunityStatus, Tone> = {
  Active: "success",
  Inactive: "neutral",
  Reported: "danger",
}

export const CATEGORY_TONE: Record<CommunityCategory, Tone> = {
  Business: "success",
  Education: "brand",
  Health: "success",
  Social: "warning",
  Technology: "info",
}

export type CommunityTab = CommunityStatus | "All"

export const TABS: readonly FilterTab<CommunityTab>[] = [
  { label: "All", value: "All" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
  { label: "Reported", value: "Reported" },
]

export const CATEGORY_FILTER: readonly FilterOption<CommunityCategory>[] = [
  { label: "Category: All" },
  ...CATEGORIES.map((category) => ({ label: category, value: category as CommunityCategory })),
]

export type MemberRange = "0-50" | "51-200" | "201-500" | "501-1000" | "1001+"

export const SIZE_FILTER: readonly FilterOption<MemberRange>[] = [
  { label: "Size: All" },
  { label: "0 to 50", value: "0-50" },
  { label: "51 to 200", value: "51-200" },
  { label: "201 to 500", value: "201-500" },
  { label: "501 to 1000", value: "501-1000" },
  { label: "Upwards", value: "1001+" },
]

export const MEMBER_BOUNDS: Record<MemberRange, [number, number]> = {
  "0-50": [0, 50],
  "51-200": [51, 200],
  "201-500": [201, 500],
  "501-1000": [501, 1000],
  "1001+": [1001, Number.POSITIVE_INFINITY],
}
