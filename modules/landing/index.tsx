import Categories from "./categories"
import DownloadCta from "./download-cta"
import Explore from "./explore"
import Faq from "./faq"
import Hero from "./hero"
import HowItWorks from "./how-it-works"
import PeopleWall from "./people-wall"
import Pricing from "./pricing"
import Safety from "./safety"

// The navbar and footer come from the marketing layout.
const Landing = () => (
  <main>
    <Hero />
    <PeopleWall />
    <Categories />
    <HowItWorks />
    <Safety />
    <Explore />
    <Pricing />
    <Faq />
    <DownloadCta />
  </main>
)

export default Landing
