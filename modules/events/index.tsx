"use client"

import { useMemo, useState } from "react"
import { Download, X } from "lucide-react"
import { DataTable } from "@/components/data-table/data-table"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { DetailSheet } from "@/components/shared/detail-sheet"
import { FilterSelect } from "@/components/shared/filter-select"
import { FilterTabs } from "@/components/shared/filter-tabs"
import { useQuery } from "@/components/topbar"
import { useClientPagination } from "@/hooks/use-client-pagination"
import { downloadCsv } from "@/lib/csv"
import { eventColumns } from "./columns"
import {
  CATEGORY_FILTER,
  DATE_FILTER,
  DATE_WINDOW,
  type DateRange,
  type EventTab,
  PAGE_SIZE,
  TABS,
  TYPE_FILTER,
} from "./constants"
import EventDetails from "./event-details"
import GridCard from "./gridcard"
import { ALL_EVENTS } from "./mock-data"

// The mock data is generated relative to this date.
const TODAY = new Date(2026, 8, 15)
const DAY_MS = 86_400_000

const EventsHomeIndex = () => {
  const { query } = useQuery()
  const [activeTab, setActiveTab] = useState<EventTab>("All Events")
  const [type, setType] = useState<EventType>()
  const [category, setCategory] = useState<EventCategory>()
  const [dateRange, setDateRange] = useState<DateRange>()
  const [viewing, setViewing] = useState<EventRow | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return ALL_EVENTS.filter((ev) => {
      if (q && !ev.createdBy.toLowerCase().includes(q) && !ev.name.toLowerCase().includes(q)) return false
      if (activeTab !== "All Events" && ev.status !== activeTab) return false
      if (type && ev.type !== type) return false
      if (category && ev.category !== category) return false
      if (dateRange) {
        const [from, to] = DATE_WINDOW[dateRange]
        const diffDays = Math.round(((ev.eventDate ?? ev.dateCreated).getTime() - TODAY.getTime()) / DAY_MS)
        if (diffDays < from || diffDays > to) return false
      }
      return true
    })
  }, [query, activeTab, type, category, dateRange])

  const { page, pageRows, setPage } = useClientPagination(filtered, PAGE_SIZE, JSON.stringify([query, activeTab, type, category, dateRange]))
  const columns = useMemo(() => eventColumns(setViewing), [])
  const hasFilters = type !== undefined || category !== undefined || dateRange !== undefined

  const handleExportCSV = () =>
    downloadCsv(
      "InstantConnect-Events.csv",
      ["Event Name", "Created By", "Date Created", "Event Date", "Type", "Category", "Attendees", "Status", "Revenue"],
      filtered.map((ev) => [
        ev.name,
        ev.createdBy,
        ev.dateCreated.toISOString().slice(0, 10),
        ev.eventDate ? ev.eventDate.toISOString().slice(0, 10) : "Ongoing",
        ev.type,
        ev.category,
        ev.attendees,
        ev.status,
        ev.type === "Free" ? "Free" : ev.revenue,
      ]),
    )

  return (
    <div className="flex-1 flex flex-col gap-y-6 overflow-y-auto scrollbar-thin pr-8">
      <div className="grid shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-center w-full">
        <GridCard />
      </div>
      <div className="flex flex-col gap-y-6 mb-8">
        <div className="w-full shrink-0 rounded-2xl border border-gray-200 bg-neutral-white shadow-[0px_0px_10px_0px_#0000000A]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
            <FilterTabs label="Event status" tabs={TABS} value={activeTab} onChange={setActiveTab} />
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-2 rounded-lg border border-[#F4F3F5] px-3.5 py-2 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3 px-5 py-4">
            <FilterSelect label="Event type" options={TYPE_FILTER} value={type} onChange={setType} />
            <FilterSelect label="Category" options={CATEGORY_FILTER} value={category} onChange={setCategory} />
            <FilterSelect label="Date range" options={DATE_FILTER} value={dateRange} onChange={setDateRange} />
            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  setType(undefined)
                  setCategory(undefined)
                  setDateRange(undefined)
                }}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600"
              >
                <X className="h-3.5 w-3.5" />
                Clear filters
              </button>
            )}
          </div>
        </div>

        <DataTable
          label="Events"
          columns={columns}
          data={pageRows}
          getRowId={(row) => row.id}
          emptyMessage="No events match the selected filters."
          footer={
            <DataTablePagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} noun={{ one: "event", other: "events" }} />
          }
        />
      </div>

      <DetailSheet
        open={viewing !== null}
        onOpenChange={(open) => !open && setViewing(null)}
        title="Event Details"
        description={viewing ? `Details of ${viewing.name}` : "Event details"}
      >
        {viewing && <EventDetails event={viewing} />}
      </DetailSheet>
    </div>
  )
}

export default EventsHomeIndex
