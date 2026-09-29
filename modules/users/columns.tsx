import { MoreHorizontal } from "lucide-react"
import { createDataTableColumns } from "@/components/data-table/columns"
import { StatusBadge } from "@/components/shared/status-badge"
import { UserAvatar } from "@/components/shared/user-avatar"
import { formatCount } from "@/lib/format"
import type { AdminUserRow } from "@/types/admin-users"
import { KYC_LABELS, PLAN_LABELS, STATUS_LABELS } from "./constants"

const JOINED = new Intl.DateTimeFormat("en-NG", { day: "2-digit", month: "short", year: "numeric", timeZone: "Africa/Lagos" })

const column = createDataTableColumns<AdminUserRow>()

export const userColumns = (onView: (user: AdminUserRow) => void) =>
  column.columns([
    column.display({
      id: "user",
      header: "User",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <UserAvatar name={row.original.fullName} src={row.original.avatarUrl} />
          <div>
            <div className="font-semibold text-sm text-neutral-light-600">{row.original.fullName}</div>
            <div className="text-xs font-normal text-neutral-light-300">{row.original.email}</div>
          </div>
        </div>
      ),
    }),
    column.accessor("status", {
      header: "Status",
      cell: ({ getValue }) => <StatusBadge tone={STATUS_LABELS[getValue()].tone}>{STATUS_LABELS[getValue()].label}</StatusBadge>,
    }),
    column.accessor("kycStatus", {
      header: "KYC Status",
      cell: ({ getValue }) => <StatusBadge tone={KYC_LABELS[getValue()].tone}>{KYC_LABELS[getValue()].label}</StatusBadge>,
    }),
    column.accessor("plan", {
      header: "Subscription",
      cell: ({ getValue }) => <span className="font-medium text-neutral-light-500">{PLAN_LABELS[getValue()]}</span>,
    }),
    column.accessor("eventsAttended", {
      header: "Events Attended",
      meta: { headerClassName: "text-center", cellClassName: "text-center font-semibold text-neutral-light-500" },
      cell: ({ getValue }) => formatCount(getValue()),
    }),
    column.accessor("joinedAt", {
      header: "Joined Date",
      meta: { cellClassName: "text-neutral-light-400" },
      cell: ({ getValue }) => <time dateTime={getValue()}>{JOINED.format(new Date(getValue()))}</time>,
    }),
    column.display({
      id: "actions",
      header: "Actions",
      meta: { headerClassName: "text-right", cellClassName: "text-right" },
      cell: ({ row }) => (
        <button
          type="button"
          aria-label={`View ${row.original.fullName}`}
          className="rounded-lg p-1.5 text-neutral-light-400 transition-colors hover:bg-slate-100"
          onClick={() => onView(row.original)}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      ),
    }),
  ])
