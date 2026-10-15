"use client"

import { useMemo, useState } from "react"
import { DataTable } from "@/components/data-table/data-table"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { FilterTabs } from "@/components/shared/filter-tabs"
import { REPORTS_PAGE_SIZE, useReviewUserReport, useUserReports } from "@/hooks/use-reports"
import type { UserReport, UserReportStatus } from "@/types/admin-reports"
import { reportColumns } from "./columns"
import { ConversationSheet } from "./conversation-sheet"
import { reportTabs } from "./constants"

const NO_REPORTS: UserReport[] = []

const EMPTY_MESSAGE: Record<UserReportStatus, string> = {
  open: "No open reports. The queue is clear.",
  resolved: "No reports have been actioned yet.",
  dismissed: "No reports have been dismissed yet.",
}

/**
 * Members reported from a profile or a chat. Disabling an account happens on
 * the Users page; this queue records what was decided.
 */
const ReportsHomeIndex = () => {
  const [tab, setTab] = useState<UserReportStatus>("open")
  const [pageState, setPageState] = useState({ tab, page: 1 })
  if (pageState.tab !== tab) setPageState({ tab, page: 1 })
  const page = pageState.tab === tab ? pageState.page : 1

  const { data, isPending, isError, error, refetch, isRefetching, isPlaceholderData, isFetching } = useUserReports(tab, page)
  const review = useReviewUserReport()
  const [chatFor, setChatFor] = useState<UserReport | null>(null)
  const pendingId = review.isPending ? (review.variables?.id ?? null) : null

  const columns = useMemo(
    () => reportColumns((report, outcome) => review.mutate({ id: report.id, outcome }), pendingId, setChatFor),
    [review, pendingId],
  )

  return (
    <div className="flex-1 flex flex-col gap-y-6 overflow-y-auto scrollbar-thin pr-8">
      <div className="flex flex-col gap-y-6 mb-8">
        <div className="flex shrink-0 bg-neutral-white items-center justify-between gap-3 p-5 py-6 rounded-2xl border-[.5px] border-primary-border flex-wrap shadow-[0px_0px_10px_0px_#00000005]">
          <FilterTabs label="Report status" tabs={reportTabs} value={tab} onChange={setTab} variant="pill" />
          <p className="text-sm text-neutral-light-400">To disable an account, find the member on the Users page.</p>
        </div>

        <DataTable
          label="Member reports"
          columns={columns}
          data={data?.items ?? NO_REPORTS}
          getRowId={(row) => row.id}
          isLoading={isPending}
          isRefreshing={isPlaceholderData && isFetching}
          skeletonRows={REPORTS_PAGE_SIZE}
          error={isError ? error : null}
          onRetry={() => refetch()}
          isRetrying={isRefetching}
          emptyMessage={EMPTY_MESSAGE[tab]}
          footer={
            <DataTablePagination
              page={page}
              pageSize={REPORTS_PAGE_SIZE}
              total={data?.page.total ?? 0}
              onPageChange={(next) => setPageState({ tab, page: next })}
              noun={{ one: "report", other: "reports" }}
              isLoading={isPending}
            />
          }
        />
      </div>

      <ConversationSheet report={chatFor} onClose={() => setChatFor(null)} />
    </div>
  )
}

export default ReportsHomeIndex
