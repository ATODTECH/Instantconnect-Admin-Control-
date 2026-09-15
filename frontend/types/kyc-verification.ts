export type KycStatus = "Verified" | "Pending" | "Rejected";
export type Action = "Review" | "View";
export type Priority = "High" | "Medium" | "Low";
export type SubmitStatus = "idle" | "submitting" | "approved" | "rejected";

export interface KYCDocType {
  nin: "National ID Card",
  otherKYCType: "International Passport" | "Driver's License"
}

export type CheckedVerification = 
"Photo matches profile photo" |
"Document is not expired"|
"Details match system records"|
"No visible signs of tampering"

export interface ChecklistItem {
  id: string;
  label: CheckedVerification;
  checked: boolean;
}

export interface CheckboxRowProps {
  id: string;
  label: CheckedVerification;
  checked: boolean;
  onChange: () => void;
}