"use client"
import { useState } from "react"
import { Check } from "lucide-react"
import { CheckboxSelect, FieldShell, NumberField, Panel, SelectField, SettingsActions, TagInput, Toggle } from "@/components/form/settings-fields"

const OCTET = "(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)"
const IPV4 = new RegExp(`^${OCTET}(?:\\.${OCTET}){3}$`)


const initialSecurity: SecurityState = {
  twoFactorAuthentication: [true, true],
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  accountLockoutDuration: 15,
  pwdMinLength: 8,
  requireSpecialCharx: true,
  requireUppercaseLetters: true,

  dataEncryption: "",
  sslCertificate: "",
  autoDataBackup: true,
  backupFrequency: "",
  dataRetentionPeriod: 365,

  ipWhitelisting: false,
  whiteListedIPs: [],
  suspiciousActivityDetection: true,

  gdprComplianceMode: true,
  cookieConsentBanner: true,
  userDataExport: true,
  rightToDeletion: true,
}

const SectionHead = ({
  title,
  description,
}: SecurityProps) => {
  return (
    <div className="flex items-center justify-between pb-4">
      <div>
        <h3
          className="block text-base font-semibold text-neutral-light-600"
        >
          {title}
        </h3>
        <p className="mt-0.5 text-xs font-normal text-neutral-light-400">{description}</p>
      </div>
    </div>
  )
}

