export type AdminNotificationKind = "kyc_submitted" | "support_message" | "event_created" | "user_reported"

export interface AdminNotification {
  /** `<kind>:<source id>` */
  id: string
  kind: AdminNotificationKind
  /** The KYC submission, the member who wrote to support, the event, or the report. */
  targetId: string
  title: string
  body: string
  occurredAt: string
  read: boolean
}

export interface AdminNotificationPage {
  items: AdminNotification[]
  /** Across the whole 30-day feed, not just this page. */
  unreadCount: number
  page: { total: number, limit: number, offset: number }
}
