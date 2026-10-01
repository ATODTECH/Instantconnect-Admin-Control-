"use client"

import { useRef, useState, type KeyboardEvent } from "react"
import { CheckCheck, ChevronDown, CircleX, Copy, Eye, EyeClosed, Lock } from "lucide-react"
import { cn } from "cn"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

const FIELD = "h-9 rounded-lg border-slate-200 bg-neutral-white text-sm text-neutral-light-500 shadow-sm focus-visible:border-primary focus-visible:ring-primary/15"

/** A settings card. Rows inside are separated by hairlines. */
export const Panel = ({ title, children }: { title?: string, children: React.ReactNode }) => (
  <section className="space-y-4 rounded-xl border border-primary-border bg-neutral-white p-6">
    {title && <h2 className="text-base font-bold text-neutral-light-600">{title}</h2>}
    <div className="divide-y divide-slate-100">{children}</div>
  </section>
)

/** One setting: its name and explanation on the left, the control on the right. */
export const FieldShell = ({ label, description, htmlFor, children }: FieldShellProps) => (
  <div className="flex items-center justify-between gap-6 py-4 first:pt-0 last:pb-0">
    <div className="max-w-md">
      <Label htmlFor={htmlFor} className="text-sm font-semibold text-neutral-light-500">{label}</Label>
      <p className="mt-0.5 text-xs text-neutral-light-400">{description}</p>
    </div>
    <div className="shrink-0">{children}</div>
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

interface CheckboxSelectProps {
  id: string
  options: readonly string[]
  checked: readonly boolean[]
  onToggle: (index: number) => void
  placeholder?: string
  className?: string
}

/** A dropdown of options where any number can be ticked. */
export const CheckboxSelect = ({ id, options, checked, onToggle, placeholder = "None", className = "w-56" }: CheckboxSelectProps) => {
  const chosen = options.filter((_, index) => checked[index])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          id={id}
          type="button"
          className={cn(
            "flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-neutral-white px-3 py-2 text-left text-sm text-neutral-light-500 shadow-sm outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15",
            className,
          )}
        >
          <span className="truncate">{chosen.length ? chosen.join(", ") : placeholder}</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-(--radix-dropdown-menu-trigger-width)">
        {options.map((option, index) => (
          <DropdownMenuCheckboxItem
            key={option}
            checked={checked[index]}
            onCheckedChange={() => onToggle(index)}
            onSelect={(event) => event.preventDefault()}
          >
            {option}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** A masked key with a show/hide toggle. */
export const SecretField = ({ id, value, onChange }: { id: string, value: string, onChange: (value: string) => void }) => {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Input id={id} type={visible ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} className={cn(FIELD, "w-full pr-10 font-mono")} />
      <button
        type="button"
        onClick={() => setVisible((shown) => !shown)}
        aria-label={visible ? "Hide key" : "Show key"}
        aria-pressed={visible}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-neutral-light-400"
      >
        {visible ? <EyeClosed className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  )
}

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
export const StackedField = ({ label, description, htmlFor, children }: { label: string, description?: string, htmlFor?: string, children: React.ReactNode }) => (
  <div>
    <Label htmlFor={htmlFor} className="text-sm font-semibold text-neutral-light-500">{label}</Label>
    <div className="mt-1.5">{children}</div>
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

/**
 * Settings the server does not act on yet. They stay visible so the plan is
 * clear, but locked: a switch that changes nothing would mislead whoever flips it.
 */
export const UnavailableSettings = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-4">
    <div role="note" className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
      <Lock className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden />
      <p className="text-sm text-amber-900">
        <span className="font-semibold">Not available yet.</span> These settings are not connected to the platform, so they can&apos;t be changed.
      </p>
    </div>
    <fieldset disabled aria-label="Not available yet" className="space-y-6 opacity-60">
      {children}
    </fieldset>
  </div>
)
