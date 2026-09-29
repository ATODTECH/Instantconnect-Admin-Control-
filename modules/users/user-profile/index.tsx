"use client"
import { useState } from "react"
import { useFormik } from "formik"
import { Ban, CircleXIcon, MessageSquare, ShieldAlert } from "lucide-react"
import { cn } from "cn"
import { FormButton, FormInput } from "@/components/form"
import { Skeleton } from "@/components/ui/skeleton"
import { WidgetError } from "@/components/widget-state"
import { useMessageUser, useUser } from "@/hooks/use-users"
import { formatActivityDate, formatCount, initials } from "@/lib/format"
import { messageUserValidationSchema, type MessageUserValues } from "@/schemas/validation-schema"
import { AVATAR_COLORS, KYC_LABELS, PLAN_LABELS, STATUS_LABELS } from "../constants"

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
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 rounded-xl border border-brand-tint bg-brand-surface-subtle p-4">
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
        <label htmlFor="message-body" className="text-sm font-medium text-ink-title">Message</label>
        <textarea
          id="message-body"
          rows={4}
          disabled={isPending}
          placeholder={`Hi ${firstName}, …`}
          aria-invalid={bodyError ? true : undefined}
          aria-describedby={bodyError ? "message-body-error" : undefined}
          className="w-full rounded-md border border-ink-border bg-neutral-white px-3 py-2 text-sm text-ink-title outline-none placeholder:text-ink-placeholder focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/15 aria-invalid:border-danger disabled:opacity-60"
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

const UserProfile = ({ userId, onClose }: { userId: string, onClose: () => void }) => {
  const { data: person, isPending, isError, error, refetch, isRefetching } = useUser(userId)
  const [isComposing, setComposing] = useState(false)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-profile-title"
      onClick={(e) => e.stopPropagation()}
      className="relative flex flex-col ml-auto h-full w-full max-w-105 border border-b-primary-border shadow-[-20px_0px_60px_#00000026] bg-neutral-white cursor-default"
    >
      <div className="flex items-center justify-between gap-4 text-neutral-light-600 text-lg font-bold pt-7.25 pb-5.25 px-6">
        <h3 id="user-profile-title">User Profile Details</h3>
        <button aria-label="Close" className="h-8 w-8 bg-[#F4F3F5] rounded-full cursor-pointer" onClick={onClose}>
          <CircleXIcon size={12} className="h-3 w-3 text-neutral-light-300 mx-auto" />
        </button>
      </div>
      <div className="flex flex-col gap-y-7 px-6 pb-10 scrollbar-thin scrollbar-thumb-gray-200 overflow-y-auto">
        {isPending ? (
          <ProfileSkeleton />
        ) : isError ? (
          <WidgetError message={error.message} onRetry={() => refetch()} isRetrying={isRefetching} className="py-16" />
        ) : (
          <>
            <div className="flex gap-3 items-center w-full rounded-xl border border-bg-purple-light-200 bg-bg-purple-light-200 p-4">
              {person.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- Cloudinary serves its own sized variants
                <img src={person.avatarUrl} alt="" height={80} width={80} className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <span aria-hidden className={cn("inline-flex items-center justify-center shrink-0 w-20 h-20 text-xl rounded-full", AVATAR_COLORS[0])}>
                  {initials(person.fullName)}
                </span>
              )}
              <div className="flex flex-col gap-1 min-w-0">
                <span className="font-bold text-neutral-light-600 text-xl truncate">{person.fullName}</span>
                <span className="font-normal text-neutral-light-300 text-sm truncate">{person.email}</span>
                <span className={cn("font-semibold py-1 px-3 text-xs rounded-md w-fit", STATUS_LABELS[person.status].style)}>
                  {STATUS_LABELS[person.status].label}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="inline-flex items-center justify-center gap-2 w-full py-2 text-xs font-semibold border border-[#FED7AA] bg-[#FFF7ED] text-[#FB923C] rounded-lg cursor-pointer" onClick={() => alert("coming soon!")}>
                <ShieldAlert size={14} className="h-3.5 w-3.5" />
                Suspend
              </button>
              <button
                className="inline-flex items-center justify-center gap-2 w-full py-2 text-xs font-semibold border border-purple-light-600 bg-bg-purple-light-200 text-purple-light-600 rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => setComposing(true)}
                disabled={isComposing || person.status !== "active"}
                title={person.status !== "active" ? "Only active accounts can be messaged" : undefined}
              >
                <MessageSquare size={14} className="h-3.5 w-3.5" />
                Message
              </button>
              <button className="inline-flex items-center justify-center gap-2 w-full py-2 text-xs font-semibold border border-[#EB8C8C] bg-[#FCF2F2] text-[#C92B2B] rounded-lg cursor-pointer" onClick={() => alert("coming soon!")}>
                <Ban size={14} className="h-3.5 w-3.5" />
                Disabled
              </button>
            </div>

            {isComposing && (
              <MessageForm userId={person.id} firstName={person.fullName.split(" ")[0]} onDone={() => setComposing(false)} />
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
                <p className="flex justify-between gap-2 py-2.5 border-b-[.5px] border-b-[#F4F3F5]">
                  <span className="font-medium">KYC Status</span>
                  <span className={cn("text-[11px] py-0.5 px-2 rounded-sm font-semibold", KYC_LABELS[person.kycStatus].style)}>
                    {KYC_LABELS[person.kycStatus].label}
                  </span>
                </p>
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
                  <div key={label} className="border flex flex-col gap-1 rounded-lg border-[#F4F3F5] bg-primary p-3">
                    <h5 className="uppercase text-neutral-light-300 text-xs font-medium">{label}</h5>
                    <span>{formatCount(Number(value))}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default UserProfile
