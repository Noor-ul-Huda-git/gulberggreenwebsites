import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import PageHero from '../components/layout/PageHero.jsx'
import { LISTING_TYPE_OPTIONS } from '../data/propertyListingTypes.js'
import { fetchProperties } from '../lib/api.js'

function formatPkr(value) {
  if (value == null || value === '') return 'Price on request'
  const n = Number(value)
  if (Number.isNaN(n)) return String(value)
  try {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(n)
  } catch {
    return `PKR ${n.toLocaleString('en-PK')}`
  }
}

function cardImageUrl(p) {
  if (p.featured_image_url) return p.featured_image_url
  if (Array.isArray(p.images) && p.images.length > 0 && p.images[0].url) {
    return p.images[0].url
  }
  return null
}

const listParent = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.06 },
  },
}

const listItem = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

function Properties() {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [listingType, setListingType] = useState('')
  const [block, setBlock] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minMarlas, setMinMarlas] = useState('')
  const [maxMarlas, setMaxMarlas] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [baths, setBaths] = useState('')

  const [items, setItems] = useState([])
  const [nextPageToLoad, setNextPageToLoad] = useState(2)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const t = window.setTimeout(() => setSearch(searchInput), 380)
    return () => window.clearTimeout(t)
  }, [searchInput])

  const filterParams = useMemo(
    () => ({
      search: search || undefined,
      listing_type: listingType || undefined,
      block: block.trim() || undefined,
      min_price: minPrice || undefined,
      max_price: maxPrice || undefined,
      min_marlas: minMarlas || undefined,
      max_marlas: maxMarlas || undefined,
      bedrooms: bedrooms || undefined,
      baths: baths || undefined,
    }),
    [search, listingType, block, minPrice, maxPrice, minMarlas, maxMarlas, bedrooms, baths],
  )

  const filterKey = useMemo(() => JSON.stringify(filterParams), [filterParams])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setNextPageToLoad(2)
    ;(async () => {
      try {
        const data = await fetchProperties({
          ...filterParams,
          page: '1',
        })
        if (cancelled) return
        const list = Array.isArray(data) ? data : data.results ?? []
        setItems(list)
        setHasMore(Boolean(data.next))
      } catch {
        if (!cancelled) {
          setItems([])
          setError('We could not load listings right now. Please try again in a moment.')
          setHasMore(false)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [filterKey, filterParams])

  const loadMore = async () => {
    if (!hasMore || loadingMore || loading) return
    setLoadingMore(true)
    try {
      const data = await fetchProperties({
        ...filterParams,
        page: String(nextPageToLoad),
      })
      const list = Array.isArray(data) ? data : data.results ?? []
      setItems((prev) => [...prev, ...list])
      setHasMore(Boolean(data.next))
      setNextPageToLoad((p) => p + 1)
    } catch {
      setHasMore(false)
    } finally {
      setLoadingMore(false)
    }
  }

  const resetFilters = () => {
    setSearchInput('')
    setSearch('')
    setListingType('')
    setBlock('')
    setMinPrice('')
    setMaxPrice('')
    setMinMarlas('')
    setMaxMarlas('')
    setBedrooms('')
    setBaths('')
  }

  const showLoadMore = hasMore && items.length > 0

  return (
    <div className="bg-white font-[Poppins,Manrope,system-ui,sans-serif]">
      <PageHero overlay="dark">
        <div className="container-shell flex min-h-[min(44vh,480px)] flex-col justify-center px-4 pb-14 pt-28 md:min-h-[min(48vh,520px)] md:pb-16 md:pt-32">
          <Motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-4xl text-center"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-[#31C950] [text-shadow:0_2px_12px_rgba(0,0,0,0.65)] md:text-xs">
              Curated inventory
            </p>
            <h1 className="mt-4 font-[Poppins,Manrope,system-ui,sans-serif] text-3xl font-bold leading-[1.1] tracking-[-0.03em] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.55)] md:text-4xl lg:text-[2.6rem]">
              Discover properties across Gulberg Greens
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-white/88 [text-shadow:0_1px_12px_rgba(0,0,0,0.55)] md:text-base">
              Search residential and commercial listings, filter by price and size, and explore rich galleries for every
              property published by our team.
            </p>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto mt-12 w-full max-w-5xl"
          >
            <div className="pointer-events-none absolute -inset-1 rounded-[1.75rem] bg-gradient-to-r from-[#31C950]/35 via-white/10 to-[#4d9af6]/25 opacity-80 blur-xl" />
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/20 bg-white/10 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-7">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <label className="flex flex-col gap-2 text-left">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">Search</span>
                  <input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Title, block, keywords…"
                    className="rounded-xl border border-white/25 bg-black/20 px-4 py-3 text-[14px] text-white outline-none ring-0 transition placeholder:text-white/45 focus:border-[#31C950]/65 focus:bg-black/30 focus:shadow-[0_0_0_3px_rgba(49,201,80,0.18)]"
                  />
                </label>
                <label className="flex flex-col gap-2 text-left">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                    Listing type
                  </span>
                  <select
                    value={listingType}
                    onChange={(e) => setListingType(e.target.value)}
                    className="appearance-none rounded-xl border border-white/25 bg-black/20 px-4 py-3 text-[14px] text-white outline-none transition focus:border-[#31C950]/65 focus:shadow-[0_0_0_3px_rgba(49,201,80,0.18)]"
                  >
                    {LISTING_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.label} value={opt.value} className="bg-slate-900 text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-left">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">Block</span>
                  <input
                    value={block}
                    onChange={(e) => setBlock(e.target.value)}
                    placeholder="e.g. A, Executive"
                    className="rounded-xl border border-white/25 bg-black/20 px-4 py-3 text-[14px] text-white outline-none transition placeholder:text-white/45 focus:border-[#31C950]/65 focus:shadow-[0_0_0_3px_rgba(49,201,80,0.18)]"
                  />
                </label>
                <label className="flex flex-col gap-2 text-left">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">Min price</span>
                  <input
                    inputMode="numeric"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="PKR"
                    className="rounded-xl border border-white/25 bg-black/20 px-4 py-3 text-[14px] text-white outline-none transition placeholder:text-white/45 focus:border-[#31C950]/65 focus:shadow-[0_0_0_3px_rgba(49,201,80,0.18)]"
                  />
                </label>
                <label className="flex flex-col gap-2 text-left">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">Max price</span>
                  <input
                    inputMode="numeric"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="PKR"
                    className="rounded-xl border border-white/25 bg-black/20 px-4 py-3 text-[14px] text-white outline-none transition placeholder:text-white/45 focus:border-[#31C950]/65 focus:shadow-[0_0_0_3px_rgba(49,201,80,0.18)]"
                  />
                </label>
                <label className="flex flex-col gap-2 text-left">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">Area (marlas)</span>
                  <div className="flex gap-2">
                    <input
                      inputMode="decimal"
                      value={minMarlas}
                      onChange={(e) => setMinMarlas(e.target.value)}
                      placeholder="Min"
                      className="w-full rounded-xl border border-white/25 bg-black/20 px-3 py-3 text-[14px] text-white outline-none transition placeholder:text-white/45 focus:border-[#31C950]/65 focus:shadow-[0_0_0_3px_rgba(49,201,80,0.18)]"
                    />
                    <input
                      inputMode="decimal"
                      value={maxMarlas}
                      onChange={(e) => setMaxMarlas(e.target.value)}
                      placeholder="Max"
                      className="w-full rounded-xl border border-white/25 bg-black/20 px-3 py-3 text-[14px] text-white outline-none transition placeholder:text-white/45 focus:border-[#31C950]/65 focus:shadow-[0_0_0_3px_rgba(49,201,80,0.18)]"
                    />
                  </div>
                </label>
                <label className="flex flex-col gap-2 text-left">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">Bedrooms</span>
                  <input
                    inputMode="numeric"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    placeholder="Exact match"
                    className="rounded-xl border border-white/25 bg-black/20 px-4 py-3 text-[14px] text-white outline-none transition placeholder:text-white/45 focus:border-[#31C950]/65 focus:shadow-[0_0_0_3px_rgba(49,201,80,0.18)]"
                  />
                </label>
                <label className="flex flex-col gap-2 text-left">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">Baths</span>
                  <input
                    inputMode="numeric"
                    value={baths}
                    onChange={(e) => setBaths(e.target.value)}
                    placeholder="Exact match"
                    className="rounded-xl border border-white/25 bg-black/20 px-4 py-3 text-[14px] text-white outline-none transition placeholder:text-white/45 focus:border-[#31C950]/65 focus:shadow-[0_0_0_3px_rgba(49,201,80,0.18)]"
                  />
                </label>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-5">
                <p className="text-[12px] text-white/65">
                  {loading ? 'Updating results…' : `${items.length} listing${items.length === 1 ? '' : 's'} shown`}
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="rounded-full border border-white/25 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90 transition hover:border-[#31C950]/55 hover:bg-[#31C950]/15"
                >
                  Clear filters
                </button>
              </div>
            </div>
          </Motion.div>
        </div>
      </PageHero>

      <div className="border-b border-slate-100 bg-[linear-gradient(180deg,#fafbfc_0%,#ffffff_55%)]">
        <div className="container-shell py-14 md:py-16 lg:py-20">
          {error ? (
            <Motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-rose-100 bg-rose-50/80 px-5 py-4 text-sm text-rose-800"
            >
              {error}
            </Motion.p>
          ) : null}

          {loading && !items.length ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="animate-pulse overflow-hidden rounded-2xl border border-slate-100/80 bg-white shadow-sm"
                >
                  <div className="aspect-[16/10] bg-slate-200" />
                  <div className="space-y-3 p-6">
                    <div className="h-3 w-20 rounded bg-slate-200" />
                    <div className="h-5 w-full rounded bg-slate-200" />
                    <div className="h-4 w-2/3 rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {!loading && !items.length && !error ? (
            <Motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[1.5rem] border border-dashed border-slate-200 bg-white px-8 py-16 text-center shadow-sm"
            >
              <p className="text-lg font-semibold text-slate-800">No properties match your filters yet</p>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-500">
                Try widening the price band, clearing the block, or searching with a shorter keyword. New inventory is
                added regularly from the admin panel.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-8 inline-flex items-center justify-center rounded-full bg-[#31C950] px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_12px_30px_rgba(49,201,80,0.35)] transition hover:bg-[#28b048]"
              >
                Reset all filters
              </button>
            </Motion.div>
          ) : null}

          {items.length ? (
            <Motion.div
              key={filterKey}
              variants={listParent}
              initial="hidden"
              animate="show"
              className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10"
            >
              {items.map((p) => {
                const img = cardImageUrl(p)
                return (
                  <Motion.article
                    key={`${p.id}-${p.slug}`}
                    variants={listItem}
                    whileHover={{ y: -6, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
                    className="group relative flex flex-col overflow-hidden rounded-[1.35rem] border border-slate-100/90 bg-white shadow-[0_22px_60px_rgba(15,23,42,0.07)] transition-shadow duration-300 hover:shadow-[0_28px_70px_rgba(49,201,80,0.12)]"
                  >
                    <Link to={`/properties/${p.slug}`} className="relative block overflow-hidden">
                      <div className="relative aspect-[16/10] bg-slate-100">
                        {img ? (
                          <Motion.img
                            src={img}
                            alt=""
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-50 text-[12px] font-medium text-slate-400">
                            Image coming soon
                          </div>
                        )}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-80 transition duration-500 group-hover:opacity-95" />
                        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                          {p.is_featured ? (
                            <span className="rounded-full bg-[#31C950] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white shadow-lg">
                              Featured
                            </span>
                          ) : null}
                          <span className="rounded-full bg-white/92 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-800 shadow">
                            {p.listing_type_display || p.listing_type}
                          </span>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                          <p className="text-lg font-semibold tracking-tight text-white drop-shadow">
                            {formatPkr(p.price)}
                          </p>
                          {p.area_marlas != null ? (
                            <span className="rounded-full bg-black/45 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                              {p.area_marlas} marla
                              {Number(p.area_marlas) === 1 ? '' : 's'}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </Link>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex flex-wrap gap-2 text-[12px] text-slate-500">
                        {p.block ? (
                          <span className="rounded-full bg-slate-50 px-2.5 py-1 font-medium text-slate-700">
                            Block {p.block}
                          </span>
                        ) : null}
                        {p.bedrooms != null ? (
                          <span className="rounded-full bg-slate-50 px-2.5 py-1">{p.bedrooms} beds</span>
                        ) : null}
                        {p.baths != null ? (
                          <span className="rounded-full bg-slate-50 px-2.5 py-1">{p.baths} baths</span>
                        ) : null}
                      </div>
                      <h2 className="mt-4 text-lg font-semibold leading-snug tracking-tight text-slate-900 transition group-hover:text-[#1a3553]">
                        <Link to={`/properties/${p.slug}`}>{p.title}</Link>
                      </h2>
                      {p.short_description ? (
                        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">{p.short_description}</p>
                      ) : null}
                      <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Ref · {p.slug}
                        </p>
                        <Link
                          to={`/properties/${p.slug}`}
                          className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#31C950] transition hover:gap-2"
                        >
                          View details
                          <span aria-hidden>→</span>
                        </Link>
                      </div>
                    </div>
                  </Motion.article>
                )
              })}
            </Motion.div>
          ) : null}

          {showLoadMore ? (
            <div className="mt-12 flex justify-center">
              <Motion.button
                type="button"
                onClick={() => void loadMore()}
                disabled={loadingMore}
                whileTap={{ scale: 0.98 }}
                className="rounded-full border border-slate-200 bg-white px-8 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-800 shadow-sm transition hover:border-[#31C950]/45 hover:bg-[#31C950]/6 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingMore ? 'Loading…' : 'Load more listings'}
              </Motion.button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Properties
