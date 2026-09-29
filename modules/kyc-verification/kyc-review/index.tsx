"use client"

import { useState } from "react"
import { Image as ImageIcon } from "lucide-react"
import { DetailRow, DetailSection } from "@/components/shared/detail-parts"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { ChecklistItem, SubmitStatus } from "@/types/kyc-verification"
import type { UserRecord } from "../mock-users"

const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: "photo-match", label: "Photo matches profile photo", checked: true },
  { id: "not-expired", label: "Document is not expired", checked: true },
  { id: "details-match", label: "Details match system records", checked: true },
  { id: "no-tampering", label: "No visible signs of tampering", checked: false },
]

const comingSoon = () => alert("coming soon!")

const DocumentSlots = ({ documentName }: { documentName: string }) => (
  <section>
    <div className="mb-3 flex items-end justify-between gap-4">
      <h4 className="text-xs font-semibold uppercase text-primary">Document Information</h4>
      <span className="inline-flex rounded-sm border border-brand-tint bg-secondary px-1.5 py-0.5 text-[.625rem] font-semibold text-primary">{documentName}</span>
    </div>
    <div className="grid grid-cols-2 gap-3">
      {["Front of Document", "Back of Document"].map((side) => (
        <button
          key={side}
          type="button"
          onClick={comingSoon}
          className="flex h-25 flex-col items-center justify-center gap-2 rounded-lg border border-primary-border bg-[#F4F3F5] p-3 text-xs font-semibold text-[#64748B] hover:bg-slate-100"
        >
          <ImageIcon className="h-5 w-5" aria-hidden />
          {side}
        </button>
      ))}
    </div>
  </section>
)

const KycReview = ({ person }: { person: UserRecord }) => {
  const [notes, setNotes] = useState("")
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST)
  const [status, setStatus] = useState<SubmitStatus>("idle")

  const toggle = (id: string) =>
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)))

  // Simulated until the KYC review is wired to /kyc/submissions/:id/approve and /reject.
  const decide = async (decision: "approved" | "rejected") => {
    setStatus("submitting")
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setStatus(decision)
  }

  return (
    <>
      <div className="flex w-full items-center gap-3 rounded-xl border border-bg-purple-light-200 bg-bg-purple-light-200 p-4">
        <UserAvatar name={person.name} src={person.avatar || null} size="lg" />
        <div className="flex flex-col">
          <span className="text-xl font-bold text-neutral-light-600">{person.name}</span>
          <span className="text-sm text-neutral-light-300">{person.email}</span>
          <span className="text-[11px] text-neutral-light-300">Submitted: {person.kycDateSubmitted}</span>
        </div>
      </div>

      <DocumentSlots documentName={person.docType.nin} />
      <DocumentSlots documentName={person.docType.otherKYCType} />

      <DetailSection title="Extracted Details">
        <DetailRow label="Full Name">{person.name}</DetailRow>
        <DetailRow label="NIN Number">•••• •••• 8383</DetailRow>
        <DetailRow label="Date of Birth">{person.dob}</DetailRow>
        <DetailRow label="Address">{person.location}</DetailRow>
      </DetailSection>

      <DetailSection title="Verification Checklist">
        <ul className="flex flex-col gap-3 pt-1.5">
          {checklist.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              <Checkbox id={item.id} checked={item.checked} onCheckedChange={() => toggle(item.id)} />
              <Label htmlFor={item.id} className="text-[13px] font-normal leading-relaxed text-[#475569]">{item.label}</Label>
            </li>
          ))}
        </ul>
      </DetailSection>

      <DetailSection title="Admin Notes">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={255}
          rows={4}
          aria-label="Admin notes"
          placeholder="Add review notes or reason for rejection here..."
          className="mt-1.5 min-h-18 bg-[#FBFBFD] text-neutral-light-500"
        />
      </DetailSection>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="success"
            size="lg"
            className="flex-1"
            loading={status === "submitting"}
            disabled={person.action === "Review"}
            onClick={() => decide("approved")}
          >
            Approve
          </Button>
          <Button variant="danger" size="lg" className="flex-1" disabled={status === "submitting"} onClick={() => decide("rejected")}>
            Reject
          </Button>
        </div>
        <p role="status" className="text-xs font-medium">
          {status === "approved" && <span className="text-secondary-green-500">Verification approved and sent to the applicant.</span>}
          {status === "rejected" && <span className="text-danger">Verification rejected and notes recorded.</span>}
        </p>
      </div>
    </>
  )
}

export default KycReview
