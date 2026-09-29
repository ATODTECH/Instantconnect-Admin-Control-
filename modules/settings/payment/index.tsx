"use client"
import { useState } from "react"
import { CopyField, FieldShell, NumberField, Panel, SecretField, SelectField, SettingsActions, StackedField, TagInput, Toggle } from "@/components/form/settings-fields"
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BillingState {
  paymentGateway: PaymentGatewayState;
  currencyPricing: CurrencyPricingState;
  plans: SubscriptionPlan[];
  payout: PayoutSettingsState;
  refund: RefundPolicyState;
}

// to-be fmt => API DATA
const initialState: BillingState = {
  paymentGateway: {
    primaryGateway: "Paystack",
    testMode: false,
    paystackPublicKey: "pk_live_51Hn8x92kLm0pQwErTyUiOp",
    paystackSecretKey: "sk_live_9fG7hJ3kLpQwErTyUiOpAsD",
    webhookUrl: "https://api.instantconnect.com/webhooks/paystack",
  },
  currencyPricing: {
    defaultCurrency: "NGN - Nigerian Naira",
    supportedCurrencies: ["NGN", "USD", "GBP"],
    minimumTransactionAmount: 500,
    maximumTransactionAmount: 5000000,
  },
  plans: [
    {
      id: "basic",
      name: "BASIC",
      price: 5000,
      features: ["5 events/month", "3 communities", "Basic support", "Standard matching"],
    },
    {
      id: "premium",
      name: "PREMIUM",
      price: 15000,
      badge: "POPULAR",
      featured: true,
      features: [
        "Unlimited events",
        "10 communities",
        "Priority support",
        "Advanced matching",
        "Analytics",
      ],
    },
    {
      id: "business",
      name: "Business",
      price: 35000,
      features: [
        "Everything in Premium",
        "Unlimited communities",
        "Dedicated manager",
        "Custom branding",
        "API access",
      ],
    },
  ],
  payout: {
    eventCreatorPayoutPct: 85,
    platformCommissionPct: 15,
    payoutSchedule: "Weekly",
    minimumPayoutAmount: 10000,
    autoPayout: true,
  },
  refund: {
    allowRefunds: true,
    refundWindowHours: 48,
    autoApproveRefundsUnder: 5000,
    requireAdminApproval: true,
  },
}

//............. Subscription Plan ................
const formatNaira = (amount: number) => {
  return `NGN ${amount.toLocaleString("en-NG")}`;
}

