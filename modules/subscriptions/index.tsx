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
import { subscriptionColumns } from "./columns"
import { DATE_FILTER, PAGE_SIZE, PLAN_FILTER, type StartedWithin, type SubscriptionTab, TABS } from "./constants"
import GridCard from "./gridcard"
import { ALL_SUBSCRIPTIONS } from "./mock-data"
import SubscriptionDetails from "./subscription-details"

// The mock data is generated relative to this date.
const TODAY = new Date(2026, 8, 15)
const DAY_MS = 86_400_000

const SubscriptionsHomeIndex = () => {
  const { query } = useQuery()
  const [activeTab, setActiveTab] = useState<SubscriptionTab>("All")
  const [plan, setPlan] = useState<Plan>()
  const [startedWithin, setStartedWithin] = useState<StartedWithin>()
  const [viewing, setViewing] = useState<SubscriptionRow | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return ALL_SUBSCRIPTIONS.filter((sub) => {
      if (q && !sub.name.toLowerCase().includes(q) && !sub.email.toLowerCase().includes(q)) return false
      if (activeTab !== "All" && sub.status !== activeTab) return false
      if (plan && sub.subscriptionPlan !== plan) return false
      if (startedWithin) {
        const daysAgo = Math.round((TODAY.getTime() - sub.startDate.getTime()) / DAY_MS)
        if (daysAgo < 0 || daysAgo > Number(startedWithin)) return false
      }
      return true
    })
  }, [query, activeTab, plan, startedWithin])

  const { page, pageRows, setPage } = useClientPagination(filtered, PAGE_SIZE, JSON.stringify([query, activeTab, plan, startedWithin]))
  const columns = useMemo(() => subscriptionColumns(setViewing), [])

  const handleExportCSV = () =>
    downloadCsv(
      "InstantConnect-Subscriptions.csv",
      ["Name", "Email", "Plan", "Payment Method", "Start Date", "Next Billing Date", "Status"],
      filtered.map((sub) => [
        sub.name,
        sub.email,
        sub.subscriptionPlan,
        sub.paymentMethod,
        sub.startDate.toISOString().slice(0, 10),
        sub.expiresDate.toISOString().slice(0, 10),
        sub.status,
      ]),
    )

  return (
    <div className="flex-1 flex flex-col gap-y-6 overflow-y-auto scrollbar-thin pr-8">
      <div className="grid shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-center w-full">
        <GridCard />
      </div>
      <div className="flex flex-col gap-y-6 mb-8">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-neutral-white px-5 py-4 shadow-[0px_0px_10px_0px_#0000000A]">
          <FilterTabs label="Subscription status" tabs={TABS} value={activeTab} onChange={setActiveTab} />
          <div className="flex flex-wrap items-center gap-3">
            <FilterSelect label="Plan" options={PLAN_FILTER} value={plan} onChange={setPlan} />
            <FilterSelect label="Started" options={DATE_FILTER} value={startedWithin} onChange={setStartedWithin} />
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
          label="Subscriptions"
          columns={columns}
          data={pageRows}
          getRowId={(row) => row.id}
          emptyMessage="No subscriptions match the selected filters."
          footer={
            <DataTablePagination
              page={page}
              pageSize={PAGE_SIZE}
              total={filtered.length}
              onPageChange={setPage}
              noun={{ one: "subscription", other: "subscriptions" }}
            />
          }
        />
      </div>

      <DetailSheet
        open={viewing !== null}
        onOpenChange={(open) => !open && setViewing(null)}
        title="Subscription Details"
        description={viewing ? `Subscription of ${viewing.name}` : "Subscription details"}
      >
        {viewing && <SubscriptionDetails subscription={viewing} />}
      </DetailSheet>
    </div>
  )
}

export default SubscriptionsHomeIndex
