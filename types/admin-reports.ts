export type UserReportReason =
  | "harassment"
  | "fake_profile"
  | "spam"
  | "inappropriate_content"
  | "safety_concern"
  | "underage"
  | "other"

export type UserReportSource = "profile" | "chat"

export type UserReportStatus = "open" | "dismissed" | "resolved"

export type MemberStatus = "pending_verification" | "active" | "suspended"

export interface UserReportParty {
  id: string
  fullName: string
  email: string
  status: MemberStatus
}

export interface UserReport {
  id: string
  reporter: UserReportParty
  reportedUser: UserReportParty
  /** Open reports against the reported member, from anyone. */
  openReportsAgainst: number
  reason: UserReportReason
  details: string | null
  source: UserReportSource
  status: UserReportStatus
  createdAt: string
  reviewedAt: string | null
}

export interface UserReportPage {
  items: UserReport[]
  page: { total: number, limit: number, offset: number }
}
