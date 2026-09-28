"use client"

import { AVATAR_COLORS } from "@/modules/live-connection"
import { UserRecord } from "@/modules/users"
import { CheckboxRowProps, ChecklistItem, SubmitStatus } from "@/types/kyc-verification"
import { CircleXIcon, Image, Loader2Icon } from "lucide-react"
import { useState } from "react"

interface KYCModalInfoProps {
  person: UserRecord;
  modal: (val: boolean) => void;
}

const initialChecklist: ChecklistItem[] = [
  { id: "photo-match", label: "Photo matches profile photo", checked: true },
  { id: "not-expired", label: "Document is not expired", checked: true },
  {
    id: "details-match",
    label: "Details match system records",
    checked: true,
  },
  {
    id: "no-tampering",
    label: "No visible signs of tampering",
    checked: false,
  },
]

const CheckboxRow = ({
  id,
  label,
  checked,
  onChange,
}: CheckboxRowProps) => {
  return (
    <label className="flex items-center py-1.5 gap-4">
      <input
        id={id}
        checked={checked}
        type="checkbox"
        className="w-4 h-4 rounded accent-green-600 cursor-pointer"
        onChange={onChange}
      />
      <span className=" font-normal leading-relaxed text-[13px] text-[#475569]">{label}</span>
    </label>
  )
}

