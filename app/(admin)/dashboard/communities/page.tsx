import CommunitiesHomeIndex from '@/modules/communities';
import { Metadata, NextPage } from 'next'

export const metadata: Metadata = {
  title: "Communities - InstantLinkUp",
  description: "Monitor and manage all platform communities.",
};

const Communities: NextPage = () => {
  return (
    <>
      <CommunitiesHomeIndex />
    </>
  )
}

export default Communities