import { Calendar, Clock, MapPin } from "lucide-react"
import { StatusBadge } from "@/components/shared/status-badge"
import { UserAvatar } from "@/components/shared/user-avatar"
import { AvatarStack } from "@/components/shared/avatar-stack"
import { fmtDate, fmtRevenue, STATUS_TONE } from "../constants"
import { ATTENDEES, generateAttendees } from "../mock-data"

const soldPercent = (attendees: number, remaining: number) => Math.round((attendees / (remaining + attendees)) * 100)

const EventDetails = ({ event }: { event: EventRow }) => {
  const faces = generateAttendees(event.attendees).slice(0, 6)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center gap-4">
        <h3 className="text-neutral-light-600 text-2xl font-bold">{event.name}</h3>
        <StatusBadge tone={STATUS_TONE[event.status]}>{event.status}</StatusBadge>
      </div>

      <div className="flex flex-col gap-1.5 text-neutral-light-500">
        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-neutral-light-300" aria-hidden />
          <span className="font-semibold text-sm">{fmtDate(event.eventDate)}</span>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-neutral-light-300" aria-hidden />
          <span className="font-medium text-sm">10:00 AM - 5:00 PM</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="h-4 w-4 text-neutral-light-300" aria-hidden />
          <span className="font-medium text-sm">Landmark Event Centre, Lagos</span>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <StatusBadge tone="brand">{event.type} Event</StatusBadge>
          <div className="text-primary text-sm font-bold">
            {fmtRevenue(event.priceTag)}
            <span className="text-neutral-light-300 font-normal"> per ticket</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center gap-4 border border-[#F4F3F5] p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <UserAvatar name={event.createdBy} src={event.avatar || null} size="md" />
          <div className="flex flex-col">
            <span className="text-neutral-light-600 font-bold text-sm">{event.createdBy}</span>
            <span className="text-xs text-neutral-light-300">no-reply@example.com</span>
          </div>
        </div>
        <div className="flex flex-col text-end font-semibold">
          <span className="uppercase text-neutral-light-300 leading-none text-[11px]">Created on</span>
          <span className="text-neutral-light-600 text-[13px]">{fmtDate(event.dateCreated)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-y-[.5px] py-5 border-y-[#F4F3F5]">
        <h4 className="text-neutral-light-600 font-semibold text-sm uppercase">Event Description</h4>
        <p className="text-neutral-light-400 text-sm">
          The Lagos Tech Summit returns as West Africa&apos;s premium gathering for software engineers, product leaders, venture capitalists,
          and ecosystem operators. Join us for a full day of keynotes, panels, workshops and networking.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h4 className="text-[#1F1D24] font-semibold text-base">Attendees ({event.attendees})</h4>
        <AvatarStack people={faces} total={event.attendees} />
        <ul className="flex flex-col border-[.5px] border-[#E6E5EA] py-2 px-4 rounded-xl">
          {ATTENDEES.toReversed().slice(0, 4).map((attendee) => (
            <li key={attendee.name} className="flex justify-between items-center gap-4 py-2.75 border-b-[.5px] border-b-[#F4F3F5] last:border-b-0">
              <div className="flex gap-3 items-center">
                <UserAvatar name={attendee.name} src={attendee.avatar || null} />
                <div className="flex flex-col">
                  <span className="text-neutral-light-600 font-bold text-sm">{attendee.name}</span>
                  <span className="text-neutral-light-300 text-xs">{attendee.portfolio}</span>
                </div>
              </div>
              <StatusBadge tone={attendee.status === "VIP" ? "brand" : "neutral"}>{attendee.status}</StatusBadge>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between gap-4 p-5 rounded-xl bg-bg-purple-light-200 border-[.5px] border-[#F3E8FF]">
        <div className="flex flex-col">
          <h4 className="text-primary uppercase font-bold text-xs">Total Revenue</h4>
          <span className="wrap-break-word text-2xl font-extrabold text-[#5B21B6]">{fmtRevenue(event.revenue)}</span>
        </div>
        {event.type === "Paid" && (
          <div className="flex flex-col items-end gap-1 text-[13px]">
            <span className="text-nowrap">
              <b className="text-neutral-light-600">{event.attendees} / {event.ticket + event.attendees}</b>
              <span className="text-neutral-light-300"> sold</span>
            </span>
            <div
              role="progressbar"
              aria-label="Tickets sold"
              aria-valuenow={soldPercent(event.attendees, event.ticket)}
              className="bg-brand-tint rounded-full w-21 h-2 overflow-hidden"
            >
              <div className="h-full bg-primary" style={{ width: `${soldPercent(event.attendees, event.ticket)}%` }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventDetails
