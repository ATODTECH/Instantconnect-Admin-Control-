"use client"
import { KeyboardEvent, useRef, useState } from "react"
import { FieldShell, NumberField, Panel, Toggle } from "../general"
import { CurrencyChips, FieldPayment, PrefixedNumberField, SelectFieldPayment } from "../payment"

// to-be fmt => API DATA
const initialState: ContentModerationState = {
  aIContentFilter: true,
  profanityFilter: true,
  spamDetection: true,
  nsfwImageDetection: true,
  linkScreening: false,
  sensitivityLevel: "Medium",

  reportsThresholdForAutoHide: 5,
  reportsThresholdForAutoBan: 15,
  reviewQueuePriority: "Most Reported First",
  notifyReporterOnAction: true,
  appealWindow: 7,

  blockedWords: ["scam", "fraud", "hack", "exploit", "spam", "phishing", "whitelist", "giveaway", "crypto-scam"],
  blockedDomains: ["malware-site.com", "phishing.net", "sketchy-link.org", "free-tokens.co"],
  blockedFileTypes: [".exe", ".bat", ".cmd"],

  firstOffense: "Warning",
  secondOffense: "24-hour Mute",
  thirdOffense: "7-day Ban",
  repeatOffender: "Permanent Ban",
  autoEscalation: true,
}

