export interface CountStat {
  value: number
  /** Against 30 days ago; null when there was nothing to compare with. */
  changePct: number | null
}

export interface DashboardStats {
  totalUsers: CountStat
  activeEvents: CountStat
  revenue: { amountMinor: number, currency: string, changePct: number | null }
  pendingKyc: { value: number }
}

export interface UserGrowth {
  points: { month: string, newUsers: number }[]
}

export interface EventsByCategory {
  total: number
  categories: { categoryId: string | null, label: string, count: number, percentage: number }[]
}

export type ActivityStatus = "successful" | "completed" | "pending" | "approved" | "rejected"

export interface DashboardActivity {
  id: string
  kind: "user_registered" | "event_created" | "kyc_submitted"
  description: string
  status: ActivityStatus
  user: { id: string, fullName: string, email: string }
  occurredAt: string
}

export interface DashboardActivityPage {
  items: DashboardActivity[]
  page: { total: number, limit: number, offset: number }
}
