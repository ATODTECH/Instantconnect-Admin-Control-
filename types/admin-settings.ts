/** Only what the server enforces; the rest of the Settings page is not live yet. */
export interface PlatformSettings {
  maintenanceMode: boolean
  allowNewRegistrations: boolean
  /** 18 or more. */
  minimumAge: number
  kycRequiredToJoinEvents: boolean
  kycRequiredToCreateEvents: boolean
  allowPaidEvents: boolean
  /** Platform wide push switches; off stops the push, the in-app notification still arrives. */
  pushMessages: boolean
  pushConnections: boolean
  pushEvents: boolean
  pushMeetups: boolean
  pushKyc: boolean
  pushCommunities: boolean
  kycSubmittedAlert: boolean
  adminAlertEmails: string[]
  lockoutEnabled: boolean
  /** 3 to 20. */
  lockoutMaxAttempts: number
  /** 1 to 1440. */
  lockoutMinutes: number
  /** 1 to 365. */
  keepSignedInDays: number
  blockedWords: string[]
  blockedDomains: string[]
  updatedAt: string
  updatedByName: string | null
}

export type EditablePlatformSettings = Omit<PlatformSettings, "updatedAt" | "updatedByName">
