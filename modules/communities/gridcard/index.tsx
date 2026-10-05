"use client"

import { StatCard, StatCardSkeleton } from "@/components/shared/stat-card"
import { WidgetError } from "@/components/widget-state"
import { useCommunityStats } from "@/hooks/use-communities"
import { formatCount } from "@/lib/format"

const GridCard = () => {
  const { data, isPending, isError, error, refetch, isRefetching } = useCommunityStats()

  if (isPending) return Array.from({ length: 4 }, (_, index) => <StatCardSkeleton key={index} />)
  if (isError) {
    return <WidgetError message={error.message} onRetry={() => refetch()} isRetrying={isRefetching} className="sm:col-span-2 lg:col-span-4" />
  }

  return (
    <>
      <StatCard title="Total Communities" value={formatCount(data.totalCommunities)} tone="brand" note={{ label: `+${formatCount(data.createdThisMonth)} this month`, tone: "brand" }} />
      <StatCard title="Active Communities" value={formatCount(data.activeCommunities)} tone="success" note={{ label: `${formatCount(data.activeToday)} active today`, tone: "success" }} />
      <StatCard
        title="Reported Communities"
        value={formatCount(data.reportedCommunities)}
        tone="neutral"
        note={{ label: data.openReports > 0 ? "Requires critical audit" : "Nothing to review", tone: "neutral" }}
      />
      <StatCard title="Total Members" value={formatCount(data.totalMembers)} tone="warning" note={{ label: `+${formatCount(data.membersThisWeek)} this week`, tone: "warning" }} />
    </>
  )
}

export default GridCard
