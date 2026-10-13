import Image from "next/image"
import { LogoMark } from "@/components/brand/logo-mark"
import { Reveal } from "@/components/landing/reveal"
import { Container } from "@/components/landing/section"
import { StoreButtons } from "@/components/landing/store-buttons"
import { STORE_LINKS } from "../constants"
import { PEOPLE } from "../screens/parts"

/** Faces scattered round the banner's edge, positioned in percent of the banner. */
const FACES = [
  { person: PEOPLE.amara, className: "left-[6%] top-[14%] size-14" },
  { person: PEOPLE.david, className: "left-[12%] bottom-[12%] size-11" },
  { person: PEOPLE.kemi, className: "right-[7%] top-[18%] size-12" },
  { person: PEOPLE.seun, className: "right-[13%] bottom-[14%] size-14" },
]

const DownloadCta = () => (
  <section id="download" className="scroll-mt-20 py-20 sm:py-28">
    <Container>
      <Reveal className="relative isolate overflow-hidden rounded-[2.5rem] bg-brand-gradient px-6 py-20 text-center sm:px-16 sm:py-24">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute -left-20 -top-24 size-96 rounded-full bg-white/15 blur-3xl" />
          <div className="absolute -bottom-32 -right-10 size-96 rounded-full bg-brand-orange/40 blur-3xl" />
        </div>
        {FACES.map(({ person, className }) => (
          <Image
            key={person.name}
            src={person.photo}
            alt=""
            width={112}
            height={112}
            className={`absolute hidden rounded-full object-cover ring-4 ring-white/40 md:block ${className}`}
          />
        ))}

        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
          <LogoMark variant="white" className="size-16 drop-shadow-lg" />
          <h2 className="text-balance text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">
            Your people are <span className="font-brand font-normal italic">closer</span> than you think.
          </h2>
          <p className="max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
            Download InstantLinkUp and see who&apos;s around you right now. It&apos;s free to join.
          </p>
          <StoreButtons links={STORE_LINKS} tone="light" className="mt-2 justify-center" />
        </div>
      </Reveal>
    </Container>
  </section>
)

export default DownloadCta
