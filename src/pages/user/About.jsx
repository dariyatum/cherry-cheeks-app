import { Sprout, FlaskConical, Recycle } from "lucide-react";

import aboutHero from "../../assets/images/about-hero.jpg";
import founderPortrait from "../../assets/images/founder-portrait.jpg";
import teamKim from "../../assets/images/team-kim.jpg";
import teamHana from "../../assets/images/team-hana.jpg";
import teamYuri from "../../assets/images/team-yuri.jpg";

const eyebrow = "text-xs font-semibold uppercase tracking-[0.2em] text-cherry";
const container = "mx-auto max-w-[90%] px-5 md:px-8";

const values = [
  {
    icon: Sprout,
    title: "Skin-respecting",
    text: "Barrier-minded formulas, dermatologically tested and designed for daily use.",
  },
  {
    icon: FlaskConical,
    title: "Purposeful formulas",
    text: "Clinically supported actives paired with comforting Korean botanicals.",
  },
  {
    icon: Recycle,
    title: "Considered impact",
    text: "Refill-ready design, FSC papers, and less material wherever possible.",
  },
];

const team = [
  { name: "Kim MinJuu", role: "Owner & Founder", image: teamKim },
  { name: "Dr. Hana Seo", role: "Head of Color", image: teamHana },
  { name: "Yuri Han", role: "Creative Director", image: teamYuri },
];

function About() {
  return (
    <div className="bg-cream">
      {/* Hero image */}
      <section className={`${container} pt-4`}>
        <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-blush sm:aspect-[16/7]">
          <img
            src={aboutHero}
            alt="The Cherry Cheeks atelier in Seoul"
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      {/* Intro */}
      <section className={`${container} py-16 text-center lg:py-24`}>
        <p className={`${eyebrow} mb-5`}>Born in Seoul · Made with intention</p>
        <h1 className="mx-auto max-w-3xl font-display text-4xl leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
          We believe beauty begins with attention.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-gray-600">
          Cherry Cheeks creates high-performing makeup that turns the everyday
          into a considered ritual.
        </p>
      </section>

      {/* Our story */}
      <section
        className={`${container} grid items-center gap-10 pb-16 lg:grid-cols-[1fr_1.6fr] lg:gap-16 lg:pb-24`}
      >
        <div>
          <p className="font-display text-5xl italic text-cherry">01</p>
          <p className={`${eyebrow} mb-3 mt-3`}>Our story</p>
          <h2 className="font-display text-3xl text-gray-900 sm:text-4xl">
            A slower, more thoughtful kind of beauty.
          </h2>
        </div>

        <div className="space-y-4 text-sm leading-relaxed text-gray-600">
          <p>
            Mr. Kim MinJuu founded Cherry Cheeks after years spent observing how
            beauty could feel both elevated and deeply personal. He imagined
            color products with the intelligence of Korean makeup expertise, the
            ease of modern application, and packaging quiet enough to live
            beautifully in your space.
          </p>
          <p>
            From our Seoul atelier, we collaborate with trusted color experts and
            makers to refine every texture, shade, and gesture. Nothing is added
            without purpose. Nothing is rushed.
          </p>
        </div>
      </section>

      {/* Mission: full-width color */}
      <section className="w-full  py-16 lg:py-24">
        <div className={container}>
          <div className="mb-10 text-center">
            <p className={`${eyebrow} mb-2`}>Our mission</p>
            <h2 className="font-display text-3xl text-gray-900 sm:text-4xl">
              Make room for real skin.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-gray-600">
              We create sensorial essentials that help people feel present,
              confident, and entirely themselves.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {values.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-cherry/10 bg-white p-6"
              >
                <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-blush-deep text-cherry">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <h3 className="font-display text-xl text-gray-900">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-500">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the founder */}
      <section
        className={`${container} grid items-center gap-10 py-16 lg:grid-cols-[1fr_1.3fr] lg:gap-16 lg:py-24`}
      >
        <img
          src={founderPortrait}
          alt="Mr. Kim MinJuu, owner and founder"
          className="aspect-[4/5] w-full rounded-2xl bg-blush object-cover"
        />

        <div>
          <p className={`${eyebrow} mb-3`}>Meet the founder</p>
          <h2 className="font-display text-4xl text-gray-900 sm:text-5xl">
            Mr. Kim MinJuu
          </h2>
          <p className="mt-3 text-[11px] uppercase tracking-widest text-gray-500">
            Owner &amp; Founder
          </p>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-gray-600">
            MinJuu’s approach is rooted in restraint: listen closely, refine
            patiently, and let the essential remain. His vision shapes every
            detail, from the way a shade reads on skin to the gentle weight of a
            compact in hand.
          </p>
          <blockquote className="mt-6 font-display text-2xl italic text-cherry">
            “Luxury is not excess. It is care made visible.”
          </blockquote>
          <p className="mt-3 font-display text-lg italic text-gray-700">
            Kim MinJuu
          </p>
        </div>
      </section>

      {/* Team */}
      <section className={`${container} pb-16 lg:pb-24`}>
        <div className="mb-8">
          <p className={`${eyebrow} mb-2`}>The people behind the ritual</p>
          <h2 className="font-display text-3xl text-gray-900 sm:text-4xl">
            Our studio team
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            A small collective of color, design, and beauty specialists.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m) => (
            <article key={m.name}>
              <img
                src={m.image}
                alt={m.name}
                className="aspect-[4/5] w-full rounded-2xl bg-blush object-cover"
              />
              <h3 className="mt-3 font-display text-xl text-gray-900">
                {m.name}
              </h3>
              <p className="text-[11px] uppercase tracking-widest text-gray-500">
                {m.role}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Promise: full-width color */}
      <section className="w-full  text-center lg:py-24">
        <div className={container}>
          <p className={`${eyebrow} text-3xl mb-4`} >Our promise</p>
          <h2 className="mx-auto max-w-2xl font-display text-3xl leading-snug text-gray-900 sm:text-5xl">
            Made carefully. Worn naturally. Remembered quietly.
          </h2>
        </div>
      </section>
    </div>
  );
}

export default About;