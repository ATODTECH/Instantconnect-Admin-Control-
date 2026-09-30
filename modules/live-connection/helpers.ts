import type { AdminMeetupRow, LatLng, MeetupParty } from "@/types/admin-meetups"

const TIME = new Intl.DateTimeFormat("en-NG", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Africa/Lagos" })
const DAY_TIME = new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Africa/Lagos" })
const DAY_KEY = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos" })

/** "2:30 PM" today, "29 Sept, 2:30 PM" any other day. */
export const formatWhen = (iso: string, now = new Date()) =>
  DAY_KEY.format(new Date(iso)) === DAY_KEY.format(now) ? TIME.format(new Date(iso)) : DAY_TIME.format(new Date(iso))

/** "Halima L." */
export const shortName = (fullName: string) => {
  const [first, ...rest] = fullName.trim().split(/\s+/)
  const last = rest.at(-1)
  return last ? `${first} ${last[0]}.` : first
}

export const pairName = (meetup: AdminMeetupRow) => meetup.parties.map((party) => shortName(party.fullName)).join(" & ")

export const firstName = (party: MeetupParty) => party.fullName.trim().split(/\s+/)[0]

/** "45 min", "1h 30m", "15d 1h". */
export const formatDuration = (ms: number) => {
  const minutes = Math.max(0, Math.floor(ms / 60_000))
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours >= 24) {
    const days = Math.floor(hours / 24)
    return hours % 24 ? `${days}d ${hours % 24}h` : `${days}d`
  }
  const rest = minutes % 60
  return rest ? `${hours}h ${rest}m` : `${hours}h`
}

/** Time together once started; before that, how long until the scheduled time. */
export const durationLabel = (meetup: AdminMeetupRow, now = Date.now()) => {
  if (meetup.startedAt) {
    const end = meetup.endedAt ? new Date(meetup.endedAt).getTime() : now
    return formatDuration(end - new Date(meetup.startedAt).getTime())
  }
  if (meetup.scheduledAt) {
    const until = new Date(meetup.scheduledAt).getTime() - now
    return until > 0 ? `in ${formatDuration(until)}` : "On the way"
  }
  return "—"
}

export const formatDistance = (meters: number) => (meters < 1000 ? `${meters} m` : `${(meters / 1000).toFixed(1)} km`)

/** Where to put a meetup's pin: the venue, else wherever someone is. */
export const pinFor = (meetup: AdminMeetupRow): LatLng | null =>
  meetup.venue ?? meetup.parties.find((party) => party.location)?.location ?? null

export type PinTone = "active" | "completed" | "flagged"

export const PIN_COLOURS: Record<PinTone, string> = {
  active: "#22C55E",
  completed: "#83818E",
  flagged: "#C92B2B",
}

export const toneOf = (meetup: AdminMeetupRow): PinTone =>
  meetup.flag ? "flagged" : meetup.status === "ended" ? "completed" : "active"

/** Victoria Island, where most meetups are. */
export const DEFAULT_CENTER: LatLng = { lat: 6.42816, lng: 3.41897 }
