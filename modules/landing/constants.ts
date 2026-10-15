import {
  BadgeCheck,
  Briefcase,
  CalendarDays,
  Coffee,
  Fingerprint,
  Flag,
  Globe2,
  HeartHandshake,
  KeyRound,
  MapPinned,
  MessageCircle,
  Mic2,
  PartyPopper,
  Radar,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react"
import type { Tone } from "@/components/landing/feature-card"
import type { Store } from "@/components/landing/store-buttons"

/** Store listings. Leave a store `null` until it is live; its badge reads "Coming soon". */
export const STORE_LINKS: Record<Store, string | null> = {
  apple: null,
  google: null,
}

export const CONTACT_EMAIL = "privacy@instantlinkup.com"

/** Sections of the landing page. Rooted at "/" so they also work from /privacy and /terms. */
export const NAV_LINKS = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Safety", href: "/#safety" },
  { label: "Explore", href: "/#explore" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
] as const

export type Category = { name: string, body: string, icon: LucideIcon, tone: Tone }

/** The five categories people are surfaced by in the app. */
export const CATEGORIES: Category[] = [
  { name: "Friendship", body: "New faces for brunch, gym sessions or a walk round the lagoon.", icon: HeartHandshake, tone: "blush" },
  { name: "Business", body: "Co-founders, clients and collaborators working a few streets away.", icon: Briefcase, tone: "sky" },
  { name: "Talents", body: "Musicians, designers, photographers and makers ready to create.", icon: Mic2, tone: "peach" },
  { name: "Social", body: "Plans tonight, a game this weekend, a crew for the next concert.", icon: PartyPopper, tone: "lilac" },
  { name: "General", body: "Curious about the people around you? Start anywhere.", icon: Globe2, tone: "mint" },
]

export const HOW_IT_WORKS = [
  {
    key: "discover",
    step: "01",
    title: "Discover people nearby",
    body: "Pick what you're after (friends, business, talent or plans) and see verified people around you, sorted by distance and online now.",
  },
  {
    key: "chat",
    step: "02",
    title: "Connect and chat",
    body: "Send a request, and once it's accepted the conversation opens. Messages arrive live, with read receipts and photo sharing.",
  },
  {
    key: "plan",
    step: "03",
    title: "Plan the meetup together",
    body: "Propose a time and place straight from the chat. They can accept, suggest another slot, or decline, and you both see where things stand.",
  },
  {
    key: "verify",
    step: "04",
    title: "Verify you both arrived",
    body: "Each of you gets a one-time arrival code. Swap codes in person to confirm you're meeting the real person from the profile.",
  },
] as const

export type HowItWorksKey = (typeof HOW_IT_WORKS)[number]["key"]

export const SAFETY_FEATURES = [
  { icon: KeyRound, title: "One-time arrival codes", body: "A fresh code for each of you, valid only around the meetup, that can only be read off a phone that's really there." },
  { icon: Radar, title: "Live location, on your terms", body: "Share where you are with the person you're meeting while you're on your way, and switch it off any time." },
  { icon: Users, title: "Safety circles", body: "Add family or friends who get told where you are, who you're with, and when the meetup ends." },
  { icon: BadgeCheck, title: "Verified identities", body: "ID checks reviewed by our team put a verified badge on real profiles, so you know who's who." },
  { icon: Fingerprint, title: "PIN & biometric lock", body: "Lock the app behind your PIN, Face ID or fingerprint. It re-locks itself when you step away." },
  { icon: Flag, title: "Block & report", body: "Block anyone in two taps and report what feels off. Every report is reviewed by a person." },
] as const

export const EXPLORE_FEATURES = [
  {
    key: "events",
    label: "Events",
    icon: CalendarDays,
    tone: "peach" as Tone,
    title: "Events happening around you",
    body: "Find what's on nearby, or host your own: set a cover, venue and time, then invite your connections.",
  },
  {
    key: "communities",
    label: "Communities",
    icon: Users,
    tone: "lilac" as Tone,
    title: "Communities that feel local",
    body: "Join groups around what you love. Post, comment, pin updates and invite your connections in.",
  },
  {
    key: "places",
    label: "Places",
    icon: Coffee,
    tone: "blush" as Tone,
    title: "Places worth meeting at",
    body: "Cafés, coworking spaces and parks picked for meeting people, so the first hello happens somewhere good.",
  },
  {
    key: "chat",
    label: "Chat",
    icon: MessageCircle,
    tone: "sky" as Tone,
    title: "Chat that leads somewhere",
    body: "Every conversation has a meetup built in, so it doesn't stall at small talk.",
  },
] as const

export type BillingCycle = "monthly" | "annual"

export type Plan = {
  id: string
  name: string
  tagline: string
  /** Naira per month, and per year on annual billing. */
  monthly: number
  annual: number
  features: string[]
  featured?: boolean
  icon: LucideIcon
}

/**
 * Mirrors Free in the app and the `plus` row of `subscription_plans`. Admins
 * can change prices in Settings → Payment, so update these alongside.
 */
export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Discover, connect and meet safely",
    monthly: 0,
    annual: 0,
    icon: MapPinned,
    features: [
      "Discover people nearby, in every category",
      "Up to 5 new connection requests a day",
      "Chat with your accepted connections",
      "Photo swap before confirming a meetup",
      "GPS arrival check and one-time meetup codes",
      "Live location sharing and meetup summaries for your trusted contacts",
      "Block, report, hide from discovery and privacy controls",
      "Ads while browsing, never during safety checks",
    ],
  },
  {
    id: "plus",
    name: "LinkUp Plus",
    tagline: "More reach, more control, no ads",
    monthly: 2000,
    annual: 24000,
    featured: true,
    icon: Sparkles,
    features: [
      "Unlimited connection requests, within fair use",
      "Completely ad-free",
      "Advanced discovery filters and preferences",
      "Expanded search and discovery",
      "Preview people in other cities before you travel",
      "Full, searchable connection history",
      "Saved discovery preferences and connections",
      "Better group and trusted circle management",
      "More visibility controls",
    ],
  },
]

export const FAQS = [
  {
    q: "Is InstantLinkUp a dating app?",
    a: "It can be, but it's much more. You choose what you're looking for (friendship, business, talent, social plans or anything in between) and we show you people nearby who want the same.",
  },
  {
    q: "How do arrival codes keep me safe?",
    a: "When a meetup is confirmed, you each get your own one-time code. You show yours, they enter it, and the other way round. A match confirms you're both really there, with the person from the profile. Codes expire shortly after the meetup and lock after too many wrong tries.",
  },
  {
    q: "Who can see my location?",
    a: "People nearby see a rough distance, never your exact spot. Live location is only shared during a meetup you've agreed to, only with that person, and only while you leave it switched on. Your safety circle gets the venue and who you're with, not a live map.",
  },
  {
    q: "What does verification involve?",
    a: "You submit a government ID and a selfie in the app. Our team reviews it, and once approved your profile shows a verified badge. Your documents are never shown to other members.",
  },
  {
    q: "Where is InstantLinkUp available?",
    a: "We're launching in Lagos first and growing city by city. Download the app to be among the first people on it in your area.",
  },
  {
    q: "Is it free?",
    a: "Yes. Discovering people, chatting and every meetup safety feature are free. LinkUp Plus adds unlimited connection requests, advanced discovery filters, travel previews and no ads.",
  },
] as const
