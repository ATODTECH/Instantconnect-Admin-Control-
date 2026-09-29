"use client"

import { useState } from "react"
import { FieldShell, NumberField, Panel, SelectField, SettingsActions, TextField, Toggle } from "@/components/form/settings-fields"

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

      <SettingsActions isDirty={isChangeDefault} justSaved={justSaved} onDiscard={handleDiscard} onSave={handleSave} />
    </div>
  )
}

export default GeneralSettings