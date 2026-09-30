"use client"

import { useState } from "react"
import { ExternalLink } from "lucide-react"
import { DetailRow, DetailSection } from "@/components/shared/detail-parts"
import { StatusBadge } from "@/components/shared/status-badge"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { WidgetError } from "@/components/widget-state"
import { useApproveKyc, useKycSubmission, useRejectKyc } from "@/hooks/use-kyc"
import { formatActivityDate } from "@/lib/format"
import type { KycSubmission } from "@/types/admin-kyc"
import { ADDITIONAL_ID_LABELS, KIN_LABELS, KYC_STATUS_LABELS, formatDay } from "../constants"

const REASON_MAX = 300

/** A reviewer's aid, not saved: Approve waits until every box is ticked. */
const CHECKLIST = [
  { id: "selfie-match", label: "Selfie matches the photo on both IDs" },
  { id: "not-expired", label: "IDs are not expired" },
  { id: "details-match", label: "Name and date of birth match the account" },
  { id: "address-match", label: "Utility bill shows the address given" },
  { id: "no-tampering", label: "No visible signs of tampering" },
] as const

/** A date of birth has no time zone; noon UTC keeps it on the same calendar day everywhere. */
const formatBirthday = (day: string) => formatDay(`${day}T12:00:00Z`)

