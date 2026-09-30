"use client"

import { StatCard, StatCardSkeleton } from "@/components/shared/stat-card"
import { WidgetError } from "@/components/widget-state"
import { useEventStats } from "@/hooks/use-events"
import { formatCount, formatNaira } from "@/lib/format"

const GridCard = () => {
  const { data, isPending, isError, error, refetch, isRefetching } = useEventStats()

  if (isPending) return Array.from({ length: 4 }, (_, index) => <StatCardSkeleton key={index} />)
  if (isError) {
    return <WidgetError message={error.message} onRetry={() => refetch()} isRetrying={isRefetching} className="sm:col-span-2 lg:col-span-4" />
  }

  return (
    <>
      <StatCard title="Total Events" value={formatCount(data.total)} tone="brand" note={{ label: "Overall events created", tone: "brand" }} />
      <StatCard title="Upcoming Events" value={formatCount(data.upcoming)} tone="success" note={{ label: "Upcoming or ongoing", tone: "success" }} />
      <StatCard title="Past Events" value={formatCount(data.past)} tone="neutral" note={{ label: "Already ended", tone: "neutral" }} />
      <StatCard title="Total Revenue" value={formatNaira(data.revenueMinor)} tone="warning" note={{ label: "No ticket sales yet", tone: "warning" }} />
    </>
  )
}

export default GridCard
