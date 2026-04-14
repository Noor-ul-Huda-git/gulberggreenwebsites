import { updates } from '../data/siteContent.js'

function LatestUpdates() {
  return (
    <div className="container-shell py-20 lg:py-24">
      <div className="mb-14 space-y-4">
        <p className="section-kicker">Latest Updates</p>
        <h1 className="section-title max-w-4xl">
          A dedicated space for development news, possession guidance, and market-facing announcements.
        </h1>
        <p className="section-copy">
          This page is currently static, but the layout is ready for future admin-managed updates
          so the site can publish important project information in a more structured way.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          {updates.map((update) => (
            <article key={update.title} className="card-panel p-8">
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-amber-700">
                {update.date}
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                {update.title}
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                {update.summary}
              </p>
            </article>
          ))}
        </div>

        <aside className="card-panel h-fit p-8">
          <p className="section-kicker">Editorial direction</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
            Better content structure builds more trust.
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            This section can later include block-specific notices, file attachments, fee guidance,
            possession milestones, and featured updates selected from the Django admin panel.
          </p>
        </aside>
      </div>
    </div>
  )
}

export default LatestUpdates