const BannedField = ({
  title,
  description,
  ban,
  onChange,
}: BannedFieldProps) => {
  const [draft, setDraft] = useState("")
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const commitDraft = () => {
    const value = draft.trim().replace(/,$/, "");
    if (!value) return;

    if (ban.includes(value)) {
      setError("That IP is already added");
      return;
    }

    onChange([...ban, value]);
    setDraft("");
    setError(null);
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault(); 
      commitDraft();
    } else if (e.key === "Backspace" && draft === "" && ban.length > 0) {
      onChange(ban.slice(0, -1));
    }
  }

  return (
    <div className="mt-4">
      <label className="block text-sm font-semibold text-neutral-light-500">
        {title}
      </label>
      <div
        onClick={() => inputRef.current?.focus()}
        className={[
          "mt-2 flex flex-wrap items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-primary px-3 py-2",
          "transition-colors cursor-text",
          error
            ? "border-red-300 ring-1 ring-red-200"
            : "border-slate-200 focus-within:ring-1 focus-within:ring-purple-light-600 ring-purple-light-600",
        ].join(" ")}
      >
        {ban.map((ban) => (
          <span
            key={ban}
            className="font-medium text-[13px] text-neutral-light-400"
          >
            {ban},
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={draft}
          placeholder={"Edit ban..."}
          onChange={(e) => {
            setDraft(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={handleKeyDown}
          onBlur={commitDraft}
          className="min-w-40 flex-1 border-none bg-transparent p-1 text-[13px] font-medium text-neutral-light-400 placeholder:text-[#9CA3AF] focus:outline-none focus:ring-0"
        />
      </div>
      {description && <p className="mt-1.5 text-xs font-normal text-neutral-light-400">{description}</p>}
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  )
}

const ContentModerationSettings = () => {
  const [state, setState] = useState<ContentModerationState>(initialState)
  const [saved, setSaved] = useState<ContentModerationState>(initialState)
  const [justSaved, setJustSaved] = useState(false)

  const isChangeDefault = JSON.stringify(state) !== JSON.stringify(saved)

  const set = <K extends keyof ContentModerationState>(key: K, value: ContentModerationState[K]) =>
    setState((prev) => ({ ...prev, [key]: value }))
  
  const handleDiscard = () => setState(saved)
  const handleSave = () => {
    setSaved(state)
    setJustSaved(true)
    window.setTimeout(() => setJustSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <Panel title="Auto-Moderation Settings">
        <FieldShell
          label="AI Content Filter"
          description="Automatically scan and flag inappropriate content using AI"
        >
          <Toggle
            checked={state.aIContentFilter}
            onChange={(v) => set("aIContentFilter", v)}
            label="AI Content Filter"
          />
        </FieldShell>
        <FieldShell
          label="Profanity Filter"
          description="Block messages and posts containing profane language"
        >
          <Toggle
            checked={state.profanityFilter}
            onChange={(v) => set("profanityFilter", v)}
            label="Profanity Filter"
          />
        </FieldShell>
        <FieldShell
          label="Spam Detection"
          description="Detect and auto-hide spam messages and posts"
        >
          <Toggle
            checked={state.spamDetection}
            onChange={(v) => set("spamDetection", v)}
            label="Spam Detection"
          />
        </FieldShell>
        <FieldShell
          label="NSFW Image Detection"
          description="Automatically flag or remove explicit images"
        >
          <Toggle
            checked={state.nsfwImageDetection}
            onChange={(v) => set("nsfwImageDetection", v)}
            label="NSFW Image Detection"
          />
        </FieldShell>
        <FieldShell
          label="Link Screening"
          description="Scan shared links for malware or phishing"
        >
          <Toggle
            checked={state.linkScreening}
            onChange={(v) => set("linkScreening", v)}
            label="Link Screening"
          />
        </FieldShell>
        <div className="pt-4">
          <FieldPayment 
            label="Sensitivity Level"
            description="How aggressively content is flagged" 
            htmlFor="sensitivityLevel"
          >
            <div className="max-w-md">
              <SelectFieldPayment
                id="sensitivityLevel"
                value={state.sensitivityLevel}
                onChange={(v) => set("sensitivityLevel", v)}
                options={["Medium", "Low", "High"]}
              />
            </div>
          </FieldPayment>
        </div>
      </Panel>
      <Panel title="Reporting & Review Settings">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 pb-4">
          <FieldPayment
            label="Reports Threshold for Auto-Hide"
            description="Number of reports before content is automatically hidden"
            htmlFor="reportsThresholdForAutoHide"
          >
            <NumberField
              id="reportsThresholdForAutoHide"
              value={state.reportsThresholdForAutoHide}
              onChange={(v) => set("reportsThresholdForAutoHide", v)}
              className="w-full"
            />
          </FieldPayment>
          <FieldPayment
            label="Reports Threshold for Auto-Ban"
            description="Number of reports on a user before automatic suspension"
            htmlFor="reportsThresholdForAutoBan"
          >
            <NumberField
              id="reportsThresholdForAutoBan"
              value={state.reportsThresholdForAutoBan}
              onChange={(v) => set("reportsThresholdForAutoBan", v)}
              className="w-full"
            />
          </FieldPayment>
          <FieldPayment 
            label="Review Queue Priority"
            description="Order in which flagged content appears in the review queue" 
            htmlFor="reviewQueuePriority"
          >
            <SelectFieldPayment
              id="reviewQueuePriority"
              value={state.reviewQueuePriority}
              onChange={(v) => set("reviewQueuePriority", v)}
              options={["Most Reported First"]}
            />
          </FieldPayment>
        </div>
        <FieldShell
          label="Notify Reporter on Action"
          description="Send notification to reporter when action is taken"
        >
          <Toggle
            checked={state.notifyReporterOnAction}
            onChange={(v) => set("notifyReporterOnAction", v)}
            label="Notify Reporter on Action"
          />
        </FieldShell>
        <div className="max-w-110 pt-4">
          <FieldPayment
            label="Appeal Window"
            description="Days a user has to appeal a moderation decision"
            htmlFor="appealWindow"
          >
            <PrefixedNumberField
              id="appealWindow"
              prefix="days"
              value={state.appealWindow}
              onChange={(v) => set("appealWindow", v)}
            />
          </FieldPayment>
        </div>
      </Panel>
      <Panel title="Banned Content Lists">
        <div className="space-y-4 pb-4">
          <BannedField
            title="Blocked Words"
            description="Custom words automatically blocked across the platform"
            ban={state.blockedWords}
            onChange={(ban) => set("blockedWords", ban)}
          />
          <BannedField
            title="Blocked Domains"
            description="URLs automatically blocked from being shared"
            ban={state.blockedDomains}
            onChange={(ban) => set("blockedDomains", ban)}
          />
        </div>
        <div className="pt-4">
          <FieldPayment 
            label="Blocked File Types"
            description="File types users cannot upload"
          >
            <CurrencyChips
              currencies={state.blockedFileTypes}
              onChange={(v) => set("blockedFileTypes", v)}
            />
          </FieldPayment>

        </div>
      </Panel>
      <Panel  title="User Penalties System">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 pb-4">
          <FieldPayment 
            label="First Offense"
            description="Action taken on first content violation" 
            htmlFor="firstOffense"
          >
            <SelectFieldPayment
              id="firstOffense"
              value={state.firstOffense}
              onChange={(v) => set("firstOffense", v)}
              options={["Warning","24-hour Mute","7-day Ban","Permanent Ban"]}
            />
          </FieldPayment>
          <FieldPayment 
            label="Second Offense"
            description="Action taken on second violation" 
            htmlFor="secondOffense"
          >
            <SelectFieldPayment
              id="secondOffense"
              value={state.secondOffense}
              onChange={(v) => set("secondOffense", v)}
              options={["24-hour Mute","Warning","7-day Ban","Permanent Ban"]}
            />
          </FieldPayment>
          <FieldPayment 
            label="Third Offense"
            description="Action taken on third violation" 
            htmlFor="thirdOffense"
          >
            <SelectFieldPayment
              id="thirdOffense"
              value={state.thirdOffense}
              onChange={(v) => set("thirdOffense", v)}
              options={["7-day Ban","24-hour Mute","Warning","Permanent Ban"]}
            />
          </FieldPayment>
          <FieldPayment 
            label="Repeat Offender"
            description="Action for users with 4+ violations" 
            htmlFor="repeatOffender"
          >
            <SelectFieldPayment
              id="repeatOffender"
              value={state.repeatOffender}
              onChange={(v) => set("repeatOffender", v)}
              options={["Permanent Ban","7-day Ban","24-hour Mute","Warning",]}
            />
          </FieldPayment>
        </div>
        <FieldShell
          label="Auto-escalation"
          description="Automatically escalate penalties for repeat offenders"
        >
          <Toggle
            checked={state.autoEscalation}
            onChange={(v) => set("autoEscalation", v)}
            label="Auto-escalation"
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

export default ContentModerationSettings