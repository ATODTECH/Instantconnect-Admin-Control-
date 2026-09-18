"use client"

import { KeyboardEvent, useRef, useState } from "react";
import { FieldShell, Panel, Toggle } from "../general";
import { CircleX } from "lucide-react";

interface NotificationState {
  welcomeEmail: boolean;
  subscriptionConfirmation: boolean;
  paymentReceipt: boolean;
  paymentFailedAlert: boolean;
  eventReminder: boolean;
  kycStatusUpdate: boolean;
  accountDeactivationWarning: boolean;

  newMessage: boolean;
  connectionRequest: boolean;
  eventUpdates: boolean;
  communityActivity: boolean;
  nearbyEvents: boolean;


  failedPaymentAlerts: boolean;
  newKycSubmission: boolean;
  reportedContent: boolean;
  highTrafficWarning: boolean;
  adminEmailRecipients: string[];
}

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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EmailRecipientsField = ({
  emails,
  onChange,
}: EmailRecipientProps) => {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commitDraft = () => {
    const value = draft.trim().replace(/,$/, "");
    if (!value) return;

    if (!EMAIL_REGEX.test(value)) {
      setError("Enter a valid email address");
      return;
    }
    if (emails.includes(value)) {
      setError("That email is already added");
      return;
    }

    onChange([...emails, value]);
    setDraft("");
    setError(null);
  };

  const removeEmail = (email: string) => {
    onChange(emails.filter((e) => e !== email));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault(); 
      commitDraft();
    } else if (e.key === "Backspace" && draft === "" && emails.length > 0) {
      onChange(emails.slice(0, -1));
    }
  };

  return (
    <div className="mt-6">
      <label className="block text-sm font-semibold text-[#334155]">
        Admin Email Recipients
      </label>
      <div
        onClick={() => inputRef.current?.focus()}
        className={[
          "mt-2 flex flex-wrap items-center gap-2 rounded-lg border border-[#D1D5DB] bg-neutral-white px-3 py-2",
          "transition-colors cursor-text",
          error
            ? "border-red-300 ring-1 ring-red-200"
            : "border-slate-200 focus-within:ring-2 focus-within:ring-purple-light-600 focus-within:border-puli600ring-purple-light-600",
        ].join(" ")}
      >
        {emails.map((email) => (
          <span
            key={email}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#F1F5F9] border border-primary-border px-2.5 py-1 font-medium text-[13px] text-[#334155]"
          >
            {email}
            <CircleX 
              size={14}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeEmail(email);
              }}
              className="h-3.5 w-3.5 text-neutral-light-400 transition-colors hover:text-[#334155] cursor-pointer"
            />
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={draft}
          placeholder={emails.length === 0 ? "Add email..." : "Add email..."}
          onChange={(e) => {
            setDraft(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={handleKeyDown}
          onBlur={commitDraft}
          className="min-w-40 flex-1 border-none bg-transparent p-1 text-[13px] font-normal text-[#334155] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-0"
        />
      </div>
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  )
}


const NotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationState>(initialNotification)
  const [savedSettings, setSavedSettings] =
    useState<NotificationState>(initialNotification)
  const [justSaved, setJustSaved] = useState(false)

  const isChangeDefault = JSON.stringify(settings) !== JSON.stringify(savedSettings)
  
  const set = <K extends keyof NotificationState>(key: K, value: NotificationState[K]) =>
    setSettings((prev) => ({ ...prev, [key]: value }))

  const handleDiscard = () => setSettings(savedSettings);

  const handleSave = () => {
    setSavedSettings(settings);
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 2000);
  };

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
        <EmailRecipientsField
          emails={settings.adminEmailRecipients}
          onChange={(emails) => set("adminEmailRecipients", emails)}
        />
      </Panel>
      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pb-4">
        {justSaved && (
          <span className="mr-auto text-sm font-medium text-emerald-600">
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

export default NotificationSettings