"use client"

import { MotionConfig } from "motion/react"
import Categories from "./categories"
import DownloadCta from "./download-cta"
import Explore from "./explore"
import Faq from "./faq"
import Footer from "./footer"
import Hero from "./hero"
import HowItWorks from "./how-it-works"
import Navbar from "./navbar"
import Pricing from "./pricing"
import Safety from "./safety"

// Visitors who ask for reduced motion get the content without the movement.
const Landing = () => (
  <MotionConfig reducedMotion="user">
    <Navbar />
    <main>
      <Hero />
      <Categories />
      <HowItWorks />
      <Safety />
      <Explore />
      <Pricing />
      <Faq />
      <DownloadCta />
    </main>
    <Footer />
  </MotionConfig>
)

export default Landing
