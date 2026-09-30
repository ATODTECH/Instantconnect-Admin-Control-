"use client"

import { useState } from "react"
import { cn } from "cn"
import { Skeleton } from "@/components/ui/skeleton"
import { WidgetError } from "@/components/widget-state"
import { useMeetups } from "@/hooks/use-meetups"
import { formatCount } from "@/lib/format"
import type { AdminMeetupRow, MeetupView } from "@/types/admin-meetups"
import ConnectionCard from "./connection-card"
import ConnectionDetails from "./connection-details"
import LiveMap from "./google-maps"
import GridCard from "./gridcard"

const NO_MEETUPS: AdminMeetupRow[] = []

const LiveConnectionHomeIndex = () => {
  const [view, setView] = useState<MeetupView>("ongoing")
  const [trackingId, setTrackingId] = useState<string | null>(null)

  const { data, isPending, isError, error, refetch, isRefetching } = useMeetups(view)
  // The Ongoing count stays on its tab while Past is open.
  const { data: ongoing } = useMeetups("ongoing")

  const meetups = data?.items ?? NO_MEETUPS

  const tab = (value: MeetupView, label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={view === value}
      className={cn(
        "inline-flex items-center justify-center w-full py-4 border-b-2 cursor-pointer outline-none transition",
        view === value ? "font-semibold text-purple-light-600 border-b-purple-light-600" : "font-medium text-neutral-light-300 border-b-transparent",
      )}
      onClick={() => setView(value)}
    >
      {label}
    </button>
  )

  return (
    <div className="flex-1 flex flex-col gap-y-6 overflow-y-auto scrollbar-thin pr-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 items-center w-full">
        <GridCard />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 w-full mb-6">
        <div className="col-span-2 h-screen">
          <div className="relative bg-neutral-white w-full h-full border-[.5px] border-primary-border rounded-2xl overflow-hidden">
            <LiveMap meetups={meetups} selectedId={trackingId} onSelect={setTrackingId} />
          </div>
        </div>
        <div className="bg-neutral-white border-[.5px] border-primary-border rounded-2xl h-fit">
          {trackingId === null ? (
            <>
              <div role="tablist" aria-label="Connections" className="flex text-sm items-center justify-between border-b-[.5px] border-b-primary-border">
                {tab("ongoing", `Ongoing (${formatCount(ongoing?.page.total ?? 0)})`)}
                {tab("past", "Past Connections")}
              </div>
              <div className="h-fit max-h-[calc(100vh-54px)] scrollbar-thin scrollbar-thumb-gray-200 overflow-y-auto">
                <div className="flex flex-col gap-4 p-4">
                  {isPending ? (
                    Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-36 w-full rounded-xl" />)
                  ) : isError ? (
                    <WidgetError message={error.message} onRetry={() => refetch()} isRetrying={isRefetching} className="py-10" />
                  ) : meetups.length === 0 ? (
                    <p className="w-full text-center text-sm text-neutral-light-300 py-4">
                      {view === "ongoing" ? "No meetups are underway right now." : "No meetups have ended yet."}
                    </p>
                  ) : (
                    meetups.map((meetup) => <ConnectionCard key={meetup.id} meetup={meetup} onTrack={setTrackingId} />)
                  )}
                  {data && data.page.total > meetups.length && (
                    <p className="text-center text-xs text-neutral-light-300">Showing the latest {meetups.length} of {formatCount(data.page.total)}.</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex text-sm w-full border-b-[.5px] border-b-primary-border">
                <h2 className="font-semibold text-base text-neutral-light-600 p-4">Connection Analytics</h2>
              </div>
              <div className="flex flex-col gap-4 h-fit max-h-[calc(100vh-54px)] scrollbar-thin scrollbar-thumb-gray-200 overflow-y-auto">
                <div className="flex flex-col gap-4 p-4">
                  <ConnectionDetails key={trackingId} meetupId={trackingId} onBack={() => setTrackingId(null)} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default LiveConnectionHomeIndex
