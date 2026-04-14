import { mapHighlights } from '../data/siteContent.js'

function GulbergMap() {
  return (
    <div className="container-shell py-20 lg:py-24">
      <div className="mb-14 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <p className="section-kicker">Gulberg Map</p>
          <h1 className="section-title max-w-4xl">
            A cleaner map experience can guide visitors through blocks, landmarks, and access points.
          </h1>
          <p className="section-copy">
            For this first release, the page establishes the visual framework for a richer map
            presentation with highlighted sectors, major routes, and location storytelling.
          </p>
        </div>

        <div className="card-panel flex min-h-72 items-end rounded-[2.25rem] bg-gradient-to-br from-emerald-900 via-slate-800 to-slate-950 p-8 text-white">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-amber-300">Access + orientation</p>
            <p className="mt-4 max-w-md text-3xl font-semibold tracking-tight">
              A future interactive map can live here while keeping the page elegant and easy to scan.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="card-panel p-8">
          <p className="section-kicker">Key highlights</p>
          <div className="mt-6 space-y-4">
            {mapHighlights.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="card-panel p-4">
          <div className="flex min-h-[28rem] items-center justify-center rounded-[1.75rem] border border-dashed border-slate-300 bg-[linear-gradient(135deg,#f2efe4,#ffffff)] p-8 text-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                Map placeholder
              </p>
              <p className="mt-4 max-w-lg text-2xl font-semibold tracking-tight text-slate-950">
                This area is ready for an image, custom SVG map, or embedded location view in the next step.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GulbergMap
