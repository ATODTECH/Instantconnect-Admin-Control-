import SubscriptionsHomeIndex from '@/modules/subscriptions'
import { Metadata, NextPage } from 'next'

export const metadata: Metadata = {
  title: "Subscriptions - InstantLinkUp",
  description: "Monitor and manage all platform subscriptions.",
}

const Subscription: NextPage = () => {

  return (
    <>
      <SubscriptionsHomeIndex />
    </>
  )
}

export default Subscription