const DocumentImage = ({ label, src }: { label: string, src: string }) => (
  <a
    href={src}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative flex flex-col gap-1.5 rounded-lg focus-visible:outline-2 focus-visible:outline-primary"
  >
    <span className="flex h-32 items-center justify-center overflow-hidden rounded-lg border border-primary-border bg-[#F4F3F5]">
      {/* A signed Cloudinary URL, sized on the server; next/image would need the host allow-listed for no gain. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={label} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-[1.03]" />
    </span>
    <span className="flex items-center gap-1 text-xs font-semibold text-[#64748B]">
      {label}
      <ExternalLink className="h-3 w-3" aria-hidden />
      <span className="sr-only">(opens full size in a new tab)</span>
    </span>
  </a>
)

const Documents = ({ submission }: { submission: KycSubmission }) => (
  <DetailSection title="Documents">
    <div className="grid grid-cols-2 gap-3 pt-1.5">
      <DocumentImage label="National ID Card" src={submission.documents.nationalId} />
      <DocumentImage label={ADDITIONAL_ID_LABELS[submission.additionalIdKind]} src={submission.documents.additionalId} />
      <DocumentImage label="Utility Bill" src={submission.documents.utilityBill} />
      <DocumentImage label="Selfie" src={submission.documents.selfie} />
    </div>
  </DetailSection>
)

const Decision = ({ submission }: { submission: KycSubmission }) => (
  <DetailSection title="Decision">
    <DetailRow label="Outcome">
      <StatusBadge tone={KYC_STATUS_LABELS[submission.status].tone}>{KYC_STATUS_LABELS[submission.status].label}</StatusBadge>
    </DetailRow>
    <DetailRow label="Reviewed">{submission.reviewedAt && formatActivityDate(submission.reviewedAt)}</DetailRow>
    <DetailRow label="Reviewed By">{submission.reviewedByName}</DetailRow>
    {submission.status === "rejected" && (
      <p className="mt-3 rounded-lg border border-primary-border bg-[#FBFBFD] p-3 text-sm text-neutral-light-500">
        <span className="mb-1 block text-xs font-semibold uppercase text-neutral-light-300">Reason sent to the member</span>
        {submission.rejectionReason}
      </p>
    )}
  </DetailSection>
)

const ReviewActions = ({ submission }: { submission: KycSubmission }) => {
  const [checked, setChecked] = useState<Set<string>>(() => new Set())
  const [reason, setReason] = useState("")
  const [reasonError, setReasonError] = useState<string | null>(null)
  const { mutate: approve, isPending: isApproving } = useApproveKyc()
  const { mutate: reject, isPending: isRejecting } = useRejectKyc()

  const isBusy = isApproving || isRejecting
  const allChecked = checked.size === CHECKLIST.length

  const toggle = (id: string) =>
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const submitRejection = () => {
    const trimmed = reason.trim()
    if (!trimmed) {
      setReasonError("Add a reason. The member sees it and can fix the problem.")
      return
    }
    setReasonError(null)
    reject({ id: submission.id, reason: trimmed })
  }

  return (
    <>
      <DetailSection title="Verification Checklist">
        <ul className="flex flex-col gap-3 pt-1.5">
          {CHECKLIST.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              <Checkbox id={item.id} checked={checked.has(item.id)} onCheckedChange={() => toggle(item.id)} disabled={isBusy} />
              <Label htmlFor={item.id} className="text-[13px] font-normal leading-relaxed text-[#475569]">{item.label}</Label>
            </li>
          ))}
        </ul>
      </DetailSection>

      <DetailSection title="Reason for Rejection">
        <Textarea
          id="kyc-rejection-reason"
          value={reason}
          onChange={(e) => {
            setReason(e.target.value)
            if (reasonError) setReasonError(null)
          }}
          maxLength={REASON_MAX}
          rows={4}
          disabled={isBusy}
          aria-label="Reason for rejection"
          aria-invalid={reasonError ? true : undefined}
          aria-describedby="kyc-rejection-hint"
          placeholder="e.g. The utility bill is older than three months."
          className="mt-1.5 min-h-18 bg-[#FBFBFD] text-neutral-light-500"
        />
        <p id="kyc-rejection-hint" className="mt-1.5 flex justify-between gap-2 text-xs">
          {reasonError
            ? <span role="alert" className="text-danger">{reasonError}</span>
            : <span className="text-neutral-light-300">Only needed to reject. The member sees it in the app.</span>}
          <span className="shrink-0 text-neutral-light-300">{reason.length}/{REASON_MAX}</span>
        </p>
      </DetailSection>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <Button
            variant="success"
            size="lg"
            className="flex-1"
            loading={isApproving}
            disabled={!allChecked || isRejecting}
            title={allChecked ? undefined : "Tick every check to approve"}
            onClick={() => approve({ id: submission.id })}
          >
            Approve
          </Button>
          <Button variant="danger" size="lg" className="flex-1" loading={isRejecting} disabled={isApproving} onClick={submitRejection}>
            Reject
          </Button>
        </div>
        {!allChecked && <p className="text-xs text-neutral-light-300">Tick every check above to approve.</p>}
      </div>
    </>
  )
}

const ReviewSkeleton = () => (
  <div role="status" className="flex flex-col gap-y-7">
    <span className="sr-only">Loading submission</span>
    <div className="flex items-center gap-3 rounded-xl bg-bg-purple-light-200 p-4">
      <Skeleton className="h-20 w-20 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-52" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-32 rounded-lg" />)}
    </div>
    <div className="space-y-3">
      {Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-5 w-full" />)}
    </div>
  </div>
)

const KycReview = ({ submissionId }: { submissionId: string }) => {
  const { data: submission, isPending, isError, error, refetch, isRefetching } = useKycSubmission(submissionId)

  if (isPending) return <ReviewSkeleton />
  if (isError) {
    return <WidgetError message={error.message} onRetry={() => refetch()} isRetrying={isRefetching} className="py-16" />
  }

  const { applicant } = submission

  return (
    <>
      <div className="flex w-full items-center gap-3 rounded-xl border border-bg-purple-light-200 bg-bg-purple-light-200 p-4">
        <UserAvatar name={applicant.fullName} src={applicant.avatarUrl} size="lg" />
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-xl font-bold text-neutral-light-600">{applicant.fullName}</span>
          <span className="truncate text-sm text-neutral-light-300">{applicant.email}</span>
          <span className="text-[11px] text-neutral-light-300">Submitted {formatActivityDate(submission.submittedAt)}</span>
          <StatusBadge tone={KYC_STATUS_LABELS[submission.status].tone} className="mt-1 w-fit">{KYC_STATUS_LABELS[submission.status].label}</StatusBadge>
        </div>
      </div>

      <Documents submission={submission} />

      <DetailSection title="Applicant Details">
        <DetailRow label="Full Name">{applicant.fullName}</DetailRow>
        <DetailRow label="Date of Birth">{applicant.dateOfBirth && formatBirthday(applicant.dateOfBirth)}</DetailRow>
        <DetailRow label="Phone Number">{applicant.phone}</DetailRow>
        <DetailRow label="Address">{submission.addressLine}</DetailRow>
        <DetailRow label="City">{`${submission.city}, ${submission.state}`}</DetailRow>
        <DetailRow label="Country">{submission.country}</DetailRow>
      </DetailSection>

      <DetailSection title="Next of Kin">
        <DetailRow label="Name">{submission.kinName}</DetailRow>
        <DetailRow label="Relationship">{KIN_LABELS[submission.kinRelationship]}</DetailRow>
        <DetailRow label="Phone Number">{submission.kinPhone}</DetailRow>
        <DetailRow label="Email">{submission.kinEmail}</DetailRow>
        <DetailRow label="Address">{submission.kinAddress}</DetailRow>
      </DetailSection>

      {submission.status === "pending" ? <ReviewActions submission={submission} /> : <Decision submission={submission} />}
    </>
  )
}

export default KycReview
