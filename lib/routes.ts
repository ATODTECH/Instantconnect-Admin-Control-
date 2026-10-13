export const ROUTES = {
  home: "/",
  login: "/login",
  overview: "/dashboard/overview",
  users: "/dashboard/users",
  kycVerification: "/dashboard/kyc-verification",
  liveConnection: "/dashboard/live-connection",
  events: "/dashboard/events",
  communities: "/dashboard/communities",
  reports: "/dashboard/reports",
  subscriptions: "/dashboard/subscriptions",
  settings: "/dashboard/settings",
} as const

/** Pages anyone can open, signed in or not. */
export const PUBLIC_PATHS: readonly string[] = [ROUTES.home]

/**
 * The title and one-line description the top bar shows for each page. `search`
 * is the search box's placeholder; pages without it have nothing to search.
 */
export const PAGE_HEADINGS: Record<string, { title: string, description: string, search?: string }> = {
  [ROUTES.overview]: { title: "Dashboard", description: "Welcome back, Admin. InstantLinkUp overview and quick metrics." },
  [ROUTES.users]: { title: "User Management", description: "Manage platform members, KYC verification records, and billing tiers.", search: "Search name or email..." },
  [ROUTES.kycVerification]: { title: "KYC Verification", description: "Review and verify user identity documents.", search: "Search name or email..." },
  [ROUTES.liveConnection]: { title: "Live Connection", description: "Monitor active meetups and connection locations in real-time." },
  [ROUTES.events]: { title: "Events", description: "Monitor and manage all platform events.", search: "Search event or host..." },
  [ROUTES.communities]: { title: "Community Management", description: "Monitor and manage all platform communities.", search: "Search community or creator..." },
  [ROUTES.reports]: { title: "Member Reports", description: "Review members reported by other members." },
  [ROUTES.subscriptions]: { title: "Subscription Management", description: "Monitor and manage all platform subscriptions.", search: "Search name or email..." },
  [ROUTES.settings]: { title: "Platform Settings", description: "Configure and manage platform preferences." },
}
