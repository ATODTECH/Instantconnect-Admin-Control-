export type MeetupView = "ongoing" | "past"
export type MeetupStatus = "proposed" | "scheduled" | "active" | "ended" | "declined" | "cancelled" | "expired"
export type ArrivalState = "pending" | "en_route" | "arrived"

export interface LatLng {
  lat: number
  lng: number
}

export interface MeetupParty {
  userId: string
  fullName: string
  avatarUrl: string | null
  isProposer: boolean
  arrivalState: ArrivalState
  enRouteAt: string | null
  arrivedAt: string | null
  /** When the other person confirmed their arrival code. */
  verifiedAt: string | null
  isSharingLocation: boolean
  /** Only while they are sharing. */
  location: LatLng | null
  locationAt: string | null
}

export interface MeetupFlag {
  flaggedAt: string
  flaggedByName: string | null
  reason: string
}

export interface AdminMeetupRow {
  id: string
  status: MeetupStatus
  scheduledAt: string | null
  /** When both arrival codes were confirmed. */
  startedAt: string | null
  endedAt: string | null
  venueName: string | null
  venueAddress: string | null
  venue: LatLng | null
  /** Proposer first. */
  parties: MeetupParty[]
  flag: MeetupFlag | null
}

export interface AdminMeetupPage {
  items: AdminMeetupRow[]
  page: { total: number, limit: number, offset: number }
}

export interface AdminMeetupDetail extends AdminMeetupRow {
  proposedAt: string
  acceptedAt: string | null
  distanceApartMeters: number | null
  /** Newest first. */
  safetyChecksSentAt: string[]
}

export interface AdminMeetupStats {
  activeNow: number
  startedToday: number
  startedYesterday: number
  flagged: number
}
