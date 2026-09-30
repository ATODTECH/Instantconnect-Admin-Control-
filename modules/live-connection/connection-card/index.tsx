import { Clock, Flag, MapPin } from "lucide-react"
import { cn } from "cn"
import { UserAvatar } from "@/components/shared/user-avatar"
import type { AdminMeetupRow } from "@/types/admin-meetups"
import { durationLabel, formatWhen, pairName } from "../helpers"

const ConnectionCard = ({ meetup, onTrack }: { meetup: AdminMeetupRow, onTrack: (id: string) => void }) => {
  const isLive = meetup.status !== "ended"
  const when = meetup.startedAt ?? meetup.scheduledAt

  return (
    <div className="flex flex-col justify-between items-center gap-3 border-[.5px] border-[#F1F5F9] bg-neutral-white shadow-[0px_0px_10px_0px_#0000000F] p-4 rounded-xl">
      <div className="flex items-center justify-between w-full">
        <div className="flex -space-x-1.5">
          {meetup.parties.map((party) => (
            <UserAvatar key={party.userId} name={party.fullName} src={party.avatarUrl} size="md" className="ring-2 ring-neutral-white" />
          ))}
        </div>
        <div className={cn("flex items-center gap-1 text-[11px] font-semibold", isLive ? "text-secondary-green-500" : "text-neutral-light-300")}>
          <span className={cn("inline-flex shrink-0 h-1.5 w-1.5 rounded-full", isLive ? "bg-secondary-green-500" : "bg-neutral-light-300")} />
          <span>{durationLabel(meetup)}</span>
        </div>
      </div>

      <div className="flex w-full items-center gap-2 text-sm text-neutral-light-600 font-semibold">
        <span className="truncate">{pairName(meetup)}</span>
        {meetup.flag && (
          <span title={meetup.flag.reason} className="inline-flex shrink-0 items-center gap-1 rounded-sm bg-[#FCF2F2] px-1.5 py-0.5 text-[10px] font-semibold text-[#C92B2B]">
            <Flag className="h-2.5 w-2.5" aria-hidden />
            Flagged
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-neutral-light-300 w-full">
        <div className="flex min-w-0 items-center gap-1">
          <MapPin size={11} className="h-2.75 w-2.75 shrink-0" aria-hidden />
          <span className="truncate font-normal text-xs">{meetup.venueName ?? "No venue set"}</span>
        </div>
        {when && (
          <div className="flex items-center gap-1">
            <Clock size={11} className="h-2.75 w-2.75" aria-hidden />
            <span className="font-normal text-xs">{formatWhen(when)}</span>
          </div>
        )}
      </div>

      <div className="flex w-full items-center justify-between gap-4">
        <div className="w-full max-w-[60%] h-0 border border-[#F1F5F9]" />
        <button
          type="button"
          className="py-1.5 px-3.5 rounded-lg bg-bg-purple-light-200 text-xs font-semibold tracking-wide cursor-pointer text-purple-light-600"
          onClick={() => onTrack(meetup.id)}
          aria-label={`${isLive ? "Track" : "View"} ${pairName(meetup)}`}
        >
          {isLive ? "Track" : "View"}
        </button>
      </div>
    </div>
  )
}

export default ConnectionCard
