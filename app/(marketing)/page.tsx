import { Metadata } from "next"
import Landing from "@/modules/landing"

const DESCRIPTION =
  "Meet real people near you for friendship, business, talent and social plans, then meet up safely with one-time arrival codes and verified profiles."

export const metadata: Metadata = {
  title: "InstantLinkUp - Meet real people near you. Right now.",
  description: DESCRIPTION,
  openGraph: {
    title: "InstantLinkUp",
    description: DESCRIPTION,
    url: "https://instantlinkup.com",
    siteName: "InstantLinkUp",
    type: "website",
  },
}

const HomePage = () => <Landing />

export default HomePage
