'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import PageHero from '../../components/layout/PageHero.jsx'

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

function formatNewsDateUpper(iso) {
  return formatNewsDate(iso).toUpperCase()
}

function ArticleBody({ text }) {
  const raw = text?.trim() ?? ''
  if (!raw) return null

  if (/<[a-z][\s\S]*>/i.test(raw)) {
    return (
      <div
        className="news-article-body max-w-none text-[17px] leading-[1.88] text-slate-700 [&_a]:text-[#1a3553] [&_a]:font-medium [&_a]:underline [&_a]:decoration-slate-300 [&_a]:underline-offset-2 [&_a]:transition hover:[&_a]:text-[#31C950] [&_strong]:font-semibold [&_em]:italic [&_h2]:mt-12 [&_h2]:font-semibold[&_h2]:text-[#1a3553] [&_h2]:tracking-tight [&_h3]:mt-8 [&_h3]:font-semibold [&_h3]:text-[#1a3553] [&_h4]:mt-6 [&_h4]:font-semibold [&_h4]:text-slate-800 [&_p+p]:mt-5 [&_p]:leading-[1.88] [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-slate-200 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_img]:mx-auto [&_img]:my-6 [&_img]:block [&_img]:max-h-[min(70vh,48rem)] [&_img]:w-auto [&_img]:max-w-full [&_img]:rounded-xl [&_img]:border [&_img]:border-slate-200/60 [&_pre]:my-5 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-slate-100 [&_pre]:p-4 [&_pre]:text-[15px] [&_hr]:my-10 [&_hr]:border-slate-200"
        dangerouslySetInnerHTML={{ __html: raw }}
      />
    )
  }

  return (
    <div className="space-y-6 text-[17px] leading-[1.88] text-slate-700">
      {raw.split(/\n\n+/).map((block, i) => (
        <p key={i}>{block}</p>
      ))}
    </div>
  )
}

