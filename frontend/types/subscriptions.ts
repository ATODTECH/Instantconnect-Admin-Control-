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

interface SubscriptionTABSProps {
  label: string,
  status: SubscriptionStatus | "All",
}

interface SubscriptionDropdownProps {
  label: string,
  value: string,
  options: readonly string[],
  onChange: (v: string) => void,
  icon?: React.ReactNode,
}

interface PaymentHistoryItem {
  date: string;
  amount: string;
  status: PaymentStatus;
  note?: string;
}