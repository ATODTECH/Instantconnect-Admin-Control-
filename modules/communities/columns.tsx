import { cn } from "cn"
import { createDataTableColumns } from "@/components/data-table/columns"
import { StatusBadge } from "@/components/shared/status-badge"
import { UserAvatar } from "@/components/shared/user-avatar"
import { formatCount } from "@/lib/format"
import type { AdminCommunityRow } from "@/types/admin-communities"
import { formatDay } from "../events/constants"
import { STATUS_LABELS, categoryTone, initialColour } from "./constants"

const column = createDataTableColumns<AdminCommunityRow>()

export const communityColumns = (onView: (community: AdminCommunityRow) => void) =>
  column.columns([
    column.display({
      id: "name",
      header: "Community Name",
      meta: { cellClassName: "max-w-50" },
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-white", initialColour(row.original.id))}
          >
            {row.original.name.charAt(0).toUpperCase()}
          </span>
          <span className="truncate font-semibold text-neutral-light-600" title={row.original.name}>{row.original.name}</span>
        </div>
      ),
    }),
    column.display({
      id: "creator",
      header: "Creator",
      meta: { cellClassName: "max-w-50" },
      cell: ({ row }) =>
        row.original.creator ? (
          <div className="flex items-center gap-2">
            <UserAvatar name={row.original.creator.fullName} src={row.original.creator.avatarUrl} size="md" />
            <span className="truncate font-medium text-neutral-light-400">{row.original.creator.fullName}</span>
          </div>
        ) : (
          <span className="text-neutral-light-400">{row.original.isOfficial ? "Safety Team" : "Deleted account"}</span>
        ),
    }),
    column.display({
      id: "category",
      header: "Category",
      cell: ({ row }) =>
        row.original.isOfficial ? (
          <StatusBadge tone="brand">Official</StatusBadge>
        ) : row.original.categoryLabel ? (
          <StatusBadge tone={categoryTone(row.original.categoryId)}>{row.original.categoryLabel}</StatusBadge>
        ) : (
          <span className="text-neutral-light-400">None</span>
        ),
    }),
    column.accessor("memberCount", {
      header: "Members",
      meta: { cellClassName: "font-medium text-neutral-light-400" },
      cell: ({ getValue }) => formatCount(getValue()),
    }),
    column.accessor("postsThisWeek", {
      header: "Posts This Week",
      meta: { cellClassName: "font-medium text-neutral-light-400" },
      cell: ({ getValue }) => formatCount(getValue()),
    }),
    column.accessor("createdAt", {
      header: "Date Created",
      meta: { cellClassName: "whitespace-nowrap text-neutral-light-400" },
      cell: ({ getValue }) => formatDay(getValue()),
    }),
    column.accessor("status", {
      header: "Status",
      cell: ({ getValue }) => <StatusBadge tone={STATUS_LABELS[getValue()].tone}>● {STATUS_LABELS[getValue()].label}</StatusBadge>,
    }),
    column.display({
      id: "actions",
      header: "Actions",
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
