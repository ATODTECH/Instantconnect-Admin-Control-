import { Metadata } from "next"
import { getLegalDocument } from "@/lib/legal"
import LegalPage from "@/modules/legal"

export const metadata: Metadata = {
  title: "Privacy Notice - InstantLinkUp",
  description: "How InstantLinkUp collects, uses, shares and protects your personal information, and the rights you have over it.",
}

const PrivacyPage = async () => {
  const document = await getLegalDocument("privacy-notice")

  return (
    <main>
      <LegalPage slug="privacy-notice" document={document} />
    </main>
  )
}

export default PrivacyPage
