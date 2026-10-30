import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Button from "../../components/Button";
import ProductCard from "../../components/ProductCard";

import hero from "../../assets/images/hero.jpg";
import complexion from "../../assets/images/complexion.jpg";
import eyes from "../../assets/images/eyes.jpg";
import lips from "../../assets/images/lips.jpg";
import founder from "../../assets/images/founder.jpg";
import silkVeil from "../../assets/images/silk-veil-cushion.jpg";
import velvetPalette from "../../assets/images/velvet-shadow-palette.jpg";


const categories = [
  {
    number: "01",
    title: "Complexion",
    text: "Foundation, concealer, and cushion",
    image: complexion,
    to: "/products",
  },
  {
    number: "02",
    title: "Eyes",
    text: "Shadows, liners, and mascaras",
    image: eyes,
    to: "/products",
  },
  {
    number: "03",
    title: "Lips",
    text: "Tints, balms, and lipsticks",
    image: lips,
    to: "/products",
  },
];

const products = [
  { id: 1, image: silkVeil, category: "Makeup · Complexion", name: "Silk Veil Cushion", price: "$48", badge: "Bestseller" },
  { id: 2, image: velvetPalette, category: "Makeup · Eyes", name: "Velvet Shadow Palette", price: "$42", badge: "New" },
  { id: 3, image: velvetPalette, category: "Makeup · Eyes", name: "Velvet Shadow Palette", price: "$42", badge: "New" },
  { id: 4, image: silkVeil, category: "Makeup · Complexion", name: "Silk Veil Cushion", price: "$48", badge: "Bestseller" },
];

const reviews = [
  {
    id: 1,
    quote: "The cushion gives me a rested, polished finish without feeling layered.",
    name: "Jina Park",
    detail: "Verified purchase · Silk Veil Cushion",
  },
  {
    id: 2,
    quote: "The cushion wears like a second skin and still looks fresh after a full day.",
    name: "Maya Chen",
    detail: "Verified purchase · Velvet Shadow Palette",
  },
];

const eyebrow = "text-xs font-semibold uppercase tracking-[0.2em] text-cherry";
const container = "mx-auto max-w-[90%] px-5 md:px-8";

