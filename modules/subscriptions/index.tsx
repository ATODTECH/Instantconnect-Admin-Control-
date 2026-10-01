import { Wallet } from "lucide-react"
import { NotLiveYet } from "@/components/shared/not-live-yet"

const SubscriptionsHomeIndex = () => (
  <NotLiveYet
    icon={Wallet}
    title="Subscriptions aren't live yet"
    reason="The app's plan screens don't take payments yet, so every member is on the Free plan. This page will fill in once checkout and billing exist."
    planned={[
      "Subscribers by plan, with start and renewal dates",
      "Revenue this month and failed payments",
      "Each member's payment history",
    ]}
  />
)

export default SubscriptionsHomeIndex
