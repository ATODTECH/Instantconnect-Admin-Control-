import { UserRecord } from "../kyc-verification/mock-users"

// Placeholder data until the events admin API exists.

//  ..........Generated MOCK Data from the below ...............
const EVENT_NAMES = [
  "Lagos Tech Summit",
  "PM Meetup Lagos",
  "DevFest Lagos",
  "Women in Tech Conference",
  "Crypto Traders Meetup",
  "Product Design Sprint",
  "Startup Pitch Night",
  "AI Builders Workshop",
  "Fintech Founders Forum",
  "UX Lagos Roundtable",
  "Growth Marketing Bootcamp",
  "Data Engineers Meetup",
  "Creative Founders Brunch",
  "Cloud Native Lagos",
  "No-Code Builders Day",
  "Africa Investor Summit",
  "Remote Work Unconference",
  "Blockchain Devs Lagos",
  "Design Systems Workshop",
  "SaaS Growth Meetup",
]

const CREATORS: Pick<UserRecord, 'name'|'email'|'avatar'>[] = [
  {name: "Olamide Samuel", email: "", avatar:""},
  {name: "Chidi Benson", email: "", avatar:""},
  {name: "Tunde Fila", email: "", avatar:""},
  {name: "Amina Yusuf", email: "", avatar:""},
  {name: "Emeka Oji", email: "", avatar:""},
  {name: "Kemi Adesina", email: "", avatar:""},
  {name: "Zainab Bello", email: "", avatar:""},
  {name: "Femi Adeyemi", email: "", avatar:""},
]

export const CATEGORIES: EventCategory[] = [
  "Technology",
  "Business",
  "Education",
  "Health",
  "Social",
]

// Simple seeded PRNG so the dataset is stable across renders/edits.
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

function generateEvents(count: number): EventRow[] {
  const rows: EventRow[] = []
  const today = new Date(2026, 8, 15)

  for (let i = 0; i < count; i++) {
    const creator = CREATORS[Math.floor(rand() * CREATORS.length)]
    const name = EVENT_NAMES[Math.floor(rand() * EVENT_NAMES.length)]
    const category = CATEGORIES[Math.floor(rand() * CATEGORIES.length)]
    const type: EventType = rand() > 0.4 ? "Paid" : "Free"

    // dateCreated: somewhere in the last ~20 months
    const createdOffsetDays = Math.floor(rand() * 600)
    const dateCreated = new Date(today)
    dateCreated.setDate(dateCreated.getDate() - createdOffsetDays)

    // status distribution: 35% upcoming, 15% ongoing, 50% past
    const roll = rand()
    let status: EventStatus
    let eventDate: Date | null

    if (roll < 0.15) {
      status = "Ongoing"
      eventDate = null
    } else if (roll < 0.5) {
      status = "Upcoming"
      eventDate = new Date(today)
      eventDate.setDate(eventDate.getDate() + Math.floor(rand() * 180) + 1)
    } else {
      status = "Past"
      eventDate = new Date(today)
      eventDate.setDate(eventDate.getDate() - Math.floor(rand() * 400) - 1)
    }

    const attendees = Math.floor(rand() * 400) + 20
    const revenue =
      type === "Free" ? 0 : Math.floor((rand() * 2_500_000 + 200_000) / 10_000) * 10_000

    const ticket = type === "Paid" ? Math.floor(rand() * 500) + 20: 0
    const priceTag = type === "Paid" ? Math.floor((rand() * 10_000 + 25_000) / 500) * 50 : 0

    rows.push({
      id: `evt-${i + 1}`,
      name: `${name}${i >= EVENT_NAMES.length ? ` ${Math.floor(i / EVENT_NAMES.length) + 1}` : ""}`,
      createdBy: creator.name,
      email: creator.email,
      avatar: creator.avatar,
      dateCreated,
      eventDate,
      type,
      category,
      attendees,
      status,
      revenue,
      priceTag,
      ticket,
    });
  }

  // newest created first, like a real "Created by" table would default to
  return rows.sort((a, b) => b.dateCreated.getTime() - a.dateCreated.getTime());
}

export const ALL_EVENTS = generateEvents(486)

export const ATTENDEES = [
  {name: "Olamide Samuel", portfolio: "Senior Backend Engineer at Paystack", avatar: "", status: "VIP"},
  {name: "Chioma Adebayo", portfolio: "Technical Product Manager at Kuda", avatar: "", status: "Regular"},
  {name: "Tunde Fila", portfolio: "Founder at Speak for Child", avatar: "", status: "Regular"},
  {name: "Amina Yusuf", portfolio: "Venture Capital Analyst", avatar: "", status: "Regular"},
  {name: "Emeka Oji", portfolio: "Senior Virtual Assistant at KiddiEdu", avatar: "", status: "Regular"},
  {name: "Kemi Adeosun", portfolio: "Minister of Finance", avatar: "", status: "VIP"},
  {name: "Zainab Bello", portfolio: "First Daughter, Dangote Group", avatar: "", status: "VIP"},
  {name: "Femi Adeyemi", portfolio: "Chairman AMAC", avatar: "", status: "VIP"},
]


const attendeeRand = mulberry32(42)

export function generateAttendees(count: number): AttendeeEventRow[] {
  const rows: AttendeeEventRow[] = [];

  for (let i = 0; i < count; i++) {
    const attendee = ATTENDEES[Math.floor(attendeeRand() * ATTENDEES.length)];
    const status: 'VIP'|'Regular' = attendeeRand() > 0.4 ? "VIP" : "Regular";

    rows.push({
      id: `atd-${i + 1}`,
      name: attendee.name,
      avatar: attendee.avatar,
      status,
    })
  }

  return rows
}
