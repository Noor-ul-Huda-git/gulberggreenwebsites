import ContactUsClient from './ContactUsClient'
import { STATIC_PAGE_SEO } from '../../data/staticPageSeo.js'

export const metadata = {
  title: 'Contact Gulberg Greens Islamabad | IBECHS Sales Office',
  description:
    'Get in touch with Gulberg Greens Islamabad. Contact IBECHS office for property ' +
    'inquiries, plot bookings and investment information. Call or visit us today.',
  alternates: { canonical: '/contact/' },
}

export default function ContactPage() {
  return <ContactUsClient seo={STATIC_PAGE_SEO.contact} />
}
