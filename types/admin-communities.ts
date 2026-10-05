export interface AdminPerson {
  id: string
  fullName: string
  avatarUrl: string | null
}

export type AdminCommunityStatus = "active" | "inactive" | "reported"
export type AdminCommunitySize = "small" | "medium" | "large"

export interface AdminCommunityFilters {
  search?: string
  status?: AdminCommunityStatus
  categoryId?: string
  size?: AdminCommunitySize
}

export interface AdminCommunityRow {
  id: string
  name: string
  /** The Safety Community. */
  isOfficial: boolean
  isPublic: boolean
  categoryId: string | null
  categoryLabel: string | null
  creator: AdminPerson | null
  memberCount: number
  postCount: number
  /** Posts with open reports. */
  reportedPostCount: number
  postsThisWeek: number
  status: AdminCommunityStatus
  lastActivityAt: string
  createdAt: string
}

export interface AdminCommunityPage {
  items: AdminCommunityRow[]
  page: { total: number, limit: number, offset: number }
}

export interface AdminCommunityStats {
  totalCommunities: number
  createdThisMonth: number
  activeCommunities: number
  activeToday: number
  reportedCommunities: number
  openReports: number
  totalMembers: number
  membersThisWeek: number
}

export interface CommunityActivity {
  kind: "joined" | "posted"
  actorName: string
  excerpt: string | null
  occurredAt: string
}

export interface AdminCommunityDetail extends AdminCommunityRow {
  description: string | null
  coverUrl: string | null
  membersThisWeek: number
  recentActivity: CommunityActivity[]
  memberPreview: AdminPerson[]
}

export type ReportStatus = "open" | "dismissed" | "removed"

export type ReportReason = "spam" | "harassment" | "misinformation" | "hate_speech" | "violence" | "sexual_content" | "other"

export interface ReportedPost {
  postId: string
  communityId: string
  communityName: string
  author: AdminPerson
  body: string | null
  mediaUrl: string | null
  postedAt: string
  reportCount: number
  reasons: { reason: ReportReason, count: number }[]
  /** Newest first, at most five. */
  details: string[]
  lastReportedAt: string
  status: ReportStatus
  reviewedByName: string | null
}

export interface ReportedPostPage {
  items: ReportedPost[]
  page: { total: number, limit: number, offset: number }
}

export interface OfficialPost {
  id: string
  author: AdminPerson & { username: string | null, isVerified: boolean }
  authorIsAdmin: boolean
  body: string | null
  mediaUrl: string | null
  likeCount: number
  commentCount: number
  createdAt: string
}

export interface OfficialPostPage {
  items: OfficialPost[]
  page: { total: number, limit: number, offset: number }
}
