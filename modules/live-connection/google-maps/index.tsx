"use client"

import { useState } from "react"
import { AdvancedMarker, AdvancedMarkerAnchorPoint, APIProvider, ColorScheme, ControlPosition, InfoWindow, Map, MapControl, Pin } from "@vis.gl/react-google-maps"
import { ArrowRight, Clock, MapPin } from "lucide-react"
import { UserAvatar } from "@/components/shared/user-avatar"
import { useMeetup } from "@/hooks/use-meetups"
import type { AdminMeetupRow } from "@/types/admin-meetups"
import { DEFAULT_CENTER, PIN_COLOURS, formatWhen, pairName, pinFor, shortName, toneOf } from "../helpers"

const LegendDot = ({ colour, label }: { colour: string, label: string }) => (
  <div className="flex gap-2 items-center flex-nowrap">
    <span className="shrink-0 w-2 h-2 inline-flex rounded-full" style={{ backgroundColor: colour }} />
    <span>{label}</span>
  </div>
)

const Legend = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="m-3 border border-[#2D3548] bg-[#1E293B]/90 p-3 rounded-lg">
    <div className="flex flex-col gap-1.5 text-[11px] text-ic-light font-normal">
      <span className="uppercase font-semibold text-ic-muted">{title}</span>
      {children}
    </div>
  </div>
)

const VENUE_COLOUR = "#9333EA"
const LIVE_COLOUR = "#22C55E"

/** One meetup: the venue and each person's live position while they share it. */
const TrackingLayer = ({ meetupId }: { meetupId: string }) => {
  const { data: meetup } = useMeetup(meetupId)
  if (!meetup) return null

  return (
    <>
      {meetup.venue && (
        <AdvancedMarker position={meetup.venue} title={meetup.venueName ?? "Meeting point"}>
          <Pin background={VENUE_COLOUR} borderColor="#000" glyphColor="#FFF" />
        </AdvancedMarker>
      )}
      {meetup.parties.map((party) =>
        party.location ? (
          // Anchored on its left edge so a person standing at the venue sits beside the pin, not under it.
          <AdvancedMarker key={party.userId} position={party.location} title={party.fullName} anchorPoint={AdvancedMarkerAnchorPoint.LEFT_CENTER}>
            <div className="flex items-center gap-1 rounded-full bg-neutral-white py-0.5 pl-0.5 pr-2 shadow-md ring-2" style={{ ["--tw-ring-color" as string]: LIVE_COLOUR }}>
              <UserAvatar name={party.fullName} src={party.avatarUrl} size="xs" />
              <span className="text-[11px] font-semibold text-[#1E293B]">{shortName(party.fullName)}</span>
            </div>
          </AdvancedMarker>
        ) : null,
      )}
      <MapControl position={ControlPosition.LEFT_BOTTOM}>
        <Legend title="Live Tracking Legend">
          <LegendDot colour={LIVE_COLOUR} label="Live position (sharing)" />
          <LegendDot colour={VENUE_COLOUR} label="Meeting point" />
        </Legend>
      </MapControl>
    </>
  )
}

/** Every meetup in the current tab, coloured by state. */
const OverviewLayer = ({ meetups, onSelect }: { meetups: AdminMeetupRow[], onSelect: (id: string) => void }) => {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <>
      {meetups.map((meetup) => {
        const position = pinFor(meetup)
        if (!position) return null
        const when = meetup.startedAt ?? meetup.scheduledAt

        return (
          <AdvancedMarker key={meetup.id} position={position} title={pairName(meetup)} onClick={() => setOpenId(meetup.id)}>
            <Pin background="#EA4335" borderColor="#000" glyphColor={PIN_COLOURS[toneOf(meetup)]} />
            {openId === meetup.id && (
              <InfoWindow position={position} onCloseClick={() => setOpenId(null)} minWidth={220} headerDisabled>
                <div className="flex flex-col w-full">
                  <div className="flex items-center gap-2 pb-2">
                    <div className="flex -space-x-1.5">
                      {meetup.parties.map((party) => (
                        <UserAvatar key={party.userId} name={party.fullName} src={party.avatarUrl} className="ring-2 ring-neutral-white" />
                      ))}
                    </div>
                    <span className="inline-flex text-purple-light-600 font-semibold text-[10px] border border-[#F3E8FF] bg-bg-purple-light-200 rounded-sm py-0.5 px-1.5 capitalize">
                      {meetup.flag ? "Flagged" : meetup.status}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 pb-2 border-b border-b-[#F1F5F9]">
                    <div className="w-full text-sm text-neutral-light-600 font-semibold">{pairName(meetup)}</div>
                    <div className="flex flex-col items-start gap-1 pl-1 text-neutral-light-300 w-full">
                      <div className="flex items-center gap-1">
                        <MapPin size={11} className="h-2.75 w-2.75" aria-hidden />
                        <span className="font-normal text-xs">{meetup.venueName ?? "No venue set"}</span>
                      </div>
                      {when && (
                        <div className="flex items-center gap-1">
                          <Clock size={11} className="h-2.75 w-2.75" aria-hidden />
                          <span className="font-normal text-xs">{formatWhen(when)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-4 justify-between text-purple-light-600 text-xs font-semibold pt-2 cursor-pointer"
                    onClick={() => onSelect(meetup.id)}
                  >
                    <span>View Details</span>
                    <ArrowRight size={12} className="h-3 w-3" aria-hidden />
                  </button>
                </div>
              </InfoWindow>
            )}
          </AdvancedMarker>
        )
      })}
      <MapControl position={ControlPosition.LEFT_BOTTOM}>
        <Legend title="Legend">
          <LegendDot colour={PIN_COLOURS.active} label="Active" />
          <LegendDot colour={PIN_COLOURS.completed} label="Completed" />
          <LegendDot colour={PIN_COLOURS.flagged} label="Flagged" />
        </Legend>
      </MapControl>
    </>
  )
}

interface LiveMapProps {
  meetups: AdminMeetupRow[]
  selectedId: string | null
  onSelect: (id: string) => void
}

const LiveMap = ({ meetups, selectedId, onSelect }: LiveMapProps) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const { data: selected } = useMeetup(selectedId ?? "", { enabled: selectedId !== null })

  if (!apiKey) {
    return <div className="p-4 text-sm text-red-600">The map needs NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local.</div>
  }

  const center = selectedId
    ? (selected && pinFor(selected)) ?? DEFAULT_CENTER
    : meetups.map(pinFor).find((point) => point !== null) ?? DEFAULT_CENTER

  return (
    <APIProvider apiKey={apiKey}>
      {/* Remounted per selection, and once its data arrives, so the map recentres on what is being tracked. */}
      <Map
        key={selectedId ? `${selectedId}-${selected ? "ready" : "loading"}` : "overview"}
        defaultCenter={center}
        defaultZoom={selectedId ? 14 : 12}
        gestureHandling="greedy"
        mapId="DEMO_MAP_ID"
        colorScheme={ColorScheme.DARK}
      >
        {selectedId ? <TrackingLayer meetupId={selectedId} /> : <OverviewLayer meetups={meetups} onSelect={onSelect} />}
      </Map>
    </APIProvider>
  )
}

export default LiveMap
