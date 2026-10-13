import { Metadata } from "next"
import { getLegalDocument } from "@/lib/legal"
import LegalPage from "@/modules/legal"

export const metadata: Metadata = {
  title: "Terms of Use - InstantLinkUp",
  description: "The terms that apply when you use InstantLinkUp, including community standards, safety, subscriptions and your rights.",
}

const TermsPage = async () => {
  const document = await getLegalDocument("terms-of-use")

  return (
    <main>
      <LegalPage slug="terms-of-use" document={document} />
    </main>
  )
}

export default TermsPage
