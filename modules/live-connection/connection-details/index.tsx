"use client"

import { useState } from "react"
import { AlertTriangle, ArrowLeft, CheckCircleIcon, CircleCheckBigIcon } from "lucide-react"
import { cn } from "cn"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { WidgetError } from "@/components/widget-state"
import { useFlagMeetup, useMeetup, useSendSafetyCheck, useStopTracking, useUnflagMeetup } from "@/hooks/use-meetups"
import type { AdminMeetupDetail } from "@/types/admin-meetups"
import { durationLabel, firstName, formatDistance, formatWhen } from "../helpers"

const REASON_MAX = 300

type LogEntry = { at: string, label: string, tone?: "alert" }

/** Everything that happened, oldest first, from the timestamps the meetup keeps. */
const timeline = (meetup: AdminMeetupDetail): LogEntry[] => {
  const entries: (LogEntry | null)[] = [
    { at: meetup.proposedAt, label: "Meetup proposed" },
    meetup.acceptedAt ? { at: meetup.acceptedAt, label: "Time accepted" } : null,
    ...meetup.parties.flatMap((party) => [
      party.enRouteAt ? { at: party.enRouteAt, label: `${firstName(party)} set off` } : null,
      party.arrivedAt ? { at: party.arrivedAt, label: `${firstName(party)} arrived` } : null,
    ]),
    meetup.startedAt ? { at: meetup.startedAt, label: "Both confirmed arrival codes" } : null,
    ...meetup.safetyChecksSentAt.map((at) => ({ at, label: "Safety check sent", tone: "alert" as const })),
    meetup.flag ? { at: meetup.flag.flaggedAt, label: "Flagged by admin", tone: "alert" as const } : null,
    meetup.endedAt ? { at: meetup.endedAt, label: "Meetup ended" } : null,
  ]

  return entries.filter((entry): entry is LogEntry => entry !== null).sort((a, b) => a.at.localeCompare(b.at))
}

const InfoRow = ({ label, children, className }: { label: string, children: React.ReactNode, className?: string }) => (
  <p className="flex justify-between gap-3">
    <span>{label}</span>
    <span className={cn("text-neutral-light-600 font-medium text-end", className)}>{children}</span>
  </p>
)

