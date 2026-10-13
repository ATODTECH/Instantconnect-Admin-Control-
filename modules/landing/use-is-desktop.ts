"use client"

import { useEffect, useState } from "react"

/**
 * Whether the viewport is at the lg breakpoint or wider. Starts true so the
 * server render and first paint match the desktop layout.
 */
export const useIsDesktop = () => {
  const [desktop, setDesktop] = useState(true)

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)")
    const update = () => setDesktop(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  return desktop
}
