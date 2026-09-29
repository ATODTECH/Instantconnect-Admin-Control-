import { ArrowLeft, ArrowRight, Ellipsis } from "lucide-react"
import { cn } from "cn"
import { formatCount } from "@/lib/format"
import { getPageList } from "@/lib/pagination"

interface DataTablePaginationProps {
  /** 1-based. */
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  /** What a row is, for "Showing 1-10 of 41 users". */
  noun?: { one: string, other: string }
  isLoading?: boolean
}

const STEP = "inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 disabled:text-slate-300 disabled:cursor-not-allowed disabled:hover:bg-transparent"

export const DataTablePagination = ({
  page,
  pageSize,
  total,
  onPageChange,
  noun = { one: "result", other: "results" },
  isLoading = false,
}: DataTablePaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  return (
    <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 flex-wrap gap-3">
      <p className="text-sm font-semibold text-neutral-light-300/60" aria-live="polite">
        {isLoading ? (
          <span>Loading {noun.other}…</span>
        ) : total === 0 ? (
          <span>Showing 0 {noun.other}</span>
        ) : (
          <>
            Showing <b className="text-neutral-light-500">{start}-{end}</b> of{" "}
            <b className="text-neutral-light-500">{formatCount(total)}</b> {total === 1 ? noun.one : noun.other}
          </>
        )}
      </p>
      <nav aria-label="Pagination" className="flex items-center gap-2">
        <button type="button" className={STEP} onClick={() => onPageChange(page - 1)} disabled={page <= 1 || isLoading}>
          <ArrowLeft className="w-4 h-4" aria-hidden />
          Previous
        </button>
        {getPageList(page, totalPages).map((item, index) =>
          item === "ellipsis" ? (
            <span key={`ellipsis-${index}`} aria-hidden className="px-1 text-neutral-light-500">
              <Ellipsis className="w-4 h-4" />
            </span>
          ) : (
            <button
              type="button"
              key={item}
              onClick={() => onPageChange(item)}
              aria-current={item === page ? "page" : undefined}
              aria-label={`Page ${item}`}
              className={cn(
                "min-w-10 h-10 px-3 text-sm font-medium rounded-xl border transition-colors",
                item === page ? "bg-primary border-primary text-primary-foreground" : "border-slate-200 text-neutral-light-600 hover:bg-slate-50",
              )}
            >
              {item}
            </button>
          ),
        )}
        <button type="button" className={STEP} onClick={() => onPageChange(page + 1)} disabled={page >= totalPages || isLoading}>
          Next
          <ArrowRight className="w-4 h-4" aria-hidden />
        </button>
      </nav>
    </div>
  )
}
