import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const heroSlides = [
  {
    image:
      'https://gulberggreens.com.pk/wp-content/uploads/2026/01/gulberg-greens-best-investment-destination.webp',
    title: 'Islamabad’s Prime Destination for Plots and Investment',
    subtitle: 'A premium community with modern infrastructure, easy Islamabad Expressway access, and strong long-term investment potential across residential, commercial, and lifestyle spaces.',
  },
  {
    image:
      'https://gulberggreens.com.pk/wp-content/uploads/2026/01/gulberg-infrastructure.webp',
    title: 'Why Choose This Community?',
    subtitle: 'Designed for quality living and lasting value, it offers apartments, houses, farmhouses, and commercial options, supported by schools, healthcare, retail, and recreation.',
  },
  {
    image:
      'https://gulberggreens.com.pk/wp-content/uploads/2026/01/Gulberg-development-status.webp',
    title: 'Quick Overview of Plots & Blocks',
    subtitle: 'Multiple residential and farmhouse blocks offer varied plot sizes, apartments, houses, and farmhouses to suit both lifestyle and investment goals.',
  },
  {
    image:
      'https://gulberggreens.com.pk/wp-content/uploads/2026/01/block.webp',
    title: 'A Lifestyle Built Around Green Spaces',
    subtitle: 'Explore residential sectors, the signature lake, and key planning highlights through impactful visuals.',
  },
  {
    image:
      'https://gulberggreens.com.pk/wp-content/uploads/2026/01/gulberg-helipad.webp',
    title: "Pakistan's First Public Heliport",
    subtitle: 'The community is developing Pakistan’s first public heliport to improve connectivity and support future growth, reflecting its focus on innovation and premium infrastructure.',
  },
]

const investItems = [
  {
    title: 'Trusted development',
    description:
      'A master-planned Islamabad address with clear positioning for residential, farmhouse, and commercial buyers.',
    icon: 'spark',
  },
  {
    title: 'Strong capital structures',
    description:
      'A digital platform that explains location, value, and property categories in a simpler, more transparent way.',
    icon: 'bars',
  },
  {
    title: 'Aligned guidance',
    description:
      'Content that supports families, investors, and agents with clearer project details and direct contact paths.',
    icon: 'people',
  },
]

const newsCards = [
  {
    category: 'News',
    title: 'Development updates across residential and executive blocks',
    copy:
      'A dedicated insight card layout for possession updates, roads, and current project activity.',
    variant: 'gold',
  },
  {
    category: 'Articles',
    title: 'Gulberg Greens location advantages and access corridors',
    copy:
      'Use this space to publish short location-led insights about connectivity, amenities, and market value.',
    variant: 'industrial',
  },
  {
    category: 'Articles',
    title: 'Investment opportunities across plots, farmhouses, and commercial space',
    copy:
      'A clean article grid can help buyers compare options and understand the wider project vision.',
    variant: 'sky',
  },
]

