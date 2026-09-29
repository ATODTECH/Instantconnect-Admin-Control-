"use client"

import { useMemo } from "react"
import { useTable } from "@tanstack/react-table"
import { cn } from "cn"
import { Checkbox } from "@/components/ui/checkbox"
import { ProgressBar } from "@/components/ui/progress-bar"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { WidgetEmpty, WidgetError } from "@/components/widget-state"
import { dataTableFeatures, type DataTableColumns } from "./columns"

interface DataTableSelection {
  selectedIds: ReadonlySet<string>
  onChange: (next: Set<string>) => void
  /** Accessible name for a row's checkbox, e.g. the person's name. */
  rowLabel: (id: string) => string
}

export interface DataTableProps<TData extends object> {
  /** Names the table for screen readers. */
  label: string
  columns: DataTableColumns<TData>
  data: readonly TData[]
  getRowId: (row: TData) => string
  isLoading?: boolean
  /** Background refetch or page change with rows still on screen. */
  isRefreshing?: boolean
  skeletonRows?: number
  error?: Error | null
  onRetry?: () => void
  isRetrying?: boolean
  emptyMessage?: string
  /** Adds a checkbox column. Selection is by id, so it survives paging. */
  selection?: DataTableSelection
  /** Pagination or anything else under the rows. */
  footer?: React.ReactNode
  /** Tailwind min-width for the table before it scrolls sideways. */
  minWidthClassName?: string
  rowClassName?: (row: TData) => string | undefined
  className?: string
}

const NO_ROWS: never[] = []

export function DataTable<TData extends object>({
  label,
  columns,
  data,
  getRowId,
  isLoading = false,
  isRefreshing = false,
  skeletonRows = 8,
  error,
  onRetry,
  isRetrying = false,
  emptyMessage = "Nothing to show yet.",
  selection,
  footer,
  minWidthClassName = "min-w-[950px]",
  rowClassName,
  className,
}: DataTableProps<TData>) {
  const rows = useMemo(() => (data.length ? [...data] : NO_ROWS), [data])
  const table = useTable({
    features: dataTableFeatures,
    columns,
    data: rows,
    getRowId: (row) => getRowId(row),
  })

  const columnCount = columns.length + (selection ? 1 : 0)
  const pageIds = rows.map(getRowId)
  const allOnPageSelected = selection !== undefined && pageIds.length > 0 && pageIds.every((id) => selection.selectedIds.has(id))
  const someOnPageSelected = selection !== undefined && pageIds.some((id) => selection.selectedIds.has(id))

  const togglePage = () => {
    if (!selection) return
    const next = new Set(selection.selectedIds)
    pageIds.forEach((id) => (allOnPageSelected ? next.delete(id) : next.add(id)))
    selection.onChange(next)
  }

  const toggleRow = (id: string) => {
    if (!selection) return
    const next = new Set(selection.selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    selection.onChange(next)
  }

  const showError = Boolean(error) && rows.length === 0 && !isLoading

  return (
    <div className={cn("shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white", className)}>
      <ProgressBar className={isRefreshing ? "visible" : "invisible"} />
      {showError ? (
        <WidgetError message={error!.message} onRetry={() => onRetry?.()} isRetrying={isRetrying} className="py-16" />
      ) : (
        <div aria-busy={isLoading || isRefreshing}>
          <Table aria-label={label} className={cn(minWidthClassName, "transition-opacity", isRefreshing && "opacity-60")}>
            <TableHeader>
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id} className="border-b-primary-border bg-[#FBFBFD] hover:bg-[#FBFBFD]">
                  {selection && (
                    <TableHead className="w-10 pl-5">
                      <Checkbox
                        aria-label="Select all on this page"
                        checked={allOnPageSelected ? true : someOnPageSelected ? "indeterminate" : false}
                        onCheckedChange={togglePage}
                        disabled={rows.length === 0}
                      />
                    </TableHead>
                  )}
                  {group.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      scope="col"
                      className={cn(
                        "h-auto py-3.75 text-xs font-semibold uppercase text-neutral-light-300 first:pl-5 last:pr-5",
                        header.column.columnDef.meta?.headerClassName,
                      )}
                    >
                      {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: skeletonRows }, (_, index) => (
                  <TableRow key={index} aria-hidden className="hover:bg-transparent">
                    {Array.from({ length: columnCount }, (_, cell) => (
                      <TableCell key={cell} className="py-4 first:pl-5 last:pr-5">
                        <Skeleton className={cn("h-4", cell === 0 && selection ? "w-4 rounded" : cell % 3 === 1 ? "w-32" : "w-20")} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : rows.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={columnCount}>
                    <WidgetEmpty message={emptyMessage} className="py-14" />
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => {
                  const isSelected = selection?.selectedIds.has(row.id) ?? false
                  return (
                    <TableRow
                      key={row.id}
                      data-state={isSelected ? "selected" : undefined}
                      className={cn("border-slate-100 data-[state=selected]:bg-violet-50/40", rowClassName?.(row.original))}
                    >
                      {selection && (
                        <TableCell className="pl-5 pr-4">
                          <Checkbox
                            aria-label={`Select ${selection.rowLabel(row.id)}`}
                            checked={isSelected}
                            onCheckedChange={() => toggleRow(row.id)}
                          />
                        </TableCell>
                      )}
                      {row.getAllCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={cn("py-3 text-sm first:pl-5 last:pr-5", cell.column.columnDef.meta?.cellClassName)}
                        >
                          <table.FlexRender cell={cell} />
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
          {isLoading && <span role="status" className="sr-only">Loading {label.toLowerCase()}</span>}
        </div>
      )}
      {footer}
    </div>
  )
}