const SecuritySettings = () => {
  const [security, setSecurity] = useState<SecurityState>(initialSecurity)
  const [savedSecurity, setSavedSecurity] =
    useState<SecurityState>(initialSecurity)
  const [justSaved, setJustSaved] = useState(false)

  const isChangeDefault = JSON.stringify(security) !== JSON.stringify(savedSecurity)
  
  const toggleCheck = (id: number) => {
    setSecurity((prev) => 
      ({...prev, twoFactorAuthentication: prev.twoFactorAuthentication.map((item, index) =>
        (index===id)? !item: item
      )})
    )
  }
  const set = <K extends keyof SecurityState>(key: K, value: SecurityState[K]) =>
    setSecurity((prev) => ({ ...prev, [key]: value }))

  const handleDiscard = () => setSecurity(savedSecurity);

  const handleSave = () => {
    setSavedSecurity(security);
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 2000);
  }


  return (
    <div className="space-y-6">
      <Panel>
        <SectionHead 
          title="Authentication"
          description="Configure 2FA, lockout durations, session rules, and complex user password constraints."
        />
        <FieldShell
          label="Two-Factor Authentication (2FA)"
          description="Enforce 2FA for platform access"
        >
          <CheckboxSelect
            id="auth"
            checked={security.twoFactorAuthentication}
            onToggle={toggleCheck}
            options={["Required for Admin", "Required for All Users"]}
            placeholder="Not required"
          />
        </FieldShell>
        <FieldShell
          label="Session Timeout"
          description="Auto-logout after period of inactivity"
          htmlFor="sessionTimeout"
        >
          <NumberField
            id="sessionTimeout"
            value={security.sessionTimeout}
            onChange={(v) => set("sessionTimeout", v)}
            suffix="minutes"
          />
        </FieldShell>
        <FieldShell
          label="Max Login Attempts"
          description="Lock account after consecutive failed attempts"
          htmlFor="maxLoginAttempts"
        >
          <NumberField
            id="maxLoginAttempts"
            value={security.maxLoginAttempts}
            onChange={(v) => set("maxLoginAttempts", v)}
          />
        </FieldShell>
        <FieldShell
          label="Account Lockout Duration"
          description="Duration account remains locked after max attempts"
          htmlFor="accountLockoutDuration"
        >
          <NumberField
            id="accountLockoutDuration"
            value={security.accountLockoutDuration}
            onChange={(v) => set("accountLockoutDuration", v)}
            suffix="minutes"
          />
        </FieldShell>
        <FieldShell
          label="Password Minimum Length"
          description="Minimum characters required for user passwords"
          htmlFor="pwdMinLength"
        >
          <NumberField
            id="pwdMinLength"
            value={security.pwdMinLength}
            onChange={(v) => set("pwdMinLength", v)}
          />
        </FieldShell>
        <FieldShell
          label="Require Special Characters"
          description="Passwords must include special characters"
        >
          <Toggle
            checked={security.requireSpecialCharx}
            onChange={(v) => set("requireSpecialCharx", v)}
            label="Require Special Characters"
          />
        </FieldShell>
        <FieldShell
          label="Require Uppercase Letters"
          description="Passwords must include at least one uppercase letter"
        >
          <Toggle
            checked={security.requireSpecialCharx}
            onChange={(v) => set("requireSpecialCharx", v)}
            label="Require Special Characters"
          />
        </FieldShell>
      </Panel>
      <Panel>
        <SectionHead 
          title="Data Protection"
          description="Manage end-to-end data encryption, transport security, and automatic backup routines."
        />
        <FieldShell
          label="Data Encryption"
          description="All user data encrypted at rest"
          htmlFor="pwdMinLength"
        >
          <span className=" text-[13px] font-semibold text-[#03543F] py-1 px-2.5 rounded-md bg-[#DEF7EC]">AES-256</span>
        </FieldShell>
        <FieldShell
          label="SSL Certificate"
          description="Transport layer security status"
        >
          <div className="flex gap-2 flex-nowrap items-center text-secondary-green-500 font-medium text-sm">
            <Check size={16} className=" h-4 w-4" />
            <span>Valid until Dec 2025</span>
          </div>
        </FieldShell>
        <FieldShell
          label="Auto Data Backup"
          description="Automatic daily backup of platform data"
        >
          <Toggle
            checked={security.autoDataBackup}
            onChange={(v) => set("autoDataBackup", v)}
            label="Auto Data Backup"
          />
        </FieldShell>
        <FieldShell
          label="Backup Frequency"
          description="How often platform data is backed up"
          htmlFor="backupFrequency"
        >
          <SelectField
            id="backupFrequency"
            value={security.backupFrequency}
            onChange={(v) => set("backupFrequency", v)}
            options={["Daily", "Weekly", "Monthly", "Yearly"]}
          />
        </FieldShell>
        <FieldShell
          label="Data Retention Period"
          description="How long deleted user data is retained before permanent removal"
          htmlFor="dataRetentionPeriod"
        >
          <NumberField
            id="dataRetentionPeriod"
            value={security.dataRetentionPeriod}
            onChange={(v) => set("dataRetentionPeriod", v)}
            suffix="days"
          />
        </FieldShell>
      </Panel>
      <Panel>
        <SectionHead 
          title="Access Control"
          description="Restrict administrative reach, inspect secure platform activity, and track audit trails."
        />
        <FieldShell
          label="IP Whitelisting"
          description="Restrict admin access to specific IP addresses"
        >
          <Toggle
            checked={security.ipWhitelisting}
            onChange={(v) => set("ipWhitelisting", v)}
            label="IP Whitelisting"
          />
        </FieldShell>
        <TagInput
          id="whiteListedIPs"
          label="Whitelisted IPs"
          values={security.whiteListedIPs}
          onChange={(ips) => set("whiteListedIPs", ips)}
          placeholder="Add IP address..."
          noun="IP"
          validate={(ip) =>
            !IPV4.test(ip) ? "Enter a valid IP address" : security.whiteListedIPs.includes(ip) ? "That IP is already added" : null
          }
        />
        <FieldShell
          label="Admin Role Permissions"
          description="Manage admin roles and their access levels"
        >
          <button
            className=" text-purple-light-600 text-sm font-semibold underline underline-offset-2 cursor-pointer"
            onClick={()=> alert('coming soon!')}
          >
            View/Edit
          </button>
        </FieldShell>
        <FieldShell
          label="Login Activity Logs"
          description="Monitor recent login activity across the platform"
        >
          <button
            className=" text-purple-light-600 text-sm font-semibold underline underline-offset-2 cursor-pointer"
            onClick={()=> alert('coming soon!')}
          >
            View Logs
          </button>
        </FieldShell>
        <FieldShell
          label="Suspicious Activity Detection"
          description="Flag unusual login patterns or locations"
        >
          <Toggle
            checked={security.suspiciousActivityDetection}
            onChange={(v) => set("suspiciousActivityDetection", v)}
            label="Suspicious Activity Detection"
          />
        </FieldShell>        
      </Panel>
      <Panel>
        <SectionHead 
          title="Privacy & compliance"
          description="Adjust GDPR compliance switches, consent forms, and automated account purging features."
        />
        <FieldShell
          label="GDPR Compliance Mode"
          description="Enable GDPR-compliant data handling and consent flows"
        >
          <Toggle
            checked={security.gdprComplianceMode}
            onChange={(v) => set("gdprComplianceMode", v)}
            label="GDPR Compliance Mode"
          />
        </FieldShell>        
        <FieldShell
          label="Cookie Consent Banner"
          description="Show cookie consent banner to users"
        >
          <Toggle
            checked={security.cookieConsentBanner}
            onChange={(v) => set("cookieConsentBanner", v)}
            label="Cookie Consent Banner"
          />
        </FieldShell>
        <FieldShell
          label="User Data Export"
          description="Allow users to request export of their personal data"
        >
          <Toggle
            checked={security.userDataExport}
            onChange={(v) => set("userDataExport", v)}
            label="User Data Export"
          />
        </FieldShell>        
        <FieldShell
          label="Right to Deletion"
          description="Allow users to request permanent deletion of their data"
        >
          <Toggle
            checked={security.rightToDeletion}
            onChange={(v) => set("rightToDeletion", v)}
            label="Right to Deletion"
          />
        </FieldShell>
      </Panel>
      <SettingsActions isDirty={isChangeDefault} justSaved={justSaved} onDiscard={handleDiscard} onSave={handleSave} />
    </div>
  )
}

export default SecuritySettings