"use client"

import { useMemo, useState } from "react"
import { Download, RefreshCw } from "lucide-react"
import { DataTable } from "@/components/data-table/data-table"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { DetailSheet } from "@/components/shared/detail-sheet"
import { FilterTabs, type FilterTab } from "@/components/shared/filter-tabs"
import { useQuery } from "@/components/topbar"
import { useClientPagination } from "@/hooks/use-client-pagination"
import { downloadCsv } from "@/lib/csv"
import { kycColumns } from "./columns"
import GridCard from "./gridcard"
import KycReview from "./kyc-review"
import { USERS, type UserRecord } from "./mock-users"

const PAGE_SIZE = 8

type KycTab = KycStatus | "All Submissions"

const TABS: readonly FilterTab<KycTab>[] = (["All Submissions", "Pending", "Verified", "Rejected"] as const).map((value) => ({
  label: value,
  value,
  count: value === "All Submissions" ? USERS.length : USERS.filter((user) => user.kyc === value).length,
}))

const KYCHomeIndex = () => {
  const { query } = useQuery()
  const [tab, setTab] = useState<KycTab>("All Submissions")
  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  const [reviewing, setReviewing] = useState<UserRecord | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return USERS.filter((u) => {
      if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false
      if (tab !== "All Submissions" && u.kyc !== tab) return false
      return true
    })
  }, [query, tab])

  const { page, pageRows, setPage } = useClientPagination(filtered, PAGE_SIZE, JSON.stringify([query, tab]))
  const columns = useMemo(() => kycColumns(setReviewing), [])
  const namesById = useMemo(() => new Map(USERS.map((user) => [user.id, user.name])), [])

  const exportSelected = () =>
    downloadCsv(
      "InstantConnect-KYC-Users.csv",
      ["User ID", "Name", "Email", "Phone Number", "Gender", "DOB", "Location", "Doc Type", "Submitted Date", "KYC Status", "KYC Action"],
      USERS.filter((user) => selected.has(user.id)).map((user) => [
        user.userID,
        user.name,
        user.email,
        user.phoneNumber,
        user.gender,
        user.dob,
        user.location,
        `${user.docType.nin}, ${user.docType.otherKYCType}`,
        user.kycDateSubmitted,
        user.kyc,
        user.action,
      ]),
    )

  return (
    <div className="flex-1 flex flex-col gap-y-6 overflow-y-auto scrollbar-thin pr-8">
      <div className="grid shrink-0 grid-cols-1 gap-4 sm:grid-cols-3 items-center w-full">
        <GridCard />
      </div>
      <div className="flex flex-col gap-y-6 mb-8">
        <div className="flex shrink-0 bg-neutral-white items-center justify-between gap-3 p-5 py-6 rounded-2xl border-[.5px] border-primary-border flex-wrap shadow-[0px_0px_10px_0px_#00000005]">
          <FilterTabs label="KYC status" tabs={TABS} value={tab} onChange={setTab} variant="pill" />
          <button
            type="button"
            onClick={() => (selected.size > 0 ? exportSelected() : alert("coming soon!"))}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-primary-border bg-neutral-white px-3 py-2 text-sm font-semibold text-neutral-light-400 hover:bg-slate-50"
          >
            {selected.size > 0 ? <Download className="h-3.5 w-3.5" /> : <RefreshCw className="h-3.5 w-3.5" />}
            {selected.size > 0 ? `Export ${selected.size} selected` : "Refresh Queue"}
          </button>
        </div>

        <DataTable
          label="KYC submissions"
          columns={columns}
          data={pageRows}
          getRowId={(row) => row.id}
          emptyMessage="No users match the current search and filters."
          selection={{ selectedIds: selected, onChange: setSelected, rowLabel: (id) => namesById.get(id) ?? "user" }}
          footer={
            <DataTablePagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} noun={{ one: "submission", other: "submissions" }} />
          }
        />
      </div>

      <DetailSheet
        open={reviewing !== null}
        onOpenChange={(open) => !open && setReviewing(null)}
        title="Document Review"
        description={reviewing ? `KYC documents submitted by ${reviewing.name}` : "KYC document review"}
      >
        {reviewing && <KycReview key={reviewing.id} person={reviewing} />}
      </DetailSheet>
    </div>
  )
}

export default KYCHomeIndex
