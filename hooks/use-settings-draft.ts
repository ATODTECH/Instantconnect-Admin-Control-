import { useState } from "react"
import { usePlatformSettings, useUpdatePlatformSettings } from "@/hooks/use-settings"
import type { EditablePlatformSettings, PlatformSettings } from "@/types/admin-settings"

type Editable<K extends keyof EditablePlatformSettings> = Pick<EditablePlatformSettings, K>

/** Lists compare by content, so re-adding a removed word counts as no change. */
const same = (a: unknown, b: unknown) => (Array.isArray(a) && Array.isArray(b) ? JSON.stringify(a) === JSON.stringify(b) : a === b)

/**
 * One settings tab's unsaved edits over the saved settings. Each tab owns a
 * slice of the same record and saves only the keys it changed.
 */
export function useSettingsDraft<K extends keyof EditablePlatformSettings>(keys: readonly K[]) {
  const query = usePlatformSettings()
  const { mutate: save, isPending: isSaving } = useUpdatePlatformSettings()
  const [draft, setDraft] = useState<Editable<K> | null>(null)

  const pick = (settings: PlatformSettings) => Object.fromEntries(keys.map((key) => [key, settings[key]])) as unknown as Editable<K>

  const saved = query.data ? pick(query.data) : null
  const values = draft ?? saved
  const changes = saved && values ? (Object.fromEntries(keys.filter((key) => !same(saved[key], values[key])).map((key) => [key, values[key]])) as Partial<Editable<K>>) : {}

  return {
    query,
    values,
    isDirty: Object.keys(changes).length > 0,
    isSaving,
    set: <F extends K>(key: F, value: Editable<K>[F]) => values && setDraft({ ...values, [key]: value }),
    discard: () => setDraft(null),
    save: () => save(changes, { onSuccess: () => setDraft(null) }),
  }
}
