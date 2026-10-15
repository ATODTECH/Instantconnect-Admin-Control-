export type UserStatus = "pending_verification" | "active" | "suspended"
export type KycStatus = "none" | "pending" | "verified" | "rejected"
export type UserPlan = "free" | "plus"
export type JoinedWithin = "30d" | "90d" | "6m"

export interface AdminUserFilters {
  search?: string
  status?: UserStatus
  kycStatus?: KycStatus
  plan?: UserPlan
  joinedWithin?: JoinedWithin
}

export interface AdminUserRow {
  id: string
  fullName: string
  email: string
  avatarUrl: string | null
  status: UserStatus
  kycStatus: KycStatus
  plan: UserPlan
  eventsAttended: number
  joinedAt: string
}

export interface AdminUserPage {
  items: AdminUserRow[]
  page: { total: number, limit: number, offset: number }
}

export interface AdminUserDetail extends AdminUserRow {
  phone: string
  username: string | null
  dateOfBirth: string | null
  location: string | null
  lastActiveAt: string | null
  stats: { eventsAttended: number, eventsCreated: number, connections: number }
}

export interface MessageUserInput {
  subject: string
  body: string
}
