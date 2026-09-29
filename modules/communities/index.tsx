"use client"

import { useMemo, useState } from "react"
import { Download } from "lucide-react"
import { DataTable } from "@/components/data-table/data-table"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { DetailSheet } from "@/components/shared/detail-sheet"
import { FilterSelect } from "@/components/shared/filter-select"
import { FilterTabs } from "@/components/shared/filter-tabs"
import { useQuery } from "@/components/topbar"
import { useClientPagination } from "@/hooks/use-client-pagination"
import { downloadCsv } from "@/lib/csv"
import { communityColumns } from "./columns"
import CommunityDetails from "./community-details"
import { CATEGORY_FILTER, type CommunityTab, MEMBER_BOUNDS, type MemberRange, PAGE_SIZE, SIZE_FILTER, TABS } from "./constants"
import GridCard from "./gridcard"
import { ALL_COMMUNITIES } from "./mock-data"

const CommunitiesHomeIndex = () => {
  const { query } = useQuery()
  const [activeTab, setActiveTab] = useState<CommunityTab>("All")
  const [category, setCategory] = useState<CommunityCategory>()
  const [memberRange, setMemberRange] = useState<MemberRange>()
  const [viewing, setViewing] = useState<CommunityRow | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return ALL_COMMUNITIES.filter((com) => {
      if (q && !com.createdBy.toLowerCase().includes(q) && !com.communityName.toLowerCase().includes(q)) return false
      if (activeTab !== "All" && com.status !== activeTab) return false
      if (category && com.category !== category) return false
      if (memberRange) {
        const [min, max] = MEMBER_BOUNDS[memberRange]
        if (com.members < min || com.members > max) return false
      }
      return true
    })
  }, [query, activeTab, category, memberRange])

  const { page, pageRows, setPage } = useClientPagination(filtered, PAGE_SIZE, JSON.stringify([query, activeTab, category, memberRange]))
  const columns = useMemo(() => communityColumns(setViewing), [])

  const handleExportCSV = () =>
    downloadCsv(
      "InstantConnect-Communities.csv",
      ["Community Name", "Created By", "Category", "Members", "Weekly Post", "Date Created", "Status"],
      filtered.map((com) => [com.communityName, com.createdBy, com.category, com.members, com.weeklyPost, com.dateCreated.toISOString().slice(0, 10), com.status]),
    )

  return (
    <div className="flex-1 flex flex-col gap-y-6 overflow-y-auto scrollbar-thin pr-8">
      <div className="grid shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-center w-full">
        <GridCard />
      </div>
      <div className="flex flex-col gap-y-6 mb-8">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-neutral-white px-5 py-4 shadow-[0px_0px_10px_0px_#0000000A]">
          <FilterTabs label="Community status" tabs={TABS} value={activeTab} onChange={setActiveTab} />
          <div className="flex flex-wrap items-center gap-3">
            <FilterSelect label="Category" options={CATEGORY_FILTER} value={category} onChange={setCategory} />
            <FilterSelect label="Community size" options={SIZE_FILTER} value={memberRange} onChange={setMemberRange} />
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-2 rounded-lg border border-[#F4F3F5] px-3.5 py-2 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>

        <DataTable
          label="Communities"
          columns={columns}
          data={pageRows}
          getRowId={(row) => row.id}
          emptyMessage="No communities match the selected filters."
          footer={
            <DataTablePagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} noun={{ one: "community", other: "communities" }} />
          }
        />
      </div>

      <DetailSheet
        open={viewing !== null}
        onOpenChange={(open) => !open && setViewing(null)}
        title="Community Details"
        description={viewing ? `Details of ${viewing.communityName}` : "Community details"}
      >
        {viewing && <CommunityDetails community={viewing} />}
      </DetailSheet>
    </div>
  )
}

export default CommunitiesHomeIndex
