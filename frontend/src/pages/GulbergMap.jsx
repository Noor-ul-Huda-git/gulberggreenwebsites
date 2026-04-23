import { lazy, Suspense } from 'react'
import PageBreadcrumbs from '../components/layout/PageBreadcrumbs.jsx'
import PageHero from '../components/layout/PageHero.jsx'

const GulbergMapPdfViewer = lazy(() => import('../components/gulbergMap/GulbergMapPdfViewer.jsx'))

function GulbergMap() {
  return (
    <div className="bg-white font-[Poppins,Manrope,system-ui,sans-serif] text-slate-800">
      <PageHero overlay="dark">
        <div className="container-shell flex min-h-[min(42vh,440px)] flex-col items-center justify-center px-4 pb-12 pt-28 text-center md:min-h-[min(46vh,500px)] md:pb-16 md:pt-32">
          <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-[#31C950] [text-shadow:0_2px_12px_rgba(0,0,0,0.65)] md:text-xs">
            Location &amp; master plan
          </p>
          <h1 className="mt-4 max-w-3xl font-[Poppins,Manrope,system-ui,sans-serif] text-3xl font-bold leading-[1.12] tracking-[-0.03em] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.55)] md:text-4xl lg:text-[2.5rem]">
            Gulberg Map
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-white/88 [text-shadow:0_1px_12px_rgba(0,0,0,0.55)] md:text-base">
            Explore the official master plan below — pan and zoom to study blocks, roads, and precincts in full detail.
          </p>
        </div>
      </PageHero>

      <div className="border-b border-slate-100 bg-[linear-gradient(180deg,#fafbfc_0%,#ffffff_55%)]">
        <div className="container-shell px-4 pb-12 pt-5 sm:px-6 sm:pt-6 md:pb-16 md:pt-8 lg:pb-20 lg:pt-10">
          <PageBreadcrumbs
            variant="onLight"
            className="mb-5 md:mb-6"
            items={[{ to: '/', label: 'Home' }, { label: 'Gulberg Map' }]}
          />
          <div className="mx-auto max-w-3xl text-center">
            {/* <p className="text-[15px] leading-relaxed text-slate-600 md:text-[16px] md:leading-[1.75]">
              The document is rendered in high resolution in your browser. Use the zoom controls or Ctrl/⌘ + scroll to
              magnify; pan by dragging inside the viewer.
            </p> */}
          </div>

          <div className="relative mx-auto mt-10 max-w-6xl md:mt-14">
            <div
              className="pointer-events-none absolute -inset-px rounded-[1.25rem] bg-[linear-gradient(135deg,rgba(49,201,80,0.15),transparent_45%,rgba(26,53,83,0.06))] opacity-90 md:rounded-3xl"
              aria-hidden
            />
            <Suspense
              fallback={
                <div className="flex min-h-[min(52vh,560px)] items-center justify-center rounded-[1.25rem] border border-slate-200/90 bg-slate-100 md:min-h-[min(58vh,640px)] md:rounded-3xl">
                  <div className="flex flex-col items-center gap-3 px-6">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#31C950] border-t-transparent" />
                    <p className="text-sm font-medium text-slate-600">Preparing map viewer…</p>
                  </div>
                </div>
              }
            >
              <GulbergMapPdfViewer />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GulbergMap
