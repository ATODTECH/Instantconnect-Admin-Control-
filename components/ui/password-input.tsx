"use client"

import * as React from "react"
import { cn } from "cn"

import { Input } from "@/components/ui/input"

function PasswordInput({
  className,
  disabled,
  ...props
}: Omit<React.ComponentProps<"input">, "type">) {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        disabled={disabled}
        className={cn("pr-16", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((shown) => !shown)}
        disabled={disabled}
        aria-pressed={visible}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 rounded-r-md px-3 text-sm font-medium text-slate-600 outline-none hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-700 disabled:opacity-60"
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  )
}

export { PasswordInput }
