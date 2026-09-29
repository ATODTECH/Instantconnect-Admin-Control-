import { USERS } from "../kyc-verification/mock-users"

// Placeholder data until subscriptions and payments exist.

// .................... Start mock data ....................

export const PLANS: Plan[] = [
  "Business",
  "Free",
  "Premium",
]

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}
const rand = mulberry32(42)

function generateUsers(count: number): SubscriptionRow[] {
  const rows: SubscriptionRow[] = []
  const today = new Date(2026, 8, 7)

  for (let i = 0; i < count; i++) {
    const user = USERS[Math.floor(rand() * USERS.length)]
    const subscriptionPlan = PLANS[Math.floor(rand() * PLANS.length)]

    const createdOffsetDays = Math.floor(rand() * 600)
    const startDate = new Date(today)
    startDate.setUTCDate(startDate.getUTCDate() - createdOffsetDays)
    const expiresDate = new Date(startDate.getUTCFullYear()+1, startDate.getUTCMonth(), startDate.getUTCDate())

    const roll = rand()
    let paymentMethod: string
    let status: SubscriptionStatus
    
    if (roll < 0.15) {
      status = "Active"
      paymentMethod = "Visa"
    } else if (roll < 0.5) {
      status = "Expired"
      paymentMethod = "GTBank Transfer"
    } else if (roll < 0.75) {
      status = "Cancelled"
      paymentMethod = "Mastercard"
    } else {
      status = "Failed"
      paymentMethod = "Access Bank Transfer"
    }
    
    const paymentCardPin = (paymentMethod==="Visa" || paymentMethod==="Mastercard") ? Math.floor(rand() * 9000) + 1000 : 0
    const isPro = 
    (subscriptionPlan==="Free") ? false: true;
    const amount = 
    (subscriptionPlan==="Free") ? 5000 :
    (subscriptionPlan==="Premium") ? 15000 : 35000;

    rows.push({
      id: `sub-${i + 1}`,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      phoneNumber: user.phoneNumber,
      isPro,
      amount,
      paymentMethod,
      paymentCardPin,
      subscriptionPlan,
      startDate,
      expiresDate,
      status,
    })
  }

  return rows.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
}

export const ALL_SUBSCRIPTIONS = generateUsers(486)
