"use client"

import { useState } from "react";
import { FieldShell, Panel, SettingsActions, TagInput, Toggle } from "@/components/form/settings-fields";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


const initialNotification: NotificationState = {
  welcomeEmail: true,
  subscriptionConfirmation: true,
  paymentReceipt: true,
  paymentFailedAlert: true,
  eventReminder: true,
  kycStatusUpdate: true,
  accountDeactivationWarning: true,

  newMessage: true,
  connectionRequest: true,
  eventUpdates: true,
  communityActivity: false,
  nearbyEvents: false,

  failedPaymentAlerts: true,
  newKycSubmission: true,
  reportedContent: true,
  highTrafficWarning: false,
  adminEmailRecipients: ["admin@instantconnect.com", "support@instantconnect.com"],
}

const NotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationState>(initialNotification)
  const [savedSettings, setSavedSettings] =
    useState<NotificationState>(initialNotification)
  const [justSaved, setJustSaved] = useState(false)

  const isChangeDefault = JSON.stringify(settings) !== JSON.stringify(savedSettings)
  
  const set = <K extends keyof NotificationState>(key: K, value: NotificationState[K]) =>
    setSettings((prev) => ({ ...prev, [key]: value }))

  const handleDiscard = () => setSettings(savedSettings)

  const handleSave = () => {
    setSavedSettings(settings)
    setJustSaved(true)
    window.setTimeout(() => setJustSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <Panel title="Email Notifications">
        <FieldShell
          label="Welcome Email"
          description="Send welcome email to new users upon registration"
        >
          <Toggle
            checked={settings.welcomeEmail}
            onChange={(v) => set("welcomeEmail", v)}
            label="Welcome Email"
          />
        </FieldShell>
        <FieldShell
          label="Subscription Confirmation"
          description="Notify users when subscription is activated or renewed"
        >
          <Toggle
            checked={settings.subscriptionConfirmation}
            onChange={(v) => set("subscriptionConfirmation", v)}
            label="Subscription Confirmation"
          />
        </FieldShell>
        <FieldShell
          label="Payment Receipt"
          description="Send payment receipt after successful transactions"
        >
          <Toggle
            checked={settings.paymentReceipt}
            onChange={(v) => set("paymentReceipt", v)}
            label="Payment Receipt"
          />
        </FieldShell>
        <FieldShell
          label="Payment Failed Alert"
          description="Alert users when payment fails"
        >
          <Toggle
            checked={settings.paymentFailedAlert}
            onChange={(v) => set("paymentFailedAlert", v)}
            label="Payment Failed Alert"
          />
        </FieldShell>
        <FieldShell
          label="Event Reminder"
          description="Send reminder 24 hours before event starts"
        >
          <Toggle
            checked={settings.eventReminder}
            onChange={(v) => set("eventReminder", v)}
            label="Event Reminder"
          />
        </FieldShell>
        <FieldShell
          label="KYC Status Update"
          description="Notify users when KYC verification status changes"
        >
          <Toggle
            checked={settings.eventReminder}
            onChange={(v) => set("eventReminder", v)}
            label="KYC Status Update"
          />
        </FieldShell>
        <FieldShell
          label="Account Deactivation Warning"
          description="Warn users before account deactivation"
        >
          <Toggle
            checked={settings.eventReminder}
            onChange={(v) => set("eventReminder", v)}
            label="Account Deactivation Warning"
          />
        </FieldShell>
      </Panel>
      <Panel title="Push Notifications">
        <FieldShell
          label="New Message"
          description="Notify when user receives a new message"
        >
          <Toggle
            checked={settings.newMessage}
            onChange={(v) => set("newMessage", v)}
            label="New Message"
          />
        </FieldShell>
        <FieldShell
          label="Connection Request"
          description="Alert when someone sends a connection request"
        >
          <Toggle
            checked={settings.connectionRequest}
            onChange={(v) => set("connectionRequest", v)}
            label="Connection Request"
          />
        </FieldShell>
        <FieldShell
          label="Event Updates"
          description="Notify about event changes or cancellations"
        >
          <Toggle
            checked={settings.eventUpdates}
            onChange={(v) => set("eventUpdates", v)}
            label="Event Updates"
          />
        </FieldShell>
        <FieldShell
          label="Community Activity"
          description="Notify about new posts in joined communities"
        >
          <Toggle
            checked={settings.communityActivity}
            onChange={(v) => set("communityActivity", v)}
            label="Community Activity"
          />
        </FieldShell>
        <FieldShell
          label="Nearby Events"
          description="Alert users about events near their location"
        >
          <Toggle
            checked={settings.nearbyEvents}
            onChange={(v) => set("nearbyEvents", v)}
            label="Nearby Events"
          />
        </FieldShell>
      </Panel>
      <Panel title="Admin Alerts">
        <FieldShell
          label="Failed Payment Alerts"
          description="Notify admin team when payments fail"
        >
          <Toggle
            checked={settings.failedPaymentAlerts}
            onChange={(v) => set("failedPaymentAlerts", v)}
            label="Failed Payment Alerts"
          />
        </FieldShell>
        <FieldShell
          label="New KYC Submission"
          description="Alert when new KYC document is submitted"
        >
          <Toggle
            checked={settings.newKycSubmission}
            onChange={(v) => set("newKycSubmission", v)}
            label="New KYC Submission"
          />
        </FieldShell>
        <FieldShell
          label="Reported Content"
          description="Notify when content or user is reported"
        >
          <Toggle
            checked={settings.reportedContent}
            onChange={(v) => set("reportedContent", v)}
            label="Reported Content"
          />
        </FieldShell>
        <FieldShell
          label="High Traffic Warning"
          description="Alert when platform traffic exceeds threshold"
        >
          <Toggle
            checked={settings.highTrafficWarning}
            onChange={(v) => set("highTrafficWarning", v)}
            label="High Traffic Warning"
          />
        </FieldShell>
        {/* Email Field */}
        <TagInput
          id="adminEmailRecipients"
          label="Admin Email Recipients"
          values={settings.adminEmailRecipients}
          onChange={(emails) => set("adminEmailRecipients", emails)}
          placeholder="Add email..."
          noun="email"
          validate={(email) =>
            !EMAIL_REGEX.test(email) ? "Enter a valid email address" : settings.adminEmailRecipients.includes(email) ? "That email is already added" : null
          }
          className="mt-6"
        />
      </Panel>
      <SettingsActions isDirty={isChangeDefault} justSaved={justSaved} onDiscard={handleDiscard} onSave={handleSave} />
    </div>
  )
}

export default NotificationSettings