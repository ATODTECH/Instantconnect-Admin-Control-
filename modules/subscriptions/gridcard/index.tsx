"use client"

import { StatCard, StatCardSkeleton } from "@/components/shared/stat-card"
import { WidgetError } from "@/components/widget-state"
import { useSubscriptionStats } from "@/hooks/use-subscriptions"
import { formatCount } from "@/lib/format"
import { formatNairaExact } from "../constants"

const GridCard = () => {
  const { data, isPending, isError, error, refetch, isRefetching } = useSubscriptionStats()

  if (isPending) return Array.from({ length: 4 }, (_, index) => <StatCardSkeleton key={index} />)
  if (isError) {
    return <WidgetError message={error.message} onRetry={() => refetch()} isRetrying={isRefetching} className="sm:col-span-2 lg:col-span-4" />
  }

  const activeShare = data.totalSubscribers > 0 ? Math.round((data.activeSubscriptions / data.totalSubscribers) * 1000) / 10 : 0
  const revenueChange =
    data.revenueLastMonthMinor > 0
      ? Math.round(((data.revenueThisMonthMinor - data.revenueLastMonthMinor) / data.revenueLastMonthMinor) * 100)
      : null

  return (
    <>
      <StatCard title="Total Subscribers" value={formatCount(data.totalSubscribers)} tone="brand" note={{ label: `+${formatCount(data.newThisMonth)} this month`, tone: "brand" }} />
      <StatCard title="Active Subscriptions" value={formatCount(data.activeSubscriptions)} tone="warning" note={{ label: `${activeShare}% of total`, tone: "warning" }} />
      <StatCard
        title="Revenue This Month"
        value={formatNairaExact(data.revenueThisMonthMinor)}
        tone="success"
        note={{
          label: revenueChange === null ? "No revenue last month" : `${revenueChange >= 0 ? "+" : ""}${revenueChange}% vs last month`,
          tone: revenueChange !== null && revenueChange < 0 ? "danger" : "success",
        }}
      />
      <StatCard
        title="Failed Payments"
        value={formatCount(data.failedPayments)}
        tone="danger"
        note={{ label: data.failedPayments > 0 ? "Requires attention" : "Last 30 days", tone: data.failedPayments > 0 ? "danger" : "neutral" }}
      />
    </>
  )
}

export default GridCard
