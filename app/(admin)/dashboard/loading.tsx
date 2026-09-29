import { ProgressBar } from "@/components/ui/progress-bar"
import { Skeleton } from "@/components/ui/skeleton"

// Rendered inside the dashboard layout, so the sidebar and top bar stay put
// while only the page area waits.
const DashboardLoading = () => {
  return (
    <div role="status" aria-live="polite" className="flex flex-1 flex-col gap-y-6 overflow-hidden pr-8">
      <span className="sr-only">Loading page</span>
      <ProgressBar className="rounded-full" />
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-29.25 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-80 w-full rounded-2xl" />
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  )
}

export default DashboardLoading
