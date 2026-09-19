"use client"
import { useState, KeyboardEvent } from "react"
import { Panel, FieldShell, Toggle } from "../general"
import { Check, CheckCheck, ChevronDown, CircleX, Copy, Eye, EyeClosed, Plus } from "lucide-react";

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

const FieldPayment = ({
  label,
  description,
  htmlFor,
  children,
}: FieldShellProps) => {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-neutral-light-500">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {description && <p className="mt-1.5 text-xs font-normal text-neutral-light-400">{description}</p>}
    </div>
  )
}

const baseInputClasses = [
  "w-full rounded-lg border border-slate-200 bg-neutral-white px-3 py-2 text-sm text-neutral-light-600",
  "shadow-sm transition-colors",
  "focus:outline-none focus:ring-1 focus:ring-purple-light-600 focus:border-purple-light-600",
].join(" ");

const TextFieldPayment = ({
  id,
  value,
  onChange,
}: TextFieldProps) => {
  return (
    <input
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={baseInputClasses}
    />
  )
}

function SelectField({
  id,
  value,
  onChange,
  options,
}: SelectFieldProps) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[baseInputClasses, "appearance-none pr-9"].join(" ")}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 " />
    </div>
  )
}

/** A numeric input with a fixed, non-editable prefix badge, e.g. "NGN 500" or "% 85". */
const PrefixedNumberField = ({
  id,
  prefix,
  value,
  onChange,
}: PrefixedNumberFieldProps) => {
  return (
    <div
      className={[
        "flex items-center rounded-lg border border-slate-200 bg-white shadow-sm transition-colors",
        "focus-within:ring-1 focus-within:ring-purple-light-600 focus-within:border-purple-light-600",
      ].join(" ")}
    >
      <span className="select-none border-r border-slate-100 px-3 py-2 text-sm text-neutral-light-400">
        {prefix}
      </span>
      <input
        id={id}
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-r-lg bg-transparent px-3 py-2 text-sm font-normal text-neutral-light-600 focus:outline-none"
      />
    </div>
  )
}

// marked for removal, replaces fieldShell
function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        <p className="mt-0.5 text-xs text-slate-400">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </div>
  )
}