function InvestIcon({ icon }) {
  if (icon === 'spark') {
    return (
      <svg viewBox="0 0 48 48" className="h-12 w-12 text-slate-400">
        <circle cx="24" cy="24" r="15" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M24 14v6M24 28v6M14 24h6M28 24h6M17 17l4 4M27 27l4 4M31 17l-4 4M21 27l-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  }

  if (icon === 'bars') {
    return (
      <svg viewBox="0 0 48 48" className="h-12 w-12 text-slate-400">
        <rect x="10" y="10" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M18 31V22M24 31V17M30 31V25" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12 text-slate-400">
      <circle cx="24" cy="17" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="13" cy="22" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="35" cy="22" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 36c1.6-4 5-6 8-6s6.4 2 8 6M7.5 36c1.2-3 3.7-4.8 6.3-5.1M34.2 30.9c2.6.3 5.1 2.1 6.3 5.1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function Home() {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [])

  const goToSlide = (index) => setActiveSlide(index)
  const goToPrevious = () =>
    setActiveSlide((current) => (current - 1 + heroSlides.length) % heroSlides.length)
  const goToNext = () => setActiveSlide((current) => (current + 1) % heroSlides.length)

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden border-t border-slate-200">
        <div className="relative min-h-[28rem] md:min-h-[38rem]">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.image}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === activeSlide ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.55),rgba(15,23,42,0.2)_48%,rgba(15,23,42,0.25))]" />
            </div>
          ))}

          <div className="container-shell relative flex min-h-[28rem] flex-col justify-end py-14 md:min-h-[38rem] md:py-20">
            <div className="max-w-4xl text-white">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/85">
                Gulberg Greens Islamabad
              </p>
              <h1 className="max-w-4xl text-4xl font-light leading-[1.03] tracking-[-0.05em] text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.18)] md:text-7xl">
                {heroSlides[activeSlide].title}
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/90 md:text-base">
                {heroSlides[activeSlide].subtitle}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/properties"
                  className="rounded-full bg-white px-6 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-100"
                >
                  View Properties
                </Link>
                <Link
                  to="/latest-updates"
                  className="rounded-full border border-white/70 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Latest Updates
                </Link>
              </div>
            </div>

            <div className="mt-10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide.title}
                    type="button"
                    onClick={() => goToSlide(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      index === activeSlide ? 'w-8 bg-white' : 'w-2.5 bg-white/55'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={goToPrevious}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 text-xl text-white transition hover:bg-white/10"
                  aria-label="Previous slide"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 text-xl text-white transition hover:bg-white/10"
                  aria-label="Next slide"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-16 md:py-20">
        <div className="max-w-3xl">
          <h2 className="text-[2rem] font-light tracking-[-0.03em] text-slate-700 md:text-[2.5rem]">
            Why invest with us?
          </h2>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-[1.15fr_2fr]">
          <div className="max-w-md">
            <p className="text-5xl leading-none text-[#3b82f6]">“</p>
            <p className="mt-5 text-[15px] leading-8 text-slate-600">
              Our selective property approach gives buyers and investors exposure to premium
              residential and commercial opportunities in Gulberg Greens through a more transparent
              and modern platform.
            </p>
            <p className="mt-5 text-5xl leading-none text-[#3b82f6]">”</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {investItems.map((item) => (
              <article key={item.title} className="space-y-5">
                <InvestIcon icon={item.icon} />
                <h3 className="text-lg font-medium text-slate-700">{item.title}</h3>
                <p className="text-sm leading-7 text-slate-500">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(219,230,247,0.55),rgba(161,214,247,0.25)),radial-gradient(circle_at_65%_12%,rgba(49,131,224,0.28),transparent_18%),radial-gradient(circle_at_76%_64%,rgba(88,147,59,0.34),transparent_10%),linear-gradient(180deg,#b4d8f4_0%,#cfe6fb_22%,#f1d6bf_22%,#c8d7e7_100%)]" />
        <div className="absolute inset-y-0 right-[22%] w-[2px] bg-white/30" />
        <div className="absolute left-0 bottom-0 h-[48%] w-[36%] bg-white/18" />
        <div className="container-shell relative flex min-h-[18rem] items-end justify-between gap-6 py-10">
          <div className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
            <p className="text-3xl font-light tracking-[-0.03em] md:text-4xl">
              Gulberg Greens Islamabad
            </p>
            <p className="mt-2 text-sm text-white/90">Residential plots, farmhouses, and commercial opportunities</p>
          </div>
          <Link
            to="/properties"
            className="rounded-full border border-white/80 px-6 py-3 text-sm text-white transition hover:bg-white hover:text-slate-700"
          >
            Find out more
          </Link>
        </div>
      </section>

      <section className="container-shell py-16 md:py-20">
        <div className="flex items-center justify-between gap-6">
          <h2 className="text-[2rem] font-light tracking-[-0.03em] text-slate-700 md:text-[2.5rem]">
            Latest news & insights
          </h2>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {newsCards.map((card) => (
            <article key={card.title} className="group">
              <div
                className={`aspect-[1.45/1] overflow-hidden ${
                  card.variant === 'gold'
                    ? 'bg-[linear-gradient(135deg,#f6d35f,#f0dd8c_48%,#d8e5ef)]'
                    : card.variant === 'industrial'
                      ? 'bg-[linear-gradient(135deg,#91a7b7,#9db1bf_28%,#758894_29%,#6a7a84_55%,#c6d4dc_100%)]'
                      : 'bg-[linear-gradient(180deg,#b9dcff,#dcecff_55%,#a7c3e6_55%,#d8e9fb)]'
                }`}
              >
                <div className="h-full w-full bg-[linear-gradient(90deg,rgba(255,255,255,0.12)_0,rgba(255,255,255,0.12)_1px,transparent_1px,transparent_24%)]" />
              </div>
              <p className="mt-3 text-[11px] uppercase tracking-[0.08em] text-[#4d9af6]">{card.category}</p>
              <h3 className="mt-2 max-w-md text-[1.9rem] font-light leading-[1.05] tracking-[-0.03em] text-slate-800">
                {card.title}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">{card.copy}</p>
            </article>
          ))}
        </div>

        <div className="mt-12">
          <Link
            to="/latest-updates"
            className="inline-flex rounded-full bg-[#3b82f6] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#2563eb]"
          >
            See All
          </Link>
        </div>
      </section>

      <section className="bg-[#f6f4ee]">
        <div className="container-shell py-16">
          <div className="max-w-3xl">
            <h2 className="text-[2rem] font-light tracking-[-0.03em] text-slate-700 md:text-[2.5rem]">
              Subscribe to our insights
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Subscribe to keep up to date with the latest information and project insights.
            </p>
            <Link
              to="/contact-us"
              className="mt-6 inline-flex rounded-full bg-[#3b82f6] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#2563eb]"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
