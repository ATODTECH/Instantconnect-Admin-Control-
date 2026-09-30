export type KycSubmissionStatus = "pending" | "approved" | "rejected"
export type KycAdditionalIdKind = "passport" | "drivers_license"
export type KinRelationship = "parent" | "sibling" | "spouse" | "child" | "guardian" | "relative"

export interface KycApplicant {
  id: string
  fullName: string
  email: string
  phone: string
  /** From the account, to compare with the ID. */
  dateOfBirth: string | null
  avatarUrl: string | null
}

/** Signed for admins; each opens the image itself. */
export interface KycDocuments {
  nationalId: string
  additionalId: string
  utilityBill: string
  selfie: string
}

export interface KycSubmission {
  id: string
  status: KycSubmissionStatus
  submittedAt: string
  reviewedAt: string | null
  reviewedByName: string | null
  rejectionReason: string | null
  applicant: KycApplicant
  additionalIdKind: KycAdditionalIdKind
  addressLine: string
  country: string
  state: string
  city: string
  kinName: string
  kinRelationship: KinRelationship
  kinPhone: string
  kinEmail: string
  kinAddress: string
  documents: KycDocuments
}

export interface KycSubmissionCounts {
  all: number
  pending: number
  approved: number
  rejected: number
}

export interface KycSubmissionPage {
  items: KycSubmission[]
  page: { total: number, limit: number, offset: number }
  counts: KycSubmissionCounts
}

export interface KycSubmissionFilters {
  status?: KycSubmissionStatus
  search?: string
}

export interface KycReviewStats {
  pending: number
  approvedToday: number
  rejectedToday: number
}
