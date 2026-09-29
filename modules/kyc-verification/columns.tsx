import { cn } from "cn"
import { createDataTableColumns } from "@/components/data-table/columns"
import { StatusBadge } from "@/components/shared/status-badge"
import { UserAvatar } from "@/components/shared/user-avatar"
import type { KycSubmission } from "@/types/admin-kyc"
import { ADDITIONAL_ID_LABELS, KYC_STATUS_LABELS, PRIORITY_TONE, formatDay, priorityOf } from "./constants"

const column = createDataTableColumns<KycSubmission>()

export const documentsOf = (submission: KycSubmission) =>
  `National ID Card, ${ADDITIONAL_ID_LABELS[submission.additionalIdKind]}`

export const kycColumns = (onOpen: (submission: KycSubmission) => void) =>
  column.columns([
    column.display({
      id: "user",
      header: "User",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <UserAvatar name={row.original.applicant.fullName} src={row.original.applicant.avatarUrl} />
          <div>
            <div className="text-sm font-semibold text-neutral-light-600">{row.original.applicant.fullName}</div>
            <div className="text-xs text-neutral-light-300">{row.original.applicant.email}</div>
          </div>
        </div>
      ),
    }),
    column.display({
      id: "documents",
      header: "Document Type",
      meta: { cellClassName: "max-w-50" },
      cell: ({ row }) => (
        <span title={documentsOf(row.original)} className="block truncate font-medium text-neutral-light-500">
          {documentsOf(row.original)}
        </span>
      ),
    }),
    column.accessor("submittedAt", {
      header: "Submitted Date",
      meta: { cellClassName: "text-neutral-light-400" },
      cell: ({ getValue }) => formatDay(getValue()),
    }),
    column.accessor("status", {
      header: "Status",
      cell: ({ getValue }) => <StatusBadge tone={KYC_STATUS_LABELS[getValue()].tone}>{KYC_STATUS_LABELS[getValue()].label}</StatusBadge>,
    }),
    column.display({
      id: "priority",
      header: "Priority",
      cell: ({ row }) => {
        if (row.original.status !== "pending") return <span className="text-neutral-light-300">—</span>
        const priority = priorityOf(row.original.submittedAt)
        return <StatusBadge tone={PRIORITY_TONE[priority]}>{priority}</StatusBadge>
      },
    }),
    column.display({
      id: "action",
      header: "Action",
      meta: { headerClassName: "text-right", cellClassName: "text-right" },
      cell: ({ row }) => {
        const isPending = row.original.status === "pending"
        return (
          <button
            type="button"
            onClick={() => onOpen(row.original)}
            aria-label={`${isPending ? "Review" : "View"} ${row.original.applicant.fullName}'s documents`}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-semibold",
              isPending ? "bg-primary text-primary-foreground hover:bg-brand-deep" : "border border-brand-tint bg-secondary text-primary hover:bg-brand-surface",
            )}
          >
            {isPending ? "Review" : "View"}
          </button>
        )
      },
    }),
  ])
