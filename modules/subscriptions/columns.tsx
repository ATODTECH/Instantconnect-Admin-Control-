import { createDataTableColumns } from "@/components/data-table/columns"
import { StatusBadge } from "@/components/shared/status-badge"
import { UserAvatar } from "@/components/shared/user-avatar"
import type { AdminSubscriber } from "@/types/admin-subscriptions"
import { formatDay } from "../events/constants"
import { MethodIcon, STATUS_LABELS, describeMethod, formatNairaExact, planTone } from "./constants"

const column = createDataTableColumns<AdminSubscriber>()

export const subscriptionColumns = (
  onView: (subscription: AdminSubscriber) => void,
  onRetry: (subscription: AdminSubscriber) => void,
  retryingId: string | null,
) =>
  column.columns([
    column.display({
      id: "user",
      header: "User",
      meta: { cellClassName: "max-w-52" },
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <UserAvatar name={row.original.fullName} src={row.original.avatarUrl} size="md" />
          <div className="min-w-0">
            <p className="truncate font-semibold text-neutral-light-600" title={row.original.fullName}>{row.original.fullName}</p>
            <p className="truncate text-xs text-neutral-light-400" title={row.original.email}>{row.original.email}</p>
          </div>
        </div>
      ),
    }),
    column.accessor("planName", {
      header: "Plan",
      cell: ({ row }) => <StatusBadge tone={planTone(row.original.planId)}>{row.original.planName.split(" ")[0]}</StatusBadge>,
    }),
    column.accessor("amountMinor", {
      header: "Amount",
      meta: { cellClassName: "whitespace-nowrap font-semibold text-neutral-light-600" },
      cell: ({ getValue }) => formatNairaExact(getValue()),
    }),
    column.display({
      id: "method",
      header: "Payment Method",
      cell: ({ row }) => (
        <span className="flex items-center gap-2 whitespace-nowrap text-neutral-light-400">
          <MethodIcon method={row.original.paymentMethod} />
          {describeMethod(row.original.paymentMethod)}
        </span>
      ),
    }),
    column.accessor("startedAt", {
      header: "Start Date",
      meta: { cellClassName: "whitespace-nowrap text-neutral-light-400" },
      cell: ({ getValue }) => formatDay(getValue()),
    }),
    column.accessor("currentPeriodEnd", {
      header: "Next Billing",
      meta: { cellClassName: "whitespace-nowrap text-neutral-light-400" },
      cell: ({ getValue }) => formatDay(getValue()),
    }),
    column.accessor("status", {
      header: "Status",
      cell: ({ getValue }) => <StatusBadge tone={STATUS_LABELS[getValue()].tone}>{STATUS_LABELS[getValue()].label}</StatusBadge>,
    }),
    column.display({
      id: "actions",
      header: "Actions",
      meta: { headerClassName: "text-right", cellClassName: "text-right" },
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onView(row.original)}
            aria-label={`View ${row.original.fullName}'s subscription`}
            className="rounded-md border border-gray-200 px-3 py-1 text-xs font-medium text-neutral-light-500 hover:bg-gray-50"
          >
            View
          </button>
          {row.original.canRetry && (
            <button
              type="button"
              onClick={() => onRetry(row.original)}
              disabled={retryingId === row.original.id}
              aria-label={`Retry ${row.original.fullName}'s failed renewal`}
              className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-white hover:opacity-90 disabled:opacity-60"
            >
              {retryingId === row.original.id ? "Retrying" : "Retry"}
            </button>
          )}
        </div>
      ),
    }),
  ])