const FlagForm = ({ meetupId, initial, onDone }: { meetupId: string, initial: string, onDone: () => void }) => {
  const [reason, setReason] = useState(initial)
  const [error, setError] = useState<string | null>(null)
  const { mutate: flag, isPending } = useFlagMeetup()

  const submit = () => {
    const trimmed = reason.trim()
    if (!trimmed) {
      setError("Add a reason. Only admins see it.")
      return
    }
    flag({ id: meetupId, reason: trimmed }, { onSuccess: onDone })
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-[#EB8C8C] bg-[#FCF2F2] p-3">
      <label htmlFor="flag-reason" className="text-xs font-semibold text-[#C92B2B]">Why are you flagging this connection?</label>
      <Textarea
        id="flag-reason"
        rows={3}
        value={reason}
        maxLength={REASON_MAX}
        disabled={isPending}
        onChange={(e) => {
          setReason(e.target.value)
          if (error) setError(null)
        }}
        aria-invalid={error ? true : undefined}
        aria-describedby="flag-reason-hint"
        placeholder="e.g. Location sharing stopped right after arrival."
        className="min-h-18 bg-neutral-white text-sm text-neutral-light-500"
      />
      <p id="flag-reason-hint" className="flex justify-between gap-2 text-[11px]">
        {error ? <span role="alert" className="text-danger">{error}</span> : <span className="text-neutral-light-300">Neither person is told.</span>}
        <span className="text-neutral-light-300">{reason.length}/{REASON_MAX}</span>
      </p>
      <div className="flex gap-2">
        <button type="button" onClick={onDone} disabled={isPending} className="flex-1 rounded-lg border border-[#E4E7EC] bg-neutral-white py-2 text-xs font-semibold text-neutral-light-400 disabled:opacity-50">
          Cancel
        </button>
        <button type="button" onClick={submit} disabled={isPending} className="flex-1 rounded-lg bg-[#C92B2B] py-2 text-xs font-semibold text-neutral-white disabled:opacity-60">
          {isPending ? "Flagging" : initial ? "Update flag" : "Flag connection"}
        </button>
      </div>
    </div>
  )
}

const DetailsSkeleton = () => (
  <div role="status" className="flex flex-col gap-4">
    <span className="sr-only">Loading connection</span>
    <Skeleton className="h-28 w-full rounded-xl" />
    {Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-4 w-full" />)}
    <Skeleton className="h-32 w-full rounded-xl" />
  </div>
)

const ConnectionDetails = ({ meetupId, onBack }: { meetupId: string, onBack: () => void }) => {
  const { data: meetup, isPending, isError, error, refetch, isRefetching } = useMeetup(meetupId)
  const [isFlagging, setFlagging] = useState(false)
  const { mutate: sendCheck, isPending: isSending } = useSendSafetyCheck()
  const { mutate: stop, isPending: isStopping } = useStopTracking()
  const { mutate: unflag, isPending: isUnflagging } = useUnflagMeetup()

  const back = (
    <button
      type="button"
      className="flex text-xs w-fit py-1.5 px-2 rounded-lg bg-bg-purple-light-200 items-center gap-2 text-neutral-light-300 hover:text-purple-light-600 cursor-pointer"
      onClick={onBack}
    >
      <ArrowLeft size={16} aria-hidden />
      <span>Back</span>
    </button>
  )

  if (isPending) return <DetailsSkeleton />
  if (isError) {
    return (
      <div className="flex flex-col gap-4">
        <WidgetError message={error.message} onRetry={() => refetch()} isRetrying={isRefetching} className="py-10" />
        {back}
      </div>
    )
  }

  const isLive = meetup.status === "scheduled" || meetup.status === "active"
  const [first, second] = meetup.parties
  const anyoneSharing = meetup.parties.some((party) => party.isSharingLocation)
  const isBusy = isSending || isStopping || isUnflagging

  return (
    <>
      <div className="grid grid-cols-3 gap-1 border border-[#F4F3F5] bg-[#F1F5F8] p-4 rounded-xl">
        {[first, second].map((party, index) =>
          party ? (
            <div key={party.userId} className={cn("flex flex-col gap-2 items-center justify-center min-w-0", index === 1 && "col-start-3")}>
              <UserAvatar name={party.fullName} src={party.avatarUrl} className="size-12 text-lg" />
              <span className="font-semibold text-xs text-neutral-light-600 w-full truncate text-center" title={party.fullName}>{party.fullName}</span>
            </div>
          ) : null,
        )}
        <div className="col-start-2 row-start-1 flex flex-col gap-1 items-center justify-center">
          {meetup.status === "active" && (
            <>
              <CircleCheckBigIcon size={16} className="h-4 w-4 text-secondary-green-500" aria-hidden />
              <span className="py-0.5 px-1.5 bg-[#DCFCE7] rounded-sm text-[.625rem] text-secondary-green-500">Connected</span>
            </>
          )}
          {meetup.status === "scheduled" && <span className="py-0.5 px-1.5 bg-[#FFF7ED] rounded-sm text-[.625rem] text-[#FB923C]">On the way</span>}
          {meetup.status === "ended" && <span className="py-0.5 px-1.5 bg-[#F4F3F5] rounded-sm text-[.625rem] text-neutral-light-400">Ended</span>}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 border-b border-b-[#F4F3F5] pb-4">
        <h5 className="text-neutral-light-300 font-semibold text-xs uppercase">Meeting Information</h5>
        <div className="flex flex-col gap-1.5 text-[13px] font-normal text-neutral-light-300">
          <InfoRow label="Location">{meetup.venueName ?? "No venue set"}</InfoRow>
          {meetup.venueAddress && <InfoRow label="Address" className="text-xs">{meetup.venueAddress}</InfoRow>}
          {meetup.scheduledAt && <InfoRow label="Scheduled">{formatWhen(meetup.scheduledAt)}</InfoRow>}
          <InfoRow label="Started">{meetup.startedAt ? formatWhen(meetup.startedAt) : "Not yet"}</InfoRow>
          <InfoRow label="Duration">{meetup.startedAt ? durationLabel(meetup) : "—"}</InfoRow>
          <InfoRow label="Distance Apart" className={cn("font-semibold", isLive && meetup.distanceApartMeters !== null ? "text-secondary-green-500" : "")}>
            {meetup.distanceApartMeters !== null
              ? `${isLive ? "Currently: " : ""}${formatDistance(meetup.distanceApartMeters)}`
              : isLive ? "Needs both sharing" : "—"}
          </InfoRow>
          {meetup.parties.map((party) => (
            <InfoRow key={party.userId} label={`${firstName(party)}'s location`} className={party.isSharingLocation ? "text-secondary-green-500" : "text-neutral-light-300"}>
              {party.isSharingLocation ? (party.locationAt ? `Live · ${formatWhen(party.locationAt)}` : "Sharing, no fix yet") : "Not sharing"}
            </InfoRow>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 border-b border-b-[#F4F3F5] pb-4">
        <h5 className="text-neutral-light-300 font-semibold text-xs uppercase">Real-time Log</h5>
        <ol className="flex flex-col gap-1.5 text-[13px] font-normal text-neutral-light-300">
          {timeline(meetup).map((entry, index) => (
            <li key={`${entry.at}-${index}`} className={cn("flex justify-between gap-3", entry.tone === "alert" && "text-[#C92B2B]")}>
              <div className="flex items-center gap-2">
                <span className={cn("inline-flex shrink-0 h-2 w-2 rounded-full", entry.tone === "alert" ? "bg-[#C92B2B]" : isLive ? "bg-purple-light-600" : "bg-neutral-light-400")} />
                <span>{entry.label}</span>
              </div>
              <span className="text-[11px] text-end font-normal text-nowrap">{formatWhen(entry.at)}</span>
            </li>
          ))}
          {isLive && (
            <li className="flex justify-between gap-3 font-semibold text-secondary-green-500">
              <div className="flex items-center gap-2">
                <span className="inline-flex shrink-0 h-2 w-2 rounded-full bg-secondary-green-500" />
                <span>{meetup.status === "active" ? "Together at the venue" : "Heading there"}</span>
              </div>
              <span className="text-[11px] text-end">Now</span>
            </li>
          )}
        </ol>
      </div>

      {meetup.flag ? (
        <div className="flex flex-col gap-2 border border-[#F9F3F3] bg-[#F9E3E3] p-3 rounded-lg text-[#C92B2B]">
          <div className="flex items-center gap-3 font-medium text-[13px]">
            <AlertTriangle size={18} strokeWidth={2.5} className="h-4.5 w-4.5 shrink-0" aria-hidden />
            <span>Flagged{meetup.flag.flaggedByName ? ` by ${meetup.flag.flaggedByName}` : ""} · {formatWhen(meetup.flag.flaggedAt)}</span>
          </div>
          <p className="text-xs text-neutral-light-500">{meetup.flag.reason}</p>
          <div className="flex gap-3 text-xs font-semibold">
            <button type="button" onClick={() => setFlagging(true)} disabled={isBusy || isFlagging} className="underline disabled:opacity-50">Edit reason</button>
            <button type="button" onClick={() => unflag({ id: meetup.id })} disabled={isBusy} className="underline disabled:opacity-50">
              {isUnflagging ? "Removing" : "Remove flag"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 border p-3 rounded-lg font-medium text-[13px] bg-[#F0FDF4] border-[#DCFCE7] text-secondary-green-500">
          <CheckCircleIcon size={18} strokeWidth={2.5} className="h-4.5 w-4.5" aria-hidden />
          <span>Not flagged</span>
        </div>
      )}

      {isFlagging && <FlagForm meetupId={meetup.id} initial={meetup.flag?.reason ?? ""} onDone={() => setFlagging(false)} />}

      <div className="flex flex-col gap-2.5 pb-4">
        {isLive && (
          <button
            type="button"
            className="flex items-center justify-center border border-[#FB923C] px-3 py-2.5 rounded-lg bg-neutral-white font-semibold text-[13px] text-[#FB923C] w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => sendCheck({ id: meetup.id })}
            disabled={isBusy}
            title="Sends both people an in-app safety check that opens their chat"
          >
            {isSending ? "Sending" : "Send Safety Check"}
          </button>
        )}
        {!meetup.flag && (
          <button
            type="button"
            className="flex items-center justify-center border border-[#C92B2B] px-3 py-2.5 rounded-lg bg-neutral-white font-semibold text-[13px] text-[#C92B2B] w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setFlagging(true)}
            disabled={isBusy || isFlagging}
          >
            Flag Connection
          </button>
        )}
        {isLive && (
          <button
            type="button"
            className="flex items-center justify-center border border-[#E4E7EC] px-3 py-2.5 rounded-lg bg-[#F4F3F5] font-semibold text-[13px] text-neutral-light-300 w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => stop({ id: meetup.id })}
            disabled={isBusy || !anyoneSharing}
            title={anyoneSharing ? "Switches off live location for both people" : "Neither person is sharing their location"}
          >
            {isStopping ? "Stopping" : "End Tracking"}
          </button>
        )}
      </div>

      {back}
    </>
  )
}

export default ConnectionDetails
