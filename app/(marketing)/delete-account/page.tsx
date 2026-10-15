import { Metadata } from "next"
import DeleteAccountPage from "@/modules/delete-account"

export const metadata: Metadata = {
  title: "Delete Your Account - InstantLinkUp",
  description: "How to delete your InstantLinkUp account, in the app or by email, and what happens to your information.",
}

const Page = () => (
  <main>
    <DeleteAccountPage />
  </main>
)

export default Page
