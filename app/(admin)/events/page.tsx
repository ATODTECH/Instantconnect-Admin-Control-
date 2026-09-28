import EventsHomeIndex from "@/modules/events";
import { Metadata, NextPage } from "next";

export const metadata: Metadata = {
  title: "Events - InstantConnect",
  description: "Review and verify user identity documents.",
};

const Events: NextPage = () => {
  return (
    <>
      <EventsHomeIndex />
    </>
  )
}

export default Events