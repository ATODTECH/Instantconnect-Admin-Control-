"use client"

import { useState, type ChangeEvent, type FocusEvent, type ReactNode } from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "cn"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type FormInputProps = {
  containerStyle?: string
  label?: string
  labelStyle?: string
  inputStyle?: string
  id: string
  name?: string
  type: string
  placeholder?: string
  autoComplete?: string
  disabled?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onBlur: (e: FocusEvent<HTMLInputElement>) => void
  error?: string
  touched?: boolean
}

const FormInput = ({
  containerStyle,
  label,
  labelStyle,
  inputStyle,
  id,
  name,
  type,
  placeholder,
  autoComplete,
  disabled,
  iconLeft,
  iconRight,
  value,
  onChange,
  onBlur,
  error,
  touched,
}: FormInputProps) => {
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === "password"
  const inputType = isPassword && showPassword ? "text" : type
  const hasError = Boolean(touched && error)
  const errorId = `${id}-error`

  return (
    <div className={cn("grid w-full items-center gap-2", containerStyle)}>
      {label && (
        <Label htmlFor={id} className={cn("text-ink-title", labelStyle)}>
          {label}
        </Label>
      )}
      <div className="relative flex items-center">
        {iconLeft && (
          <div aria-hidden className="pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 text-ink-meta">
            {iconLeft}
          </div>
        )}
        <Input
          type={inputType}
          id={id}
          name={name ?? id}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className={cn(iconLeft ? "pl-10" : "pl-4", isPassword || iconRight ? "pr-10" : "pr-4", inputStyle)}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? errorId : undefined}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword((shown) => !shown)}
            disabled={disabled}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute top-1/2 right-3 z-10 -translate-y-1/2 rounded text-ink-meta outline-none hover:text-ink-title focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        ) : (
          iconRight && (
            <div aria-hidden className="pointer-events-none absolute top-1/2 right-3 z-10 -translate-y-1/2 text-ink-meta">
              {iconRight}
            </div>
          )
        )}
      </div>
      {hasError && (
        <p id={errorId} role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

export default FormInput
