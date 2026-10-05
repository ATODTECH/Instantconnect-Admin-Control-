export interface EventbriteOrganizer {
  id: string
  organizerId: string
  /** Null until the first sync names it. */
  name: string | null
  pageUrl: string
  isActive: boolean
  upcomingEventCount: number
  lastSyncedAt: string | null
  /** Why the last sync failed; null when it succeeded. */
  lastSyncError: string | null
  addedByName: string | null
  createdAt: string
}

export interface EventbriteOrganizerPage {
  /** False when EVENTBRITE_TOKEN is not set on the server. */
  tokenConfigured: boolean
  isSyncing: boolean
  items: EventbriteOrganizer[]
  page: { total: number, limit: number, offset: number }
}
