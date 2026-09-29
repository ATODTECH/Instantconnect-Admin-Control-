"use client"

import { useEffect } from "react"
import { WidgetError } from "@/components/widget-state"

// A render error in one page stays inside the page area; the sidebar keeps working.
const DashboardError = ({ error, retry }: { error: Error & { digest?: string }, retry: () => void }) => {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-1 items-center justify-center pr-8">
      <WidgetError
        message="This page failed to load. The rest of the dashboard still works."
        onRetry={retry}
        className="rounded-2xl bg-neutral-white p-10 shadow-[0px_0px_10px_0px_#00000005]"
      />
    </div>
  )
}

export default DashboardError