function Home() {
  return (
    <div className="bg-cream">
      {/* Hero: full width */}
{/* Hero: full width */}
<section className="relative w-full bg-[#F2D9DA] overflow-hidden  pt-0 pb-16" >
  <div className="grid lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[1.1fr_1fr] items-center">
    
    {/* Left Column: Text & CTAs */}
    <div className="flex flex-col justify-center px-6 py-12 md:px-12 lg:py-20 lg:pl-[calc(6vw+1rem)] lg:pr-8 z-10">
      <p className="mb-4 uppercase tracking-[0.2em] text-xs font-medium text-[#C89B88]">
        Radiant skin. Real confidence.
      </p>
      
      <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#2D2826] leading-[1.15]">
        Reveal your quiet radiance. <br />
        <span className="italic font-normal">The Surface</span>
      </h1>

      <p className="mt-6 max-w-md leading-relaxed text-[#6B635E] text-base">
        Scientifically proven skincare that nourishes, renews, and reveals your natural glow.
      </p>

      {/* Dual Buttons */}
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Button to="/products" className="bg-[#C89B88] text-white px-7 py-3.5 rounded-full hover:bg-[#B78875] transition shadow-sm">
          Explore the collection
        </Button>
        <Button to="/about" className="border border-[#C89B88]/60 text-[#2D2826] px-7 py-3.5 rounded-full hover:bg-[#EFE8E2] transition">
          Learn More
        </Button>
      </div>

      {/* Inline Badges */}
      <div className="mt-10 flex flex-wrap items-center gap-8 pt-6 border-t border-[#E6DDD8]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full border border-[#C89B88]/40 flex items-center justify-center text-[#C89B88]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          </div>
          <span className="text-xs uppercase tracking-wider font-medium text-[#59514D]">Clean Ingredients</span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full border border-[#C89B88]/40 flex items-center justify-center text-[#C89B88]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
          </div>
          <span className="text-xs uppercase tracking-wider font-medium text-[#59514D]">Clinically Tested</span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full border border-[#C89B88]/40 flex items-center justify-center text-[#C89B88]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          </div>
          <span className="text-xs uppercase tracking-wider font-medium text-[#59514D]">Cruelty Free & Vegan</span>
        </div>
      </div>
    </div>

    {/* Right Column: Hero Image */}
    <div className="relative h-[50vh] min-h-[350px] w-full lg:h-[600px] flex items-center justify-center pr-4">
      <img
        src={hero}
        alt="Lumière skincare collection mockup"
        className="h-full w-full object-contain object-center lg:scale-105"
      />
    </div>
  </div>

  {/* Bottom Feature Breakdown Card */}
  <div className="max-w-7xl mx-auto px-6 mt-4 lg:-mt-6 relative z-20">
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#EBE3DE] shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#EBE3DE] p-6 lg:p-8 gap-6 sm:gap-0">
      
      <div className="flex items-start gap-4 px-2">
        <span className="text-2xl text-[#C89B88] font-light">✨</span>
        <div>
          <h3 className="font-semibold text-sm uppercase tracking-wider text-[#2D2826]">Brightens Dull Skin</h3>
          <p className="text-xs text-[#6B635E] mt-1 leading-relaxed">Enhances natural glow and radiance.</p>
        </div>
      </div>

      <div className="flex items-start gap-4 px-2 pt-4 sm:pt-0 sm:pl-6">
        <span className="text-2xl text-[#C89B88] font-light">💧</span>
        <div>
          <h3 className="font-semibold text-sm uppercase tracking-wider text-[#2D2826]">Deeply Hydrates</h3>
          <p className="text-xs text-[#6B635E] mt-1 leading-relaxed">Locks in moisture for soft, supple skin.</p>
        </div>
      </div>

      <div className="flex items-start gap-4 px-2 pt-4 lg:pt-0 lg:pl-6">
        <span className="text-2xl text-[#C89B88] font-light">🛡️</span>
        <div>
          <h3 className="font-semibold text-sm uppercase tracking-wider text-[#2D2826]">Strengthens Skin Barrier</h3>
          <p className="text-xs text-[#6B635E] mt-1 leading-relaxed">Protects and restores your skin barrier.</p>
        </div>
      </div>

      <div className="flex items-start gap-4 px-2 pt-4 lg:pt-0 lg:pl-6">
        <span className="text-2xl text-[#C89B88] font-light">🌿</span>
        <div>
          <h3 className="font-semibold text-sm uppercase tracking-wider text-[#2D2826]">Natural & Safe</h3>
          <p className="text-xs text-[#6B635E] mt-1 leading-relaxed">Clean, effective, and non-toxic formulas.</p>
        </div>
      </div>

    </div>
  </div>
</section>

      {/* Categories */}
      <section className={`${container} mt-20 py-6`}>
        <div className="grid gap-5 md:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.number}
              to={c.to}
              className="group relative block aspect-square overflow-hidden rounded-2xl bg-blush-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cherry"
            >
              <img
                src={c.image}
                alt={c.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.55),transparent_60%)]" />
              <span className="absolute left-5 top-4 font-semibold text-cherry sm:text-lg">
                {c.number}
              </span>
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <h3 className="font-display text-3xl">{c.title}</h3>
                <p className="mt-1 flex items-center gap-1 text-sm text-white/90">
                  {c.text} <ArrowRight size={14} aria-hidden="true" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Our story */}
      <section className="mt-6 bg-[#E9DED0] py-16 lg:py-24">
        <div className={`${container} grid items-center gap-10 lg:grid-cols-2`}>
          <img
            src={founder}
            alt="Mr. Kim MinJuu, founder of Cherry Cheeks"
            className="aspect-square w-full max-w-[480px] rounded-2xl bg-blush object-cover"
          />
          <div>
            <p className={`${eyebrow} mb-3`}>Our story</p>
            <h2 className="font-display text-4xl text-gray-900">
              Color with intention, from Seoul.
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-gray-600">
              Founded by Mr. Kim MinJuu, Cherry Cheeks brings together Korean
              color expertise and an understated point of view. Each product is
              made to support, not conceal, the texture and character of real
              skin.
            </p>
            <p className="mt-6 font-display text-2xl italic text-cherry">
              “A ritual should make room for you to feel like yourself.”
            </p>
            <div className="mt-6">
              <Button variant="secondary" to="/about">
                Discover our story
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Everyday essentials */}
      <section className={`${container} pt-20 pb-20`}>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={`${eyebrow} mb-2`}>Loved by makeup</p>
            <h2 className="font-display text-4xl text-gray-900">
              Everyday essentials
            </h2>
            <p className="mt-2 text-gray-600">
              High-performance color, refined to feel effortless.
            </p>
          </div>
          <Button variant="secondary" to="/products">
            Shop all products
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="w-full bg-[#E9DED0] pt-20">
        <div className={`${container} pb-16 lg:pb-24`}>
          <div className="mb-8 text-center">
            <p className={`${eyebrow} mb-2`}>Notes from our makeup community</p>
            <h2 className="font-display text-4xl text-gray-900">Softly polished</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {reviews.map((r) => (
              <figure
                key={r.id}
                className="rounded-2xl border border-cherry/15 bg-white p-6"
              >
                <p className="text-sm tracking-widest text-cherry" aria-label="5 out of 5 stars">
                  ★★★★★
                </p>
                <blockquote className="mt-3 font-display text-xl text-gray-800">
                  “{r.quote}”
                </blockquote>
                <figcaption className="mt-4 text-sm">
                  <span className="font-semibold text-gray-900">{r.name}</span>
                  <span className="block text-xs text-gray-500">{r.detail}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;