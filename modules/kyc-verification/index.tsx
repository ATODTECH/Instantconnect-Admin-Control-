"use client"

import { useMemo, useState } from "react"
import { Download, RefreshCw } from "lucide-react"
import { cn } from "cn"
import { useQueryClient } from "@tanstack/react-query"
import { DataTable } from "@/components/data-table/data-table"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { DetailSheet } from "@/components/shared/detail-sheet"
import { FilterTabs } from "@/components/shared/filter-tabs"
import { useQuery } from "@/components/topbar"
import { useDebounce } from "@/hooks/use-debounce"
import { KYC_PAGE_SIZE, kycKeys, useKycSubmissions } from "@/hooks/use-kyc"
import { downloadCsv } from "@/lib/csv"
import { formatCount } from "@/lib/format"
import type { KycSubmission, KycSubmissionFilters } from "@/types/admin-kyc"
import { documentsOf, kycColumns } from "./columns"
import { KIN_LABELS, KYC_STATUS_LABELS, formatDay, kycTabs, type KycTab } from "./constants"
import GridCard from "./gridcard"
import KycReview from "./kyc-review"

const NO_SUBMISSIONS: KycSubmission[] = []

const KYCHomeIndex = () => {
  const queryClient = useQueryClient()
  const { query } = useQuery()
  const search = useDebounce(query.trim(), 300)
  const [tab, setTab] = useState<KycTab>("pending")
  // Ticks survive paging, so each ticked row is kept whole for the export.
  const [picked, setPicked] = useState<Map<string, KycSubmission>>(() => new Map())
  const [reviewing, setReviewing] = useState<KycSubmission | null>(null)

  const filters = useMemo<KycSubmissionFilters>(
    () => ({ status: tab === "all" ? undefined : tab, search: search || undefined }),
    [tab, search],
  )

  // A new tab or search starts again at page 1, reset during render so the
  // stale page is never requested.
  const filterKey = JSON.stringify(filters)
  const [pageState, setPageState] = useState({ filterKey, page: 1 })
  if (pageState.filterKey !== filterKey) setPageState({ filterKey, page: 1 })
  const page = pageState.filterKey === filterKey ? pageState.page : 1

  const { data, isPending, isError, error, refetch, isRefetching, isPlaceholderData, isFetching } = useKycSubmissions(filters, page)

  const rows = data?.items ?? NO_SUBMISSIONS
  const total = data?.page.total ?? 0
  const columns = useMemo(() => kycColumns(setReviewing), [])

  const rowsById = useMemo(() => new Map(rows.map((row) => [row.id, row])), [rows])
  const selected = useMemo(() => new Set(picked.keys()), [picked])

  const setSelected = (ids: Set<string>) =>
    setPicked((prev) => {
      const next = new Map<string, KycSubmission>()
      for (const id of ids) {
        const row = prev.get(id) ?? rowsById.get(id)
        if (row) next.set(id, row)
      }
      return next
    })

  const exportSelected = () =>
    downloadCsv(
      "InstantConnect-KYC-Submissions.csv",
      ["Submission ID", "User ID", "Name", "Email", "Phone", "Date of Birth", "Documents", "Address", "Next of Kin", "Kin Relationship", "Kin Phone", "Submitted", "Status", "Reviewed", "Reviewed By", "Rejection Reason"],
      [...picked.values()].map((row) => [
          row.id,
          row.applicant.id,
          row.applicant.fullName,
          row.applicant.email,
          row.applicant.phone,
          row.applicant.dateOfBirth ?? "",
          documentsOf(row),
          [row.addressLine, row.city, row.state, row.country].join(", "),
          row.kinName,
          KIN_LABELS[row.kinRelationship],
          row.kinPhone,
          formatDay(row.submittedAt),
          KYC_STATUS_LABELS[row.status].label,
          row.reviewedAt ? formatDay(row.reviewedAt) : "",
          row.reviewedByName ?? "",
          row.rejectionReason ?? "",
        ]),
    )

  const refreshQueue = () => queryClient.invalidateQueries({ queryKey: kycKeys.all })

  return (
    <div className="flex-1 flex flex-col gap-y-6 overflow-y-auto scrollbar-thin pr-8">
      <div className="grid shrink-0 grid-cols-1 gap-4 sm:grid-cols-3 items-center w-full">
        <GridCard />
      </div>
      <div className="flex flex-col gap-y-6 mb-8">
        <div className="flex shrink-0 bg-neutral-white items-center justify-between gap-3 p-5 py-6 rounded-2xl border-[.5px] border-primary-border flex-wrap shadow-[0px_0px_10px_0px_#00000005]">
          <FilterTabs label="KYC status" tabs={kycTabs(data?.counts)} value={tab} onChange={setTab} variant="pill" />
          <div className="flex items-center gap-3">
            {selected.size > 0 && (
              <button type="button" onClick={() => setSelected(new Set())} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
                Clear selection
              </button>
            )}
            <button
              type="button"
              onClick={() => (selected.size > 0 ? exportSelected() : refreshQueue())}
              disabled={selected.size === 0 && isFetching}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-primary-border bg-neutral-white px-3 py-2 text-sm font-semibold text-neutral-light-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {selected.size > 0
                ? <Download className="h-3.5 w-3.5" />
                : <RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} />}
              {selected.size > 0 ? `Export ${formatCount(selected.size)} selected` : "Refresh Queue"}
            </button>
          </div>
        </div>

        <DataTable
          label="KYC submissions"
          columns={columns}
          data={rows}
          getRowId={(row) => row.id}
          isLoading={isPending}
          isRefreshing={isPlaceholderData && isFetching}
          skeletonRows={KYC_PAGE_SIZE}
          error={isError ? error : null}
          onRetry={() => refetch()}
          isRetrying={isRefetching}
          emptyMessage={search ? "No submissions match the current search." : tab === "pending" ? "The queue is clear." : "No submissions yet."}
          selection={{ selectedIds: selected, onChange: setSelected, rowLabel: (id) => (picked.get(id) ?? rowsById.get(id))?.applicant.fullName ?? "submission" }}
          footer={
            <DataTablePagination
              page={page}
              pageSize={KYC_PAGE_SIZE}
              total={total}
              onPageChange={(next) => setPageState({ filterKey, page: next })}
              noun={{ one: "submission", other: "submissions" }}
              isLoading={isPending}
            />
          }
        />
      </div>

      <DetailSheet
        open={reviewing !== null}
        onOpenChange={(open) => !open && setReviewing(null)}
        title="Document Review"
        description={reviewing ? `KYC documents submitted by ${reviewing.applicant.fullName}` : "KYC document review"}
      >
        {reviewing && <KycReview key={reviewing.id} submissionId={reviewing.id} />}
      </DetailSheet>
    </div>
  )
}

export default KYCHomeIndex
