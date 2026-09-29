import type { Tone } from "@/lib/tones"
import type { FilterOption } from "@/components/shared/filter-select"
import type { JoinedWithin, KycStatus, UserPlan, UserStatus } from "@/types/admin-users"

export const STATUS_LABELS: Record<UserStatus, { label: string, tone: Tone }> = {
  active: { label: "Active", tone: "success" },
  pending_verification: { label: "Pending", tone: "warning" },
  suspended: { label: "Disabled", tone: "danger" },
}

export const KYC_LABELS: Record<KycStatus, { label: string, tone: Tone }> = {
  verified: { label: "Verified", tone: "brand" },
  pending: { label: "Pending", tone: "warning" },
  rejected: { label: "Rejected", tone: "neutral" },
  none: { label: "Not submitted", tone: "neutral" },
}

export const PLAN_LABELS: Record<UserPlan, string> = {
  free: "Free",
  premium: "Premium",
  business: "Business",
}

export const STATUS_FILTER: readonly FilterOption<UserStatus>[] = [
  { label: "All Statuses" },
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending_verification" },
  { label: "Disabled", value: "suspended" },
]

export const KYC_FILTER: readonly FilterOption<KycStatus>[] = [
  { label: "All KYC" },
  { label: "Verified", value: "verified" },
  { label: "Pending", value: "pending" },
  { label: "Rejected", value: "rejected" },
  { label: "Not submitted", value: "none" },
]

export const PLAN_FILTER: readonly FilterOption<UserPlan>[] = [
  { label: "All Plans" },
  { label: "Free", value: "free" },
  { label: "Premium", value: "premium" },
  { label: "Business", value: "business" },
]

export const JOINED_FILTER: readonly FilterOption<JoinedWithin>[] = [
  { label: "All Time" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 90 Days", value: "90d" },
  { label: "Last 6 Months", value: "6m" },
]
