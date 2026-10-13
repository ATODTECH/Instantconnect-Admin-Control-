import api from "@/lib/axios"
import type { EditablePlatformSettings, PlatformSettings } from "@/types/admin-settings"

export const getPlatformSettings = async (): Promise<PlatformSettings> => {
  const { data } = await api.get<PlatformSettings>("/admin/settings")
  return data
}

export const updatePlatformSettings = async (changes: Partial<EditablePlatformSettings>): Promise<PlatformSettings> => {
  const { data } = await api.patch<PlatformSettings>("/admin/settings", changes)
  return data
}
