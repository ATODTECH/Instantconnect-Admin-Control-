"use client"

import { useState } from "react"
import { Check, Plus } from "lucide-react"
import { cn } from "cn"
import { CopyField, FieldShell, NumberField, Panel, SelectField, StackedField, TextField, Toggle } from "@/components/form/settings-fields"
import { StatusBadge } from "@/components/shared/status-badge"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { usePaymentSettings, usePlans, useUpdatePlan } from "@/hooks/use-subscriptions"
import { formatCount } from "@/lib/format"
import type { AdminPlan } from "@/types/admin-subscriptions"
import { SettingsError, SettingsSkeleton } from "../settings-state"

const noop = () => {}

const naira = (minor: number) => (minor / 100).toLocaleString("en-NG", { maximumFractionDigits: 2 })

/**
 * Paystack keys stay in the server's environment, never in this dashboard:
 * a key typed into a web form is a key that can leak from it. Plans are the
 * one live part, and a new price only reaches new subscribers.
 */
const PaymentSettings = () => {
  const settings = usePaymentSettings()
  const plans = usePlans()
  const [editing, setEditing] = useState<AdminPlan | null>(null)

  if (settings.isPending || plans.isPending) return <SettingsSkeleton panels={[4, 3, 3]} />
  if (settings.isError || plans.isError) {
    return (
      <SettingsError
        onRetry={() => {
          void settings.refetch()
          void plans.refetch()
        }}
        isRetrying={settings.isRefetching || plans.isRefetching}
      />
    )
  }

  const gateway = settings.data
  const popularId = [...plans.data].sort((a, b) => b.subscriberCount - a.subscriberCount)[0]?.id

  return (
    <div className="space-y-6">
      <Panel title="Payment Gateway">
        <div className="grid gap-5 py-4 first:pt-0 sm:grid-cols-2">
          <StackedField label="Primary Gateway" description="Main payment processor for all transactions" htmlFor="gateway" locked>
            <SelectField id="gateway" value="Paystack" onChange={noop} options={["Paystack"]} className="w-full" />
          </StackedField>
          <div>
            <Label className="text-sm font-semibold text-neutral-light-500">Mode</Label>
            <div className="mt-1.5 flex h-9 items-center gap-2">
              {gateway.configured ? (
                <StatusBadge tone={gateway.testMode ? "info" : "success"}>{gateway.testMode ? "Test mode" : "Live"}</StatusBadge>
              ) : (
                <StatusBadge tone="danger">Not configured</StatusBadge>
              )}
            </div>
            <p className="mt-1.5 text-xs text-neutral-light-400">
              {gateway.testMode ? "A test key is set: payments are simulated, nothing is charged." : "Follows the secret key: sk_test_ keys run in test mode."}
            </p>
          </div>
          <StackedField label="Paystack Public Key" description="Not needed: members pay on Paystack's hosted checkout page." htmlFor="publicKey" locked>
            <TextField id="publicKey" value="" onChange={noop} placeholder="pk_..." className="w-full" />
          </StackedField>
          <div>
            <Label className="text-sm font-semibold text-neutral-light-500">Paystack Secret Key</Label>
            <div className="mt-1.5 flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-neutral-light-400">
              {gateway.configured ? (
                <>
                  <Check className="h-4 w-4 text-[#16A34A]" aria-hidden /> Set on the server
                </>
              ) : (
                "Not set"
              )}
            </div>
            <p className="mt-1.5 text-xs text-neutral-light-400">Kept in PAYSTACK_SECRET_KEY on the server, never shown here.</p>
          </div>
        </div>
        <div className="py-4 last:pb-0">
          <StackedField
            label="Webhook URL"
            htmlFor="webhookUrl"
            description={gateway.webhookUrl ? "Configure this URL in your Paystack dashboard" : "Set PUBLIC_API_URL on the server to show the URL to paste into Paystack."}
          >
            <CopyField id="webhookUrl" value={gateway.webhookUrl ?? "Not available until PUBLIC_API_URL is set"} label="Copy webhook URL" />
          </StackedField>
        </div>
      </Panel>

      <Panel title="Currency & Pricing">
        <div className="grid gap-5 py-4 first:pt-0 sm:grid-cols-2">
          <StackedField label="Default Currency" description="Primary currency for all transactions" htmlFor="currency" locked>
            <SelectField id="currency" value="NGN - Nigerian Naira" onChange={noop} options={["NGN - Nigerian Naira"]} className="w-full" />
          </StackedField>
          <StackedField label="Supported Currencies" description="Currencies accepted on the platform" htmlFor="currencies" locked>
            <TextField id="currencies" value="NGN" onChange={noop} className="w-full" />
          </StackedField>
          <StackedField label="Minimum Transaction Amount" description="Lowest amount allowed per transaction" htmlFor="minAmount" locked>
            <NumberField id="minAmount" value={100} onChange={noop} prefix="NGN" />
          </StackedField>
          <StackedField label="Maximum Transaction Amount" description="Highest amount allowed per transaction" htmlFor="maxAmount" locked>
            <NumberField id="maxAmount" value={1000000} onChange={noop} prefix="NGN" />
          </StackedField>
        </div>
      </Panel>

      <Panel title="Subscription Plans">
        <div className="grid gap-4 py-4 first:pt-0 md:grid-cols-2 xl:grid-cols-3">
          {plans.data.map((plan) => {
            const popular = plan.id === popularId && plan.subscriberCount > 0

            return (
              <article
                key={plan.id}
                className={cn("flex flex-col gap-3 rounded-xl border p-4", popular ? "border-2 border-primary bg-[#FAF5FF]" : "border-primary-border")}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className={cn("text-xs font-semibold uppercase", popular ? "text-primary" : "text-neutral-light-500")}>{plan.name}</p>
                  <div className="flex gap-1.5">
                    {!plan.isActive && <StatusBadge tone="neutral">Hidden</StatusBadge>}
                    {popular && <StatusBadge tone="brand">Popular</StatusBadge>}
                  </div>
                </div>
                <p className="text-xl font-bold text-neutral-light-600">
                  NGN {naira(plan.monthlyPriceMinor)}
                  <span className="text-sm font-normal text-neutral-light-400">/month</span>
                </p>
                <p className="text-xs text-neutral-light-400">
                  NGN {naira(plan.annualPriceMinor)}/year · {formatCount(plan.subscriberCount)} {plan.subscriberCount === 1 ? "subscriber" : "subscribers"}
                </p>
                <ul className="flex-1 space-y-1.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs text-neutral-light-500">
                      <Check className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", popular ? "text-primary" : "text-[#16A34A]")} aria-hidden />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant={popular ? "brand" : "secondary"} className="w-full" onClick={() => setEditing(plan)}>
                  Edit Plan
                </Button>
              </article>
            )
          })}
        </div>
        <div className="pt-2">
          <Button variant="outline" disabled title="New tiers need their benefits built in the app first.">
            <Plus className="h-4 w-4" aria-hidden />
            Add New Plan
          </Button>
        </div>
      </Panel>

      <Panel title="Payout Settings" description="Event ticket sales are not live yet, so there is nothing to pay out.">
        <div className="grid gap-5 py-4 first:pt-0 sm:grid-cols-2">
          <StackedField label="Event Creator Payout" description="Percentage of ticket sales paid to event creators" htmlFor="creatorPayout" locked>
            <NumberField id="creatorPayout" value={85} onChange={noop} prefix="%" />
          </StackedField>
          <StackedField label="Platform Commission" description="Platform fee on paid events" htmlFor="commission" locked>
            <NumberField id="commission" value={15} onChange={noop} prefix="%" />
          </StackedField>
          <StackedField label="Payout Schedule" description="How often payouts are processed" htmlFor="payoutSchedule" locked>
            <SelectField id="payoutSchedule" value="Weekly" onChange={noop} options={["Weekly"]} className="w-full" />
          </StackedField>
          <StackedField label="Minimum Payout Amount" description="Minimum balance before payout is triggered" htmlFor="minPayout" locked>
            <NumberField id="minPayout" value={10000} onChange={noop} prefix="NGN" />
          </StackedField>
        </div>
        <FieldShell label="Auto Payout" description="Automatically process payouts on schedule" locked>
          <Toggle checked={false} onChange={noop} label="Auto Payout" />
        </FieldShell>
      </Panel>

      <Panel title="Refund Policy" description="Admins refund a subscriber's last payment from the Subscriptions page.">
        <FieldShell label="Allow Refunds" description="Enable users to request refunds" locked>
          <Toggle checked={false} onChange={noop} label="Allow Refunds" />
        </FieldShell>
        <div className="grid gap-5 py-4 sm:grid-cols-2">
          <StackedField label="Refund Window" description="Time after payment within which refunds are allowed" htmlFor="refundWindow" locked>
            <NumberField id="refundWindow" value={48} onChange={noop} prefix="Hours" />
          </StackedField>
          <StackedField label="Auto-approve Refunds Under" description="Automatically approve refund requests below this amount" htmlFor="autoRefund" locked>
            <NumberField id="autoRefund" value={5000} onChange={noop} prefix="NGN" />
          </StackedField>
        </div>
        <FieldShell label="Require Admin Approval" description="Require manual admin approval for refund requests above the auto-approve threshold" locked>
          <Toggle checked onChange={noop} label="Require Admin Approval" />
        </FieldShell>
      </Panel>

      {editing && <EditPlanDialog key={editing.id} plan={editing} onClose={() => setEditing(null)} />}
    </div>
  )
}

const toMinor = (text: string) => Math.round(Number(text.replace(/,/g, "")) * 100)

const EditPlanDialog = ({ plan, onClose }: { plan: AdminPlan, onClose: () => void }) => {
  const update = useUpdatePlan()
  const [name, setName] = useState(plan.name)
  const [tagline, setTagline] = useState(plan.tagline)
  const [monthly, setMonthly] = useState(String(plan.monthlyPriceMinor / 100))
  const [annual, setAnnual] = useState(String(plan.annualPriceMinor / 100))
  const [features, setFeatures] = useState(plan.features.join("\n"))
  const [isActive, setIsActive] = useState(plan.isActive)

  const monthlyMinor = toMinor(monthly)
  const annualMinor = toMinor(annual)
  const priceError =
    !Number.isFinite(monthlyMinor) || !Number.isFinite(annualMinor) || monthlyMinor < 10000 || annualMinor < 10000
      ? "Prices must be at least NGN 100."
      : null
  const priceChanged = monthlyMinor !== plan.monthlyPriceMinor || annualMinor !== plan.annualPriceMinor

  const save = () => {
    if (priceError || !name.trim()) return
    update.mutate(
      {
        id: plan.id,
        changes: {
          name: name.trim(),
          tagline: tagline.trim(),
          monthlyPriceMinor: monthlyMinor,
          annualPriceMinor: annualMinor,
          features: features.split("\n").map((line) => line.trim()).filter(Boolean),
          isActive,
        },
      },
      { onSuccess: onClose },
    )
  }

  return (
    <AlertDialog open onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit {plan.name}</AlertDialogTitle>
          <AlertDialogDescription>
            {plan.subscriberCount > 0
              ? `Its ${formatCount(plan.subscriberCount)} current subscribers keep the price they signed up at; a new price applies to new subscribers.`
              : "Changes show in the app straight away."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="planName">Name</Label>
            <Input id="planName" value={name} maxLength={60} onChange={(event) => setName(event.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="planTagline">Tagline</Label>
            <Input id="planTagline" value={tagline} maxLength={120} onChange={(event) => setTagline(event.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="planMonthly">Monthly price (NGN)</Label>
              <Input id="planMonthly" inputMode="decimal" value={monthly} onChange={(event) => setMonthly(event.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="planAnnual">Annual price (NGN)</Label>
              <Input id="planAnnual" inputMode="decimal" value={annual} onChange={(event) => setAnnual(event.target.value)} />
            </div>
          </div>
          {priceError && <p role="alert" className="text-xs text-[#D94949]">{priceError}</p>}
          <div className="grid gap-1.5">
            <Label htmlFor="planFeatures">Features, one per line</Label>
            <Textarea id="planFeatures" value={features} rows={5} onChange={(event) => setFeatures(event.target.value)} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="planActive">Show in the app</Label>
            <Switch id="planActive" checked={isActive} onCheckedChange={setIsActive} />
          </div>
          {priceChanged && plan.subscriberCount > 0 && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">New subscribers will pay the new price.</p>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={update.isPending}>Cancel</AlertDialogCancel>
          <Button variant="brand" loading={update.isPending} disabled={Boolean(priceError) || !name.trim()} onClick={save}>
            Save Plan
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default PaymentSettings
