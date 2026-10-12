"use client"

import { useState } from "react"
import { TriangleAlert } from "lucide-react"
import {
  FieldShell,
  NumberField,
  Panel,
  SelectField,
  SettingsActions,
  TextField,
  Toggle,
} from "@/components/form/settings-fields"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { WidgetError } from "@/components/widget-state"
import { usePlatformSettings, useUpdatePlatformSettings } from "@/hooks/use-settings"
import { formatActivityDate } from "@/lib/format"
import type { EditablePlatformSettings, PlatformSettings } from "@/types/admin-settings"

/** The legal floor the server also enforces. */
const MINIMUM_AGE_FLOOR = 18
const MINIMUM_AGE_CEILING = 100

const EDITABLE_KEYS = [
  "maintenanceMode",
  "allowNewRegistrations",
  "minimumAge",
  "kycRequiredToJoinEvents",
  "kycRequiredToCreateEvents",
  "allowPaidEvents",
] as const satisfies readonly (keyof EditablePlatformSettings)[]

const editableFrom = (settings: PlatformSettings): EditablePlatformSettings =>
  Object.fromEntries(EDITABLE_KEYS.map((key) => [key, settings[key]])) as unknown as EditablePlatformSettings

const changesBetween = (saved: EditablePlatformSettings, draft: EditablePlatformSettings) =>
  Object.fromEntries(EDITABLE_KEYS.filter((key) => saved[key] !== draft[key]).map((key) => [key, draft[key]])) as Partial<EditablePlatformSettings>

const noop = () => {}

