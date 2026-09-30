import type { Tone } from "@/lib/tones"
import type { FilterTab } from "@/components/shared/filter-tabs"
import type { KinRelationship, KycAdditionalIdKind, KycSubmissionCounts, KycSubmissionStatus } from "@/types/admin-kyc"

export type KycTab = KycSubmissionStatus | "all"

export const KYC_STATUS_LABELS: Record<KycSubmissionStatus, { label: string, tone: Tone }> = {
  pending: { label: "Pending", tone: "warning" },
  approved: { label: "Verified", tone: "success" },
  rejected: { label: "Rejected", tone: "neutral" },
}

export const ADDITIONAL_ID_LABELS: Record<KycAdditionalIdKind, string> = {
  passport: "International Passport",
  drivers_license: "Driver's License",
}

export const KIN_LABELS: Record<KinRelationship, string> = {
  parent: "Parent",
  sibling: "Sibling",
  spouse: "Spouse",
  child: "Child",
  guardian: "Guardian",
  relative: "Relative",
}

export const kycTabs = (counts?: KycSubmissionCounts): FilterTab<KycTab>[] => [
  { label: "All Submissions", value: "all", count: counts?.all },
  { label: "Pending", value: "pending", count: counts?.pending },
  { label: "Verified", value: "approved", count: counts?.approved },
  { label: "Rejected", value: "rejected", count: counts?.rejected },
]

export type Priority = "High" | "Medium" | "Low"

const HOUR = 60 * 60 * 1000

/** How long a pending submission has waited: past two days is High, past one Medium. */
export const priorityOf = (submittedAt: string, now = Date.now()): Priority => {
  const waited = now - new Date(submittedAt).getTime()
  if (waited >= 48 * HOUR) return "High"
  if (waited >= 24 * HOUR) return "Medium"
  return "Low"
}

export const PRIORITY_TONE: Record<Priority, Tone> = {
  High: "danger",
  Medium: "brand",
  Low: "neutral",
}

const DAY = new Intl.DateTimeFormat("en-NG", { day: "2-digit", month: "short", year: "numeric", timeZone: "Africa/Lagos" })
export const formatDay = (iso: string) => DAY.format(new Date(iso))
