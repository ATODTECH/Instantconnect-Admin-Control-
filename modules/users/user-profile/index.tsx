"use client"
import { useState } from "react"
import { useFormik } from "formik"
import { Ban, CircleCheck, MessageSquare, Trash2 } from "lucide-react"
import { FormButton, FormInput } from "@/components/form"
import { StatusBadge } from "@/components/shared/status-badge"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { WidgetError } from "@/components/widget-state"
import { useDeleteUser, useMessageUser, useSetUserEnabled, useUser } from "@/hooks/use-users"
import { formatActivityDate, formatCount } from "@/lib/format"
import { messageUserValidationSchema, type MessageUserValues } from "@/schemas/validation-schema"
import { KYC_LABELS, PLAN_LABELS, STATUS_LABELS } from "../constants"

const DATE = new Intl.DateTimeFormat("en-NG", { day: "2-digit", month: "short", year: "numeric", timeZone: "Africa/Lagos" })
const formatDate = (iso: string) => DATE.format(new Date(iso))
/** A date of birth has no time zone; noon UTC keeps it on the same calendar day everywhere. */
const formatBirthday = (day: string) => DATE.format(new Date(`${day}T12:00:00Z`))

const Row = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <p className="flex justify-between gap-2 py-2.5 border-b-[.5px] border-b-[#F4F3F5]">
    <span className="font-medium">{label}</span>
    <span className="text-neutral-light-500 font-semibold text-right">{children ?? "Not provided"}</span>
  </p>
)

const MessageForm = ({ userId, firstName, onDone }: { userId: string, firstName: string, onDone: () => void }) => {
  const { mutate: send, isPending } = useMessageUser()
  const formik = useFormik<MessageUserValues>({
    initialValues: { subject: "", body: "" },
    validationSchema: messageUserValidationSchema,
    onSubmit: (values) => {
      send({ id: userId, ...messageUserValidationSchema.cast(values) }, { onSuccess: onDone })
    },
  })
  const { getFieldProps, errors, touched, handleSubmit } = formik
  const bodyError = touched.body && errors.body

  return (
    <form method="post" onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 rounded-xl border border-brand-tint bg-brand-surface-subtle p-4">
      <p className="text-xs text-ink-muted">
        This goes to {firstName}&apos;s Help &amp; Support chat in the app, signed with your first name.
      </p>
      <FormInput
        id="message-subject"
        type="text"
        label="Subject"
        placeholder="Account review"
        disabled={isPending}
        inputStyle="h-10"
        {...getFieldProps("subject")}
        touched={touched.subject}
        error={errors.subject}
      />
      <div className="grid gap-2">
        <Label htmlFor="message-body" className="text-ink-title">Message</Label>
        <Textarea
          id="message-body"
          rows={4}
          disabled={isPending}
          placeholder={`Hi ${firstName}, …`}
          aria-invalid={bodyError ? true : undefined}
          aria-describedby={bodyError ? "message-body-error" : undefined}
          className="min-h-24 bg-neutral-white text-ink-title placeholder:text-ink-placeholder focus-visible:border-primary focus-visible:ring-primary/15"
          {...getFieldProps("body")}
        />
        {bodyError && <p id="message-body-error" role="alert" className="text-sm text-danger">{errors.body}</p>}
      </div>
      <div className="flex gap-2">
        <FormButton btnType="button" variant="outline" btnText="Cancel" btnStyles="flex-1 h-9" handleClick={onDone} disabled={isPending} />
        <FormButton btnType="submit" btnText={isPending ? "Sending" : "Send message"} btnStyles="flex-1 h-9" isLoading={isPending} />
      </div>
    </form>
  )
}

type Confirming = "disable" | "delete"

const CONFIRM_COPY: Record<Confirming, { title: string, body: (firstName: string) => string, action: string, pending: string }> = {
  disable: {
    title: "Disable this account?",
    body: (firstName) => `${firstName} is signed out everywhere and cannot sign in until you enable the account again.`,
    action: "Disable",
    pending: "Disabling",
  },
  delete: {
    title: "Delete this account?",
    body: (firstName) => `${firstName} disappears from discovery, chat and this list, and their email and phone can register again. This cannot be undone here.`,
    action: "Delete account",
    pending: "Deleting",
  },
}

