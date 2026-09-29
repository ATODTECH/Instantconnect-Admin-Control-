"use client"
import { cn } from "cn"
import { StatCard, StatCardSkeleton } from "@/components/shared/stat-card"
import { WidgetError } from "@/components/widget-state"
import { useDashboardStats } from "@/hooks/use-dashboard"
import { formatCount, formatNaira } from "@/lib/format"
import { TONE_STYLES } from "@/lib/tones"

const ChangeBadge = ({ changePct }: { changePct: number | null }) => {
  if (changePct === null) return null

  const isDown = changePct < 0
  return (
    <span title="Change against 30 days ago" className={cn("py-1 px-2 text-xs font-semibold rounded-lg", TONE_STYLES[isDown ? "danger" : "success"].chip)}>
      {isDown ? "−" : "+"} {Math.abs(changePct)}%
    </span>
  )
}

const GridCard = () => {
  const { data, isPending, isError, error, refetch, isRefetching } = useDashboardStats()

  if (isPending) {
    return (
      <>
        <span role="status" className="sr-only">Loading overview numbers</span>
        {Array.from({ length: 4 }, (_, index) => <StatCardSkeleton key={index} />)}
      </>
    )
  }

  if (isError) {
    return (
      <WidgetError
        message={error.message}
        onRetry={() => refetch()}
        isRetrying={isRefetching}
        className="col-span-full min-h-29.25 rounded-2xl border-[0.5px] border-[#E4E7EC] bg-neutral-white p-6"
      />
    )
  }

  const pendingKyc = data.pendingKyc.value

  return (
    <>
      <StatCard title="Total Users" value={formatCount(data.totalUsers.value)} aside={<ChangeBadge changePct={data.totalUsers.changePct} />} />
      <StatCard title="Active Events" value={formatCount(data.activeEvents.value)} aside={<ChangeBadge changePct={data.activeEvents.changePct} />} />
      <StatCard title="Revenue" value={formatNaira(data.revenue.amountMinor)} aside={<ChangeBadge changePct={data.revenue.changePct} />} />
      <StatCard
        title="Pending KYC"
        value={formatCount(pendingKyc)}
        tone={pendingKyc > 0 ? "warning" : "neutral"}
        valueTitle={pendingKyc > 0 ? "Submissions waiting for review" : "Nothing waiting"}
      />
    </>
  )
}

export default GridCard
