"use client"

import { StatCard, StatCardSkeleton } from "@/components/shared/stat-card"
import { WidgetError } from "@/components/widget-state"
import { useMeetupStats } from "@/hooks/use-meetups"
import { formatCount } from "@/lib/format"
import type { Tone } from "@/lib/tones"

/** "+18% vs yesterday"; nothing to compare against when yesterday was zero. */
const changeNote = (today: number, yesterday: number): { label: string, tone: Tone } => {
  if (yesterday === 0) return { label: today > 0 ? "None yesterday" : "Today", tone: "brand" }
  const change = Math.round(((today - yesterday) / yesterday) * 100)
  return { label: `${change > 0 ? "+" : ""}${change}% vs yesterday`, tone: change < 0 ? "danger" : "brand" }
}

const GridCard = () => {
  const { data, isPending, isError, error, refetch, isRefetching } = useMeetupStats()

  if (isPending) return Array.from({ length: 3 }, (_, index) => <StatCardSkeleton key={index} />)
  if (isError) {
    return <WidgetError message={error.message} onRetry={() => refetch()} isRetrying={isRefetching} className="sm:col-span-3" />
  }

  return (
    <>
      <StatCard title="Active Connections Now" value={formatCount(data.activeNow)} tone="success" note={{ label: "Live", tone: "success" }} noteLayout="inline" />
      <StatCard title="Connections Today" value={formatCount(data.startedToday)} tone="brand" note={changeNote(data.startedToday, data.startedYesterday)} noteLayout="inline" />
      <StatCard
        title="Flagged Meetups"
        value={formatCount(data.flagged)}
        tone="danger"
        note={data.flagged > 0 ? { label: "Action Required", tone: "danger" } : { label: "All clear", tone: "success" }}
        noteLayout="inline"
      />
    </>
  )
}

export default GridCard
