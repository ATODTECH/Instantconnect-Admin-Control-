import type { JoinedWithin, KycStatus, UserPlan, UserStatus } from "@/types/admin-users"

export const AVATAR_COLORS = [
  "bg-violet-100 text-violet-700",
  "bg-blue-100 text-blue-700",
  "bg-pink-100 text-pink-700",
  "bg-emerald-100 text-emerald-700",
  "bg-orange-100 text-orange-700",
]

export const STATUS_LABELS: Record<UserStatus, { label: string, style: string }> = {
  active: { label: "Active", style: "bg-[#DCFCE7] text-[#22C55E]" },
  pending_verification: { label: "Pending", style: "bg-[#FFF7ED] text-[#FB923C]" },
  suspended: { label: "Suspended", style: "bg-[#F9E3E3] text-[#991B1B]" },
}

export const KYC_LABELS: Record<KycStatus, { label: string, style: string }> = {
  verified: { label: "Verified", style: "bg-[#FAF5FF] text-[#9333EA]" },
  pending: { label: "Pending", style: "bg-[#FFF7ED] text-[#FB923C]" },
  rejected: { label: "Rejected", style: "bg-[#F4F3F5] text-[#4F4E59]" },
  none: { label: "Not submitted", style: "bg-[#F8FAFC] text-[#83818E]" },
}

export const PLAN_LABELS: Record<UserPlan, string> = {
  free: "Free",
  premium: "Premium",
  business: "Business",
}

/** Each dropdown's first option means "no filter". */
export const STATUS_FILTER = [
  { label: "All Statuses", value: undefined },
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending_verification" },
  { label: "Suspended", value: "suspended" },
] as const satisfies readonly { label: string, value?: UserStatus }[]

export const KYC_FILTER = [
  { label: "All KYC", value: undefined },
  { label: "Verified", value: "verified" },
  { label: "Pending", value: "pending" },
  { label: "Rejected", value: "rejected" },
  { label: "Not submitted", value: "none" },
] as const satisfies readonly { label: string, value?: KycStatus }[]

export const PLAN_FILTER = [
  { label: "All Plans", value: undefined },
  { label: "Free", value: "free" },
  { label: "Premium", value: "premium" },
  { label: "Business", value: "business" },
] as const satisfies readonly { label: string, value?: UserPlan }[]

export const JOINED_FILTER = [
  { label: "All Time", value: undefined },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 90 Days", value: "90d" },
  { label: "Last 6 Months", value: "6m" },
] as const satisfies readonly { label: string, value?: JoinedWithin }[]
