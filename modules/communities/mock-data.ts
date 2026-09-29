import { UserRecord } from "../kyc-verification/mock-users"

// Placeholder data until the communities admin API exists.

//  ..........Generated MOCK Data from the below ...............

const COMMUNITY_NAMES = [
  "Lagos Tech Collective",
  "Product Managers Hub",
  "Women in STEM Nigeria",
  "Crypto Traders NG",
  "Fitness & Wellness Lagos",
  "UI/UX Designers Africa",
  "Startup Founders Circle",
  "AI Builders Workshop",
  "Fintech Founders USA",
  "Crypto Traders UG",
  "CISCO Hub",
  "Data Engineers NG",
  "DSN Nigeria",
  "UBA Group",
  "No-Code Builders Founders",
  "Africa Investor Summit",
  "Remote Work Labs",
  "PIS Labs",
  "NBA USA",
  "Medicals Society",
]

const CREATORS: Pick<UserRecord, 'name'|'avatar'>[] = [
  {name: "Tunde Olowo", avatar:""},
  {name: "Chioma Nze", avatar:""},
  {name: "Amina Yusuf", avatar:""},
  {name: "Emeka Obi", avatar:""},
  {name: "Victor Bassey", avatar:""},
  {name: "Kemi Adesina", avatar:""},
  {name: "Alimi Rukayat", avatar:""},
  {name: "Femi Banjo", avatar:""},
  {name: "Emmanuel Taiwo", avatar:""},
]

export const CATEGORIES: EventCategory[] = [
  "Technology",
  "Business",
  "Education",
  "Health",
  "Social",
]

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}
const rand = mulberry32(42)

function generateCommunities(count: number): CommunityRow[] {
  const rows: CommunityRow[] = []
  const today = new Date(2026, 8, 15)

  for (let i = 0; i < count; i++) {
    const creator = CREATORS[Math.floor(rand() * CREATORS.length)]
    const name = COMMUNITY_NAMES[Math.floor(rand() * COMMUNITY_NAMES.length)]
    const category = CATEGORIES[Math.floor(rand() * CATEGORIES.length)]

    const createdOffsetDays = Math.floor(rand() * 600)
    const dateCreated = new Date(today)
    dateCreated.setDate(dateCreated.getDate() - createdOffsetDays)

    const roll = rand()
    let status: CommunityStatus

    if (roll < 0.15) {
      status = "Active"
    } else if (roll < 0.5) {
      status = "Inactive"
    } else {
      status = "Reported"
    }

    const members = Math.floor((rand() * 10_000 + 25_000) / 500) * 50 
    const weeklyPost = Math.floor(rand() * 500) + 20
    const totalPost = weeklyPost + Math.floor(rand() * 24_500)
    const about = "A premier ecosystem for builders, developers, and tech executives in Lagos. We drive ecosystem collaborations, share tech career opportunities, and host impactful developer workshops."

    rows.push({
      id: `com-${i + 1}`,
      communityName: `${name}${i >= COMMUNITY_NAMES.length ? ` ${Math.floor(i / COMMUNITY_NAMES.length) + 1}` : ""}`,
      createdBy: creator.name,
      creatorAvatar: creator.avatar,
      communityAvatar: '',
      dateCreated,
      category,
      about,
      members,
      weeklyPost,
      totalPost,
      status,
    });
  }

  return rows.sort((a, b) => b.dateCreated.getTime() - a.dateCreated.getTime());
}

export const ALL_COMMUNITIES = generateCommunities(486)
