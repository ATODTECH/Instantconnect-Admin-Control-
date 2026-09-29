"use client"

import { cn } from "cn"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Radix Select cannot hold an empty value, so "no filter" travels as this.
const ALL = "__all__"

export interface FilterOption<T extends string> {
  readonly label: string
  /** Undefined means "no filter"; put that option first. */
  readonly value?: T
}

interface FilterSelectProps<T extends string> {
  label: string
  options: readonly FilterOption<T>[]
  value: T | undefined
  onChange: (value: T | undefined) => void
  className?: string
}

/** A toolbar filter. Highlighted while it narrows the results. */
export function FilterSelect<T extends string>({ label, options, value, onChange, className }: FilterSelectProps<T>) {
  const isActive = value !== undefined

  return (
    <Select value={value ?? ALL} onValueChange={(next) => onChange(next === ALL ? undefined : (next as T))}>
      <SelectTrigger
        aria-label={label}
        className={cn(
          "h-9 min-w-36 rounded-lg bg-neutral-white px-3 text-sm font-medium",
          isActive ? "border-violet-300 bg-violet-50 text-primary [&_svg]:text-violet-400" : "border-primary-border text-[#1E293B] hover:bg-slate-50",
          className,
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" align="start">
        {options.map((option) => (
          <SelectItem key={option.value ?? ALL} value={option.value ?? ALL}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
