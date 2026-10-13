import { MotionProvider } from "@/components/landing/motion-provider"
import Footer from "@/modules/landing/footer"
import Navbar from "@/modules/landing/navbar"

/** The public site: the landing page and the legal pages share its navbar and footer. */
const MarketingLayout = ({ children }: { children: React.ReactNode }) => (
  <MotionProvider>
    <Navbar />
    {children}
    <Footer />
  </MotionProvider>
)

export default MarketingLayout