const GeneralSettings = () => {
  const { data, isPending, isError, refetch, isRefetching } = usePlatformSettings()
  const { mutate: save, isPending: isSaving } = useUpdatePlatformSettings()
  const [draft, setDraft] = useState<EditablePlatformSettings | null>(null)
  const [confirmingMaintenance, setConfirmingMaintenance] = useState(false)

  if (isPending) return <GeneralSettingsSkeleton />
  if (isError) {
    return (
      <Panel>
        <WidgetError message="Couldn't load the platform settings." onRetry={() => refetch()} isRetrying={isRefetching} className="py-10" />
      </Panel>
    )
  }

  const saved = editableFrom(data)
  const values = draft ?? saved
  const changes = changesBetween(saved, values)
  const isDirty = Object.keys(changes).length > 0
  const ageError =
    !Number.isInteger(values.minimumAge) || values.minimumAge < MINIMUM_AGE_FLOOR || values.minimumAge > MINIMUM_AGE_CEILING
      ? `Enter a whole number from ${MINIMUM_AGE_FLOOR} to ${MINIMUM_AGE_CEILING}`
      : null

  const set = <K extends keyof EditablePlatformSettings>(key: K, value: EditablePlatformSettings[K]) =>
    setDraft({ ...values, [key]: value })

  const commit = () =>
    save(changes, {
      onSuccess: () => {
        setDraft(null)
        setConfirmingMaintenance(false)
      },
    })

  const handleSave = () => {
    if (ageError) return
    // Switching it on locks every member out, so it gets a second look.
    if (changes.maintenanceMode === true) {
      setConfirmingMaintenance(true)
      return
    }
    commit()
  }

  return (
    <div className="space-y-6">
      {data.maintenanceMode && (
        <div role="status" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#DC2626]" aria-hidden />
          <p className="text-sm text-red-900">
            <span className="font-semibold">Maintenance mode is on.</span> Members can&apos;t use the app until it&apos;s switched off. The dashboard keeps working.
          </p>
        </div>
      )}

      <Panel title="General Settings">
        <FieldShell label="Platform Name" description="The brand name displayed to users across the platform emails and client apps." htmlFor="platformName" locked>
          <TextField id="platformName" value="InstantLinkUp" onChange={noop} />
        </FieldShell>
        <FieldShell label="Platform Description" description="Brief overview of the platform purpose used for metadata and SEO." htmlFor="platformDescription" locked>
          <TextField id="platformDescription" value="A community and events platform for real-time local connection" onChange={noop} />
        </FieldShell>
        <FieldShell label="Default Language" description="Preferred localization setting for system notifications and default translation." htmlFor="defaultLanguage" locked>
          <SelectField id="defaultLanguage" value="English (US)" onChange={noop} options={["English (US)"]} className="w-72" />
        </FieldShell>
        <FieldShell label="Timezone" description="Platform metrics and scheduled jobs already run on Lagos time." htmlFor="timezone" locked>
          <SelectField id="timezone" value="Africa/Lagos (WAT)" onChange={noop} options={["Africa/Lagos (WAT)"]} className="w-72" />
        </FieldShell>
        <FieldShell
          label="Maintenance Mode"
          description="Members get a 'down for maintenance' message on every request, signed in or not. Admins and this dashboard keep working."
        >
          <Toggle checked={values.maintenanceMode} onChange={(v) => set("maintenanceMode", v)} label="Maintenance Mode" />
        </FieldShell>
      </Panel>

      <Panel title="User Registration Settings">
        <FieldShell label="Allow New Registrations" description="When off, sign-up in the app is refused. Existing members can still sign in.">
          <Toggle checked={values.allowNewRegistrations} onChange={(v) => set("allowNewRegistrations", v)} label="Allow New Registrations" />
        </FieldShell>
        <FieldShell label="Require Email Verification" description="Members confirm their email with a code before they can use the app. Always on." locked>
          <Toggle checked onChange={noop} label="Require Email Verification" />
        </FieldShell>
        <FieldShell label="Require Phone Verification" description="Require an SMS code at sign-up as well." locked>
          <Toggle checked={false} onChange={noop} label="Require Phone Verification" />
        </FieldShell>
        <FieldShell
          label="Minimum Age Requirement"
          description={`Checked against the date of birth at sign-up. It can be raised, but never below the legal floor of ${MINIMUM_AGE_FLOOR}. Existing members are not affected.`}
          htmlFor="minimumAge"
        >
          <div className="flex flex-col items-end gap-1">
            <NumberField id="minimumAge" value={values.minimumAge} onChange={(v) => set("minimumAge", v)} suffix="yrs" className="w-28" />
            {ageError && <p role="alert" className="text-xs text-[#D94949]">{ageError}</p>}
          </div>
        </FieldShell>
        <FieldShell label="KYC Required for Events" description="Members must have passed KYC before they can join an event.">
          <Toggle checked={values.kycRequiredToJoinEvents} onChange={(v) => set("kycRequiredToJoinEvents", v)} label="KYC Required for Events" />
        </FieldShell>
      </Panel>

      <Panel title="Event Settings">
        <FieldShell label="Max Event Capacity" description="Events have no capacity limit yet." htmlFor="maxEventCapacity" locked>
          <NumberField id="maxEventCapacity" value={500} onChange={noop} />
        </FieldShell>
        <FieldShell label="Allow Paid Events" description="When off, new events must be free. Paid events that already exist stay as they are.">
          <Toggle checked={values.allowPaidEvents} onChange={(v) => set("allowPaidEvents", v)} label="Allow Paid Events" />
        </FieldShell>
        <FieldShell label="Platform Commission" description="Waits on ticket checkout for events." htmlFor="platformCommission" locked>
          <NumberField id="platformCommission" value={5} onChange={noop} suffix="%" />
        </FieldShell>
        <FieldShell label="Auto-approve Events" description="Events publish straight away; there is no review step yet." locked>
          <Toggle checked onChange={noop} label="Auto-approve Events" />
        </FieldShell>
        <FieldShell label="Event Creation Requires KYC" description="Members must have passed KYC before they can host an event.">
          <Toggle checked={values.kycRequiredToCreateEvents} onChange={(v) => set("kycRequiredToCreateEvents", v)} label="Event Creation Requires KYC" />
        </FieldShell>
      </Panel>

      <Panel title="Community Settings">
        <FieldShell label="Max Communities Per User" description="Members can create any number of communities today." htmlFor="maxCommunitiesPerUser" locked>
          <NumberField id="maxCommunitiesPerUser" value={5} onChange={noop} />
        </FieldShell>
        <FieldShell label="Allow Private Communities" description="Members can make a community invite-only. Always on." locked>
          <Toggle checked onChange={noop} label="Allow Private Communities" />
        </FieldShell>
        <FieldShell label="Require Admin Approval" description="New communities go live straight away; there is no review step yet." locked>
          <Toggle checked={false} onChange={noop} label="Require Admin Approval" />
        </FieldShell>
        <FieldShell label="Max Members Per Community" description="Communities have no member cap yet." htmlFor="maxMembersPerCommunity" locked>
          <NumberField id="maxMembersPerCommunity" value={10000} onChange={noop} className="w-28" />
        </FieldShell>
      </Panel>

      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-neutral-light-400">
          Last changed {formatActivityDate(data.updatedAt)}
          {data.updatedByName && ` by ${data.updatedByName}`}
        </p>
        <SettingsActions
          isDirty={isDirty && !ageError}
          justSaved={false}
          isSaving={isSaving}
          onDiscard={() => setDraft(null)}
          onSave={handleSave}
        />
      </div>

      <AlertDialog open={confirmingMaintenance} onOpenChange={setConfirmingMaintenance}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-red-50 text-[#EF4444]">
              <TriangleAlert aria-hidden />
            </AlertDialogMedia>
            <AlertDialogTitle>Turn on maintenance mode?</AlertDialogTitle>
            <AlertDialogDescription>
              Every member is locked out of the app straight away, until you switch it off again here.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSaving}>Cancel</AlertDialogCancel>
            {/* A plain Button, not AlertDialogAction, so the dialog stays open with the spinner while saving. */}
            <Button variant="danger" loading={isSaving} onClick={commit}>
              Turn on and save
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

const GeneralSettingsSkeleton = () => (
  <div role="status" className="space-y-6">
    <span className="sr-only">Loading settings</span>
    {[3, 3].map((rows, panel) => (
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

export default GeneralSettings
