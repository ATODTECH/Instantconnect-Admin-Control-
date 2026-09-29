type CommunityStatus = "Active" | "Inactive" | "Reported"
type CommunityCategory =
  | "Technology"
  | "Business"
  | "Social"
  | "Health"
  | "Education"

interface CommunityRow {
  id: string,
  communityName: string,
  createdBy: string,
  communityAvatar: string,
  creatorAvatar: string,
  dateCreated: Date,
  category: CommunityCategory,
  members: number,
  weeklyPost: number,
  totalPost: number,
  status: CommunityStatus,
  about: string,
}

