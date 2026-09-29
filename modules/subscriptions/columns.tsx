import { createDataTableColumns } from "@/components/data-table/columns"
import { StatusBadge } from "@/components/shared/status-badge"
import { UserAvatar } from "@/components/shared/user-avatar"
import { fmtDate, fmtNaira, PLAN_TONE, STATUS_TONE } from "./constants"

const column = createDataTableColumns<SubscriptionRow>()

export const subscriptionColumns = (onView: (subscription: SubscriptionRow) => void) =>
  column.columns([
    column.display({
      id: "user",
      header: "User",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <UserAvatar name={row.original.name} src={row.original.avatar || null} size="md" />
          <div className="flex w-full max-w-28 flex-col items-start">
            <span title={row.original.name} className="w-full truncate text-sm font-semibold text-neutral-light-600">{row.original.name}</span>
            <span title={row.original.email} className="w-full truncate text-xs text-neutral-light-300">{row.original.email}</span>
          </div>
        </div>
      ),
    }),
    column.accessor("subscriptionPlan", {
      header: "Plan",
      cell: ({ getValue }) => <StatusBadge tone={PLAN_TONE[getValue()]}>{getValue()}</StatusBadge>,
    }),
    column.accessor("amount", {
      header: "Amount",
      meta: { cellClassName: "whitespace-nowrap font-semibold text-neutral-light-600" },
      cell: ({ getValue }) => fmtNaira(getValue()),
    }),
    column.accessor("paymentMethod", {
      header: "Payment Method",
      meta: { cellClassName: "text-neutral-light-400" },
      cell: ({ row }) => `${row.original.paymentMethod}${row.original.paymentCardPin ? ` ${row.original.paymentCardPin}` : ""}`,
    }),
    column.accessor("startDate", {
      header: "Start Date",
      meta: { cellClassName: "whitespace-nowrap text-neutral-light-400" },
      cell: ({ getValue }) => fmtDate(getValue()),
    }),
    column.accessor("expiresDate", {
      header: "Next Billing",
      meta: { cellClassName: "whitespace-nowrap text-neutral-light-400" },
      cell: ({ getValue }) => fmtDate(getValue()),
    }),
    column.accessor("status", {
      header: "Status",
      cell: ({ getValue }) => <StatusBadge tone={STATUS_TONE[getValue()]}>{getValue()}</StatusBadge>,
    }),
    column.display({
      id: "actions",
      header: "Action",
      meta: { headerClassName: "text-right", cellClassName: "text-right" },
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-x-2">
          <button
            type="button"
            onClick={() => onView(row.original)}
            aria-label={`View ${row.original.name}'s subscription`}
            className="rounded-md border border-violet-200 px-3 py-1 text-xs font-medium text-primary hover:bg-secondary"
          >
            View
          </button>
          {row.original.status === "Failed" && (
            <button
              type="button"
              onClick={() => alert("coming soon!")}
              className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-brand-deep"
            >
              Retry
            </button>
          )}
        </div>
      ),
    }),
  ])