const PlanCard = ({
  plan,
  onSave,
  onRemove,
}: PlanCardProps) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<SubscriptionPlan>(plan);

  const startEdit = () => {
    setDraft(plan);
    setEditing(true);
  };

  const save = () => {
    onSave(draft);
    setEditing(false);
  };

  const cancel = () => setEditing(false);

  const containerClasses = [
    "relative flex flex-col rounded-xl border p-5",
    plan.featured
      ? "border-violet-300 bg-[#FAF5FF] ring-2 ring-violet-200"
      : "border-slate-200 bg-neutral-white",
  ].join(" ");

  if (editing) {
    return (
      <div className={containerClasses}>
        <div className="space-y-3">
          <Input
            aria-label="Plan name"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className="h-8 text-xs font-semibold uppercase tracking-wide text-neutral-light-400"
            placeholder="PLAN NAME"
          />
          <div className="flex items-center gap-1">
            <span className="text-sm text-neutral-light-300">NGN</span>
            <Input
              aria-label="Monthly price in naira"
              type="number"
              value={draft.price}
              onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
              className="h-9 text-lg font-bold text-slate-900"
            />
            <span className="text-sm text-neutral-light-300">/month</span>
          </div>
          <Textarea
            aria-label="Plan features, one per line"
            value={draft.features.join("\n")}
            onChange={(e) => setDraft({ ...draft, features: e.target.value.split("\n").filter(Boolean) })}
            rows={5}
            placeholder="One feature per line"
            className="text-sm text-neutral-light-500"
          />
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="lg" className="flex-1" onClick={cancel}>Cancel</Button>
          <Button variant="brand" size="lg" className="flex-1" onClick={save}>Save</Button>
        </div>
        <Button variant="link" size="sm" onClick={onRemove} className="mt-2 text-red-400 hover:text-red-500">
          Delete plan
        </Button>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {plan.badge && (
        <span className="absolute right-4 top-4 rounded-full bg-purple-light-600 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-white">
          {plan.badge}
        </span>
      )}
      <p className="text-sm font-bold uppercase tracking-wide text-neutral-light-400">{plan.name}</p>
      <p className="mt-2 text-xl font-extrabold text-neutral-light-600">
        {formatNaira(plan.price)}
        <span className="text-sm font-medium text-neutral-light-400">/month</span>
      </p>
      <ul className="mt-4 flex-1 space-y-2">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-[13px] text-[#4B5563] font-medium">
            <Check size={16} className=" h-4 w-4 text-secondary-green-500" />
            {feature}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={startEdit}
        className={[
          "mt-5 w-full rounded-lg py-2 text-[13px] font-semibold transition-colors cursor-pointer",
          plan.featured
            ? "bg-violet-600 text-white hover:bg-violet-700"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200",
        ].join(" ")}
      >
        Edit Plan
      </button>
    </div>
  )
}


const PaymentSettings = () => {
  const [state, setState] = useState<BillingState>(initialState)
  const [saved, setSaved] = useState<BillingState>(initialState)
  const [justSaved, setJustSaved] = useState(false)

  const isChangeDefault = JSON.stringify(state) !== JSON.stringify(saved)

  const setGateway = <K extends keyof PaymentGatewayState>(key: K, value: PaymentGatewayState[K]) =>
    setState((s) => ({ ...s, paymentGateway: { ...s.paymentGateway, [key]: value } }))

  const setCurrency = <K extends keyof CurrencyPricingState>(key: K, value: CurrencyPricingState[K]) =>
    setState((s) => ({ ...s, currencyPricing: { ...s.currencyPricing, [key]: value } }))

  const setPayout = <K extends keyof PayoutSettingsState>(key: K, value: PayoutSettingsState[K]) =>
    setState((s) => ({ ...s, payout: { ...s.payout, [key]: value } }))

  const setRefund = <K extends keyof RefundPolicyState>(key: K, value: RefundPolicyState[K]) =>
    setState((s) => ({ ...s, refund: { ...s.refund, [key]: value } }))

  const savePlan = (plan: SubscriptionPlan) =>
    setState((s) => ({
      ...s,
      plans: s.plans.some((p) => p.id === plan.id)
        ? s.plans.map((p) => (p.id === plan.id ? plan : p))
        : [...s.plans, plan],
    }))

  const removePlan = (id: string) =>
    setState((s) => ({ ...s, plans: s.plans.filter((p) => p.id !== id) }))

  const addPlan = () => {
    const id = `plan-${Date.now()}`;
    setState((s) => ({
      ...s,
      plans: [...s.plans, { id, name: "NEW PLAN", price: 0, features: [] }],
    }))
  }

  const handleDiscard = () => setState(saved)
  const handleSave = () => {
    setSaved(state)
    setJustSaved(true)
    window.setTimeout(() => setJustSaved(false), 2000)
  }


  return (
    <div className="space-y-6">
      <Panel title="Payment Gateway">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <StackedField 
            label="Primary Gateway"
            description="Main payment processor for all transactions" 
            htmlFor="primaryGateway"
          >
            <SelectField className="w-full"
              id="primaryGateway"
              value={state.paymentGateway.primaryGateway}
              onChange={(v) => setGateway("primaryGateway", v)}
              options={["Paystack", "Flutterwave", "Stripe", "Interswitch"]}
            />
          </StackedField>

          <FieldShell
            label="Test Mode"
            description="Enable test mode to simulate payments without real charges"
          >
            <Toggle
              checked={state.paymentGateway.testMode}
              onChange={(v) => setGateway("testMode", v)}
              label="Auto Data Backup"
            />
          </FieldShell>

          <StackedField 
            label="Paystack Public Key" 
            description="Your Paystack public API key" 
            htmlFor="paystackPublicKey"
          >
            <SecretField
              id="paystackPublicKey"
              value={state.paymentGateway.paystackPublicKey}
              onChange={(v) => setGateway("paystackPublicKey", v)}
            />
          </StackedField>

          <StackedField 
            label="Paystack Secret Key" 
            description="Your Paystack secret API key" 
            htmlFor="paystackSecretKey"
          >
            <SecretField
              id="paystackSecretKey"
              value={state.paymentGateway.paystackSecretKey}
              onChange={(v) => setGateway("paystackSecretKey", v)}
            />
          </StackedField>

          <div className="sm:col-span-2">
            <StackedField 
              label="Webhook URL" 
              description="Configure this URL in your Paystack dashboard" 
              htmlFor="webhookUrl"
            >
              <CopyField id="webhookUrl" value={state.paymentGateway.webhookUrl} label="Copy webhook URL" />
            </StackedField>
          </div>
        </div>
      </Panel>

      {/* Currency & Pricing */}
      <Panel title="Currency & Pricing">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <StackedField 
            label="Default Currency" 
            description="Primary currency for all transactions" 
            htmlFor="defaultCurrency"
          >
            <SelectField className="w-full"
              id="defaultCurrency"
              value={state.currencyPricing.defaultCurrency}
              onChange={(v) => setCurrency("defaultCurrency", v)}
              options={["NGN - Nigerian Naira", "USD - US Dollar", "GBP - British Pound", "GHS - Ghanaian Cedi"]}
            />
          </StackedField>

          <TagInput
            id="supportedCurrencies"
            label="Supported Currencies"
            description="Currencies accepted on the platform"
            values={state.currencyPricing.supportedCurrencies}
            onChange={(v) => setCurrency("supportedCurrencies", v)}
            normalise={(code) => code.toUpperCase()}
            validate={(code) =>
              !/^[A-Z]{3}$/.test(code) ? "Use a three-letter currency code, e.g. USD" : state.currencyPricing.supportedCurrencies.includes(code) ? "That currency is already added" : null
            }
            placeholder="USD"
            noun="currency"
            className="mt-0"
          />

          <StackedField
            label="Minimum Transaction Amount"
            description="Lowest amount allowed per transaction"
            htmlFor="minTx"
          >
            <NumberField
              id="minTx"
              prefix="NGN"
              value={state.currencyPricing.minimumTransactionAmount}
              onChange={(v) => setCurrency("minimumTransactionAmount", v)}
            />
          </StackedField>

          <StackedField
            label="Maximum Transaction Amount"
            description="Highest amount allowed per transaction"
            htmlFor="maxTx"
          >
            <NumberField
              id="maxTx"
              prefix="NGN"
              value={state.currencyPricing.maximumTransactionAmount}
              onChange={(v) => setCurrency("maximumTransactionAmount", v)}
            />
          </StackedField>
        </div>
      </Panel>

      {/* Subscription Plans */}
      <Panel title="Subscription Plans">
        <div className="w-full">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 select-none">
            {state.plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onSave={savePlan}
                onRemove={() => removePlan(plan.id)}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={addPlan}
            className="flex items-center gap-1 mt-4 w-full rounded-xl border border-dashed border-violet-300 py-3 text-sm font-semibold text-violet-600 transition-colors hover:bg-violet-50 sm:w-auto sm:px-6 cursor-pointer"
          >
            <Plus size={15} className="h-3.5 w-3.5 cursor-pointer" /> Add New Plan
          </button>
        </div>
      </Panel>

      {/* Payout Settings */}
      <Panel title="Payout Settings">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <StackedField
            label="Event Creator Payout"
            description="Percentage of ticket sales paid to event creators"
            htmlFor="creatorPayout"
          >
            <NumberField
              id="creatorPayout"
              prefix="%"
              value={state.payout.eventCreatorPayoutPct}
              onChange={(v) => setPayout("eventCreatorPayoutPct", v)}
            />
          </StackedField>

          <StackedField
            label="Platform Commission"
            description="Platform fee on paid events"
            htmlFor="platformCommission"
          >
            <NumberField
              id="platformCommission"
              prefix="%"
              value={state.payout.platformCommissionPct}
              onChange={(v) => setPayout("platformCommissionPct", v)}
            />
          </StackedField>

          <StackedField label="Payout Schedule" description="How often payouts are processed" htmlFor="payoutSchedule">
            <SelectField className="w-full"
              id="payoutSchedule"
              value={state.payout.payoutSchedule}
              onChange={(v) => setPayout("payoutSchedule", v)}
              options={["Daily", "Weekly", "Bi-weekly", "Monthly"]}
            />
          </StackedField>

          <StackedField
            label="Minimum Payout Amount"
            description="Minimum balance before payout is triggered"
            htmlFor="minPayout"
          >
            <NumberField
              id="minPayout"
              prefix="NGN"
              value={state.payout.minimumPayoutAmount}
              onChange={(v) => setPayout("minimumPayoutAmount", v)}
            />
          </StackedField>

          <div className="col-span-2">
            <FieldShell
              label="Auto Payout"
              description="Automatically process payouts on schedule"
            >
              <Toggle
                checked={state.payout.autoPayout}
                onChange={(v) => setPayout("autoPayout", v)}
                label="Auto Payout"
              />
            </FieldShell>
          </div>
        </div>
      </Panel>

      {/* Refund Policy */}
      <Panel title="Refund Policy">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="col-span-2">
            <FieldShell
              label="Allow Refunds"
              description="Enable users to request refunds"
            >
              <Toggle
                checked={state.refund.allowRefunds}
                onChange={(v) => setRefund("allowRefunds", v)}
                label="Allow Refunds"
              />
            </FieldShell>
          </div>

          <StackedField
            label="Refund Window"
            description="Time after payment within which refunds are allowed"
            htmlFor="refundWindow"
          >
            <NumberField
              id="refundWindow"
              prefix="Hours"
              value={state.refund.refundWindowHours}
              onChange={(v) => setRefund("refundWindowHours", v)}
            />
          </StackedField>

          <StackedField
            label="Auto-approve Refunds Under"
            description="Automatically approve refund requests below this amount"
            htmlFor="autoApproveUnder"
          >
            <NumberField
              id="autoApproveUnder"
              prefix="NGN"
              value={state.refund.autoApproveRefundsUnder}
              onChange={(v) => setRefund("autoApproveRefundsUnder", v)}
            />
          </StackedField>

          <div className="col-span-2">
            <FieldShell
              label="Require Admin Approval"
              description="Require manual admin approval for refund requests above auto-approve threshold"
            >
              <Toggle
                checked={state.refund.requireAdminApproval}
                onChange={(v) => setRefund("requireAdminApproval", v)}
                label="Require Admin Approval"
              />
            </FieldShell>
          </div>
        </div>
      </Panel>

      <SettingsActions isDirty={isChangeDefault} justSaved={justSaved} onDiscard={handleDiscard} onSave={handleSave} />
    </div>
  )
}

export default PaymentSettings