import { createDataTableColumns } from "@/components/data-table/columns"
import { StatusBadge } from "@/components/shared/status-badge"
import { UserAvatar } from "@/components/shared/user-avatar"
import { fmtDate, fmtRevenue, STATUS_TONE, TYPE_TONE } from "./constants"

const column = createDataTableColumns<EventRow>()

export const eventColumns = (onView: (event: EventRow) => void) =>
  column.columns([
    column.accessor("name", {
      header: "Event Name",
      meta: { cellClassName: "max-w-45 truncate font-semibold text-neutral-light-600" },
    }),
    column.accessor("createdBy", {
      header: "Created By",
      meta: { cellClassName: "max-w-50" },
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <UserAvatar name={row.original.createdBy} src={row.original.avatar || null} size="md" />
          <span className="truncate font-medium text-neutral-light-400">{row.original.createdBy}</span>
        </div>
      ),
    }),
    column.accessor("dateCreated", {
      header: "Date Created",
      meta: { cellClassName: "whitespace-nowrap text-neutral-light-400" },
      cell: ({ getValue }) => fmtDate(getValue()),
    }),
    column.accessor("eventDate", {
      header: "Event Date",
      meta: { cellClassName: "whitespace-nowrap text-neutral-light-400" },
      cell: ({ getValue }) => fmtDate(getValue()),
    }),
    column.accessor("type", {
      header: "Type",
      cell: ({ getValue }) => <StatusBadge tone={TYPE_TONE[getValue()]}>{getValue()}</StatusBadge>,
    }),
    column.accessor("attendees", {
      header: "Attendees",
      meta: { cellClassName: "font-medium text-neutral-light-400" },
    }),
    column.accessor("status", {
      header: "Status",
      cell: ({ getValue }) => <StatusBadge tone={STATUS_TONE[getValue()]}>{getValue()}</StatusBadge>,
    }),
    column.accessor("revenue", {
      header: "Revenue",
      meta: { cellClassName: "whitespace-nowrap font-semibold tracking-wide text-neutral-light-600" },
      cell: ({ getValue }) => fmtRevenue(getValue()),
    }),
    column.display({
      id: "actions",
      header: "Action",
      meta: { headerClassName: "text-right", cellClassName: "text-right" },
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => onView(row.original)}
          aria-label={`View ${row.original.name}`}
          className="rounded-md border border-violet-200 px-3 py-1 text-xs font-medium text-primary hover:bg-secondary"
        >
          View
        </button>
      ),
    }),
  ])
