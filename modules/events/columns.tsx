import { createDataTableColumns } from "@/components/data-table/columns"
import { StatusBadge } from "@/components/shared/status-badge"
import { UserAvatar } from "@/components/shared/user-avatar"
import { formatCount } from "@/lib/format"
import type { AdminEventRow } from "@/types/admin-events"
import { STATUS_LABELS, formatDay, formatPrice } from "./constants"

const column = createDataTableColumns<AdminEventRow>()

export const eventColumns = (onView: (event: AdminEventRow) => void) =>
  column.columns([
    column.accessor("title", {
      header: "Event Name",
      meta: { cellClassName: "max-w-45 truncate font-semibold text-neutral-light-600" },
      cell: ({ getValue }) => <span title={getValue()}>{getValue()}</span>,
    }),
    column.display({
      id: "host",
      header: "Created By",
      meta: { cellClassName: "max-w-50" },
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <UserAvatar name={row.original.host.fullName} src={row.original.host.avatarUrl} size="md" />
          <span className="truncate font-medium text-neutral-light-400">{row.original.host.fullName}</span>
        </div>
      ),
    }),
    column.accessor("createdAt", {
      header: "Date Created",
      meta: { cellClassName: "whitespace-nowrap text-neutral-light-400" },
      cell: ({ getValue }) => formatDay(getValue()),
    }),
    column.accessor("startsAt", {
      header: "Event Date",
      meta: { cellClassName: "whitespace-nowrap text-neutral-light-400" },
      cell: ({ getValue }) => formatDay(getValue()),
    }),
    column.accessor("priceMinor", {
      header: "Type",
      cell: ({ getValue }) => <StatusBadge tone={getValue() > 0 ? "slate" : "info"}>{getValue() > 0 ? "Paid" : "Free"}</StatusBadge>,
    }),
    column.accessor("attendees", {
      header: "Attendees",
      meta: { cellClassName: "font-medium text-neutral-light-400" },
      cell: ({ getValue }) => formatCount(getValue()),
    }),
    column.accessor("status", {
      header: "Status",
      cell: ({ getValue }) => <StatusBadge tone={STATUS_LABELS[getValue()].tone}>{STATUS_LABELS[getValue()].label}</StatusBadge>,
    }),
    column.display({
      id: "price",
      header: "Ticket Price",
      meta: { cellClassName: "whitespace-nowrap font-semibold tracking-wide text-neutral-light-600" },
      cell: ({ row }) => formatPrice(row.original.priceMinor),
    }),
    column.display({
      id: "actions",
      header: "Action",
      meta: { headerClassName: "text-right", cellClassName: "text-right" },
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => onView(row.original)}
          aria-label={`View ${row.original.title}`}
          className="rounded-md border border-violet-200 px-3 py-1 text-xs font-medium text-primary hover:bg-secondary"
        >
          View
        </button>
      ),
    }),
  ])
