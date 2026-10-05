"use client"

import { useMemo, useState } from "react"
import { Download, RotateCcw, X } from "lucide-react"
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
import {
  SUBSCRIPTIONS_PAGE_SIZE,
  useExportSubscriptions,
  usePaymentSettings,
  usePlans,
  useRefundLast,
  useRetrySubscription,
  useSubscriptions,
} from "@/hooks/use-subscriptions"
import type { AdminSubscriber, AdminSubscriptionDetail, SubscriptionFilters } from "@/types/admin-subscriptions"
import { subscriptionColumns } from "./columns"
import { SUBSCRIPTION_TABS, WINDOW_FILTER, formatNairaExact, type SubscriptionsTab } from "./constants"
import GridCard from "./gridcard"
import SubscriptionDetails from "./subscription-details"

const NO_ROWS: AdminSubscriber[] = []

const SubscriptionsHomeIndex = () => {
  const { query } = useQuery()
  const search = useDebounce(query.trim(), 300)
  const [tab, setTab] = useState<SubscriptionsTab>("all")
  const [planId, setPlanId] = useState<string>()
  const [dateWindow, setDateWindow] = useState<SubscriptionFilters["window"]>()
  const [viewing, setViewing] = useState<AdminSubscriber | null>(null)
  const [refunding, setRefunding] = useState<AdminSubscriptionDetail | null>(null)

  const { data: plans } = usePlans()
  const { data: settings } = usePaymentSettings()
  const planFilter = useMemo<FilterOption<string>[]>(
    () => [{ label: "All Plans" }, ...(plans ?? []).map((plan) => ({ label: plan.name, value: plan.id }))],
    [plans],
  )

  const filters = useMemo<SubscriptionFilters>(
    () => ({ search: search || undefined, status: tab === "all" ? undefined : tab, planId, window: dateWindow }),
    [search, tab, planId, dateWindow],
  )

  const filterKey = JSON.stringify(filters)
  const [pageState, setPageState] = useState({ filterKey, page: 1 })
  if (pageState.filterKey !== filterKey) setPageState({ filterKey, page: 1 })
  const page = pageState.filterKey === filterKey ? pageState.page : 1

  const { data, isPending, isError, error, refetch, isRefetching, isPlaceholderData, isFetching } = useSubscriptions(filters, page)
  const { mutate: runExport, isPending: isExporting } = useExportSubscriptions()
  const retry = useRetrySubscription()
  const refund = useRefundLast()

  const total = data?.page.total ?? 0
  const retryingId = retry.isPending ? (retry.variables ?? null) : null
  const columns = useMemo(
    () => subscriptionColumns(setViewing, (subscription) => retry.mutate(subscription.id), retryingId),
    [retry, retryingId],
  )
  const hasFilters = planId !== undefined || dateWindow !== undefined

  return (
    <div className="flex-1 flex flex-col gap-y-6 overflow-y-auto scrollbar-thin pr-8">
      {settings && !settings.configured && (
        <div role="note" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <span className="font-semibold">Payments are off.</span> PAYSTACK_SECRET_KEY is not set on the server, so members can&apos;t subscribe yet.
        </div>
      )}
      {settings?.configured && settings.testMode && (
        <div role="note" className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
          <span className="font-semibold">Test mode.</span> Paystack is using a test key: no real money moves.
        </div>
      )}

      <div className="grid shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-center w-full">
        <GridCard />
      </div>

      <div className="flex flex-col gap-y-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-neutral-white px-5 py-4 shadow-[0px_0px_10px_0px_#0000000A]">
          <FilterTabs label="Subscription status" tabs={SUBSCRIPTION_TABS} value={tab} onChange={setTab} />
          <div className="flex flex-wrap items-center gap-3">
            <FilterSelect label="Started" options={WINDOW_FILTER} value={dateWindow} onChange={setDateWindow} />
            <FilterSelect label="Plan" options={planFilter} value={planId} onChange={setPlanId} />
            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  setPlanId(undefined)
                  setDateWindow(undefined)
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
              title="Exports every subscription matching the tab, search and filters"
              className="flex items-center gap-2 rounded-lg border border-[#F4F3F5] px-3.5 py-2 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download className={cn("h-4 w-4", isExporting && "animate-bounce")} />
              {isExporting ? "Preparing CSV" : "Export CSV"}
            </button>
          </div>
        </div>

        <DataTable
          label="Subscriptions"
          columns={columns}
          data={data?.items ?? NO_ROWS}
          getRowId={(row) => row.id}
          isLoading={isPending}
          isRefreshing={isPlaceholderData && isFetching}
          skeletonRows={SUBSCRIPTIONS_PAGE_SIZE}
          error={isError ? error : null}
          onRetry={() => refetch()}
          isRetrying={isRefetching}
          emptyMessage={search || hasFilters || tab !== "all" ? "No subscriptions match the current search and filters." : "No subscriptions yet."}
          footer={
            <DataTablePagination
              page={page}
              pageSize={SUBSCRIPTIONS_PAGE_SIZE}
              total={total}
              onPageChange={(next) => setPageState({ filterKey, page: next })}
              noun={{ one: "subscription", other: "subscriptions" }}
              isLoading={isPending}
            />
          }
        />
      </div>

      <DetailSheet
        open={viewing !== null}
        onOpenChange={(open) => !open && setViewing(null)}
        title="Subscription Details"
        description={viewing ? `${viewing.fullName}'s subscription` : "Subscription details"}
      >
        {viewing && <SubscriptionDetails key={viewing.id} onRefund={setRefunding} subscriptionId={viewing.id} />}
      </DetailSheet>

      <AlertDialog open={refunding !== null} onOpenChange={(open) => !open && setRefunding(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-amber-50 text-[#EA7A1B]">
              <RotateCcw aria-hidden />
            </AlertDialogMedia>
            <AlertDialogTitle>Refund {refunding?.fullName}&apos;s last payment?</AlertDialogTitle>
            <AlertDialogDescription>
              {refunding ? formatNairaExact(refunding.amountMinor) : ""} goes back to them through Paystack over the next few days. Their plan
              stays as it is; cancel it separately if you need to.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={refund.isPending}>Cancel</AlertDialogCancel>
            <Button
              variant="danger"
              loading={refund.isPending}
              onClick={() => refunding && refund.mutate(refunding.id, { onSettled: () => setRefunding(null) })}
            >
              Refund
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default SubscriptionsHomeIndex