/** Masked API-key field with a show/hide eye toggle. */
const SecretField = ({
  id,
  value,
  onChange,
}: TextFieldProps) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[baseInputClasses, "pr-10 font-mono"].join(" ")}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide key" : "Show key"}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-neutral-light-400 cursor-pointer"
      >
        {visible ? (
          <EyeClosed size={16} className="h-4 w-4" />
        ) : (
          <Eye size={16} className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

const CopyField = ({ id, value }: CopyFieldProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // clipboard API unavailable — fail silently, button still gives feedback
    } finally {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        value={value}
        readOnly
        className={[baseInputClasses, "pr-10 bg-slate-50 text-slate-500 font-normal text-sm"].join(" ")}
      />
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy webhook URL"
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-violet-500 transition-colors hover:text-purple-light-600 cursor-pointer"
      >
        {copied ? (
          <CheckCheck size={20} className="h-4.5 w-4.5" />
        ) : (
          <Copy size={20} className="h-4.5 w-4.5" />
        )}
      </button>
    </div>
  )
}

const CurrencyChips = ({
  currencies,
  onChange,
}: CurrencyChipsProps) => {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const commit = () => {
    const code = draft.trim().toUpperCase();
    if (code && !currencies.includes(code)) {
      onChange([...currencies, code]);
    }
    setDraft("");
    setAdding(false);
  }

  const remove = (code: string) => onChange(currencies.filter((c) => c !== code));

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
    } else if (e.key === "Escape") {
      setDraft("");
      setAdding(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {currencies.map((code) => (
        <span
          key={code}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#F1F5F9] px-3 py-1.5 text-xs font-semibold text-[#334155]"
        >
          {code}
          <CircleX 
            size={12}
            type="button"
            onClick={() => remove(code)}
            aria-label={`Remove ${code}`}
            className="h-3 w-3 text-neutral-light-400 transition-colors hover:text-[#334155] cursor-pointer"
          />
        </span>
      ))}

      {adding ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          placeholder="USD"
          maxLength={3}
          className="w-16 rounded-md border border-violet-300 px-2 py-1 text-xs uppercase text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-light-600"
        />
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex gap-1 items-center text-xs font-semibold px-3 py-1.5 rounded-full bg-bg-purple-light-200 text-purple-light-600 transition-colors hover:text-purple-500 cursor-pointer "
        >
          <Plus size={12} className="h-3 w-3" /> Add
        </button>
      )}
    </div>
  )
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
          <input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className="w-full rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-light-400 focus:outline-none focus:ring-1 focus:ring-purple-light-600"
            placeholder="PLAN NAME"
          />
          <div className="flex items-center gap-1">
            <span className="text-sm text-neutral-light-300">NGN</span>
            <input
              type="number"
              value={draft.price}
              onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
              className="w-full rounded-md border border-slate-200 px-2 py-1 text-lg font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-light-600"
            />
            <span className="text-sm text-neutral-light-300">/month</span>
          </div>
          <textarea
            value={draft.features.join("\n")}
            onChange={(e) =>
              setDraft({ ...draft, features: e.target.value.split("\n").filter(Boolean) })
            }
            rows={5}
            placeholder="One feature per line"
            className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm text-neutral-light-500 focus:outline-none focus:ring-1 focus:ring-purple-light-600"
          />
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={cancel}
            className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-sm font-medium text-neutral-light-400 transition-colors hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            className="flex-1 rounded-lg bg-purple-light-600 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-light-600/90 cursor-pointer"
          >
            Save
          </button>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="mt-2 text-xs font-medium text-red-400 transition-colors hover:text-red-500 cursor-pointer"
        >
          Delete plan
        </button>
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
          <FieldPayment 
            label="Primary Gateway"
            description="Main payment processor for all transactions" 
            htmlFor="primaryGateway"
          >
            <SelectField
              id="primaryGateway"
              value={state.paymentGateway.primaryGateway}
              onChange={(v) => setGateway("primaryGateway", v)}
              options={["Paystack", "Flutterwave", "Stripe", "Interswitch"]}
            />
          </FieldPayment>

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

          <FieldPayment 
            label="Paystack Public Key" 
            description="Your Paystack public API key" 
            htmlFor="paystackPublicKey"
          >
            <SecretField
              id="paystackPublicKey"
              value={state.paymentGateway.paystackPublicKey}
              onChange={(v) => setGateway("paystackPublicKey", v)}
            />
          </FieldPayment>

          <FieldPayment 
            label="Paystack Secret Key" 
            description="Your Paystack secret API key" 
            htmlFor="paystackSecretKey"
          >
            <SecretField
              id="paystackSecretKey"
              value={state.paymentGateway.paystackSecretKey}
              onChange={(v) => setGateway("paystackSecretKey", v)}
            />
          </FieldPayment>

          <div className="sm:col-span-2">
            <FieldPayment 
              label="Webhook URL" 
              description="Configure this URL in your Paystack dashboard" 
              htmlFor="webhookUrl"
            >
              <CopyField id="webhookUrl" value={state.paymentGateway.webhookUrl} />
            </FieldPayment>
          </div>
        </div>
      </Panel>

      {/* Currency & Pricing */}
      <Panel title="Currency & Pricing">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FieldPayment 
            label="Default Currency" 
            description="Primary currency for all transactions" 
            htmlFor="defaultCurrency"
          >
            <SelectField
              id="defaultCurrency"
              value={state.currencyPricing.defaultCurrency}
              onChange={(v) => setCurrency("defaultCurrency", v)}
              options={["NGN - Nigerian Naira", "USD - US Dollar", "GBP - British Pound", "GHS - Ghanaian Cedi"]}
            />
          </FieldPayment>

          <FieldPayment 
            label="Supported Currencies"
            description="Currencies accepted on the platform"
          >
            <CurrencyChips
              currencies={state.currencyPricing.supportedCurrencies}
              onChange={(v) => setCurrency("supportedCurrencies", v)}
            />
          </FieldPayment>

          <FieldPayment
            label="Minimum Transaction Amount"
            description="Lowest amount allowed per transaction"
            htmlFor="minTx"
          >
            <PrefixedNumberField
              id="minTx"
              prefix="NGN"
              value={state.currencyPricing.minimumTransactionAmount}
              onChange={(v) => setCurrency("minimumTransactionAmount", v)}
            />
          </FieldPayment>

          <FieldPayment
            label="Maximum Transaction Amount"
            description="Highest amount allowed per transaction"
            htmlFor="maxTx"
          >
            <PrefixedNumberField
              id="maxTx"
              prefix="NGN"
              value={state.currencyPricing.maximumTransactionAmount}
              onChange={(v) => setCurrency("maximumTransactionAmount", v)}
            />
          </FieldPayment>
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
          <FieldPayment
            label="Event Creator Payout"
            description="Percentage of ticket sales paid to event creators"
            htmlFor="creatorPayout"
          >
            <PrefixedNumberField
              id="creatorPayout"
              prefix="%"
              value={state.payout.eventCreatorPayoutPct}
              onChange={(v) => setPayout("eventCreatorPayoutPct", v)}
            />
          </FieldPayment>

          <FieldPayment
            label="Platform Commission"
            description="Platform fee on paid events"
            htmlFor="platformCommission"
          >
            <PrefixedNumberField
              id="platformCommission"
              prefix="%"
              value={state.payout.platformCommissionPct}
              onChange={(v) => setPayout("platformCommissionPct", v)}
            />
          </FieldPayment>

          <FieldPayment label="Payout Schedule" description="How often payouts are processed" htmlFor="payoutSchedule">
            <SelectField
              id="payoutSchedule"
              value={state.payout.payoutSchedule}
              onChange={(v) => setPayout("payoutSchedule", v)}
              options={["Daily", "Weekly", "Bi-weekly", "Monthly"]}
            />
          </FieldPayment>

          <FieldPayment
            label="Minimum Payout Amount"
            description="Minimum balance before payout is triggered"
            htmlFor="minPayout"
          >
            <PrefixedNumberField
              id="minPayout"
              prefix="NGN"
              value={state.payout.minimumPayoutAmount}
              onChange={(v) => setPayout("minimumPayoutAmount", v)}
            />
          </FieldPayment>

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

          <FieldPayment
            label="Refund Window"
            description="Time after payment within which refunds are allowed"
            htmlFor="refundWindow"
          >
            <PrefixedNumberField
              id="refundWindow"
              prefix="Hours"
              value={state.refund.refundWindowHours}
              onChange={(v) => setRefund("refundWindowHours", v)}
            />
          </FieldPayment>

          <FieldPayment
            label="Auto-approve Refunds Under"
            description="Automatically approve refund requests below this amount"
            htmlFor="autoApproveUnder"
          >
            <PrefixedNumberField
              id="autoApproveUnder"
              prefix="NGN"
              value={state.refund.autoApproveRefundsUnder}
              onChange={(v) => setRefund("autoApproveRefundsUnder", v)}
            />
          </FieldPayment>

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

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pb-4">
        {justSaved && (
          <span className="mr-auto text-sm font-medium text-secondary-green-500">
            Changes saved
          </span>
        )}
        <button
          type="button"
          onClick={handleDiscard}
          disabled={!isChangeDefault}
          className={[
            "rounded-lg border border-[#E6E5EA] bg-neutral-white px-4 py-2 text-sm font-semibold text-neutral-light-400",
            "shadow-sm transition-colors hover:bg-slate-50",
            "disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
          ].join(" ")}
        >
          Discard
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!isChangeDefault}
          className={[
            "rounded-lg bg-purple-light-600 px-4 py-2 text-sm font-semibold text-neutral-white",
            "shadow-sm transition-colors hover:bg-purple-light-600/90",
            "disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
          ].join(" ")}
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}

export default PaymentSettings