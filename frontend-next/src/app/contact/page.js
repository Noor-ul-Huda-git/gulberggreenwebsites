import ContactUsClient from './ContactUsClient'
import { STATIC_PAGE_SEO } from '../../data/staticPageSeo.js'

export const metadata = {
  title: STATIC_PAGE_SEO.contact.metaTitle,
  description: STATIC_PAGE_SEO.contact.metaDescription,
  alternates: {
    canonical: 'https://gulberggreens.com.pk/contact/',
  },
}

export default function ContactPage() {
  return <ContactUsClient seo={STATIC_PAGE_SEO.contact} />
}