"use client"

import { ChevronDown } from "lucide-react"
import { useState } from "react"

const initialSettings: SettingsState = {
  platformName: "Instantconnect",
  platformDescription: "A community and events platform for real-time connection",
  defaultLanguage: "English (US)",
  timezone: "Africa/Lagos (WAT)",
  maintenanceMode: false,

  allowNewRegistrations: true,
  requireEmailVerification: true,
  requirePhoneVerification: false,
  minimumAge: 18,
  kycRequiredForEvents: true,

  maxEventCapacity: 500,
  allowPaidEvents: true,
  platformCommission: 5,
  autoApproveEvents: false,
  eventCreationRequiresKyc: true,

  maxCommunitiesPerUser: 5,
  allowPrivateCommunities: true,
  requireAdminApproval: false,
  maxMembersPerCommunity: 10000,
}

export const Toggle = ({
  checked,
  onChange,
  label,
}: ToggleProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={[
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full",
        "transition-colors duration-200 ease-in-out",
        "focus:outline-none focus-visible:ring-1 focus-visible:ring-purple-light-600 focus-visible:ring-offset-2 cursor-pointer",
        checked ? "bg-purple-light-600" : "bg-[#CBD5E1]",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block h-4 w-4 transform rounded-full bg-neutral-white shadow",
          "transition-transform duration-200 ease-in-out",
          checked ? "translate-x-6" : "translate-x-1",
        ].join(" ")}
      />
    </button>
  )
}

export const FieldShell = ({
  label,
  description,
  htmlFor,
  children,
}: FieldShellProps) => {
  return (
    <div className="flex items-center justify-between gap-6 py-4 first:pt-0 last:pb-0">
      <div className="max-w-md">
        <label
          htmlFor={htmlFor}
          className="block text-sm font-semibold text-neutral-light-500"
        >
          {label}
        </label>
        <p className="mt-0.5 text-xs font-normal text-neutral-light-400">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

export const TextField = ({
  id,
  value,
  onChange,
  placeholder,
  className = "w-72",
}: TextFieldProps) => {
  return (
    <input
      id={id}
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={[
        className,
        "rounded-lg border border-slate-200 bg-neutral-white px-3 py-2 text-sm font-normal text-neutral-light-500 truncate",
        "shadow-sm transition-colors",
        "focus:outline-none focus:ring-1 focus:ring-purple-light-600 focus:border-purple-light-600",
      ].join(" ")}
    />
  )
}

export const NumberField = ({
  id,
  value,
  onChange,
  suffix,
  className = "w-24",
}: NumberFieldProps) => {
  return (
    <div className="relative">
      <input
        id={id}
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={[
          className,
          suffix ? "pr-7" : "",
          "rounded-lg border border-slate-200 bg-neutral-white px-3 py-2 text-sm font-normal text-neutral-light-500",
          "shadow-sm transition-colors",
          "focus:outline-none focus:ring-1 focus:ring-purple-light-600 focus:border-purple-light-600",
        ].join(" ")}
      />
      {suffix && (
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-medium text-sm text-neutral-light-400">
          {suffix}
        </span>
      )}
    </div>
  );
}

export const SelectField = ({
  id,
  value,
  onChange,
  options,
  className = "w-56",
}: SelectFieldProps) => {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          className,
          "appearance-none rounded-lg border border-slate-200 bg-neutral-white px-3 py-2 pr-9 text-sm font-normal text-neutral-light-500",
          "shadow-sm transition-colors",
          "focus:outline-none focus:ring-1 focus:ring-purple-light-600 focus:border-purple-light-600",
        ].join(" ")}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748BEB]" />
    </div>
  )
}

export const Panel = ({
  title,
  children,
}: PanelProps) => {
  return (
    <div className="rounded-xl bg-neutral-white p-6 shadow-[0px_0px_10px_0px_#0000000] space-y-4 border border-primary-border">
      <h2 className="text-base font-bold text-neutral-light-600">{title}</h2>
      <div className="divide-y divide-slate-100">{children}</div>
    </div>
  )
}


