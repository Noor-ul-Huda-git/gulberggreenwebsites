import PageHero from '../components/layout/PageHero.jsx'

function MapPinIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 22s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

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
            Explore blocks, main arteries, and landmarks across the estate — interactive map coming soon.
          </p>
        </div>
      </PageHero>

      <div className="border-b border-slate-100 bg-[linear-gradient(180deg,#fafbfc_0%,#ffffff_55%)]">
        <div className="container-shell px-4 py-12 sm:px-6 md:py-16 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[15px] leading-relaxed text-slate-600 md:text-[16px] md:leading-[1.75]">
              Use the map below to orient yourself within Gulberg Greens Islamabad. The live embed will be added here in a
              future update.
            </p>
          </div>

          <div className="relative mx-auto mt-10 max-w-6xl md:mt-14">
            <div
              className="pointer-events-none absolute -inset-px rounded-[1.25rem] bg-[linear-gradient(135deg,rgba(49,201,80,0.15),transparent_45%,rgba(26,53,83,0.06))] opacity-90 md:rounded-3xl"
              aria-hidden
            />
            <div
              className="relative flex min-h-[min(58vh,640px)] w-full flex-col items-center justify-center overflow-hidden rounded-[1.25rem] border border-slate-200/90 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_24px_60px_-28px_rgba(15,23,42,0.2)] md:min-h-[min(62vh,720px)] md:rounded-3xl"
              role="region"
              aria-label="Map placeholder"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.35]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2394a3b8' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
                aria-hidden
              />
              <div className="relative z-10 flex flex-col items-center px-6 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-300/80 bg-white/80 text-[#1a3553] shadow-[0_8px_30px_-12px_rgba(15,23,42,0.25)] md:h-[4.5rem] md:w-[4.5rem]">
                  <MapPinIcon className="h-8 w-8 md:h-9 md:w-9" />
                </span>
                <h2 className="mt-8 font-[Poppins,Manrope,system-ui,sans-serif] text-2xl font-semibold tracking-[-0.03em] text-[#1a3553] md:text-3xl">
                  Map
                </h2>
                <p className="mt-3 max-w-md text-[14px] leading-relaxed text-slate-600 md:text-[15px]">
                  Reserved for your interactive map or embedded view. Replace this block when ready.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GulbergMap
