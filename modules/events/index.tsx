"use client"

import { useMemo, useState } from "react"
import { Download, X } from "lucide-react"
import { cn } from "cn"
import { DataTable } from "@/components/data-table/data-table"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { DetailSheet } from "@/components/shared/detail-sheet"
import { FilterSelect, type FilterOption } from "@/components/shared/filter-select"
import { FilterTabs } from "@/components/shared/filter-tabs"
import { useQuery } from "@/components/topbar"
import { useDebounce } from "@/hooks/use-debounce"
import { EVENTS_PAGE_SIZE, useCategories, useEvents, useExportEvents } from "@/hooks/use-events"
import type { AdminEventFilters, AdminEventRow } from "@/types/admin-events"
import { eventColumns } from "./columns"
import { TYPE_FILTER, WINDOW_FILTER, eventTabs, type EventTab } from "./constants"
import EventDetails from "./event-details"
import GridCard from "./gridcard"
import EventbriteOrganizers from "./organizers"

const NO_EVENTS: AdminEventRow[] = []

const EventsHomeIndex = () => {
  const { query } = useQuery()
  const search = useDebounce(query.trim(), 300)
  const [tab, setTab] = useState<EventTab>("all")
  const [type, setType] = useState<AdminEventFilters["type"]>()
  const [categoryId, setCategoryId] = useState<string>()
  const [dateWindow, setDateWindow] = useState<AdminEventFilters["window"]>()
  const [viewing, setViewing] = useState<AdminEventRow | null>(null)

  const { data: categories } = useCategories()
  const categoryFilter = useMemo<FilterOption<string>[]>(
    () => [{ label: "All Categories" }, ...(categories ?? []).map((category) => ({ label: category.label, value: category.id }))],
    [categories],
  )

  const filters = useMemo<AdminEventFilters>(
    () => ({ search: search || undefined, status: tab === "all" ? undefined : tab, type, categoryId, window: dateWindow }),
    [search, tab, type, categoryId, dateWindow],
  )

  // Any change to the search or filters starts again at page 1, reset during
  // render so the stale page is never requested.
  const filterKey = JSON.stringify(filters)
  const [pageState, setPageState] = useState({ filterKey, page: 1 })
  if (pageState.filterKey !== filterKey) setPageState({ filterKey, page: 1 })
  const page = pageState.filterKey === filterKey ? pageState.page : 1

  const { data, isPending, isError, error, refetch, isRefetching, isPlaceholderData, isFetching } = useEvents(filters, page)
  const { mutate: runExport, isPending: isExporting } = useExportEvents()

  const rows = data?.items ?? NO_EVENTS
  const total = data?.page.total ?? 0
  const columns = useMemo(() => eventColumns(setViewing), [])
  const hasFilters = type !== undefined || categoryId !== undefined || dateWindow !== undefined

  const clearFilters = () => {
    setType(undefined)
    setCategoryId(undefined)
    setDateWindow(undefined)
  }

  return (
    <div className="flex-1 flex flex-col gap-y-6 overflow-y-auto scrollbar-thin pr-8">
      <div className="grid shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-center w-full">
        <GridCard />
      </div>
      <div className="flex flex-col gap-y-6 mb-8">
        <div className="w-full shrink-0 rounded-2xl border border-gray-200 bg-neutral-white shadow-[0px_0px_10px_0px_#0000000A]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
            <FilterTabs label="Event status" tabs={eventTabs(data?.counts)} value={tab} onChange={setTab} />
            <button
              type="button"
              onClick={() => runExport(filters)}
              disabled={isExporting || total === 0}
              title="Exports every event matching the tab, search and filters"
              className="flex items-center gap-2 rounded-lg border border-[#F4F3F5] px-3.5 py-2 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download className={cn("h-4 w-4", isExporting && "animate-bounce")} />
              {isExporting ? "Preparing CSV" : "Export CSV"}
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3 px-5 py-4">
            <FilterSelect label="Event type" options={TYPE_FILTER} value={type} onChange={setType} />
            <FilterSelect label="Category" options={categoryFilter} value={categoryId} onChange={setCategoryId} />
            <FilterSelect label="Date range" options={WINDOW_FILTER} value={dateWindow} onChange={setDateWindow} />
            {hasFilters && (
              <button type="button" onClick={clearFilters} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600">
                <X className="h-3.5 w-3.5" />
                Clear filters
              </button>
            )}
          </div>
        </div>

        <DataTable
          label="Events"
          columns={columns}
          data={rows}
          getRowId={(row) => row.id}
          isLoading={isPending}
          isRefreshing={isPlaceholderData && isFetching}
          skeletonRows={EVENTS_PAGE_SIZE}
          error={isError ? error : null}
          onRetry={() => refetch()}
          isRetrying={isRefetching}
          emptyMessage={search || hasFilters || tab !== "all" ? "No events match the current search and filters." : "No events yet."}
          footer={
            <DataTablePagination
              page={page}
              pageSize={EVENTS_PAGE_SIZE}
              total={total}
              onPageChange={(next) => setPageState({ filterKey, page: next })}
              noun={{ one: "event", other: "events" }}
              isLoading={isPending}
            />
          }
        />

        <EventbriteOrganizers />
      </div>

      <DetailSheet
        open={viewing !== null}
        onOpenChange={(open) => !open && setViewing(null)}
        title="Event Details"
        description={viewing ? `Details of ${viewing.title}` : "Event details"}
      >
        {viewing && <EventDetails key={viewing.id} eventId={viewing.id} />}
      </DetailSheet>
    </div>
  )
}

export default EventsHomeIndex
