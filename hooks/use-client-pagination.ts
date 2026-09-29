import { useState } from "react"

/**
 * Pages an in-memory list, for screens still on mock data. Any change to
 * `resetKey` (a search or filter) starts again at page 1.
 */
export function useClientPagination<T>(items: readonly T[], pageSize: number, resetKey: string) {
  const [state, setState] = useState({ resetKey, page: 1 })
  if (state.resetKey !== resetKey) setState({ resetKey, page: 1 })

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const page = Math.min(state.resetKey === resetKey ? state.page : 1, totalPages)

  return {
    page,
    pageRows: items.slice((page - 1) * pageSize, page * pageSize),
    setPage: (next: number) => setState({ resetKey, page: next }),
  }
}
