import { Action, KYCDocType, Priority } from "@/types/kyc-verification";

// Placeholder rows for the KYC page until its own API is wired. The Users page
// reads the real API and no longer uses these.
export interface ExportUserRecord {
  id: string,
  name: string,
  email: string,
  status: Status,
  kyc: KycStatus,
  plan: Plan,
  isPro: boolean,
  eventsAttended: number,
  joined: string,
  dob: string,
  gender: string,
  location: string,
  phoneNumber: string,
  userID: string,
  lastActive: string,
  eventCreated: string,
  communities: string,
  connection: string,
}

export interface UserRecord extends ExportUserRecord {
  avatar: string,
  docType: KYCDocType,
  action: Action,
  priority: Priority,
  kycDateSubmitted: string,
}

// to-be API DATA
export const USERS: UserRecord[] = [
  { id: "1", name: "Halima Lawal", email: "halima.l@gmail.com", avatar: "", status: "Active", kyc: "Verified", plan: "Business", isPro: true, eventsAttended: 24, joined: "12 Oct 2023", phoneNumber:"+234 812 345 6789", gender:"female", dob:"13 Mar 1997",location:"Ikeja, Lagos", userID:"#USR-00142", lastActive:"2 hours ago", eventCreated:"8", connection:"128", communities:"5", docType: {nin:"National ID Card", otherKYCType:"International Passport"}, action:"View", priority:"Low", kycDateSubmitted:"18 Oct 2026" },
  { id: "2", name: "Chidi Okonkwo", email: "chidi.o@gmail.com", avatar: "", status: "Active", kyc: "Verified", plan: "Premium", isPro: true, eventsAttended: 15, joined: "08 Nov 2023", phoneNumber:"+234 812 345 6789", gender:"female", dob:"13 Mar 1997",location:"Ikeja, Lagos", userID:"#USR-00142", lastActive:"2 hours ago", eventCreated:"8", connection:"128", communities:"5", docType:{nin:"National ID Card", otherKYCType:"Driver's License"}, action:"Review", priority:"Medium", kycDateSubmitted:"18 Oct 2025" },
  { id: "3", name: "Aisha Mohammed", email: "aisha.mo@gmail.com", avatar: "", status: "Pending", kyc: "Pending", plan: "Free", isPro: false, eventsAttended: 2, joined: "14 Jan 2024", phoneNumber:"+234 812 345 6789", gender:"female", dob:"13 Mar 1997",location:"Ikeja, Lagos", userID:"#USR-00142", lastActive:"2 hours ago", eventCreated:"8", connection:"128", communities:"5", docType:{nin:"National ID Card", otherKYCType:"Driver's License"}, action:"View", priority:"High", kycDateSubmitted:"18 Oct 2025" },
  { id: "4", name: "Doan Blaq", email: "tunde.bakare@gmail.com", avatar: "", status: "Suspended", kyc: "Rejected", plan: "Free", isPro: false, eventsAttended: 0, joined: "22 Aug 2023", phoneNumber:"+234 812 345 6789", gender:"female", dob:"13 Mar 1997",location:"Ikeja, Lagos", userID:"#USR-00142", lastActive:"2 hours ago", eventCreated:"8", connection:"128", communities:"5", docType:{nin:"National ID Card", otherKYCType:"Driver's License"}, action:"Review", priority:"Low", kycDateSubmitted:"18 Oct 2024" },
  { id: "5", name: "Ngozi Uju", email: "ngozi.eze@gmail.com", avatar: "", status: "Active", kyc: "Verified", plan: "Premium", isPro: true, eventsAttended: 31, joined: "19 May 2023", phoneNumber:"+234 812 345 6789", gender:"female", dob:"13 Mar 1997",location:"Ikeja, Lagos", userID:"#USR-00142", lastActive:"2 hours ago", eventCreated:"8", connection:"128", communities:"5", docType:{nin:"National ID Card", otherKYCType:"International Passport"}, action:"View", priority:"High", kycDateSubmitted:"18 Oct 2024" },
  { id: "6", name: "Femi Adeyemi", email: "femi.ade@gmail.com", avatar: "", status: "Active", kyc: "Pending", plan: "Free", isPro: false, eventsAttended: 8, joined: "03 Dec 2023", phoneNumber:"+234 812 345 6789", gender:"female", dob:"13 Mar 1997",location:"Ikeja, Lagos", userID:"#USR-00142", lastActive:"2 hours ago", eventCreated:"8", connection:"128", communities:"5", docType:{nin:"National ID Card", otherKYCType:"Driver's License"}, action:"View", priority:"Medium", kycDateSubmitted:"18 Oct 2023" },
  { id: "7", name: "Blessing Orija", email: "blessing.ok@gmail.com", avatar: "", status: "Active", kyc: "Verified", plan: "Business", isPro: true, eventsAttended: 42, joined: "11 Feb 2023", phoneNumber:"+234 812 345 6789", gender:"female", dob:"13 Mar 1997",location:"Ikeja, Lagos", userID:"#USR-00142", lastActive:"2 hours ago", eventCreated:"8", connection:"128", communities:"5", docType:{nin:"National ID Card", otherKYCType:"International Passport"}, action:"Review", priority:"Medium", kycDateSubmitted:"18 Oct 2023" },
  { id: "8", name: "Ibrahim Musa", email: "ibrahim.m@gmail.com", avatar: "", status: "Suspended", kyc: "Verified", plan: "Free", isPro: false, eventsAttended: 5, joined: "28 Jun 2023", phoneNumber:"+234 812 345 6789", gender:"female", dob:"13 Mar 1997",location:"Ikeja, Lagos", userID:"#USR-00142", lastActive:"2 hours ago", eventCreated:"8", connection:"128", communities:"5", docType:{nin:"National ID Card", otherKYCType:"International Passport"}, action:"Review", priority:"Low", kycDateSubmitted:"18 Oct 2023" },
  { id: "9", name: "Adewole James", email: "adewole.j@gmail.com", avatar: "", status: "Suspended", kyc: "Verified", plan: "Free", isPro: false, eventsAttended: 5, joined: "28 Jun 2023", phoneNumber:"+234 812 345 6789", gender:"female", dob:"13 Mar 1997",location:"Ikeja, Lagos", userID:"#USR-00142", lastActive:"2 hours ago", eventCreated:"8", connection:"128", communities:"5", docType:{nin:"National ID Card", otherKYCType:"Driver's License"}, action:"Review", priority:"High", kycDateSubmitted:"18 Oct 2022" },
];
