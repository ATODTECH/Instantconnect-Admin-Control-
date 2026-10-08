import type { FilterTab } from "@/components/shared/filter-tabs"
import type { Tone } from "@/lib/tones"
import type { MemberStatus, UserReportReason, UserReportSource, UserReportStatus } from "@/types/admin-reports"

export const REASON_LABELS: Record<UserReportReason, string> = {
  harassment: "Harassment or bullying",
  fake_profile: "Fake profile",
  spam: "Spam or scam",
  inappropriate_content: "Inappropriate content",
  safety_concern: "Safety concern",
  underage: "Under 18",
  other: "Other",
}

/** Reasons that put someone at risk come first in the reviewer's eye. */
export const REASON_TONE: Record<UserReportReason, Tone> = {
  harassment: "danger",
  safety_concern: "danger",
  underage: "danger",
  fake_profile: "warning",
  inappropriate_content: "warning",
  spam: "neutral",
  other: "neutral",
}

export const SOURCE_LABELS: Record<UserReportSource, string> = {
  profile: "Profile",
  chat: "Chat",
}

export const MEMBER_STATUS: Record<MemberStatus, { label: string, tone: Tone }> = {
  active: { label: "Active", tone: "success" },
  suspended: { label: "Disabled", tone: "neutral" },
  pending_verification: { label: "Unverified", tone: "warning" },
}

export const reportTabs: FilterTab<UserReportStatus>[] = [
  { label: "Open", value: "open" },
  { label: "Actioned", value: "resolved" },
  { label: "Dismissed", value: "dismissed" },
]

export const formatDay = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
