function Properties() {
  return (
    <div className="container-shell py-20 lg:py-24">
      <div className="card-panel grid gap-8 p-10 lg:grid-cols-[1.1fr_0.9fr] lg:p-14">
        <div>
          <p className="section-kicker">Properties</p>
          <h1 className="section-title mt-4 max-w-4xl">
            The frontend is ready for the property listing experience once we connect the API.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600">
            The Django backend already includes a read-only properties endpoint and admin-managed
            property model. In the next phase, this page can fetch and filter published listings
            directly from the API.
          </p>
        </div>

        <div className="rounded-[2rem] bg-stone-100 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
            Planned filters
          </p>
          <div className="mt-6 space-y-4 text-sm text-slate-700">
            <div className="rounded-2xl bg-white px-5 py-4">Search by title, size, block, or location</div>
            <div className="rounded-2xl bg-white px-5 py-4">Filter by property type</div>
            <div className="rounded-2xl bg-white px-5 py-4">Filter by sale or rent category</div>
            <div className="rounded-2xl bg-white px-5 py-4">Show featured listings first</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Properties
