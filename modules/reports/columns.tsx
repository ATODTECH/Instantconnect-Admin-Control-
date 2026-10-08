import { createDataTableColumns } from "@/components/data-table/columns"
import { StatusBadge } from "@/components/shared/status-badge"
import { UserAvatar } from "@/components/shared/user-avatar"
import type { UserReport } from "@/types/admin-reports"
import { MEMBER_STATUS, REASON_LABELS, REASON_TONE, SOURCE_LABELS, formatDay } from "./constants"

const column = createDataTableColumns<UserReport>()

type Review = (report: UserReport, outcome: "dismiss" | "resolve") => void

export const reportColumns = (onReview: Review, pendingId: string | null) =>
  column.columns([
    column.display({
      id: "reported",
      header: "Reported Member",
      cell: ({ row }) => {
        const member = row.original.reportedUser
        const status = MEMBER_STATUS[member.status]
        return (
          <div className="flex items-center gap-3">
            <UserAvatar name={member.fullName} src={null} />
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-neutral-light-600">
                {member.fullName}
                <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
              </div>
              <div className="text-xs text-neutral-light-300">{member.email}</div>
            </div>
          </div>
        )
      },
    }),
    column.display({
      id: "reason",
      header: "Reason",
      meta: { cellClassName: "max-w-72" },
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <StatusBadge tone={REASON_TONE[row.original.reason]}>{REASON_LABELS[row.original.reason]}</StatusBadge>
          {row.original.details && (
            <span title={row.original.details} className="line-clamp-2 text-xs text-neutral-light-400">
              {row.original.details}
            </span>
          )}
        </div>
      ),
    }),
    column.display({
      id: "against",
      header: "Open Reports",
      meta: { cellClassName: "text-neutral-light-500 font-semibold" },
      cell: ({ row }) => row.original.openReportsAgainst,
    }),
    column.display({
      id: "reporter",
      header: "Reported By",
      cell: ({ row }) => (
        <div>
          <div className="text-sm text-neutral-light-500">{row.original.reporter.fullName}</div>
          <div className="text-xs text-neutral-light-300">from {SOURCE_LABELS[row.original.source]}</div>
        </div>
      ),
    }),
    column.accessor("createdAt", {
      header: "Reported",
      meta: { cellClassName: "text-neutral-light-400" },
      cell: ({ getValue }) => formatDay(getValue()),
    }),
    column.display({
      id: "action",
      header: "Action",
      meta: { headerClassName: "text-right", cellClassName: "text-right" },
      cell: ({ row }) => {
        if (row.original.status !== "open") {
          return <span className="text-xs text-neutral-light-300">{row.original.reviewedAt ? formatDay(row.original.reviewedAt) : "—"}</span>
        }
        const busy = pendingId === row.original.id
        return (
          <div className="flex justify-end gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => onReview(row.original, "dismiss")}
              aria-label={`Dismiss the report against ${row.original.reportedUser.fullName}`}
              className="rounded-md border border-primary-border px-2.5 py-1 text-xs font-semibold text-neutral-light-400 hover:bg-slate-50 disabled:opacity-60"
            >
              Dismiss
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => onReview(row.original, "resolve")}
              aria-label={`Mark the report against ${row.original.reportedUser.fullName} as actioned`}
              className="rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground hover:bg-brand-deep disabled:opacity-60"
            >
              Mark actioned
            </button>
          </div>
        )
      },
    }),
  ])