const KYCModalInfo = ({ person, modal }: KYCModalInfoProps) => {
  const [notes, setNotes] = useState<string>("")
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist)
  const [status, setStatus] = useState<SubmitStatus>("idle")

  const toggleVerificationCheck = (id: string) => {
    setChecklist((prev) => 
      prev.map((item) =>
        (item.id===id)? {...item, checked: !item.checked}: item
      )
    )
  }

  const handleDecision = async (decision: "approved" | "rejected") => {
    setStatus("submitting")
    // Simulate sending the decision + notes + checklist state to a backend.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Submitting verification decision:", {
      decision,
      notes,
      checklist,
    })
    setStatus(decision)
  }

  const initials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  return (
    <>
      <div className="relative flex flex-col ml-auto h-full w-full max-w-105 bg-neutral-0 shadow-[-20px_0px_60px_#00000026] bg-neutral-white" onClick={(e)=>e.stopPropagation()} >
        <div className="flex items-center justify-between gap-4 text-neutral-light-600 text-lg font-bold pt-7.25 pb-5.25 px-6 border-b border-b-primary-border">
          <h3>Document Review</h3>
          <button className=" h-8 w-8 bg-[#F4F3F5] rounded-full cursor-pointer" onClick={()=>modal(false)}>
            <CircleXIcon size={12} className=" h-3 w-3 text-neutral-light-300 mx-auto" />
          </button>
        </div>
        <div className="flex flex-col gap-y-7 px-6 scrollbar-thin scrollbar-thumb-gray-200 overflow-y-auto">
          <div className="flex gap-3 items-center w-full rounded-xl border border-bg-purple-light-200 bg-bg-purple-light-200 p-4 ">
            {
              (person.avatar.length>0)?
              <img
                src={person.avatar}
                alt={person.name}
                height={80}
                width={80}
                className="w-20 h-20 rounded-full object-cover"
              /> :
              <span className={`inline-flex items-center justify-center shrink-0 w-20 h-20 text-xl rounded-full ${
                AVATAR_COLORS[+person.id-1 % AVATAR_COLORS.length]
              }`}>{initials(person.name)}</span>
            }
            <div className="flex flex-col">
              <span className=" font-bold text-neutral-light-600 text-xl">{person.name}</span>
              <span className=" font-normal text-neutral-light-300 text-sm">{person.email}</span>
              <p className="flex flex-nowrap text-neutral-light-300 text-[11px] font-normal">
                <span className="">Submitted:</span>
                <span className="">{person.kycDateSubmitted}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-x-7">
            <div className="flex items-end justify-between gap-4 mb-3">
              <h4 className=" uppercase font-semibold text-xs text-purple-light-600">Document Information</h4>
              <span className="inline-flex py-0.5 px-1.5 border border-[#E9D5FF] text-purple-light-600 rounded-sm bg-bg-purple-light-200 font-semibold text-[.625rem]">{person.docType.nin}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex flex-col gap-2 items-center justify-center border border-primary-border p-3 rounded-lg bg-[#F4F3F5] text-[#64748B] h-25 font-semibold text-xs cursor-pointer select-none" draggable={false} onClick={()=>alert("coming soon!")}>
                <Image size={20} className="h-5 w-5" />
                <span>Front of Document</span>
              </div>
              <div className="flex flex-col gap-2 items-center justify-center border border-primary-border p-3 rounded-lg bg-[#F4F3F5] text-[#64748B] h-25 font-semibold text-xs cursor-pointer select-none" draggable={false} onClick={()=>alert("coming soon!")}>
                <Image size={20} className="h-5 w-5" />
                <span>Back of Document</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-x-7">
            <div className="flex items-end justify-between gap-4 mb-3">
              <h4 className=" uppercase font-semibold text-xs text-purple-light-600">Document Information</h4>
              <span className="inline-flex py-0.5 px-1.5 border border-[#E9D5FF] text-purple-light-600 rounded-sm bg-bg-purple-light-200 font-semibold text-[.625rem]">{person.docType.otherKYCType}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex flex-col gap-2 items-center justify-center border border-primary-border p-3 rounded-lg bg-[#F4F3F5] text-[#64748B] h-25 font-semibold text-xs cursor-pointer select-none" draggable={false} onClick={()=>alert("coming soon!")}>
                <Image size={20} className="h-5 w-5" />
                <span>Front of Document</span>
              </div>
              <div className="flex flex-col gap-2 items-center justify-center border border-primary-border p-3 rounded-lg bg-[#F4F3F5] text-[#64748B] h-25 font-semibold text-xs cursor-pointer select-none" draggable={false} onClick={()=>alert("coming soon!")}>
                <Image size={20} className="h-5 w-5" />
                <span>Back of Document</span>
              </div>
            </div>
          </div>
          <div className="border-b-[.5px] border-b-[#F4F3F5]">
            <h4 className=" uppercase font-semibold text-xs text-purple-light-600 mb-1.5">Extracted Details</h4>
            <div className="text-neutral-light-300 text-[13px]">
              <p className="flex justify-between gap-2 py-2">
                <span className=" font-normal">Full Name</span>
                <span className=" text-neutral-light-500 font-semibold">{person.name}</span>
              </p>
              <p className="flex justify-between gap-2 py-2">
                <span className=" font-normal">NIN Number</span>
                <span className=" text-neutral-light-500 font-semibold">•••• •••• {"190283838383".slice(-4,)}</span>
              </p>
              <p className="flex justify-between gap-2 py-2">
                <span className=" font-normal">Date of Birth</span>
                <span className=" text-neutral-light-500 font-semibold">{person.dob}</span>
              </p>
              <p className="flex justify-between gap-2 py-2">
                <span className=" font-normal">Address</span>
                <span className=" text-neutral-light-500 font-semibold">{person.location}</span>
              </p>
            </div>
          </div>
          <div className="">
            <h4 className=" uppercase font-semibold text-xs text-purple-light-600 mb-3">Verification Checklist</h4>
            <div className=" flex flex-col">
              {checklist.map((item, index) => (
                <CheckboxRow
                  key={index}
                  id={item.id}
                  checked={item.checked}
                  label={item.label}
                  onChange={()=> toggleVerificationCheck(item.id)}
                />
              ))}
            </div>
          </div>
          <div className="mb-19.25">
            <h4 className=" uppercase font-semibold text-xs text-purple-light-600 mb-3">Admin Notes</h4>
            <textarea 
              onChange={(e) => setNotes(e.target.value)}
              maxLength={255}
              rows={4}
              value={notes}
              placeholder="Add review notes or reason for rejection here..." 
              className=" w-full font-normal text-sm bg-[#FBFBFD] text-neutral-light-500 placeholder:text-[#64748B] rounded-lg border border-primary-border p-3 outline-0 min-h-18 mb-5"></textarea>
            <div className="flex items-center gap-4">
              <button className=" w-full py-3 text-center rounded-lg text-sm text-neutral-white font-semibold bg-secondary-green-500 disabled:cursor-not-allowed cursor-pointer" disabled={(status === "submitting") || (person.action==="Review")} onClick={() => {(person.action==="Review") ? "": handleDecision("approved")}}>Approve</button>
              <button className=" w-full py-3 text-center rounded-lg text-sm text-neutral-white font-semibold bg-[#EF4444] disabled:cursor-not-allowed cursor-pointer" disabled={status === "submitting"} onClick={() => handleDecision("rejected")}>Reject</button>
            </div>
            {status=== "submitting" && <Loader2Icon size={24} strokeWidth={2} className="h-5 w-5 text-secondary-green-500 animate-spin mt-4" />}
            {status === "approved" && (
              <p className="mt-4 text-start text-xs font-medium text-secondary-green-500">
                Verification approved and sent to the applicant.
              </p>
            )}
            {status === "rejected" && (
              <p className="mt-4 text-start text-xs font-medium text-[#EF4444]">
                Verification rejected and notes recorded.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default KYCModalInfo