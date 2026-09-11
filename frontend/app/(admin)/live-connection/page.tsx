import LiveConnectionHomeIndex from "@/modules/live-connection";
import { Metadata, NextPage } from "next";

export const metadata: Metadata = {
  title: "Live Connection - InstantConnect",
  description: "Monitor active meetups and connection locations in real-time",
}

const UsersManagement: NextPage = () => {
  return (
    <>
      <LiveConnectionHomeIndex />
    </>
  )
}

export default UsersManagement