const ConfirmAction = ({ kind, firstName, isPending, onConfirm, onCancel }: {
  kind: Confirming
  firstName: string
  isPending: boolean
  onConfirm: () => void
  onCancel: () => void
}) => {
  const copy = CONFIRM_COPY[kind]

  return (
    <div role="alertdialog" aria-labelledby="confirm-title" aria-describedby="confirm-body" className="flex flex-col gap-3 rounded-xl border border-[#EB8C8C] bg-[#FCF2F2] p-4">
      <p id="confirm-title" className="text-sm font-semibold text-[#C92B2B]">{copy.title}</p>
      <p id="confirm-body" className="text-xs text-ink-muted">{copy.body(firstName)}</p>
      <div className="flex gap-2">
        <FormButton btnType="button" variant="outline" btnText="Cancel" btnStyles="flex-1 h-9" handleClick={onCancel} disabled={isPending} />
        <FormButton
          btnType="button"
          btnText={isPending ? copy.pending : copy.action}
          btnStyles="flex-1 h-9 bg-[#C92B2B] hover:bg-[#B02525]"
          handleClick={onConfirm}
          isLoading={isPending}
        />
      </div>
    </div>
  )
}

const ProfileSkeleton = () => (
  <div role="status" className="flex flex-col gap-y-7">
    <span className="sr-only">Loading profile</span>
    <div className="flex gap-3 items-center rounded-xl bg-bg-purple-light-200 p-4">
      <Skeleton className="h-20 w-20 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-52" />
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
    <Skeleton className="h-9 w-full rounded-lg" />
    <div className="space-y-3">
      {Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-5 w-full" />)}
    </div>
    <div className="grid grid-cols-2 gap-2.5">
      {Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-18 rounded-lg" />)}
    </div>
  </div>
)

const UserProfile = ({ userId, onDeleted }: { userId: string, onDeleted: () => void }) => {
  const { data: person, isPending, isError, error, refetch, isRefetching } = useUser(userId)
  const { mutate: setEnabled, isPending: isToggling } = useSetUserEnabled()
  const { mutate: remove, isPending: isDeleting } = useDeleteUser()
  const [isComposing, setComposing] = useState(false)
  const [confirming, setConfirming] = useState<Confirming | null>(null)

  if (isPending) return <ProfileSkeleton />
  if (isError) {
    return <WidgetError message={error.message} onRetry={() => refetch()} isRetrying={isRefetching} className="py-16" />
  }

  const firstName = person.fullName.split(" ")[0]
  const isDisabled = person.status === "suspended"
  const isBusy = isToggling || isDeleting

  const confirm = () => {
    if (confirming === "disable") {
      setEnabled({ id: person.id, enabled: false }, { onSuccess: () => setConfirming(null) })
    } else if (confirming === "delete") {
      remove({ id: person.id, fullName: person.fullName }, { onSuccess: onDeleted })
    }
  }

  const open = (next: Confirming) => {
    setComposing(false)
    setConfirming(next)
  }

  return (
    <>
      <div className="flex gap-3 items-center w-full rounded-xl border border-bg-purple-light-200 bg-bg-purple-light-200 p-4">
        <UserAvatar name={person.fullName} src={person.avatarUrl} size="lg" />
        <div className="flex flex-col gap-1 min-w-0">
          <span className="font-bold text-neutral-light-600 text-xl truncate">{person.fullName}</span>
          <span className="font-normal text-neutral-light-300 text-sm truncate">{person.email}</span>
          <StatusBadge tone={STATUS_LABELS[person.status].tone} className="w-fit">{STATUS_LABELS[person.status].label}</StatusBadge>
        </div>
      </div>

      <div className="flex gap-2">
        {isDisabled ? (
          <button
            className="inline-flex items-center justify-center gap-2 w-full py-2 text-xs font-semibold border border-[#BBF7D0] bg-[#F0FDF4] text-[#16A34A] rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setEnabled({ id: person.id, enabled: true })}
            disabled={isBusy}
          >
            <CircleCheck size={14} className="h-3.5 w-3.5" />
            {isToggling ? "Enabling" : "Enable"}
          </button>
        ) : (
          <button
            className="inline-flex items-center justify-center gap-2 w-full py-2 text-xs font-semibold border border-[#FED7AA] bg-[#FFF7ED] text-[#FB923C] rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => open("disable")}
            disabled={isBusy || confirming === "disable"}
          >
            <Ban size={14} className="h-3.5 w-3.5" />
            Disable
          </button>
        )}
        <button
          className="inline-flex items-center justify-center gap-2 w-full py-2 text-xs font-semibold border border-purple-light-600 bg-bg-purple-light-200 text-purple-light-600 rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => {
            setConfirming(null)
            setComposing(true)
          }}
          disabled={isBusy || isComposing || person.status !== "active"}
          title={person.status !== "active" ? "Only active accounts can be messaged" : undefined}
        >
          <MessageSquare size={14} className="h-3.5 w-3.5" />
          Message
        </button>
        <button
          className="inline-flex items-center justify-center gap-2 w-full py-2 text-xs font-semibold border border-[#EB8C8C] bg-[#FCF2F2] text-[#C92B2B] rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => open("delete")}
          disabled={isBusy || confirming === "delete"}
        >
          <Trash2 size={14} className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>

      {confirming && (
        <ConfirmAction
          kind={confirming}
          firstName={firstName}
          isPending={isBusy}
          onConfirm={confirm}
          onCancel={() => setConfirming(null)}
        />
      )}

      {isComposing && (
        <MessageForm userId={person.id} firstName={firstName} onDone={() => setComposing(false)} />
      )}

      <div>
        <h4 className="uppercase font-semibold text-xs text-purple-light-600 mb-1.5">Personal Information</h4>
        <div className="text-neutral-light-300 text-sm">
          <Row label="Full Name">{person.fullName}</Row>
          <Row label="Email Address">{person.email}</Row>
          <Row label="Phone Number">{person.phone}</Row>
          <Row label="Username">{person.username && `@${person.username}`}</Row>
          <Row label="Date of Birth">{person.dateOfBirth && formatBirthday(person.dateOfBirth)}</Row>
          <Row label="Location">{person.location}</Row>
        </div>
      </div>
      <div>
        <h4 className="uppercase font-semibold text-xs text-purple-light-600 mb-1.5">Account Details</h4>
        <div className="text-neutral-light-300 text-sm">
          <Row label="Joined Date">{formatDate(person.joinedAt)}</Row>
          <Row label="Last Active">{person.lastActiveAt ? formatActivityDate(person.lastActiveAt) : "Never"}</Row>
          <div className="flex justify-between gap-2 py-2.5 border-b-[.5px] border-b-[#F4F3F5]">
            <span className="font-medium">KYC Status</span>
            <StatusBadge tone={KYC_LABELS[person.kycStatus].tone}>{KYC_LABELS[person.kycStatus].label}</StatusBadge>
          </div>
          <div className="flex justify-between gap-2 py-2.5 border-b-[.5px] border-b-[#F4F3F5]">
            <span className="font-medium">Subscription</span>
            <span className="border px-1.5 py-0.5 border-[#E9D5FF] bg-bg-purple-light-200 rounded-sm text-neutral-light-500 font-medium text-[.625rem]">
              {PLAN_LABELS[person.plan]}
            </span>
          </div>
        </div>
      </div>
      <div>
        <h4 className="uppercase font-semibold text-xs text-purple-light-600 mb-3">Activity Statistics</h4>
        <div className="grid grid-cols-2 gap-2.5 text-xl font-bold text-neutral-light-500">
          {[
            ["Events Attended", person.stats.eventsAttended],
            ["Events Created", person.stats.eventsCreated],
            ["Connections", person.stats.connections],
          ].map(([label, value]) => (
            <div key={label} className="border flex flex-col gap-1 rounded-lg border-[#F4F3F5] bg-ic-light p-3">
              <h5 className="uppercase text-neutral-light-300 text-xs font-medium">{label}</h5>
              <span>{formatCount(Number(value))}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default UserProfile
