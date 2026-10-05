"use client"

import { useMemo, useState } from "react"
import { Download, Trash2, X } from "lucide-react"
import { cn } from "cn"
import { DataTable } from "@/components/data-table/data-table"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { DetailSheet } from "@/components/shared/detail-sheet"
import { FilterSelect, type FilterOption } from "@/components/shared/filter-select"
import { FilterTabs } from "@/components/shared/filter-tabs"
import { useQuery } from "@/components/topbar"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/hooks/use-debounce"
import { COMMUNITIES_PAGE_SIZE, useCommunities, useDeleteCommunity, useExportCommunities } from "@/hooks/use-communities"
import { useCategories } from "@/hooks/use-events"
import { formatCount } from "@/lib/format"
import type { AdminCommunityFilters, AdminCommunityRow } from "@/types/admin-communities"
import { communityColumns } from "./columns"
import CommunityDetails from "./community-details"
import { COMMUNITY_TABS, SIZE_FILTER, type CommunityTab } from "./constants"
import GridCard from "./gridcard"

const NO_ROWS: AdminCommunityRow[] = []

type Deleting = { id: string, name: string, postCount: number, memberCount: number }

const CommunitiesHomeIndex = () => {
  const { query } = useQuery()
  const search = useDebounce(query.trim(), 300)
  const [tab, setTab] = useState<CommunityTab>("all")
  const [categoryId, setCategoryId] = useState<string>()
  const [size, setSize] = useState<AdminCommunityFilters["size"]>()
  const [viewing, setViewing] = useState<AdminCommunityRow | null>(null)
  const [deleting, setDeleting] = useState<Deleting | null>(null)

  const { data: categories } = useCategories()
  const categoryFilter = useMemo<FilterOption<string>[]>(
    () => [{ label: "Category: All" }, ...(categories ?? []).map((category) => ({ label: category.label, value: category.id }))],
    [categories],
  )

  const filters = useMemo<AdminCommunityFilters>(
    () => ({ search: search || undefined, status: tab === "all" ? undefined : tab, categoryId, size }),
    [search, tab, categoryId, size],
  )

  // Any change to the search or filters starts again at page 1, reset during
  // render so the stale page is never requested.
  const filterKey = JSON.stringify(filters)
  const [pageState, setPageState] = useState({ filterKey, page: 1 })
  if (pageState.filterKey !== filterKey) setPageState({ filterKey, page: 1 })
  const page = pageState.filterKey === filterKey ? pageState.page : 1

  const { data, isPending, isError, error, refetch, isRefetching, isPlaceholderData, isFetching } = useCommunities(filters, page)
  const { mutate: runExport, isPending: isExporting } = useExportCommunities()
  const remove = useDeleteCommunity()

  const total = data?.page.total ?? 0
  const columns = useMemo(() => communityColumns(setViewing), [])
  const hasFilters = categoryId !== undefined || size !== undefined

  const confirmDelete = () => {
    if (!deleting) return
    remove.mutate(deleting.id, {
      onSettled: () => setDeleting(null),
      onSuccess: () => setViewing(null),
    })
  }

  return (
    <div className="flex-1 flex flex-col gap-y-6 overflow-y-auto scrollbar-thin pr-8">
      <div className="grid shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-center w-full">
        <GridCard />
      </div>

      <div className="flex flex-col gap-y-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-neutral-white px-5 py-4 shadow-[0px_0px_10px_0px_#0000000A]">
          <FilterTabs label="Community status" tabs={COMMUNITY_TABS} value={tab} onChange={setTab} />
          <div className="flex flex-wrap items-center gap-3">
            <FilterSelect label="Category" options={categoryFilter} value={categoryId} onChange={setCategoryId} />
            <FilterSelect label="Size" options={SIZE_FILTER} value={size} onChange={setSize} />
            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  setCategoryId(undefined)
                  setSize(undefined)
                }}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={() => runExport(filters)}
              disabled={isExporting || total === 0}
              title="Exports every community matching the tab, search and filters"
              className="flex items-center gap-2 rounded-lg border border-[#F4F3F5] px-3.5 py-2 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download className={cn("h-4 w-4", isExporting && "animate-bounce")} />
              {isExporting ? "Preparing CSV" : "Export CSV"}
            </button>
          </div>
        </div>

        <DataTable
          label="Communities"
          columns={columns}
          data={data?.items ?? NO_ROWS}
          getRowId={(row) => row.id}
          isLoading={isPending}
          isRefreshing={isPlaceholderData && isFetching}
          skeletonRows={COMMUNITIES_PAGE_SIZE}
          error={isError ? error : null}
          onRetry={() => refetch()}
          isRetrying={isRefetching}
          emptyMessage={search || hasFilters || tab !== "all" ? "No communities match the current search and filters." : "No communities yet."}
          footer={
            <DataTablePagination
              page={page}
              pageSize={COMMUNITIES_PAGE_SIZE}
              total={total}
              onPageChange={(next) => setPageState({ filterKey, page: next })}
              noun={{ one: "community", other: "communities" }}
              isLoading={isPending}
            />
          }
        />
      </div>

      <DetailSheet
        open={viewing !== null}
        onOpenChange={(open) => !open && setViewing(null)}
        title="Community Details"
        description={viewing ? `Details of ${viewing.name}` : "Community details"}
      >
        {viewing && (
          <CommunityDetails
            key={viewing.id}
            communityId={viewing.id}
            onDelete={(community) =>
              setDeleting({ id: community.id, name: community.name, postCount: community.postCount, memberCount: community.memberCount })
            }
          />
        )}
      </DetailSheet>

      <AlertDialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-red-50 text-[#EF4444]">
              <Trash2 aria-hidden />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete {deleting?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Its {deleting ? formatCount(deleting.postCount) : 0} posts and {deleting ? formatCount(deleting.memberCount) : 0} memberships go with it.
              This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={remove.isPending}>Cancel</AlertDialogCancel>
            <Button variant="danger" loading={remove.isPending} onClick={confirmDelete}>
              Delete community
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default CommunitiesHomeIndex
