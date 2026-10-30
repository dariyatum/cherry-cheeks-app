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
      {/* Hero */}
      <section className="bg-[#F2D9DA]">
        <div className={`${container} grid lg:grid-cols-[3fr_4fr]`}>
          <div className="flex flex-col justify-center py-16 lg:py-24">
            <p className={`${eyebrow} mb-6`}>The color collection · 2026</p>
            <h1 className="font-display text-5xl leading-tight text-gray-900 sm:text-6xl">
              Reveal your quiet radiance.
            </h1>
            <p className="mt-6 max-w-md leading-relaxed text-gray-600">
              Intuitive color, effortless application, and sensorial textures
              shaped in Seoul for the beauty of every day.
            </p>
            <div className="mt-8">
              <Button to="/products">Explore the collection</Button>
            </div>
          </div>

          <div className="relative h-[55vh] min-h-[300px] w-full overflow-hidden rounded-bl-3xl rounded-tr-3xl lg:h-auto">
            <img
              src={hero}
              alt="Cherry Cheeks color collection"
              className="absolute inset-0 h-full w-full object-cover"
            />
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
      <section className="mt-6 bg-[#F2D9DA] py-16 lg:py-24">
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