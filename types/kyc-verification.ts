export type KycStatus = "Verified" | "Pending" | "Rejected";
export type Action = "Review" | "View";
export type Priority = "High" | "Medium" | "Low";
export interface KYCDocType {
  nin: "National ID Card",
  otherKYCType: "International Passport" | "Driver's License"
}