const GeneralSettings = () => {
  const [settings, setSettings] = useState<SettingsState>(initialSettings)
  const [savedSettings, setSavedSettings] =
    useState<SettingsState>(initialSettings)
  const [justSaved, setJustSaved] = useState(false)

  const isChangeDefault = JSON.stringify(settings) !== JSON.stringify(savedSettings)

  const set = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) =>
    setSettings((prev) => ({ ...prev, [key]: value }))

  const handleDiscard = () => setSettings(savedSettings)

  const handleSave = () => {
    setSavedSettings(settings)
    setJustSaved(true)
    window.setTimeout(() => setJustSaved(false), 2000)
  }


   return (
    <div className="space-y-6">
      {/* General Settings */}
      <Panel title="General Settings">
        <FieldShell
          label="Platform Name"
          description="The brand name displayed to users across the platform emails and client apps."
          htmlFor="platformName"
        >
          <TextField
            id="platformName"
            value={settings.platformName}
            onChange={(v) => set("platformName", v)}
          />
        </FieldShell>

        <FieldShell
          label="Platform Description"
          description="Brief overview of the platform purpose used for metadata and SEO."
          htmlFor="platformDescription"
        >
          <TextField
            id="platformDescription"
            value={settings.platformDescription}
            onChange={(v) => set("platformDescription", v)}
          />
        </FieldShell>

        <FieldShell
          label="Default Language"
          description="Preferred localization setting for system notifications and system default translation."
          htmlFor="defaultLanguage"
        >
          <SelectField
            id="defaultLanguage"
            value={settings.defaultLanguage}
            onChange={(v) => set("defaultLanguage", v)}
            options={["English (US)", "English (UK)", "French", "Spanish", "Portuguese"]}
          />
        </FieldShell>

        <FieldShell
          label="Timezone"
          description="Primary timeline timezone used for platform-wide metrics and scheduled community maintenance."
          htmlFor="timezone"
        >
          <SelectField
            id="timezone"
            value={settings.timezone}
            onChange={(v) => set("timezone", v)}
            options={[
              "Africa/Lagos (WAT)",
              "UTC",
              "America/New_York (ET)",
              "Europe/London (GMT)",
            ]}
          />
        </FieldShell>

        <FieldShell
          label="Maintenance Mode"
          description="Restrict general public access to client applications while running critical server migrations."
        >
          <Toggle
            checked={settings.maintenanceMode}
            onChange={(v) => set("maintenanceMode", v)}
            label="Maintenance Mode"
          />
        </FieldShell>
      </Panel>

      {/* User Registration Settings */}
      <Panel title="User Registration Settings">
        <FieldShell
          label="Allow New Registrations"
          description="Enable or disable onboarding for new users trying to join Communa."
        >
          <Toggle
            checked={settings.allowNewRegistrations}
            onChange={(v) => set("allowNewRegistrations", v)}
            label="Allow New Registrations"
          />
        </FieldShell>

        <FieldShell
          label="Require Email Verification"
          description="Send verification link on registration before users can access live groups."
        >
          <Toggle
            checked={settings.requireEmailVerification}
            onChange={(v) => set("requireEmailVerification", v)}
            label="Require Email Verification"
          />
        </FieldShell>

        <FieldShell
          label="Require Phone Verification"
          description="Require OTP-based active SMS verification upon signup for fraud prevention."
        >
          <Toggle
            checked={settings.requirePhoneVerification}
            onChange={(v) => set("requirePhoneVerification", v)}
            label="Require Phone Verification"
          />
        </FieldShell>

        <FieldShell
          label="Minimum Age Requirement"
          description="Legal minimum age criteria required to join communities on the platform."
          htmlFor="minimumAge"
        >
          <NumberField
            id="minimumAge"
            value={settings.minimumAge}
            onChange={(v) => set("minimumAge", v)}
          />
        </FieldShell>

        <FieldShell
          label="KYC Required for Events"
          description="Enforce user identity confirmation before letting them purchase tickets or attend public events."
        >
          <Toggle
            checked={settings.kycRequiredForEvents}
            onChange={(v) => set("kycRequiredForEvents", v)}
            label="KYC Required for Events"
          />
        </FieldShell>
      </Panel>

      {/* Event Settings */}
      <Panel title="Event Settings">
        <FieldShell
          label="Max Event Capacity"
          description="Cap on maximum number of participants standard hosts can schedule per event."
          htmlFor="maxEventCapacity"
        >
          <NumberField
            id="maxEventCapacity"
            value={settings.maxEventCapacity}
            onChange={(v) => set("maxEventCapacity", v)}
          />
        </FieldShell>

        <FieldShell
          label="Allow Paid Events"
          description="Permit ticket sale integrations and checkout structures on event registration."
        >
          <Toggle
            checked={settings.allowPaidEvents}
            onChange={(v) => set("allowPaidEvents", v)}
            label="Allow Paid Events"
          />
        </FieldShell>

        <FieldShell
          label="Platform Commission"
          description="Commission percentage retained by the platform on ticket sales from paid events."
          htmlFor="platformCommission"
        >
          <NumberField
            id="platformCommission"
            value={settings.platformCommission}
            onChange={(v) => set("platformCommission", v)}
            suffix="%"
          />
        </FieldShell>

        <FieldShell
          label="Auto-approve Events"
          description="Automatically publish scheduled events without moderator vetting."
        >
          <Toggle
            checked={settings.autoApproveEvents}
            onChange={(v) => set("autoApproveEvents", v)}
            label="Auto-approve Events"
          />
        </FieldShell>

        <FieldShell
          label="Event Creation Requires KYC"
          description="Hosts must complete valid KYC verification status prior to scheduling new public events."
        >
          <Toggle
            checked={settings.eventCreationRequiresKyc}
            onChange={(v) => set("eventCreationRequiresKyc", v)}
            label="Event Creation Requires KYC"
          />
        </FieldShell>
      </Panel>

      {/* Community Settings */}
      <Panel title="Community Settings">
        <FieldShell
          label="Max Communities Per User"
          description="Limits the absolute count of primary groups or communities a single profile can initiate."
          htmlFor="maxCommunitiesPerUser"
        >
          <NumberField
            id="maxCommunitiesPerUser"
            value={settings.maxCommunitiesPerUser}
            onChange={(v) => set("maxCommunitiesPerUser", v)}
          />
        </FieldShell>

        <FieldShell
          label="Allow Private Communities"
          description="Permit invite-only and discoverability hidden community access levels."
        >
          <Toggle
            checked={settings.allowPrivateCommunities}
            onChange={(v) => set("allowPrivateCommunities", v)}
            label="Allow Private Communities"
          />
        </FieldShell>

        <FieldShell
          label="Require Admin Approval"
          description="Requires global platform moderator verification before public launch of new channels."
        >
          <Toggle
            checked={settings.requireAdminApproval}
            onChange={(v) => set("requireAdminApproval", v)}
            label="Require Admin Approval"
          />
        </FieldShell>

        <FieldShell
          label="Max Members Per Community"
          description="Strict ceiling on member caps per group for technical channel optimization."
          htmlFor="maxMembersPerCommunity"
        >
          <NumberField
            id="maxMembersPerCommunity"
            value={settings.maxMembersPerCommunity}
            onChange={(v) => set("maxMembersPerCommunity", v)}
            className="w-28"
          />
        </FieldShell>
      </Panel>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pb-4">
        {justSaved && (
          <span className="mr-auto text-sm font-medium text-secondary-green-500">
            Changes saved
          </span>
        )}
        <button
          type="button"
          onClick={handleDiscard}
          disabled={!isChangeDefault}
          className={[
            "rounded-lg border border-[#E6E5EA] bg-neutral-white px-4 py-2 text-sm font-semibold text-neutral-light-400",
            "shadow-sm transition-colors hover:bg-slate-50",
            "disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
          ].join(" ")}
        >
          Discard
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!isChangeDefault}
          className={[
            "rounded-lg bg-purple-light-600 px-4 py-2 text-sm font-semibold text-neutral-white",
            "shadow-sm transition-colors hover:bg-purple-light-600/90",
            "disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
          ].join(" ")}
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}

export default GeneralSettings