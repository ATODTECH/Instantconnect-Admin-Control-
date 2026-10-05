"use client"

import { useRef, useState, type KeyboardEvent } from "react"
import { CheckCheck, CircleX, Copy, Lock } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

const FIELD = "h-9 rounded-lg border-slate-200 bg-neutral-white text-sm text-neutral-light-500 shadow-sm focus-visible:border-primary focus-visible:ring-primary/15"

/** A settings card. Rows inside are separated by hairlines. */
export const Panel = ({ title, description, children }: { title?: string, description?: string, children: React.ReactNode }) => (
  <section className="space-y-4 rounded-xl border border-primary-border bg-neutral-white p-6">
    {title && (
      <div>
        <h2 className="text-base font-bold text-neutral-light-600">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-neutral-light-400">{description}</p>}
      </div>
    )}
    <div className="divide-y divide-slate-100">{children}</div>
  </section>
)

/** Marks a setting the platform does not act on yet. */
export const LockedTag = () => (
  <span className="ml-2 inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 align-middle text-[10px] font-semibold text-amber-700">
    <Lock className="h-2.5 w-2.5" aria-hidden />
    Not available yet
  </span>
)

/**
 * One setting: its name and explanation on the left, the control on the right.
 * A locked row keeps its place in the design but cannot be changed, since a
 * switch that does nothing would mislead whoever flips it.
 */
export const FieldShell = ({ label, description, htmlFor, children, locked = false }: FieldShellProps) => (
  <div className="flex items-center justify-between gap-6 py-4 first:pt-0 last:pb-0">
    <div className="max-w-md">
      <Label htmlFor={htmlFor} className="text-sm font-semibold text-neutral-light-500">
        {label}
        {locked && <LockedTag />}
      </Label>
      <p className="mt-0.5 text-xs text-neutral-light-400">{description}</p>
    </div>
    {locked ? (
      <fieldset disabled aria-label={`${label}, not available yet`} className="shrink-0 opacity-60">
        {children}
      </fieldset>
    ) : (
      <div className="shrink-0">{children}</div>
    )}
  </div>
)

export const Toggle = ({ checked, onChange, label }: ToggleProps) => (
  <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
)

export const TextField = ({ id, value, onChange, placeholder, className = "w-72" }: TextFieldProps) => (
  <Input id={id} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={cn(FIELD, "truncate", className)} />
)

interface NumberFieldProps {
  id: string
  value: number
  onChange: (value: number) => void
  /** Unit shown inside the right edge, e.g. "%" or "min". */
  suffix?: string
  /** Fixed label before the value, e.g. "NGN". */
  prefix?: string
  className?: string
}

export const NumberField = ({ id, value, onChange, suffix, prefix, className = "w-24" }: NumberFieldProps) => (
  <div className={cn("relative flex items-center", prefix && "rounded-lg border border-slate-200 bg-neutral-white shadow-sm focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/15", prefix ? "w-full" : undefined)}>
    {prefix && <span className="select-none border-r border-slate-100 px-3 text-sm text-neutral-light-400">{prefix}</span>}
    <Input
      id={id}
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={cn(FIELD, suffix && "pr-8", prefix ? "w-full border-0 shadow-none focus-visible:ring-0" : className)}
    />
    {suffix && (
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm font-medium text-neutral-light-400">{suffix}</span>
    )}
  </div>
)

interface SelectFieldProps {
  id: string
  value: string
  onChange: (value: string) => void
  options: readonly string[]
  className?: string
}

export const SelectField = ({ id, value, onChange, options, className = "w-56" }: SelectFieldProps) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger id={id} className={cn(FIELD, "px-3", className)}>
      <SelectValue />
    </SelectTrigger>
    <SelectContent position="popper">
      {options.map((option) => (
        <SelectItem key={option} value={option}>{option}</SelectItem>
      ))}
    </SelectContent>
  </Select>
)

/** A dropdown of options where any number can be ticked. */
/** A masked key with a show/hide toggle. */
/** A read-only value with a copy button, e.g. a webhook URL. */
export const CopyField = ({ id, value, label = "Copy" }: { id: string, value: string, label?: string }) => {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // The clipboard API can be unavailable; the tick still confirms the attempt.
    } finally {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <div className="relative">
      <Input id={id} value={value} readOnly className={cn(FIELD, "w-full bg-slate-50 pr-10 text-slate-500")} />
      <button type="button" onClick={copy} aria-label={label} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-violet-500 hover:text-primary">
        {copied ? <CheckCheck className="h-4.5 w-4.5" /> : <Copy className="h-4.5 w-4.5" />}
      </button>
    </div>
  )
}

