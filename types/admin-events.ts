export type AdminEventStatus = "upcoming" | "ongoing" | "past"
export type AdminEventType = "free" | "paid"
export type AdminEventWindow = "next30d" | "next90d" | "last30d" | "last90d" | "last180d"

export interface AdminEventFilters {
  search?: string
  status?: AdminEventStatus
  type?: AdminEventType
  categoryId?: string
  window?: AdminEventWindow
}

export interface AdminEventHost {
  id: string
  fullName: string
  email: string
  avatarUrl: string | null
  /** The host deleted their account; the event stays. */
  isDeleted: boolean
}

export interface AdminEventRow {
  id: string
  title: string
  host: AdminEventHost
  category: { id: string, label: string } | null
  status: AdminEventStatus
  startsAt: string
  endsAt: string | null
  /** Kobo. Zero is a free event. */
  priceMinor: number
  isPublic: boolean
  attendees: number
  createdAt: string
}

export interface AdminEventCounts {
  all: number
  upcoming: number
  ongoing: number
  past: number
}

export interface AdminEventPage {
  items: AdminEventRow[]
  page: { total: number, limit: number, offset: number }
  counts: AdminEventCounts
}

export interface AdminEventAttendee {
  id: string
  fullName: string
  avatarUrl: string | null
  occupation: string | null
  joinedAt: string
}

export interface AdminEventDetail extends AdminEventRow {
  description: string | null
  venueName: string
  venueAddress: string | null
  coverUrl: string | null
  invited: number
  /** The most recent 20; `attendees` is the full count. */
  recentAttendees: AdminEventAttendee[]
  /** Kobo. Zero until tickets can be bought. */
  revenueMinor: number
}

export interface AdminEventStats {
  total: number
  /** Upcoming or still running. */
  upcoming: number
  past: number
  revenueMinor: number
}

export interface Lookup {
  id: string
  label: string
}
