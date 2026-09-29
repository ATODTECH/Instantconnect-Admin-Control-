type Cell = string | number | boolean | null | undefined

/**
 * Quotes every cell and defuses one a spreadsheet would run as a formula; a bare
 * number such as a phone keeps its leading plus.
 */
const toCell = (value: Cell) => {
  const text = value === null || value === undefined ? "" : String(value)
  const isPlainNumber = /^[+-]?[\d\s().]+$/.test(text)
  const safe = /^[=+\-@\t\r]/.test(text) && !isPlainNumber ? `'${text}` : text
  return `"${safe.replace(/"/g, '""')}"`
}

/** Builds a CSV in the browser and downloads it. For data already on screen. */
export function downloadCsv(filename: string, headers: string[], rows: Cell[][]) {
  const csv = [headers, ...rows].map((row) => row.map(toCell).join(",")).join("\r\n")
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }))
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
