import { createDataTableColumns } from "@/components/data-table/columns"
import { StatusBadge } from "@/components/shared/status-badge"
import { UserAvatar } from "@/components/shared/user-avatar"
import { formatCount } from "@/lib/format"
import { CATEGORY_TONE, fmtDate, STATUS_TONE } from "./constants"

const column = createDataTableColumns<CommunityRow>()

export const communityColumns = (onView: (community: CommunityRow) => void) =>
  column.columns([
    column.accessor("communityName", {
      header: "Community Name",
      meta: { cellClassName: "max-w-48 font-semibold text-neutral-light-600" },
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <UserAvatar
            name={row.original.communityName}
            src={row.original.communityAvatar || null}
            shape="square"
            fallback={row.original.communityName[0]}
          />
          <span title={row.original.communityName} className="truncate">{row.original.communityName}</span>
        </div>
      ),
    }),
    column.accessor("createdBy", {
      header: "Creator",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <UserAvatar name={row.original.createdBy} src={row.original.creatorAvatar || null} size="xs" />
          <span className="whitespace-nowrap font-medium text-neutral-light-400">{row.original.createdBy}</span>
        </div>
      ),
    }),
    column.accessor("category", {
      header: "Category",
      cell: ({ getValue }) => <StatusBadge tone={CATEGORY_TONE[getValue()]}>{getValue()}</StatusBadge>,
    }),
    column.accessor("members", {
      header: "Members",
      meta: { cellClassName: "font-medium text-neutral-light-400" },
      cell: ({ getValue }) => formatCount(getValue()),
    }),
    column.accessor("weeklyPost", {
      header: "Post This Week",
      meta: { cellClassName: "min-w-30 font-medium text-neutral-light-400" },
      cell: ({ getValue }) => formatCount(getValue()),
    }),
    column.accessor("dateCreated", {
      header: "Date Created",
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
        <button
          type="button"
          onClick={() => onView(row.original)}
          aria-label={`View ${row.original.communityName}`}
          className="rounded-md border border-violet-200 px-3 py-1 text-xs font-medium text-primary hover:bg-secondary"
        >
          View
        </button>
      ),
    }),
  ])
