import type { FilterOption } from "@/components/shared/filter-select"
import type { FilterTab } from "@/components/shared/filter-tabs"
import type { Tone } from "@/lib/tones"
import type { AdminCommunitySize, AdminCommunityStatus } from "@/types/admin-communities"

export type CommunityTab = AdminCommunityStatus | "all"

export const COMMUNITY_TABS: readonly FilterTab<CommunityTab>[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Reported", value: "reported" },
]

export const STATUS_LABELS: Record<AdminCommunityStatus, { label: string, tone: Tone }> = {
  active: { label: "Active", tone: "success" },
  inactive: { label: "Inactive", tone: "neutral" },
  reported: { label: "Reported", tone: "danger" },
}

export const SIZE_FILTER: readonly FilterOption<AdminCommunitySize>[] = [
  { label: "Size: All" },
  { label: "Small (under 50)", value: "small" },
  { label: "Medium (50 to 499)", value: "medium" },
  { label: "Large (500+)", value: "large" },
]

/** The design colours each category's chip; unknown ones read as slate. */
const CATEGORY_TONES: Record<string, Tone> = {
  talents: "brand",
  business: "success",
  friendship: "warning",
  social: "info",
  general: "slate",
}

export const categoryTone = (categoryId: string | null): Tone => (categoryId && CATEGORY_TONES[categoryId]) || "slate"

const INITIAL_COLOURS = ["bg-[#3B82F6]", "bg-[#22C55E]", "bg-[#8B5CF6]", "bg-[#EF4444]", "bg-[#F97316]", "bg-[#06B6D4]", "bg-[#475569]"]

/** The same community always gets the same colour for its initial. */
export const initialColour = (id: string) => {
  let hash = 0
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return INITIAL_COLOURS[hash % INITIAL_COLOURS.length]
}
