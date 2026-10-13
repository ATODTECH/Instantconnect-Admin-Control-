import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getPlatformSettings, updatePlatformSettings } from "@/lib/api/settings"

export const settingsKeys = {
  platform: ["settings", "platform"] as const,
}

export const usePlatformSettings = () =>
  useQuery({
    queryKey: settingsKeys.platform,
    queryFn: getPlatformSettings,
  })

export const useUpdatePlatformSettings = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePlatformSettings,
    onSuccess: (settings) => {
      queryClient.setQueryData(settingsKeys.platform, settings)
      toast.success("Settings saved")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
