"use client"
import { cn } from "cn"
import { Skeleton } from "@/components/ui/skeleton"
import { WidgetError } from "@/components/widget-state"
import { useDashboardStats } from "@/hooks/use-dashboard"
import { formatCount, formatNaira } from "@/lib/format"

const CARD = "flex flex-col justify-between h-full min-h-29.25 p-6 rounded-2xl bg-neutral-white shadow-[0px_0px_10px_0px_#00000005]"

const ChangeBadge = ({ changePct }: { changePct: number | null }) => {
  if (changePct === null) return null

  const isDown = changePct < 0
  return (
    <span
      title="Change against 30 days ago"
      className={cn(
        "py-1 px-2 text-xs font-semibold rounded-lg",
        isDown ? "bg-[#F9E3E3] text-danger" : "bg-[#F0FDF4] text-secondary-green-500",
      )}
    >
      {isDown ? "−" : "+"} {Math.abs(changePct)}%
    </span>
  )
}

const StatCard = ({ title, value, aside }: { title: string, value: string, aside: React.ReactNode }) => (
  <div className={CARD}>
    <div className="flex justify-between items-center w-full">
      <span className="text-sm font-medium text-neutral-light-300">{title}</span>
      {aside}
    </div>
    <div className="text-[1.75rem] font-bold text-neutral-light-600">{value}</div>
  </div>
)

const StatCardSkeleton = () => (
  <div className={CARD} aria-hidden>
    <div className="flex justify-between items-center w-full">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-6 w-12 rounded-lg" />
    </div>
    <Skeleton className="mt-4 h-8 w-28" />
  </div>
)

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
        className={cn(CARD, "col-span-full")}
      />
    )
  }

  return (
    <>
      <StatCard title="Total Users" value={formatCount(data.totalUsers.value)} aside={<ChangeBadge changePct={data.totalUsers.changePct} />} />
      <StatCard title="Active Events" value={formatCount(data.activeEvents.value)} aside={<ChangeBadge changePct={data.activeEvents.changePct} />} />
      <StatCard title="Revenue" value={formatNaira(data.revenue.amountMinor)} aside={<ChangeBadge changePct={data.revenue.changePct} />} />
      <StatCard
        title="Pending KYC"
        value={formatCount(data.pendingKyc.value)}
        aside={
          <span
            title={data.pendingKyc.value > 0 ? "Submissions waiting for review" : "Nothing waiting"}
            className={cn("shrink-0 rounded-full h-2 w-2", data.pendingKyc.value > 0 ? "bg-[#FB923C]" : "bg-neutral-light-300")}
          />
        }
      />
    </>
  )
}

export default GridCard
