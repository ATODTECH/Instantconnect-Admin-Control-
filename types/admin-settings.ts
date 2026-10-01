/** Only what the server enforces; the rest of the Settings page is not live yet. */
export interface PlatformSettings {
  maintenanceMode: boolean
  allowNewRegistrations: boolean
  /** 18 or more. */
  minimumAge: number
  kycRequiredToJoinEvents: boolean
  kycRequiredToCreateEvents: boolean
  allowPaidEvents: boolean
  updatedAt: string
  updatedByName: string | null
}

export type EditablePlatformSettings = Omit<PlatformSettings, "updatedAt" | "updatedByName">
