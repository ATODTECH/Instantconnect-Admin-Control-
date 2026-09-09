import DashboardHomeIndex from '@/modules/dashboard';
import { Metadata, NextPage } from 'next'

export const metadata: Metadata = {
  title: "Dashboard - InstantConnect",
  description: "Welcome back, Admin. InstantConnect overview and quick metrics.",
};

const Home: NextPage = () => {

  return (
    <>
      <DashboardHomeIndex />
    </>
  );
}

export default Home