function GalleryChevron({ direction }) {
  const isLeft = direction === 'left'

  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d={isLeft ? 'M14.5 6.5L9 12l5.5 5.5' : 'M9.5 6.5L15 12l-5.5 5.5'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArticleImageGallery({ images }) {
  const [index, setIndex] = useState(0)
  const n = images.length

  const go = useCallback(
    (delta) => {
      setIndex((i) => (i + delta + n) % n)
    },
    [n],
  )

  useEffect(() => {
    if (n <= 1) return undefined

    const onKey = (e) => {
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }

    window.addEventListener('keydown', onKey)

    return () => window.removeEventListener('keydown', onKey)
  }, [n, go])

  if (!n) return null

  const current = images[index]

  return (
    <div className="relative mx-auto max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.28)] ring-1 ring-slate-900/[0.04]">
        <div className="flex min-h-[11rem] w-full items-center justify-center px-2 py-3 sm:min-h-[13rem] md:px-5 md:py-6">
          <img
            src={current.url}
            alt={current.alt_text || `Article image ${index + 1} of ${n}`}
            className="mx-auto block max-h-[min(78vh,52rem)] w-auto max-w-full object-contain object-center"
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        </div>

        {n > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/60 md:left-5"
              aria-label="Previous image"
            >
              <GalleryChevron direction="left" />
            </button>

            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/60 md:right-5"
              aria-label="Next image"
            >
              <GalleryChevron direction="right" />
            </button>

            <div
              className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-2backdrop-blur-md"
              role="tablist"
              aria-label="Image selection"
            >
              {images.map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Show image ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === index
                      ? 'w-7 bg-[#31C950]'
                      : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}

              <span className="pl-1 text-[11px] font-medium tabular-nums text-white/90">
                {index + 1}/{n}
              </span>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

function NewsArticle({ initialPost }) {
  const post = initialPost
  const loading = false
  const notFound = !post

  if (loading) {
    return (
      <div className="bg-white font-[Poppins,Manrope,system-ui,sans-serif]">
        <PageHero overlay="dark">
          <div className="container-shell flex min-h-[min(44vh,420px)] flex-col items-center justify-center px-4 pb-14 pt-28 md:pt-32">
            <div className="w-full max-w-3xl animate-pulse space-y-4 text-center">
              <div className="mx-auto h-4 w-32 rounded bg-white/25" />
              <div className="mx-auto h-10 w-full max-w-2xl rounded bg-white/20" />
              <div className="mx-auto h-4 w-48 rounded bg-white/20" />
            </div>
          </div>
        </PageHero>

        <div className="border-t border-slate-100 bg-slate-50/50">
          <div className="container-shell py-16">
            <div className="mx-auto max-w-3xl animate-pulse space-y-3">
              <div className="aspect-[16/9] w-full rounded-2xl bg-slate-200" />
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-[75%] rounded bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (notFound || !post) {
    return (
      <div className="bg-white font-[Poppins,Manrope,system-ui,sans-serif]">
        <PageHero overlay="dark">
          <div className="container-shell flex min-h-[min(40vh,400px)] flex-col items-center justify-center px-4 pb-14 pt-28 text-center md:pt-32">
            <h1 className="text-2xl font-bold tracking-[-0.02em] text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.5)]">
              Article not found
            </h1>

            <p className="mt-3 max-w-md text-white/85">
              This update may have been removed or the link is incorrect.
            </p>

            <Link
              href="/latest-updates/"
              className="mt-8 inline-flex font-semibold text-[#31C950] [text-shadow:0_1px_8px_rgba(0,0,0,0.6)] hover:underline"
            >
              ← Back to news
            </Link>
          </div>
        </PageHero>
      </div>
    )
  }

  return (
    <article className="bg-white font-[Poppins,Manrope,system-ui,sans-serif]">
      <PageHero overlay="dark">
        <div className="container-shell flex min-h-[min(50vh,580px)] flex-col items-center justify-center px-4 pb-20 pt-28 text-center md:min-h-[min(54vh,640px)] md:pb-24 md:pt-36">
          <p className="text-[11px] font-semibold uppercase tracking-[0.42em] text-[#31C950] [text-shadow:0_2px_12px_rgba(0,0,0,0.65)]">
            News
          </p>

          <h1 className="mt-6 max-w-4xl font-[Poppins,Manrope,system-ui,sans-serif] text-2xl font-bold leading-[1.18] tracking-[-0.03em] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.55)] md:text-4xl md:leading-[1.12] lg:text-[2.65rem]">
            {post.title}
          </h1>

          <p className="mt-8 text-[12px] font-medium uppercase tracking-[0.22em] text-white/88 [text-shadow:0_1px_10px_rgba(0,0,0,0.65)] md:text-[13px]">
            {formatNewsDateUpper(post.published_at)}
            <span className="mx-3 text-white/40">·</span>
            <span className="normal-case tracking-normal text-white/95">
              By {post.author_name}
            </span>
          </p>
        </div>
      </PageHero>

      <div className="bg-[linear-gradient(180deg,#fafbfc_0%,#ffffff_55%)]">
        <div className="container-shell py-14 md:py-16 lg:py-20">
          {post.images?.length > 0 ? (
            <div className="mb-14 md:mb-16">
              <ArticleImageGallery images={post.images} />
            </div>
          ) : null}

          <div className="mx-auto max-w-[42rem] border-t border-slate-100 pt-2">
            <ArticleBody text={post.description} />
          </div>

          <div className="mx-auto mt-16 max-w-[42rem] border-t border-slate-200 pt-10">
            <Link
              href="/latest-updates/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-[14px] font-semibold text-[#1a3553] shadow-sm transition hover:border-[#31C950]/50 hover:bg-[#31C950]/[0.06] hover:text-[#31C950]"
            >
              <span aria-hidden className="text-lg leading-none">
                ←
              </span>
              All news &amp; updates
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export default NewsArticle