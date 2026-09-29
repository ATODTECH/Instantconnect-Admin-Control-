import { cn } from "cn"
import { createDataTableColumns } from "@/components/data-table/columns"
import { StatusBadge } from "@/components/shared/status-badge"
import { UserAvatar } from "@/components/shared/user-avatar"
import type { Tone } from "@/lib/tones"
import type { Priority } from "@/types/kyc-verification"
import type { UserRecord } from "./mock-users"

export const KYC_TONE: Record<KycStatus, Tone> = {
  Verified: "success",
  Pending: "warning",
  Rejected: "neutral",
}

const PRIORITY_TONE: Record<Priority, Tone> = {
  High: "danger",
  Medium: "brand",
  Low: "neutral",
}

const column = createDataTableColumns<UserRecord>()

export const kycColumns = (onOpen: (person: UserRecord) => void) =>
  column.columns([
    column.display({
      id: "user",
      header: "User",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <UserAvatar name={row.original.name} src={row.original.avatar || null} />
          <div>
            <div className="text-sm font-semibold text-neutral-light-600">{row.original.name}</div>
            <div className="text-xs text-neutral-light-300">{row.original.email}</div>
          </div>
        </div>
      ),
    }),
    column.display({
      id: "documents",
      header: "Document Type",
      meta: { cellClassName: "max-w-50" },
      cell: ({ row }) => (
        <span title={`${row.original.docType.nin}, ${row.original.docType.otherKYCType}`} className="block truncate font-medium text-neutral-light-500">
          {row.original.docType.nin}, {row.original.docType.otherKYCType}
        </span>
      ),
    }),
    column.accessor("kycDateSubmitted", {
      header: "Submitted Date",
      meta: { cellClassName: "text-neutral-light-400" },
    }),
    column.accessor("kyc", {
      header: "Status",
      cell: ({ getValue }) => <StatusBadge tone={KYC_TONE[getValue()]}>{getValue()}</StatusBadge>,
    }),
    column.accessor("priority", {
      header: "Priority",
      cell: ({ getValue }) => <StatusBadge tone={PRIORITY_TONE[getValue()]}>{getValue()}</StatusBadge>,
    }),
    column.accessor("action", {
      header: "Action",
      meta: { headerClassName: "text-right", cellClassName: "text-right" },
      cell: ({ row, getValue }) => (
        <button
          type="button"
          onClick={() => onOpen(row.original)}
          aria-label={`${getValue()} ${row.original.name}'s documents`}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-semibold",
            getValue() === "Review" ? "bg-primary text-primary-foreground hover:bg-brand-deep" : "border border-brand-tint bg-secondary text-primary hover:bg-brand-surface",
          )}
        >
          {getValue()}
        </button>
      ),
    }),
  ])
