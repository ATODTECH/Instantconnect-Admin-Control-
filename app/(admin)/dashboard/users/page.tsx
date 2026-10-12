import UsersHomeIndex from "@/modules/users";
import { Metadata, NextPage } from "next";

export const metadata: Metadata = {
  title: "User Management - InstantLinkUp",
  description: "Manage platform members, KYC verification records, and billing tiers",
};

const UsersManagement: NextPage = () => {
  return (
    <>
      <UsersHomeIndex />
    </>
  )
}

export default UsersManagement