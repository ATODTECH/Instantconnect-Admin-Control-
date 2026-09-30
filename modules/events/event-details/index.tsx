"use client"

import { Calendar, Clock, Lock, MapPin } from "lucide-react"
import { AvatarStack } from "@/components/shared/avatar-stack"
import { StatusBadge } from "@/components/shared/status-badge"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { WidgetError } from "@/components/widget-state"
import { useEvent } from "@/hooks/use-events"
import { formatCount, formatNaira } from "@/lib/format"
import type { AdminEventDetail } from "@/types/admin-events"
import { STATUS_LABELS, formatDay, formatPrice, formatTime } from "../constants"

const timeRange = (event: AdminEventDetail) =>
  event.endsAt ? `${formatTime(event.startsAt)} - ${formatTime(event.endsAt)}` : `From ${formatTime(event.startsAt)}`

const DetailsSkeleton = () => (
  <div role="status" className="flex flex-col gap-5">
    <span className="sr-only">Loading event</span>
    <Skeleton className="h-40 w-full rounded-xl" />
    <Skeleton className="h-7 w-3/4" />
    <div className="space-y-2">
      {Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-4 w-1/2" />)}
    </div>
    <Skeleton className="h-18 w-full rounded-xl" />
    <Skeleton className="h-24 w-full" />
  </div>
)

const EventDetails = ({ eventId }: { eventId: string }) => {
  const { data: event, isPending, isError, error, refetch, isRefetching } = useEvent(eventId)

  if (isPending) return <DetailsSkeleton />
  if (isError) {
    return <WidgetError message={error.message} onRetry={() => refetch()} isRetrying={isRefetching} className="py-16" />
  }

  const isEndDifferentDay = event.endsAt && formatDay(event.endsAt) !== formatDay(event.startsAt)

  return (
    <div className="flex flex-col gap-5">
      {event.coverUrl && (
        // A Cloudinary URL sized on the server; next/image would need the host allow-listed for no gain.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={event.coverUrl} alt="" className="h-40 w-full rounded-xl object-cover" />
      )}

      <div className="flex justify-between items-start gap-4">
        <h3 className="text-neutral-light-600 text-2xl font-bold wrap-break-word min-w-0">{event.title}</h3>
        <StatusBadge tone={STATUS_LABELS[event.status].tone} className="shrink-0">{STATUS_LABELS[event.status].label}</StatusBadge>
      </div>

      <div className="flex flex-col gap-1.5 text-neutral-light-500">
        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-neutral-light-300" aria-hidden />
          <span className="font-semibold text-sm">
            {formatDay(event.startsAt)}
            {isEndDifferentDay && event.endsAt && ` - ${formatDay(event.endsAt)}`}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-neutral-light-300" aria-hidden />
          <span className="font-medium text-sm">{timeRange(event)}</span>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-neutral-light-300" aria-hidden />
          <span className="font-medium text-sm">
            {event.venueName}
            {event.venueAddress && <span className="block text-xs font-normal text-neutral-light-300">{event.venueAddress}</span>}
          </span>
        </div>
        {!event.isPublic && (
          <div className="flex items-center gap-3">
            <Lock className="h-4 w-4 text-neutral-light-300" aria-hidden />
            <span className="font-medium text-sm">Invite only · {formatCount(event.invited)} invited</span>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3 mt-3">
          <StatusBadge tone="brand">{event.priceMinor > 0 ? "Paid" : "Free"} Event</StatusBadge>
          {event.category && <StatusBadge tone="neutral">{event.category.label}</StatusBadge>}
          {event.priceMinor > 0 && (
            <div className="text-primary text-sm font-bold">
              {formatPrice(event.priceMinor)}
              <span className="text-neutral-light-300 font-normal"> per ticket</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center gap-4 border border-[#F4F3F5] p-4 rounded-xl">
        <div className="flex items-center gap-2 min-w-0">
          <UserAvatar name={event.host.fullName} src={event.host.avatarUrl} size="md" />
          <div className="flex flex-col min-w-0">
            <span className="text-neutral-light-600 font-bold text-sm truncate">
              {event.host.fullName}
              {event.host.isDeleted && <span className="ml-1.5 font-normal text-xs text-neutral-light-300">(account deleted)</span>}
            </span>
            <span className="text-xs text-neutral-light-300 truncate">{event.host.email}</span>
          </div>
        </div>
        <div className="flex flex-col text-end font-semibold shrink-0">
          <span className="uppercase text-neutral-light-300 leading-none text-[11px]">Created on</span>
          <span className="text-neutral-light-600 text-[13px]">{formatDay(event.createdAt)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-y-[.5px] py-5 border-y-[#F4F3F5]">
        <h4 className="text-neutral-light-600 font-semibold text-sm uppercase">Event Description</h4>
        <p className="text-neutral-light-400 text-sm whitespace-pre-line">{event.description || "No description."}</p>
      </div>

      <div className="flex flex-col gap-4">
        <h4 className="text-[#1F1D24] font-semibold text-base">Attendees ({formatCount(event.attendees)})</h4>
        {event.recentAttendees.length === 0 ? (
          <p className="text-sm text-neutral-light-300">Nobody has said they&apos;re going yet.</p>
        ) : (
          <>
            <AvatarStack
              people={event.recentAttendees.map((person) => ({ id: person.id, name: person.fullName, avatar: person.avatarUrl }))}
              total={event.attendees}
            />
            <ul className="flex flex-col border-[.5px] border-[#E6E5EA] py-2 px-4 rounded-xl">
              {event.recentAttendees.map((person) => (
                <li key={person.id} className="flex justify-between items-center gap-4 py-2.75 border-b-[.5px] border-b-[#F4F3F5] last:border-b-0">
                  <div className="flex gap-3 items-center min-w-0">
                    <UserAvatar name={person.fullName} src={person.avatarUrl} />
                    <div className="flex flex-col min-w-0">
                      <span className="text-neutral-light-600 font-bold text-sm truncate">{person.fullName}</span>
                      <span className="text-neutral-light-300 text-xs truncate">{person.occupation ?? "No occupation given"}</span>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-neutral-light-300">Joined {formatDay(person.joinedAt)}</span>
                </li>
              ))}
            </ul>
            {event.attendees > event.recentAttendees.length && (
              <p className="text-xs text-neutral-light-300">Showing the {event.recentAttendees.length} most recent.</p>
            )}
          </>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 p-5 rounded-xl bg-bg-purple-light-200 border-[.5px] border-[#F3E8FF]">
        <div className="flex flex-col">
          <h4 className="text-primary uppercase font-bold text-xs">Total Revenue</h4>
          <span className="wrap-break-word text-2xl font-extrabold text-[#5B21B6]">{formatNaira(event.revenueMinor)}</span>
        </div>
        <span className="text-right text-xs text-neutral-light-300">Tickets can&apos;t be bought yet,<br />so there are no sales.</span>
      </div>
    </div>
  )
}

export default EventDetails
