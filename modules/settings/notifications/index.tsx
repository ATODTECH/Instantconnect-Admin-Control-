"use client"

import { FieldShell, Panel, SettingsActions, TagInput, Toggle } from "@/components/form/settings-fields"
import { useSettingsDraft } from "@/hooks/use-settings-draft"
import { SettingsError, SettingsSkeleton } from "../settings-state"

const KEYS = [
  "pushMessages",
  "pushConnections",
  "pushEvents",
  "pushMeetups",
  "pushKyc",
  "pushCommunities",
  "kycSubmittedAlert",
  "adminAlertEmails",
] as const

/** The design's email rows. The app sends none of these emails yet. */
const EMAIL_ROWS = [
  { label: "Welcome Email", description: "Send welcome email to new users upon registration" },
  { label: "Subscription Confirmation", description: "Notify users when subscription is activated or renewed" },
  { label: "Payment Receipt", description: "Send payment receipt after successful transactions" },
  { label: "Payment Failed Alert", description: "Alert users when payment fails" },
  { label: "Event Reminder", description: "Send reminder 24 hours before event starts" },
  { label: "KYC Status Update", description: "Notify users when KYC verification status changes" },
  { label: "Account Deactivation Warning", description: "Warn users before account deactivation" },
] as const

const PUSH_SWITCHES = [
  { key: "pushMessages", label: "New Message", description: "Notify when user receives a new message" },
  { key: "pushConnections", label: "Connection Request", description: "Alert when someone sends a connection request, or accepts one" },
  { key: "pushEvents", label: "Event Updates", description: "Notify about event invites and new attendees" },
  { key: "pushCommunities", label: "Community Activity", description: "Notify about community invites, and comments and replies on members' posts" },
  { key: "pushMeetups", label: "Meetup Updates", description: "Notify when a meetup is proposed, accepted, declined or cancelled" },
  { key: "pushKyc", label: "KYC Decisions", description: "Notify when identity documents are approved or rejected" },
] as const

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_RECIPIENTS = 10

const noop = () => {}

const NotificationSettings = () => {
  const { query, values, isDirty, isSaving, set, discard, save } = useSettingsDraft(KEYS)

  if (query.isPending) return <SettingsSkeleton panels={[7, 6, 5]} />
  if (query.isError || !values) return <SettingsError onRetry={() => query.refetch()} isRetrying={query.isRefetching} />

  const alertWithoutRecipients = values.kycSubmittedAlert && values.adminAlertEmails.length === 0

  return (
    <div className="space-y-6">
      <Panel title="Email Notifications">
        {EMAIL_ROWS.map(({ label, description }) => (
          <FieldShell key={label} label={label} description={description} locked>
            <Toggle checked={false} onChange={noop} label={label} />
          </FieldShell>
        ))}
      </Panel>

      <Panel
        title="Push Notifications"
        description="Platform wide: switching one off stops its push for everyone, though the notification still appears in the app. Safety checks during a meetup always go out."
      >
        {PUSH_SWITCHES.map(({ key, label, description }) => (
          <FieldShell key={key} label={label} description={description}>
            <Toggle checked={values[key]} onChange={(v) => set(key, v)} label={label} />
          </FieldShell>
        ))}
        <FieldShell label="Nearby Events" description="Alert users about events near their location" locked>
          <Toggle checked={false} onChange={noop} label="Nearby Events" />
        </FieldShell>
      </Panel>

      <Panel title="Admin Alerts">
        <FieldShell label="Failed Payment Alerts" description="Notify admin team when payments fail" locked>
          <Toggle checked={false} onChange={noop} label="Failed Payment Alerts" />
        </FieldShell>
        <FieldShell label="New KYC Submission" description="Email the recipients below whenever a member submits identity documents.">
          <Toggle checked={values.kycSubmittedAlert} onChange={(v) => set("kycSubmittedAlert", v)} label="New KYC Submission" />
        </FieldShell>
        <FieldShell label="Reported Content" description="Notify when content or user is reported" locked>
          <Toggle checked={false} onChange={noop} label="Reported Content" />
        </FieldShell>
        <FieldShell label="High Traffic Warning" description="Alert when platform traffic exceeds threshold" locked>
          <Toggle checked={false} onChange={noop} label="High Traffic Warning" />
        </FieldShell>
        <div className="pt-2">
          <TagInput
            id="adminAlertEmails"
            label="Admin Email Recipients"
            description={`Up to ${MAX_RECIPIENTS} addresses. Press Enter after each one.`}
            values={values.adminAlertEmails}
            onChange={(v) => set("adminAlertEmails", v)}
            placeholder="Add email..."
            normalise={(value) => value.toLowerCase()}
            validate={(value) =>
              !EMAIL.test(value)
                ? "Enter a valid email address"
                : values.adminAlertEmails.length >= MAX_RECIPIENTS
                  ? `At most ${MAX_RECIPIENTS} recipients`
                  : null
            }
            noun="email"
          />
          {alertWithoutRecipients && (
            <p role="alert" className="mt-2 text-xs text-[#D94949]">Add at least one recipient, or no alert can be sent.</p>
          )}
        </div>
      </Panel>

      <SettingsActions isDirty={isDirty && !alertWithoutRecipients} justSaved={false} isSaving={isSaving} onDiscard={discard} onSave={save} />
    </div>
  )
}

export default NotificationSettings
