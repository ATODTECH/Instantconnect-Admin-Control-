"use client"
import { KeyboardEvent, useEffect, useRef, useState } from "react"
import { FieldShell, NumberField, SelectField, Toggle } from "../general"
import { Check, ChevronDown, CircleX } from "lucide-react"


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

const Panel = ({
  children,
}: {children: React.ReactNode}) => {
  return (
    <div className="rounded-xl bg-neutral-white p-6 shadow-[0px_0px_10px_0px_#0000000] space-y-4 border border-primary-border">
      <div className="divide-y divide-slate-100">{children}</div>
    </div>
  )
}

const SectionHead = ({
  title,
  description,
}: SecurityProps) => {
  return (
    <div className="flex items-center justify-between pb-4">
      <div>
        <h3
          className="block text-sm font-semibold text-neutral-light-500"
        >
          {title}
        </h3>
        <p className="mt-0.5 text-xs font-normal text-neutral-light-400">{description}</p>
      </div>
    </div>
  )
}

const SelectField2FA = ({
  id,
  checked,
  onChange,
  options,
}: SelectField2FA) => {

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
 
  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [])


  return (
    <div className="relative" ref={containerRef}>
      <button
        id={id}
        onClick={() => setOpen((o) => !o)}
        // onChange={(e) => onChange(e.target.value)}
        className={[
          "appearance-none w-56 text-start rounded-lg border border-slate-200 bg-neutral-white px-3 py-2 pr-9 text-sm font-normal text-neutral-light-500",
          "shadow-sm transition-colors",
          "focus:outline-none focus:ring-1 focus:ring-purple-light-600 focus:border-purple-light-600",
        ].join(" ")}
      >
        Required for Admin
      </button>
      <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748BEB]" />

      {open && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-primary-border bg-neutral-white py-2 px-3 shadow-lg divide-y">
          {options.map((option, index) => (
            <button key={option} type="button" className="flex py-2 text-start items-center gap-2 outline-none ring-0 cursor-pointer w-full">
              <input type="checkbox" name={option} checked={checked[index]} onChange={(e) => onChange(index)} className=" accent-purple-light-600 h-4 w-4" />
              <span className=" truncate w-full text-sm font-normal text-neutral-light-300">
                {option}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}


const WhitelistedIPsField = ({
  ips,
  onChange,
}: WhitelistedIPsProps) => {
  const [draft, setDraft] = useState("")
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const IP_RE = /^(?:(:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  const commitDraft = () => {
    const value = draft.trim().replace(/,$/, "");
    if (!value) return;

    if (!IP_RE.test(value)) {
      setError("Enter a valid IP address");
      return;
    }
    if (ips.includes(value)) {
      setError("That IP is already added");
      return;
    }

    onChange([...ips, value]);
    setDraft("");
    setError(null);
  }

  const removeIP = (ip: string) => {
    onChange(ips.filter((e) => e !== ip));
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault(); 
      commitDraft();
    } else if (e.key === "Backspace" && draft === "" && ips.length > 0) {
      onChange(ips.slice(0, -1));
    }
  }

  return (
    <div className="mt-4">
      <label className="block text-xs font-semibold text-[#334155]">
        Whitelisted IPs
      </label>
      <div
        onClick={() => inputRef.current?.focus()}
        className={[
          "mt-2 flex flex-wrap items-center gap-2 rounded-lg border border-[#D1D5DB] bg-primary px-3 py-2 mb-4",
          "transition-colors cursor-text",
          error
            ? "border-red-300 ring-1 ring-red-200"
            : "border-slate-200 focus-within:ring-1 focus-within:ring-purple-light-600 ring-purple-light-600",
        ].join(" ")}
      >
        {ips.map((ip) => (
          <span
            key={ip}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#F1F5F9] border border-primary-border px-2.5 py-1 font-medium text-[13px] text-[#334155]"
          >
            {ip}
            <CircleX 
              size={14}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeIP(ip);
              }}
              className="h-3.5 w-3.5 text-neutral-light-400 transition-colors hover:text-[#334155] cursor-pointer"
            />
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={draft}
          placeholder={ips.length === 0 ? "Add IP address... e.g. 192.168.1.1" : "Add IP address"}
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
          <SelectField2FA
            id="auth"
            checked={security.twoFactorAuthentication}
            onChange={(v) => toggleCheck((v))}
            options={['Required for Admin', 'Required for All Users']}
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
        <WhitelistedIPsField
          ips={security.whiteListedIPs}
          onChange={(ips) => set("whiteListedIPs", ips)}
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

export default SecuritySettings