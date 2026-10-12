import DashboardHomeIndex from '@/modules/dashboard';
import { Metadata, NextPage } from 'next'

export const metadata: Metadata = {
  title: "Dashboard - InstantLinkUp",
  description: "Welcome back, Admin. InstantLinkUp overview and quick metrics.",
};

const Home: NextPage = () => {

  return (
    <>
      <DashboardHomeIndex />
    </>
  );
}

export default Home