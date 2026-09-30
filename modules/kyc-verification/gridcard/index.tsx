"use client"

import { StatCard, StatCardSkeleton } from "@/components/shared/stat-card"
import { WidgetError } from "@/components/widget-state"
import { useKycStats } from "@/hooks/use-kyc"
import { formatCount } from "@/lib/format"

const GridCard = () => {
  const { data, isPending, isError, error, refetch, isRefetching } = useKycStats()

  if (isPending) return Array.from({ length: 3 }, (_, index) => <StatCardSkeleton key={index} />)
  if (isError) {
    return <WidgetError message={error.message} onRetry={() => refetch()} isRetrying={isRefetching} className="sm:col-span-3" />
  }

  return (
    <>
      <StatCard title="Pending Review" value={formatCount(data.pending)} tone="warning" note={{ label: "In queue", tone: "warning" }} noteLayout="inline" />
      <StatCard title="Approved Today" value={formatCount(data.approvedToday)} tone="success" note={{ label: "Today", tone: "success" }} noteLayout="inline" />
      <StatCard title="Rejected Today" value={formatCount(data.rejectedToday)} tone="danger" note={{ label: "Today", tone: "danger" }} noteLayout="inline" />
    </>
  )
}

export default GridCard
