import ReportsHomeIndex from '@/modules/reports';
import { Metadata, NextPage } from 'next'

export const metadata: Metadata = {
  title: "Reports - InstantLinkUp",
  description: "Review members reported by other members.",
};

const Reports: NextPage = () => {
  return (
    <>
      <ReportsHomeIndex />
    </>
  )
}

export default Reports
