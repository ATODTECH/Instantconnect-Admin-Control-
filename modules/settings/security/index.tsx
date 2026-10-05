"use client"

import { Check } from "lucide-react"
import { FieldShell, NumberField, Panel, SelectField, SettingsActions, TextField, Toggle } from "@/components/form/settings-fields"
import { StatusBadge } from "@/components/shared/status-badge"
import { useSettingsDraft } from "@/hooks/use-settings-draft"
import { SettingsError, SettingsSkeleton } from "../settings-state"

const KEYS = ["lockoutEnabled", "lockoutMaxAttempts", "lockoutMinutes", "keepSignedInDays"] as const

const LIMITS = {
  lockoutMaxAttempts: { min: 3, max: 20 },
  lockoutMinutes: { min: 1, max: 1440 },
  keepSignedInDays: { min: 1, max: 365 },
} as const

type NumericKey = keyof typeof LIMITS

const rangeError = (key: NumericKey, value: number) => {
  const { min, max } = LIMITS[key]
  return Number.isInteger(value) && value >= min && value <= max ? null : `Enter a whole number from ${min} to ${max}`
}

const noop = () => {}

const SecuritySettings = () => {
  const { query, values, isDirty, isSaving, set, discard, save } = useSettingsDraft(KEYS)

  if (query.isPending) return <SettingsSkeleton panels={[8, 5, 4, 4]} />
  if (query.isError || !values) return <SettingsError onRetry={() => query.refetch()} isRetrying={query.isRefetching} />

  const errors = {
    lockoutMaxAttempts: rangeError("lockoutMaxAttempts", values.lockoutMaxAttempts),
    lockoutMinutes: rangeError("lockoutMinutes", values.lockoutMinutes),
    keepSignedInDays: rangeError("keepSignedInDays", values.keepSignedInDays),
  }
  const hasErrors = Object.values(errors).some(Boolean)

  const numberField = (key: NumericKey, suffix: string) => (
    <div className="flex flex-col items-end gap-1">
      <NumberField id={key} value={values[key]} onChange={(v) => set(key, v)} suffix={suffix} className="w-40" />
      {errors[key] && <p role="alert" className="text-xs text-[#D94949]">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="space-y-6">
      <Panel title="Authentication" description="Configure 2FA, lockout durations, session rules, and user password constraints.">
        <FieldShell label="Two-Factor Authentication (2FA)" description="Enforce 2FA for platform access" htmlFor="twoFactor" locked>
          <SelectField id="twoFactor" value="Off" onChange={noop} options={["Off"]} className="w-56" />
        </FieldShell>
        <FieldShell label="Keep Me Signed In" description="How long a member stays signed in after ticking Keep me signed in. Without it, a session lasts a day." htmlFor="keepSignedInDays">
          {numberField("keepSignedInDays", "days")}
        </FieldShell>
        <FieldShell label="Lock Accounts After Failed Sign-ins" description="Applies in the app and on this dashboard. Setting a new password through Forgot Password unlocks the account.">
          <Toggle checked={values.lockoutEnabled} onChange={(v) => set("lockoutEnabled", v)} label="Lock Accounts After Failed Sign-ins" />
        </FieldShell>
        <FieldShell label="Max Login Attempts" description="Lock account after consecutive failed attempts" htmlFor="lockoutMaxAttempts">
          {numberField("lockoutMaxAttempts", "tries")}
        </FieldShell>
        <FieldShell label="Account Lockout Duration" description="Duration account remains locked after max attempts" htmlFor="lockoutMinutes">
          {numberField("lockoutMinutes", "minutes")}
        </FieldShell>
        <FieldShell label="Password Minimum Length" description="Minimum characters required for user passwords. Fixed at 8 today." htmlFor="pwdMinLength" locked>
          <NumberField id="pwdMinLength" value={8} onChange={noop} className="w-40" />
        </FieldShell>
        <FieldShell label="Require Special Characters" description="Passwords must include special characters" locked>
          <Toggle checked={false} onChange={noop} label="Require Special Characters" />
        </FieldShell>
        <FieldShell label="Require Uppercase Letters" description="Passwords must include at least one uppercase letter. Always on." locked>
          <Toggle checked onChange={noop} label="Require Uppercase Letters" />
        </FieldShell>
      </Panel>

      <Panel title="Data Protection" description="Data encryption, transport security, and backup routines.">
        <FieldShell label="Data Encryption" description="Passwords and PINs are hashed with Argon2; the database is encrypted at rest by the host." locked>
          <StatusBadge tone="success">At rest</StatusBadge>
        </FieldShell>
        <FieldShell label="SSL Certificate" description="Transport layer security status" locked>
          <span className="flex items-center gap-1 text-sm font-medium text-[#16A34A]">
            <Check className="h-4 w-4" aria-hidden /> Managed by the host
          </span>
        </FieldShell>
        <FieldShell label="Auto Data Backup" description="Automatic daily backup of platform data" locked>
          <Toggle checked={false} onChange={noop} label="Auto Data Backup" />
        </FieldShell>
        <FieldShell label="Backup Frequency" description="How often platform data is backed up" htmlFor="backupFrequency" locked>
          <SelectField id="backupFrequency" value="Daily" onChange={noop} options={["Daily"]} className="w-56" />
        </FieldShell>
        <FieldShell label="Data Retention Period" description="How long deleted user data is retained before permanent removal" htmlFor="retention" locked>
          <NumberField id="retention" value={365} onChange={noop} suffix="days" className="w-40" />
        </FieldShell>
      </Panel>

      <Panel title="Access Control" description="Restrict administrative reach, inspect secure platform activity, and track audit trails.">
        <FieldShell label="IP Whitelisting" description="Restrict admin access to specific IP addresses" locked>
          <Toggle checked={false} onChange={noop} label="IP Whitelisting" />
        </FieldShell>
        <FieldShell label="Whitelisted IPs" description="Addresses allowed to reach the dashboard" htmlFor="whitelist" locked>
          <TextField id="whitelist" value="" onChange={noop} placeholder="Add IP address... e.g. 192.168.1.1" className="w-56" />
        </FieldShell>
        <FieldShell label="Admin Role Permissions" description="Every admin has full access today" locked>
          <span className="text-sm text-primary underline">View/Edit</span>
        </FieldShell>
        <FieldShell label="Suspicious Activity Detection" description="Flag unusual login patterns or locations" locked>
          <Toggle checked={false} onChange={noop} label="Suspicious Activity Detection" />
        </FieldShell>
      </Panel>

      <Panel title="Privacy & Compliance" description="Compliance switches, consent forms, and account deletion.">
        <FieldShell label="GDPR Compliance Mode" description="Enable GDPR-compliant data handling and consent flows" locked>
          <Toggle checked={false} onChange={noop} label="GDPR Compliance Mode" />
        </FieldShell>
        <FieldShell label="Cookie Consent Banner" description="Show cookie consent banner to users" locked>
          <Toggle checked={false} onChange={noop} label="Cookie Consent Banner" />
        </FieldShell>
        <FieldShell label="User Data Export" description="Allow users to request export of their personal data" locked>
          <Toggle checked={false} onChange={noop} label="User Data Export" />
        </FieldShell>
        <FieldShell label="Right to Deletion" description="Members can delete their account from Settings in the app. Always on." locked>
          <Toggle checked onChange={noop} label="Right to Deletion" />
        </FieldShell>
      </Panel>

      <SettingsActions isDirty={isDirty && !hasErrors} justSaved={false} isSaving={isSaving} onDiscard={discard} onSave={save} />
    </div>
  )
}

export default SecuritySettings
