"use client"
import { useState } from "react"
import { FieldShell, NumberField, Panel, SelectField, SettingsActions, StackedField, TagInput, Toggle } from "@/components/form/settings-fields"

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
          <StackedField 
            label="Sensitivity Level"
            description="How aggressively content is flagged" 
            htmlFor="sensitivityLevel"
          >
            <div className="max-w-md">
              <SelectField className="w-full"
                id="sensitivityLevel"
                value={state.sensitivityLevel}
                onChange={(v) => set("sensitivityLevel", v)}
                options={["Medium", "Low", "High"]}
              />
            </div>
          </StackedField>
        </div>
      </Panel>
      <Panel title="Reporting & Review Settings">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 pb-4">
          <StackedField
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
          </StackedField>
          <StackedField
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
          </StackedField>
          <StackedField 
            label="Review Queue Priority"
            description="Order in which flagged content appears in the review queue" 
            htmlFor="reviewQueuePriority"
          >
            <SelectField className="w-full"
              id="reviewQueuePriority"
              value={state.reviewQueuePriority}
              onChange={(v) => set("reviewQueuePriority", v)}
              options={["Most Reported First"]}
            />
          </StackedField>
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
          <StackedField
            label="Appeal Window"
            description="Days a user has to appeal a moderation decision"
            htmlFor="appealWindow"
          >
            <NumberField
              id="appealWindow"
              prefix="days"
              value={state.appealWindow}
              onChange={(v) => set("appealWindow", v)}
            />
          </StackedField>
        </div>
      </Panel>
      <Panel title="Banned Content Lists">
        <div className="space-y-4 pb-4">
          <TagInput
            id="blockedWords"
            label="Blocked Words"
            description="Custom words automatically blocked across the platform"
            values={state.blockedWords}
            onChange={(values) => set("blockedWords", values)}
            placeholder="Add..."
          />
          <TagInput
            id="blockedDomains"
            label="Blocked Domains"
            description="URLs automatically blocked from being shared"
            values={state.blockedDomains}
            onChange={(values) => set("blockedDomains", values)}
            placeholder="Add..."
          />
        </div>
        <div className="pt-4">
          <TagInput
            id="blockedFileTypes"
            label="Blocked File Types"
            description="File types users cannot upload"
            values={state.blockedFileTypes}
            onChange={(values) => set("blockedFileTypes", values)}
            normalise={(value) => value.toLowerCase().replace(/^\./, "")}
            placeholder="exe"
            noun="file type"
            className="mt-0"
          />

        </div>
      </Panel>
      <Panel  title="User Penalties System">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 pb-4">
          <StackedField 
            label="First Offense"
            description="Action taken on first content violation" 
            htmlFor="firstOffense"
          >
            <SelectField className="w-full"
              id="firstOffense"
              value={state.firstOffense}
              onChange={(v) => set("firstOffense", v)}
              options={["Warning","24-hour Mute","7-day Ban","Permanent Ban"]}
            />
          </StackedField>
          <StackedField 
            label="Second Offense"
            description="Action taken on second violation" 
            htmlFor="secondOffense"
          >
            <SelectField className="w-full"
              id="secondOffense"
              value={state.secondOffense}
              onChange={(v) => set("secondOffense", v)}
              options={["24-hour Mute","Warning","7-day Ban","Permanent Ban"]}
            />
          </StackedField>
          <StackedField 
            label="Third Offense"
            description="Action taken on third violation" 
            htmlFor="thirdOffense"
          >
            <SelectField className="w-full"
              id="thirdOffense"
              value={state.thirdOffense}
              onChange={(v) => set("thirdOffense", v)}
              options={["7-day Ban","24-hour Mute","Warning","Permanent Ban"]}
            />
          </StackedField>
          <StackedField 
            label="Repeat Offender"
            description="Action for users with 4+ violations" 
            htmlFor="repeatOffender"
          >
            <SelectField className="w-full"
              id="repeatOffender"
              value={state.repeatOffender}
              onChange={(v) => set("repeatOffender", v)}
              options={["Permanent Ban","7-day Ban","24-hour Mute","Warning",]}
            />
          </StackedField>
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

      <SettingsActions isDirty={isChangeDefault} justSaved={justSaved} onDiscard={handleDiscard} onSave={handleSave} />
    </div>
  )
}

export default ContentModerationSettings