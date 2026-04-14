import { contactCards, contactInfo } from '../data/siteContent.js'

function ContactUs() {
  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <div className="container-shell py-20 lg:py-24">
      <div className="mb-14 space-y-4">
        <p className="section-kicker">Contact Us</p>
        <h1 className="section-title max-w-4xl">
          Make it easy for investors and families to get accurate guidance without extra friction.
        </h1>
        <p className="section-copy">
          The contact page blends direct call-to-action blocks with a refined inquiry form layout,
          ready to connect to backend handling later if you want submissions stored or emailed.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          {contactCards.map((card) => (
            <article key={card.title} className="card-panel p-8">
              <p className="text-xl font-semibold tracking-tight text-slate-950">{card.title}</p>
              <p className="mt-3 text-lg text-amber-700">{card.value}</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
            </article>
          ))}

          <div className="card-panel p-8">
            <p className="section-kicker">Office details</p>
            <p className="mt-4 text-sm leading-7 text-slate-600">{contactInfo.address}</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">{contactInfo.hours}</p>
          </div>
        </div>

        <div className="card-panel p-8 md:p-10">
          <p className="section-kicker">Send an inquiry</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            Keep the page useful now, then connect it to backend workflows later.
          </h2>
          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            <input
              className="rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 outline-none transition focus:border-slate-400"
              placeholder="Full name"
            />
            <input
              className="rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 outline-none transition focus:border-slate-400"
              placeholder="Phone number"
            />
            <input
              className="rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 outline-none transition focus:border-slate-400"
              placeholder="Email address"
            />
            <textarea
              rows="6"
              className="rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 outline-none transition focus:border-slate-400"
              placeholder="Tell us what kind of property or information you need."
            />
            <button
              type="submit"
              className="w-fit rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Submit inquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ContactUs
