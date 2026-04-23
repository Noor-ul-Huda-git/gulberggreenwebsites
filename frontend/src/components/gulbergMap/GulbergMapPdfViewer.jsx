import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { getGulbergMapPdfUrl } from '../../lib/gulbergMapPdf.js'

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

/**
 * Same-origin worker via Vite (`?url`). CDN workers (unpkg) are often blocked by CSP and get torn
 * down on re-render / Strict Mode → "Worker was terminated" and streaming aborts.
 */
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

/** Stable reference — inline `options={{…}}` triggers react-pdf reload warnings every render. */
const pdfDocumentOptions = Object.freeze({
  disableRange: false,
  disableStream: false,
  rangeChunkSize: 65536,
})

const SCALE_MIN = 0.35
const SCALE_MAX = 3.5
const SCALE_STEP = 0.15

function clampScale(n) {
  return Math.min(SCALE_MAX, Math.max(SCALE_MIN, Math.round(n * 100) / 100))
}

function GulbergMapPdfViewer() {
  const pdfUrl = useMemo(() => getGulbergMapPdfUrl(), [])
  const [numPages, setNumPages] = useState(null)
  const [scale, setScale] = useState(1)
  const [loadError, setLoadError] = useState(null)
  const [loadPct, setLoadPct] = useState(null)
  /** Fit-to-width base (px); `scale` multiplies this so we never allocate a canvas at the PDF’s raw poster size. */
  const [pageBaseWidth, setPageBaseWidth] = useState(960)
  const scrollRef = useRef(null)

  const onDocumentLoadSuccess = useCallback(({ numPages: n }) => {
    setNumPages(n)
    setLoadError(null)
    setLoadPct(null)
  }, [])

  const onDocumentLoadError = useCallback((err) => {
    const detail = err?.message || err?.toString?.() || 'Unknown error'
    setLoadError(
      `Could not load the master plan (${detail}). Add the file at frontend/public/maps/gulberg-greens-new.pdf (URL /maps/gulberg-greens-new.pdf) or set VITE_GULBERG_MAP_PDF_URL.`,
    )
  }, [])

  const onLoadProgress = useCallback(({ loaded, total }) => {
    if (total > 0) setLoadPct(Math.min(100, Math.round((loaded / total) * 100)))
    else setLoadPct(null)
  }, [])

  const zoomIn = useCallback(() => {
    setScale((s) => clampScale(s + SCALE_STEP))
  }, [])

  const zoomOut = useCallback(() => {
    setScale((s) => clampScale(s - SCALE_STEP))
  }, [])

  const zoomReset = useCallback(() => {
    setScale(1)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return undefined

    const measure = () => {
      const w = el.clientWidth
      if (w > 0) setPageBaseWidth(Math.max(320, Math.min(1680, w - 40)))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)

    const onWheel = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return
      e.preventDefault()
      setScale((s) => clampScale(s + (e.deltaY < 0 ? SCALE_STEP : -SCALE_STEP)))
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      ro.disconnect()
      el.removeEventListener('wheel', onWheel)
    }
  }, [])

  return (
    <div className="relative w-full overflow-hidden rounded-[1.25rem] border border-slate-200/90 bg-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_24px_60px_-28px_rgba(15,23,42,0.2)] md:rounded-3xl">
      <div
        className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/90 bg-white px-3 py-2.5 sm:px-4"
        onContextMenu={(e) => e.preventDefault()}
      >
        <p className="text-[12px] font-medium text-slate-600 sm:text-[13px]">
          Master plan
          {numPages != null ? (
            <span className="text-slate-400">
              {' '}
              · {numPages} page{numPages === 1 ? '' : 's'}
            </span>
          ) : null}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="hidden text-[11px] text-slate-400 sm:inline">Pinch or ⌃ scroll to zoom</span>
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            <button
              type="button"
              onClick={zoomOut}
              className="rounded-md px-2.5 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-white hover:text-[#1a3553] disabled:opacity-40"
              disabled={scale <= SCALE_MIN + 0.01}
              aria-label="Zoom out"
            >
              −
            </button>
            <button
              type="button"
              onClick={zoomReset}
              className="min-w-[3.25rem] px-2 py-1.5 text-center text-[11px] font-semibold tabular-nums text-slate-600"
              aria-label="Reset zoom to 100 percent"
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              type="button"
              onClick={zoomIn}
              className="rounded-md px-2.5 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-white hover:text-[#1a3553] disabled:opacity-40"
              disabled={scale >= SCALE_MAX - 0.01}
              aria-label="Zoom in"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="max-h-[min(78vh,900px)] min-h-[min(52vh,560px)] overflow-auto bg-gradient-to-b from-slate-100 to-slate-50 [-webkit-overflow-scrolling:touch] selection:bg-transparent sm:max-h-[min(82vh,960px)] sm:min-h-[min(58vh,640px)]"
        onContextMenu={(e) => e.preventDefault()}
        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      >
        {loadError ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 px-6 py-16 text-center">
            <p className="max-w-md text-sm font-medium text-rose-700">{loadError}</p>
            <p className="max-w-md text-[13px] text-slate-600">
              Expected file: <code className="rounded bg-slate-200 px-1 py-0.5 text-[12px]">public/maps/gulberg-greens-new.pdf</code> →{' '}
              <code className="rounded bg-slate-200 px-1 py-0.5 text-[12px]">/maps/gulberg-greens-new.pdf</code>, or set{' '}
              <code className="rounded bg-slate-200 px-1 py-0.5 text-[12px]">VITE_GULBERG_MAP_PDF_URL</code>.
            </p>
          </div>
        ) : (
          <div className="flex min-w-0 flex-col items-center gap-6 px-3 py-6 sm:px-6 sm:py-8">
            <Document
              file={pdfUrl}
              options={pdfDocumentOptions}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              onLoadProgress={onLoadProgress}
              loading={
                <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 py-12">
                  <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#31C950] border-t-transparent" aria-hidden />
                  <p className="text-sm font-medium text-slate-600">Loading master plan…</p>
                  {loadPct != null ? <p className="text-[12px] tabular-nums text-slate-400">{loadPct}%</p> : null}
                  <p className="max-w-xs text-center text-[11px] text-slate-400">Large file — first open may take a moment.</p>
                </div>
              }
            >
              {numPages
                ? Array.from({ length: numPages }, (_, i) => (
                    <Page
                      key={i + 1}
                      pageNumber={i + 1}
                      width={pageBaseWidth}
                      scale={scale}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="shadow-[0_8px_40px_-16px_rgba(15,23,42,0.25)]"
                      loading={
                        <div className="flex h-32 w-full max-w-4xl items-center justify-center rounded-lg bg-white/80 text-sm text-slate-500">
                          Rendering page {i + 1}…
                        </div>
                      }
                    />
                  ))
                : null}
            </Document>
          </div>
        )}
      </div>

      <p className="border-t border-slate-200/90 bg-white px-3 py-2 text-center text-[10px] leading-snug text-slate-400 sm:px-4 sm:text-[11px]">
        View only in browser — use zoom controls. The file is not offered as a download from this page.
      </p>
    </div>
  )
}

export default GulbergMapPdfViewer
