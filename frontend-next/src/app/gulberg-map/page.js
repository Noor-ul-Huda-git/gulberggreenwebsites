import PageBreadcrumbs from '../../components/layout/PageBreadcrumbs'
import PageHero from '../../components/layout/PageHero'
import GulbergMapPdfViewerClient from '../../components/gulbergMap/GulbergMapPdfViewerClient'
import { STATIC_PAGE_SEO } from '../../data/staticPageSeo'

export const metadata = {
title: STATIC_PAGE_SEO.gulbergMap.title,
description: STATIC_PAGE_SEO.gulbergMap.metaDescription,
}

export default function GulbergMapPage() {
const seo = STATIC_PAGE_SEO.gulbergMap

return ( <div className="bg-white font-[Poppins,Manrope,system-ui,sans-serif] text-slate-800"> <PageHero overlay="dark"> <div className="container-shell flex min-h-[min(42vh,440px)] flex-col items-center justify-center px-4 pb-12 pt-28 text-center md:min-h-[min(46vh,500px)] md:pb-16 md:pt-32"> <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-[#31C950] [text-shadow:0_2px_12px_rgba(0,0,0,0.65)] md:text-xs">
Location & master plan </p>

```
      <h1 className="mt-4 max-w-3xl font-[Poppins,Manrope,system-ui,sans-serif] text-3xl font-bold leading-[1.12] tracking-[-0.03em] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.55)] md:text-4xl lg:text-[2.5rem]">
        {seo.h1}
      </h1>

      <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-white/88 [text-shadow:0_1px_12px_rgba(0,0,0,0.55)] md:text-base">
        {seo.metaDescription}
      </p>
    </div>
  </PageHero>

  <div className="border-b border-slate-100 bg-[linear-gradient(180deg,#fafbfc_0%,#ffffff_55%)]">
    <div className="container-shell px-4 pb-12 pt-5 sm:px-6 sm:pt-6 md:pb-16 md:pt-8 lg:pb-20 lg:pt-10">
      <PageBreadcrumbs
        variant="onLight"
        className="mb-5 md:mb-6"
        items={[
          { to: '/', label: 'Home' },
          { label: 'Gulberg Map' },
        ]}
      />

      <div className="mx-auto max-w-3xl text-center">
        {/* Original explanatory paragraph intentionally kept removed. */}
      </div>

      <div className="relative mx-auto mt-10 max-w-6xl md:mt-14">
        <div
          className="pointer-events-none absolute -inset-px rounded-[1.25rem] bg-[linear-gradient(135deg,rgba(49,201,80,0.15),transparent_45%,rgba(26,53,83,0.06))] opacity-90 md:rounded-3xl"
          aria-hidden
        />

        <GulbergMapPdfViewerClient />
      </div>
    </div>
  </div>
</div>


)
}
