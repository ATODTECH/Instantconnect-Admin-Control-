"use client"

import { FieldShell, NumberField, Panel, SelectField, SettingsActions, StackedField, TagInput, TextField, Toggle } from "@/components/form/settings-fields"
import { useSettingsDraft } from "@/hooks/use-settings-draft"
import { SettingsError, SettingsSkeleton } from "../settings-state"

const KEYS = ["blockedWords", "blockedDomains"] as const

const MAX_ENTRIES = 300
const HOSTNAME = /^([a-z0-9-]{1,63}\.)+[a-z]{2,63}$/

const AUTO_MODERATION = [
  { label: "AI Content Filter", description: "Automatically scan and flag inappropriate content using AI" },
  { label: "Profanity Filter", description: "Block messages and posts containing profane language. Use Blocked Words below for now." },
  { label: "Spam Detection", description: "Detect and auto-hide spam messages and posts" },
  { label: "NSFW Image Detection", description: "Automatically flag or remove explicit images" },
  { label: "Link Screening", description: "Scan shared links for malware or phishing. Use Blocked Domains below for now." },
] as const

/** "https://www.Bad.com/path" becomes "bad.com", matching what the server stores. */
const toHostname = (value: string) =>
  value.toLowerCase().replace(/^[a-z]+:\/\//, "").replace(/^www\./, "").split(/[/?#:]/)[0]

const noop = () => {}

const ContentModerationSettings = () => {
  const { query, values, isDirty, isSaving, set, discard, save } = useSettingsDraft(KEYS)

  if (query.isPending) return <SettingsSkeleton panels={[6, 5, 3, 5]} />
  if (query.isError || !values) return <SettingsError onRetry={() => query.refetch()} isRetrying={query.isRefetching} />

  return (
    <div className="space-y-6">
      <Panel title="Auto-Moderation Settings">
        {AUTO_MODERATION.map(({ label, description }) => (
          <FieldShell key={label} label={label} description={description} locked>
            <Toggle checked={false} onChange={noop} label={label} />
          </FieldShell>
        ))}
        <FieldShell label="Sensitivity Level" description="How aggressively content is flagged" htmlFor="sensitivity" locked>
          <SelectField id="sensitivity" value="Medium" onChange={noop} options={["Medium"]} className="w-56" />
        </FieldShell>
      </Panel>

      <Panel title="Reporting & Review Settings" description="Reported community posts are reviewed by hand on the Communities page.">
        <div className="grid gap-5 py-4 first:pt-0 sm:grid-cols-2">
          <StackedField label="Reports Threshold for Auto-Hide" description="Number of reports before content is automatically hidden" htmlFor="autoHide" locked>
            <NumberField id="autoHide" value={5} onChange={noop} className="w-full" />
          </StackedField>
          <StackedField label="Reports Threshold for Auto-Ban" description="Number of reports on a user before automatic suspension" htmlFor="autoBan" locked>
            <NumberField id="autoBan" value={15} onChange={noop} className="w-full" />
          </StackedField>
          <StackedField label="Review Queue Priority" description="Order in which flagged content appears. Most reported first today." htmlFor="queuePriority" locked>
            <SelectField id="queuePriority" value="Most Reported First" onChange={noop} options={["Most Reported First"]} className="w-full" />
          </StackedField>
          <StackedField label="Appeal Window" description="Days a user has to appeal a moderation decision" htmlFor="appealWindow" locked>
            <TextField id="appealWindow" value="7 days" onChange={noop} className="w-full" />
          </StackedField>
        </div>
        <FieldShell label="Notify Reporter on Action" description="Send notification to reporter when action is taken" locked>
          <Toggle checked={false} onChange={noop} label="Notify Reporter on Action" />
        </FieldShell>
      </Panel>

      <Panel
        title="Banned Content Lists"
        description="Checked whenever a member sends a message, creates an event, edits their profile or posts in a community. Anything containing a blocked entry is refused, without saying which entry matched."
      >
        <TagInput
          id="blockedWords"
          label="Blocked Words"
          description={`Matched as whole words, ignoring case, so "ass" does not catch "class". Up to ${MAX_ENTRIES}.`}
          values={values.blockedWords}
          onChange={(v) => set("blockedWords", v)}
          placeholder="Add a word or phrase"
          normalise={(value) => value.toLowerCase()}
          validate={(value) =>
            value.length < 2 ? "Use at least 2 letters" : value.length > 64 ? "Keep it under 64 characters" : values.blockedWords.length >= MAX_ENTRIES ? `At most ${MAX_ENTRIES} words` : null
          }
          noun="word"
        />
        <TagInput
          id="blockedDomains"
          label="Blocked Domains"
          description="URLs to these sites are refused, with or without https:// or www, and so are their subdomains."
          values={values.blockedDomains}
          onChange={(v) => set("blockedDomains", v)}
          placeholder="example.com"
          normalise={toHostname}
          validate={(value) =>
            !HOSTNAME.test(value) ? "Enter a domain such as example.com" : values.blockedDomains.length >= MAX_ENTRIES ? `At most ${MAX_ENTRIES} domains` : null
          }
          noun="domain"
        />
        <div className="pt-4">
          <StackedField label="Blocked File Types" description="Members can only upload images today." htmlFor="fileTypes" locked>
            <TextField id="fileTypes" value=".exe, .bat, .cmd" onChange={noop} className="w-full" />
          </StackedField>
        </div>
      </Panel>

      <Panel title="User Penalties System">
        <div className="grid gap-5 py-4 first:pt-0 sm:grid-cols-2">
          {[
            ["First Offense", "Warning", "Action taken on first content violation"],
            ["Second Offense", "24-hour Mute", "Action taken on second violation"],
            ["Third Offense", "7-day Ban", "Action taken on third violation"],
            ["Repeat Offender", "Permanent Ban", "Action for users with 4+ violations"],
          ].map(([label, value, description]) => (
            <StackedField key={label} label={label} description={description} htmlFor={label} locked>
              <SelectField id={label} value={value} onChange={noop} options={[value]} className="w-full" />
            </StackedField>
          ))}
        </div>
        <FieldShell label="Auto-escalation" description="Automatically escalate penalties for repeat offenders. Admins suspend members by hand on the User page." locked>
          <Toggle checked={false} onChange={noop} label="Auto-escalation" />
        </FieldShell>
      </Panel>

      <SettingsActions isDirty={isDirty} justSaved={false} isSaving={isSaving} onDiscard={discard} onSave={save} />
    </div>
  )
}

export default ContentModerationSettings
