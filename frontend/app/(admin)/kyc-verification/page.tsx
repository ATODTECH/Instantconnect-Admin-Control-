import KYCHomeIndex from "@/modules/kyc-verification";
import { Metadata, NextPage } from "next";

export const metadata: Metadata = {
  title: "KYC Verification - InstantConnect",
  description: "Review and verify user identity documents.",
};

const KYCVerificaition: NextPage = () => {
  return (
    <>
      <KYCHomeIndex />
    </>
  )
}

export default KYCVerificaition