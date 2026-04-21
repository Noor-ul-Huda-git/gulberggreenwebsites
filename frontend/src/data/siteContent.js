/** Primary brand navy — matches headings & CTAs site-wide. Edit this hex to match your design. */
export const brandNavy = '#27AE60'

export const contactInfo = {
  phone: '+92 331 000 0060',
  email: 'info@gulberggreens.com.pk',
  /** Short line for footers / compact UI */
  hours: 'Mon–Sat 9:00 AM – 6:00 PM · Sun by appointment',
  /** Contact page — full schedule */
  hoursLines: [
    { label: 'Mon – Sat', value: '9:00 AM to 6:00 PM' },
    { label: 'Sun', value: 'Closed (by appointment only)' },
  ],
  address: 'HM Tower, 5th Floor, Office no 402, Gulberg Greens, Islamabad — Sales & Marketing Office',
}

/** Contact page — hero copy (single paragraph; do not duplicate on the page). */
export const contactPageIntro =
  "Have questions about buying or renting a property? Our team is here to guide you with expert advice, verified listings, and secure investment options in Gulberg. Fill out the form or contact us directly — we'll respond shortly."

/**
 * “Gulberg Greens Islamabad” place pin (from Google Maps listing).
 * @see https://www.google.com/maps/place/Gulberg+Greens+Islamabad,+Pakistan/…
 */
export const mapPlaceLat = 33.6114747
export const mapPlaceLng = 73.1733127

/** Google Maps iframe — centered on the official place coordinates. */
export const mapEmbedUrl = `https://maps.google.com/maps?q=${mapPlaceLat},${mapPlaceLng}&hl=en&z=14&output=embed`

/**
 * Same place page as in Maps (opens listing, not a generic search).
 * Tracking params removed; add ?hl=en only.
 */
export const mapDirectionsUrl =
  'https://www.google.com/maps/place/Gulberg+Greens+Islamabad,+Pakistan/@33.6087587,73.1460381,14z/data=!3m1!4b1!4m6!3m5!1s0x38dfec0851d92db3:0x66f28b1327836ee2!8m2!3d33.6114747!4d73.1733127!16s%2Fg%2F1ptwj1h48?hl=en'

export const footerAbout =
  'This is the Sales/Marketing digital platform of Gulberg Greens Islamabad, created to provide verified information about residential, commercial, farmhouse, and apartment projects. All listings, updates, and details shared here are officially sourced and maintained by the management team.'

/** Official social profiles — update hrefs when available. */
export const socialLinks = [
  { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/' },
  { id: 'twitter', label: 'Twitter', href: 'https://twitter.com/' },
  { id: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/' },
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  { id: 'pinterest', label: 'Pinterest', href: 'https://www.pinterest.com/' },
]

export const heroStats = [
  { value: '1600', label: 'Kanals around the signature lake' },
  { value: '06', label: 'Primary blocks and sectors' },
  { value: '24/7', label: 'Security and managed access' },
  { value: '01', label: 'Unified platform for project discovery' },
]

export const amenityCards = [
  {
    title: 'Living',
    description:
      'A calm residential destination shaped around space, access, and a premium environment for long-term family living.',
  },
  {
    title: 'Investment',
    description:
      'Residential, farmhouse, and commercial opportunities create strong flexibility for buyers, builders, and investors.',
  },
  {
    title: 'Community',
    description:
      'Schools, retail, banking, connectivity, and recreation support a more complete Gulberg Greens story across the website.',
  },
]

export const highlightLinks = [
  'Plots and residential blocks',
  'Farmhouse zones',
  'Commercial activity',
  'Schools and facilities',
  'Road access and location',
]

export const updates = [
  {
    title: 'Development momentum across key residential blocks',
    date: 'April 2026',
    summary:
      'Use this page to publish fresh possession, infrastructure, and utility updates from the admin-managed content flow later on.',
  },
  {
    title: 'Transfer and possession guidance refreshed',
    date: 'March 2026',
    summary:
      'The new frontend structure leaves space for fee tables, process notes, and short status articles that make the site more useful for buyers.',
  },
  {
    title: 'Commercial and lifestyle facilities spotlight',
    date: 'February 2026',
    summary:
      'Banks, schools, salons, restaurants, and internet providers can be grouped into editorial updates and trust-building content blocks.',
  },
]

export const mapHighlights = [
  'Islamabad Expressway access',
  'Business Park and commercial spine',
  'Farmhouse zones and executive blocks',
  'Signature waterfront and leisure areas',
]

export const contactCards = [
  {
    title: 'Call our team',
    value: contactInfo.phone,
    description: 'Discuss project details, plot categories, and upcoming listing plans.',
  },
  {
    title: 'Email for inquiries',
    value: contactInfo.email,
    description: 'Share requirements for residential, farmhouse, or commercial inventory.',
  },
  {
    title: 'Visit the office',
    value: 'HM Tower — Gulberg Greens',
    description: 'Meet the sales & marketing team during business hours.',
  },
]

/** FTN Marketing — Google Maps place (reviews open from listing). Tracking params omitted. */
const homeGoogleReviewsUrl =
  'https://www.google.com/maps/place/FTN+MARKETING/@33.5995865,73.1544113,17z/data=!4m8!3m7!1s0x38dfedbdbb64b061:0xef1c2cc0c3c0dc08!8m2!3d33.5995865!4d73.1544113!9m1!1b1!16s%2Fg%2F11s2m1rb93'

/**
 * Homepage “social wall” — replace `href` (and optional `embedSrc`) with your real post/video URLs.
 * When `embedSrc` is set, an iframe is shown; otherwise the card links to `href`.
 */
export const homeSocialShowcase = {
  heading: 'Connect with us',
  subheading: 'Official channels, fresh posts, and Google reviews — tap through to follow or watch.',
  googleReviewsUrl: homeGoogleReviewsUrl,
  items: [
    {
      id: 'social-fb',
      platform: 'facebook',
      title: 'Facebook',
      subtitle: 'Latest videos and community updates.',
      href: 'https://www.facebook.com/findthenest/',
      embedSrc: '',
    },
    {
      id: 'social-ig',
      platform: 'instagram',
      title: 'Instagram',
      subtitle: 'Photos, reels, and project highlights.',
      href: 'https://www.instagram.com/findthenest/',
      embedSrc: '',
    },
    {
      id: 'social-tt',
      platform: 'tiktok',
      title: 'TikTok',
      subtitle: 'Short tours and on-site clips.',
      href: 'https://www.tiktok.com/@findthenest',
      embedSrc: '',
    },
    {
      id: 'social-google',
      platform: 'google',
      title: 'Google reviews',
      subtitle: 'See what clients say about Gulberg Greens.',
      href: homeGoogleReviewsUrl,
      embedSrc: '',
    },
  ],
}
