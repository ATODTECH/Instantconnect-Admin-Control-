import { Panel } from "@/components/form/settings-fields"
import { Skeleton } from "@/components/ui/skeleton"
import { WidgetError } from "@/components/widget-state"

export const SettingsError = ({ onRetry, isRetrying }: { onRetry: () => void, isRetrying: boolean }) => (
  <Panel>
    <WidgetError message="Couldn't load the platform settings." onRetry={onRetry} isRetrying={isRetrying} className="py-10" />
  </Panel>
)

export const SettingsSkeleton = ({ panels = [3, 3] }: { panels?: number[] }) => (
  <div role="status" className="space-y-6">
    <span className="sr-only">Loading settings</span>
    {panels.map((rows, panel) => (
      <Panel key={panel}>
        <Skeleton className="mb-4 h-5 w-40" />
        {Array.from({ length: rows }, (_, row) => (
          <div key={row} className="flex items-center justify-between gap-6 py-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-80" />
            </div>
            <Skeleton className="h-5 w-9 rounded-full" />
          </div>
        ))}
      </Panel>
    ))}
  </div>
)
