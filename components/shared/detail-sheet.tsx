"use client"

import { cn } from "cn"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface DetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  /** Read to screen readers; hidden visually unless `showDescription`. */
  description: string
  showDescription?: boolean
  children: React.ReactNode
  className?: string
}

/**
 * The right-hand panel every "View" opens. Traps focus, closes on Escape or a
 * click outside, and hands focus back to the button that opened it.
 */
export const DetailSheet = ({ open, onOpenChange, title, description, showDescription = false, children, className }: DetailSheetProps) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent side="right" className={cn("w-full gap-0 bg-neutral-white p-0 sm:max-w-105", className)}>
      <SheetHeader className="px-6 pt-7 pb-5">
        <SheetTitle className="text-lg font-bold text-neutral-light-600">{title}</SheetTitle>
        <SheetDescription className={showDescription ? "text-sm text-neutral-light-300" : "sr-only"}>{description}</SheetDescription>
      </SheetHeader>
      <div className="flex flex-1 flex-col gap-y-7 overflow-y-auto px-6 pb-10 scrollbar-thin scrollbar-thumb-gray-200">{children}</div>
    </SheetContent>
  </Sheet>
)