interface TagInputProps {
  id: string
  label: string
  description?: string
  values: readonly string[]
  onChange: (values: string[]) => void
  placeholder?: string
  /** Returns an error message, or null when the entry is acceptable. */
  validate?: (value: string) => string | null
  /** Applied before validating, e.g. upper-casing a currency code. */
  normalise?: (value: string) => string
  /** What one entry is called, for "That email is already added". */
  noun?: string
  className?: string
}

/** A list of entries typed one at a time: Enter or comma adds, Backspace on empty removes the last. */
export const TagInput = ({
  id,
  label,
  description,
  values,
  onChange,
  placeholder = "Add…",
  validate,
  normalise = (value) => value,
  noun = "entry",
  className,
}: TagInputProps) => {
  const [draft, setDraft] = useState("")
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const errorId = `${id}-error`

  const commit = () => {
    const value = normalise(draft.trim().replace(/,$/, ""))
    if (!value) return

    const problem = validate?.(value) ?? (values.includes(value) ? `That ${noun} is already added` : null)
    if (problem) {
      setError(problem)
      return
    }

    onChange([...values, value])
    setDraft("")
    setError(null)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      commit()
    } else if (e.key === "Backspace" && draft === "" && values.length > 0) {
      onChange(values.slice(0, -1))
    }
  }

  return (
    <div className={cn("mt-4", className)}>
      <Label htmlFor={id} className="text-sm font-semibold text-neutral-light-500">{label}</Label>
      <div
        onClick={() => inputRef.current?.focus()}
        className={cn(
          "mt-2 flex cursor-text flex-wrap items-center gap-2 rounded-lg border bg-neutral-white px-3 py-2 transition-colors",
          error ? "border-danger ring-3 ring-danger/15" : "border-slate-200 focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/15",
        )}
      >
        {values.map((value) => (
          <span key={value} className="inline-flex items-center gap-1.5 rounded-md border border-primary-border bg-[#F1F5F9] px-2.5 py-1 text-[13px] font-medium text-[#334155]">
            {value}
            <button
              type="button"
              aria-label={`Remove ${value}`}
              onClick={(e) => {
                e.stopPropagation()
                onChange(values.filter((existing) => existing !== value))
              }}
              className="text-neutral-light-400 hover:text-[#334155]"
            >
              <CircleX className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          id={id}
          value={draft}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(e) => {
            setDraft(e.target.value)
            if (error) setError(null)
          }}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          className="min-w-32 flex-1 border-none bg-transparent p-1 text-[13px] text-[#334155] outline-none placeholder:text-[#9CA3AF]"
        />
      </div>
      {description && <p className="mt-1.5 text-xs text-neutral-light-400">{description}</p>}
      {error && <p id={errorId} role="alert" className="mt-1.5 text-sm text-danger">{error}</p>}
    </div>
  )
}

/** A setting with its label above the control, for fields laid out in a grid. */
export const StackedField = ({
  label,
  description,
  htmlFor,
  children,
  locked = false,
}: { label: string, description?: string, htmlFor?: string, children: React.ReactNode, locked?: boolean }) => (
  <div>
    <Label htmlFor={htmlFor} className="text-sm font-semibold text-neutral-light-500">
      {label}
      {locked && <LockedTag />}
    </Label>
    {locked ? (
      <fieldset disabled aria-label={`${label}, not available yet`} className="mt-1.5 opacity-60">
        {children}
      </fieldset>
    ) : (
      <div className="mt-1.5">{children}</div>
    )}
    {description && <p className="mt-1.5 text-xs text-neutral-light-400">{description}</p>}
  </div>
)

interface SettingsActionsProps {
  /** Save and Discard stay disabled until something has changed. */
  isDirty: boolean
  justSaved: boolean
  onDiscard: () => void
  onSave: () => void
  isSaving?: boolean
}

/** The Discard / Save Changes bar at the foot of every settings tab. */
export const SettingsActions = ({ isDirty, justSaved, onDiscard, onSave, isSaving = false }: SettingsActionsProps) => (
  <div className="flex items-center justify-end gap-3 pb-4">
    {justSaved && (
      <span role="status" className="mr-auto text-sm font-medium text-secondary-green-500">Changes saved</span>
    )}
    <Button variant="outline" size="lg" onClick={onDiscard} disabled={!isDirty || isSaving} className="font-semibold text-neutral-light-400">
      Discard
    </Button>
    <Button variant="brand" size="lg" onClick={onSave} disabled={!isDirty} loading={isSaving} className="font-semibold">
      Save Changes
    </Button>
  </div>
)

