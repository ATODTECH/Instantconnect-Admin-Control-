"use client"
import { useMemo } from "react"
import { createDataTableColumns } from "@/components/data-table/columns"
import { DataTable } from "@/components/data-table/data-table"
import { StatusBadge } from "@/components/shared/status-badge"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Button } from "@/components/ui/button"
import { ACTIVITY_PAGE_SIZE, useDashboardActivity } from "@/hooks/use-dashboard"
import { formatActivityDate, formatCount } from "@/lib/format"
import type { Tone } from "@/lib/tones"
import type { ActivityStatus, DashboardActivity } from "@/types/dashboard"

const STATUS: Record<ActivityStatus, { label: string, tone: Tone }> = {
  approved: { label: "Approved", tone: "success" },
  pending: { label: "Pending", tone: "warning" },
  completed: { label: "Completed", tone: "brand" },
  successful: { label: "Successful", tone: "success" },
  rejected: { label: "Rejected", tone: "danger" },
}

const column = createDataTableColumns<DashboardActivity>()

const columns = column.columns([
  column.display({
    id: "user",
    header: "User",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <UserAvatar name={row.original.user.fullName} />
        <div>
          <p className="font-semibold text-sm text-neutral-light-600">{row.original.user.fullName}</p>
          <p className="text-xs font-normal text-neutral-light-300">{row.original.user.email}</p>
        </div>
      </div>
    ),
  }),
  column.accessor("description", {
    header: "Action",
    meta: { cellClassName: "font-medium text-neutral-light-600" },
  }),
  column.accessor("occurredAt", {
    header: "Date",
    meta: { cellClassName: "text-neutral-light-300" },
    cell: ({ getValue }) => <time dateTime={getValue()}>{formatActivityDate(getValue())}</time>,
  }),
  column.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => <StatusBadge tone={STATUS[getValue()].tone}>{STATUS[getValue()].label}</StatusBadge>,
  }),
])

const NO_ACTIVITY: DashboardActivity[] = []

const ActivityIndex = () => {
  const { data, isPending, isError, error, refetch, isRefetching, isFetchingNextPage, hasNextPage, fetchNextPage } = useDashboardActivity()

  const rows = useMemo(() => data?.pages.flatMap((page) => page.items) ?? NO_ACTIVITY, [data])
  const total = data?.pages[0]?.page.total ?? 0

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
      <DataTable
        label="Recent activity"
        columns={columns}
        data={rows}
        getRowId={(row) => `${row.kind}-${row.id}`}
        isLoading={isPending}
        isRefreshing={isFetchingNextPage || (isRefetching && !isFetchingNextPage)}
        skeletonRows={ACTIVITY_PAGE_SIZE}
        error={isError && !data ? error : null}
        onRetry={() => refetch()}
        isRetrying={isRefetching}
        emptyMessage="Nothing has happened on the platform yet."
        minWidthClassName="min-w-[650px]"
        className="rounded-none border-0"
        footer={
          hasNextPage && (
            <div className="flex justify-center border-t border-slate-100 px-6 pt-3 pb-2">
              <Button
                variant="ghost"
                onClick={() => fetchNextPage()}
                loading={isFetchingNextPage}
                className="text-[.8125rem] font-semibold text-primary hover:bg-secondary hover:text-secondary-foreground"
              >
                {isFetchingNextPage ? "Loading" : "Load more activity"}
              </Button>
            </div>
          )
        }
      />
      {isError && data && <p role="alert" className="px-6 pb-2 text-center text-xs text-danger">{error.message}</p>}
    </>
  )
}

export default ActivityIndex
