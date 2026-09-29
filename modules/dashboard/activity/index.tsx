"use client"
import { Button } from "@/components/ui/button"
import { ProgressBar } from "@/components/ui/progress-bar"
import { Skeleton } from "@/components/ui/skeleton"
import { WidgetEmpty, WidgetError } from "@/components/widget-state"
import { ACTIVITY_PAGE_SIZE, useDashboardActivity } from "@/hooks/use-dashboard"
import { formatActivityDate, formatCount, initials } from "@/lib/format"
import type { ActivityStatus } from "@/types/dashboard"

const AVATAR_COLORS = [
  "bg-violet-100 text-violet-700",
  "bg-blue-100 text-blue-700",
  "bg-pink-100 text-pink-700",
  "bg-emerald-100 text-emerald-700",
  "bg-orange-100 text-orange-700",
]

const STATUS: Record<ActivityStatus, { label: string, style: string }> = {
  approved: { label: "Approved", style: "text-[#22C55E] bg-[#F0FDF4]" },
  pending: { label: "Pending", style: "text-[#FB923C] bg-[#FFF7ED]" },
  completed: { label: "Completed", style: "text-[#A855F7] bg-[#FAF5FF]" },
  successful: { label: "Successful", style: "text-[#22C55E] bg-[#F0FDF4]" },
  rejected: { label: "Rejected", style: "bg-[#F9E3E3] text-[#991B1B]" },
}

const SkeletonRows = ({ count }: { count: number }) => (
  <>
    {Array.from({ length: count }, (_, index) => (
      <tr key={index} aria-hidden className="border-t border-slate-100">
        <td className="py-3 pl-6 pr-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>
        </td>
        <td className="py-3 pr-4"><Skeleton className="h-3.5 w-52" /></td>
        <td className="py-3 pr-4"><Skeleton className="h-3.5 w-24" /></td>
        <td className="py-3 pr-6"><Skeleton className="h-6 w-20 rounded-md" /></td>
      </tr>
    ))}
  </>
)

const ActivityIndex = () => {
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useDashboardActivity()

  const rows = data?.pages.flatMap((page) => page.items) ?? []
  const total = data?.pages[0]?.page.total ?? 0
  const isBackgroundRefresh = isRefetching && !isFetchingNextPage

  return (
    <>
      <div className="flex items-center justify-between px-6">
        <h3 className="font-bold text-base text-neutral-light-600">Recent Activity</h3>
        {total > 0 && (
          <span className="text-xs font-medium text-neutral-light-300">
            Showing {formatCount(rows.length)} of {formatCount(total)}
          </span>
        )}
      </div>
      <ProgressBar className={isBackgroundRefresh ? "visible" : "invisible"} />

      {isError && !data ? (
        <WidgetError message={error.message} onRetry={() => refetch()} isRetrying={isRefetching} className="py-12" />
      ) : !isPending && rows.length === 0 ? (
        <WidgetEmpty message="Nothing has happened on the platform yet." className="py-12" />
      ) : (
        <div className="relative overflow-x-auto" aria-busy={isPending || isFetchingNextPage}>
          <table className="w-full min-w-[650px] border-collapse text-left">
            <thead>
              <tr className="text-xs font-semibold text-neutral-light-300 bg-bg-secondary">
                <th scope="col" className="pl-6 py-3">User</th>
                <th scope="col" className="py-3">Action</th>
                <th scope="col" className="py-3">Date</th>
                <th scope="col" className="pr-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={`${row.kind}-${row.id}`} className="border-t border-slate-100 text-sm">
                  <td className="py-3 pl-6 pr-4">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium ${AVATAR_COLORS[index % AVATAR_COLORS.length]}`}
                      >
                        {initials(row.user.fullName)}
                      </span>
                      <div>
                        <p className="font-semibold text-sm text-neutral-light-600">{row.user.fullName}</p>
                        <p className="text-xs font-normal text-neutral-light-300">{row.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-sm font-medium text-neutral-light-600">{row.description}</td>
                  <td className="py-3 pr-4 font-normal text-sm text-neutral-light-300">
                    <time dateTime={row.occurredAt}>{formatActivityDate(row.occurredAt)}</time>
                  </td>
                  <td className="py-3 pr-6">
                    <span className={`text-xs font-semibold py-1 px-2 rounded-md ${STATUS[row.status].style}`}>
                      {STATUS[row.status].label}
                    </span>
                  </td>
                </tr>
              ))}
              {(isPending || isFetchingNextPage) && <SkeletonRows count={ACTIVITY_PAGE_SIZE} />}
            </tbody>
          </table>
          {isPending && <span role="status" className="sr-only">Loading recent activity</span>}
        </div>
      )}

      {hasNextPage && (
        <div className="flex justify-center border-t border-slate-100 px-6 pt-3 pb-2">
          <Button
            variant="ghost"
            onClick={() => fetchNextPage()}
            loading={isFetchingNextPage}
            className="text-[.8125rem] font-semibold text-brand hover:bg-brand-surface-subtle hover:text-brand-deep"
          >
            {isFetchingNextPage ? "Loading" : "Load more activity"}
          </Button>
        </div>
      )}
      {isError && data && (
        <p role="alert" className="px-6 pb-2 text-center text-xs text-danger">{error.message}</p>
      )}
    </>
  )
}

export default ActivityIndex
