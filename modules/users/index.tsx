"use client"
import { useMemo, useState } from "react"
import { Download } from "lucide-react"
import { cn } from "cn"
import { DataTable } from "@/components/data-table/data-table"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { DetailSheet } from "@/components/shared/detail-sheet"
import { FilterSelect } from "@/components/shared/filter-select"
import { useQuery } from "@/components/topbar"
import { useDebounce } from "@/hooks/use-debounce"
import { USERS_PAGE_SIZE, useExportUsers, useUsers } from "@/hooks/use-users"
import { formatCount } from "@/lib/format"
import type { AdminUserFilters, AdminUserRow } from "@/types/admin-users"
import { userColumns } from "./columns"
import { JOINED_FILTER, KYC_FILTER, PLAN_FILTER, STATUS_FILTER } from "./constants"
import UserProfile from "./user-profile"

const NO_USERS: AdminUserRow[] = []

const UsersHomeIndex = () => {
  const { query } = useQuery()
  const search = useDebounce(query.trim(), 300)

  const [status, setStatus] = useState<AdminUserFilters["status"]>()
  const [kycStatus, setKycStatus] = useState<AdminUserFilters["kycStatus"]>()
  const [plan, setPlan] = useState<AdminUserFilters["plan"]>()
  const [joinedWithin, setJoinedWithin] = useState<AdminUserFilters["joinedWithin"]>()
  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  const [viewing, setViewing] = useState<AdminUserRow | null>(null)

  const filters = useMemo<AdminUserFilters>(
    () => ({ search: search || undefined, status, kycStatus, plan, joinedWithin }),
    [search, status, kycStatus, plan, joinedWithin],
  )

  // Any change to the search or filters starts again at page 1. Reset during
  // render rather than in an effect, so the stale page is never requested.
  const filterKey = JSON.stringify(filters)
  const [pageState, setPageState] = useState({ filterKey, page: 1 })
  if (pageState.filterKey !== filterKey) setPageState({ filterKey, page: 1 })
  const page = pageState.filterKey === filterKey ? pageState.page : 1

  const { data, isPending, isError, error, refetch, isRefetching, isPlaceholderData, isFetching } = useUsers(filters, page)
  const { mutate: runExport, isPending: isExporting } = useExportUsers()

  const rows = data?.items ?? NO_USERS
  const total = data?.page.total ?? 0
  const hasFilters = status !== undefined || kycStatus !== undefined || plan !== undefined || joinedWithin !== undefined
  const columns = useMemo(() => userColumns(setViewing), [])
  const namesById = useMemo(() => new Map(rows.map((row) => [row.id, row.fullName])), [rows])

  const clearFilters = () => {
    setStatus(undefined)
    setKycStatus(undefined)
    setPlan(undefined)
    setJoinedWithin(undefined)
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto scrollbar-thin pr-8">
      <div className="flex flex-col gap-y-6 mb-8">
        <div className="flex shrink-0 bg-neutral-white items-center justify-between gap-3 p-5 py-6 rounded-2xl border-[.5px] border-primary-border flex-wrap shadow-[0px_0px_10px_0px_#00000005]">
          <div className="flex items-center gap-4 flex-wrap">
            <FilterSelect label="Status" options={STATUS_FILTER} value={status} onChange={setStatus} />
            <FilterSelect label="KYC status" options={KYC_FILTER} value={kycStatus} onChange={setKycStatus} />
            <FilterSelect label="Plan" options={PLAN_FILTER} value={plan} onChange={setPlan} />
            <FilterSelect label="Joined" options={JOINED_FILTER} value={joinedWithin} onChange={setJoinedWithin} />
            {hasFilters && (
              <button type="button" onClick={clearFilters} className="text-sm text-slate-400 hover:text-slate-600 px-2 transition-colors">
                Clear filters
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            {selected.size > 0 && (
              <button type="button" onClick={() => setSelected(new Set())} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
                Clear selection
              </button>
            )}
            <button
              type="button"
              disabled={isExporting || total === 0}
              onClick={() => runExport({ filters, ids: [...selected] })}
              title={selected.size > 0 ? "Exports the ticked members" : "Exports every member matching the filters"}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#1E293B] bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download className={cn("w-3.5 h-3.5", isExporting && "animate-bounce")} />
              {isExporting ? "Preparing CSV" : selected.size > 0 ? `Export ${formatCount(selected.size)} selected` : "Export CSV"}
            </button>
          </div>
        </div>

        <DataTable
          label="Users"
          columns={columns}
          data={rows}
          getRowId={(row) => row.id}
          isLoading={isPending}
          isRefreshing={isPlaceholderData && isFetching}
          skeletonRows={USERS_PAGE_SIZE}
          error={isError ? error : null}
          onRetry={() => refetch()}
          isRetrying={isRefetching}
          emptyMessage={search || hasFilters ? "No users match the current search and filters." : "No members yet."}
          selection={{ selectedIds: selected, onChange: setSelected, rowLabel: (id) => namesById.get(id) ?? "user" }}
          footer={
            <DataTablePagination
              page={page}
              pageSize={USERS_PAGE_SIZE}
              total={total}
              onPageChange={(next) => setPageState({ filterKey, page: next })}
              noun={{ one: "user", other: "users" }}
              isLoading={isPending}
            />
          }
        />
      </div>

      <DetailSheet
        open={viewing !== null}
        onOpenChange={(open) => !open && setViewing(null)}
        title="User Profile Details"
        description={viewing ? `Profile of ${viewing.fullName}` : "Member profile"}
      >
        {viewing && <UserProfile userId={viewing.id} onDeleted={() => setViewing(null)} />}
      </DetailSheet>
    </div>
  )
}

export default UsersHomeIndex
