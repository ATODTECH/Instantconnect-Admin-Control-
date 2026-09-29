type EventType = "Paid" | "Free"
type EventStatus = "Upcoming" | "Ongoing" | "Past"
type EventCategory =
  | "Technology"
  | "Business"
  | "Social"
  | "Health"
  | "Education"

interface EventRow {
  id: string,
  name: string,
  email: string,
  avatar: string,
  createdBy: string,
  dateCreated: Date,
  eventDate: Date | null, // null => "Ongoing"
  type: EventType,
  category: EventCategory,
  attendees: number,
  status: EventStatus,
  revenue: number, // 0 for free events
  priceTag: number,
  ticket: number,
}

interface AttendeeEventRow {
  id: string,
  name: string,
  avatar: string,
  status: 'VIP' | 'Regular',
}

