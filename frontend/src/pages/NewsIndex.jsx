import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PageBreadcrumbs from '../components/layout/PageBreadcrumbs.jsx'
import PageHero from '../components/layout/PageHero.jsx'
import { fetchNewsPosts } from '../lib/api.js'

function formatNewsDate(iso) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(iso))
  } catch {
    return ''
  }
}

function NewsIndex() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = useMemo(() => {
    const raw = searchParams.get('page')
    const n = Number.parseInt(raw || '1', 10)
    return Number.isFinite(n) && n >= 1 ? n : 1
  }, [searchParams])

  const [posts, setPosts] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const goToPage = (nextPage) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (nextPage <= 1) next.delete('page')
        else next.set('page', String(nextPage))
        return next
      },
      { replace: true },
    )
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const ac = new AbortController()
    setLoading(true)
    setError(null)
    fetchNewsPosts({ page }, { signal: ac.signal })
      .then((data) => {
        if (data.invalidPage) {
          setSearchParams(
            (prev) => {
              const next = new URLSearchParams(prev)
              next.delete('page')
              return next
            },
            { replace: true },
          )
          return
        }
        setPosts(data.results)
        setTotalCount(data.count)
        setTotalPages(data.totalPages)
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return
        setError('Unable to load articles. Please try again shortly.')
      })
      .finally(() => {
        if (!ac.signal.aborted) setLoading(false)
      })
    return () => ac.abort()
  }, [page, setSearchParams])

  return (
    <div className="bg-white font-[Poppins,Manrope,system-ui,sans-serif]">
      <PageHero overlay="dark">
        <div className="container-shell flex min-h-[min(44vh,480px)] flex-col items-center justify-center px-4 pb-14 pt-28 text-center md:min-h-[min(48vh,520px)] md:pb-16 md:pt-32">
          <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-[#31C950] [text-shadow:0_2px_12px_rgba(0,0,0,0.65)] md:text-xs">
            News &amp; insights
          </p>
          <h1 className="mt-4 max-w-4xl font-[Poppins,Manrope,system-ui,sans-serif] text-3xl font-bold leading-[1.12] tracking-[-0.03em] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.55)] md:text-4xl lg:text-[2.65rem]">
            Latest updates from Gulberg Greens
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-white/88 [text-shadow:0_1px_12px_rgba(0,0,0,0.55)] md:text-base">
            Official announcements, market perspectives, and development milestones — published by the sales &amp; marketing
            team.
          </p>
        </div>
      </PageHero>

      <div className="border-b border-slate-100 bg-white">
        <div className="container-shell flex flex-col gap-4 py-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 space-y-2">
            <PageBreadcrumbs
              variant="onLight"
              items={[{ to: '/', label: 'Home' }, { label: 'Updates' }]}
            />
            {/* <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">All updates</p> */}
          </div>
          <p className="text-[13px] text-slate-500 sm:text-right">
            {loading
              ? 'Loading…'
              : `${totalCount} ${totalCount === 1 ? 'article' : 'articles'}${totalPages > 1 ? ` · page ${page} of ${totalPages}` : ''}`}
          </p>
        </div>
      </div>

      <div className="bg-[linear-gradient(180deg,#fafbfc_0%,#ffffff_50%)]">
        <div className="container-shell py-14 md:py-16 lg:py-20">
          {loading ? (
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
                    <div className="h-5 w-[85%] rounded bg-slate-200" />
                    <div className="mt-4 space-y-2">
                      <div className="h-3 w-full rounded bg-slate-100" />
                      <div className="h-3 w-full rounded bg-slate-100" />
                      <div className="h-3 w-2/3 rounded bg-slate-100" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {error ? (
            <p className="rounded-2xl border border-amber-200/80 bg-amber-50/90 px-6 py-4 text-center text-sm text-amber-900">
              {error}
            </p>
          ) : null}

          {!loading && !error && posts.length === 0 ? (
            <p className="rounded-2xl border border-slate-200/80 bg-white px-8 py-14 text-center text-slate-600 shadow-sm">
              No articles published yet. Please check back soon.
            </p>
          ) : null}

          {!loading && !error && posts.length > 0 ? (
            <>
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-12">
                {posts.map((post) => (
                  <article
                    key={post.slug}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100/90 bg-white shadow-[0_12px_40px_-24px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/[0.03] transition hover:-translate-y-1 hover:shadow-[0_20px_50px_-24px_rgba(15,23,42,0.18)]"
                  >
                    {post.primary_image ? (
                      <Link
                        to={`/news/${post.slug}`}
                        className="relative block aspect-[16/10] overflow-hidden bg-slate-100"
                        tabIndex={-1}
                        aria-hidden
                      >
                        <img
                          src={post.primary_image}
                          alt=""
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                      </Link>
                    ) : (
                      <div className="aspect-[16/10] bg-gradient-to-br from-slate-100 to-slate-50" aria-hidden />
                    )}
                    <div className="flex flex-1 flex-col p-6 md:p-7">
                      <h2 className="font-[Poppins,Manrope,system-ui,sans-serif] text-lg font-semibold leading-snug tracking-[-0.02em] text-[#1a2332] md:text-xl">
                        <Link to={`/news/${post.slug}`} className="transition hover:text-[#31C950]">
                          {post.title}
                        </Link>
                      </h2>
                      <p className="mt-4 flex-1 text-[15px] leading-relaxed text-slate-600">{post.excerpt}</p>
                      <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">
                        {formatNewsDate(post.published_at).toUpperCase()}
                      </p>
                      <Link
                        to={`/news/${post.slug}`}
                        className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-[#31C950] transition hover:gap-2"
                      >
                        Read more
                        <span aria-hidden className="text-lg leading-none">
                          »
                        </span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              {totalPages > 1 ? (
                <nav
                  className="mt-14 flex flex-col items-center justify-center gap-4 border-t border-slate-100 pt-10 sm:flex-row sm:gap-6"
                  aria-label="News pagination"
                >
                  <button
                    type="button"
                    onClick={() => goToPage(page - 1)}
                    disabled={page <= 1}
                    className="inline-flex min-h-[44px] min-w-[7rem] items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-[13px] font-semibold text-slate-700 transition hover:border-[#31C950]/40 hover:text-[#31C950] disabled:pointer-events-none disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <p className="text-[13px] tabular-nums text-slate-500">
                    Page <span className="font-semibold text-slate-800">{page}</span> of{' '}
                    <span className="font-semibold text-slate-800">{totalPages}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => goToPage(page + 1)}
                    disabled={page >= totalPages}
                    className="inline-flex min-h-[44px] min-w-[7rem] items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-[13px] font-semibold text-slate-700 transition hover:border-[#31C950]/40 hover:text-[#31C950] disabled:pointer-events-none disabled:opacity-40"
                  >
                    Next
                  </button>
                </nav>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default NewsIndex
