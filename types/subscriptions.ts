type SubscriptionStatus = 
  |"Active"
  | "Expired" 
  | "Failed"
  | "Cancelled"

type PaymentStatus = "success" | "failed"

interface SubscriptionRow {
  id: string,
  name: string,
  email: string,
  avatar: string,
  amount: number,
  paymentMethod: string,
  paymentCardPin: number,
  subscriptionPlan: Plan,
  isPro: boolean,
  phoneNumber: string,
  startDate: Date,
  expiresDate: Date,
  status: SubscriptionStatus,
}

interface PaymentHistoryItem {
  date: string;
  amount: string;
  status: PaymentStatus;
  note?: string;
}