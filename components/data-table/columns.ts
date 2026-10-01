import { createColumnHelper, metaHelper, tableFeatures, type ColumnDef } from "@tanstack/react-table"

export interface DataTableColumnMeta {
  headerClassName?: string
  cellClassName?: string
}

/**
 * Tables here render and select rows; sorting, filtering and paging happen on
 * the server, so no row-model features are on.
 */
export const dataTableFeatures = tableFeatures({
  columnMeta: metaHelper<DataTableColumnMeta>(),
})

export type DataTableFeatures = typeof dataTableFeatures

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- a column list mixes value types
export type DataTableColumns<TData extends object> = ColumnDef<DataTableFeatures, TData, any>[]

export const createDataTableColumns = <TData extends object>() => createColumnHelper<DataTableFeatures, TData>()
