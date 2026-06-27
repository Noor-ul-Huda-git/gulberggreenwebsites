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

/** Official social profiles — footer & shared “Connect” row. */
export const socialLinks = [
  { id: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@gulberggreens_ibechs' },
  { id: 'pinterest', label: 'Pinterest', href: 'https://www.pinterest.com/gulberggreensibechs/' },
  { id: 'medium', label: 'Medium', href: 'https://medium.com/@gulberggreens.com.pk' },
  { id: 'quora', label: 'Quora', href: 'https://www.quora.com/profile/Gulberg-Greens-Islamabad-4' },
  { id: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/@gulberggreens.ibechs' },
  { id: 'bluesky', label: 'Bluesky', href: 'https://bsky.app/profile/gulberggreens.bsky.social' },
  { id: 'x', label: 'X', href: 'https://x.com/gulberg_ibechs' },
  { id: 'dribbble', label: 'Dribbble', href: 'https://dribbble.com/gulberg-greens' },
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/gulberggreens.ibechs/?hl=en' },
]

export const heroStats = [
  { value: '1600', label: 'Kanals around the signature lake' },
  { value: '06', label: 'Primary blocks and sectors' },
  { value: '24/7', label: 'Security and managed access' },
  { value: '01', label: 'Unified platform for project discovery' },
]

/** Homepage FAQ — 11 questions (June 2026 SEO brief). */
export const homeFaqItems = [
  {
    id: 'cda-approved',
    question: 'Is Gulberg Greens Islamabad CDA approved?',
    paragraphs: [
      'Yes. Gulberg Greens is fully approved by the Capital Development Authority (CDA) and holds NOC from RDA, FGEHF, and NAB — making it one of the most legally secure housing societies in Islamabad.',
    ],
  },
  {
    id: 'investment-or-living',
    question: 'Is this project suitable for investment or living?',
    paragraphs: [
      'Gulberg Greens is ideal for both living and investment. With possession-ready plots, move-in-ready houses, and consistent property appreciation — it serves end-users and investors equally.',
    ],
  },
  {
    id: 'property-types',
    question: 'What types of properties are available in Gulberg Greens?',
    paragraphs: [
      'The community offers farmhouse plots, residential plots, houses, apartments, and commercial properties, catering to different lifestyle and investment needs.',
    ],
  },
  {
    id: 'investor-popularity',
    question: 'Why is Gulberg Greens popular among investors?',
    paragraphs: [
      'Investors are attracted to Gulberg Greens because of its prime location, strong development standards, growing demand, and long-term potential for property value appreciation.',
    ],
  },
  {
    id: 'transfer-plot-2026',
    question: 'How to transfer a plot in Gulberg Greens 2026?',
    paragraphs: [
      'Transfer procedures are conducted through the official IBECHS transfer office. For complete documentation requirements and current transfer fee schedule, contact our sales team.',
    ],
  },
  {
    id: 'residential-plot-sizes',
    question: 'What residential plot sizes are available in Gulberg Greens?',
    paragraphs: [
      'Residential plots: 5 Marla, 7 Marla, 10 Marla, 1 Kanal and 2 kanal.',
    ],
  },
  {
    id: 'farmhouse-sizes',
    question: 'What farmhouse sizes are available in Gulberg Greens?',
    paragraphs: ['Farmhouse plots: 4 Kanal, 5 Kanal, 10 Kanal.'],
  },
  {
    id: 'buy-installment',
    question: 'How to buy plots on installment in Gulberg Greens?',
    paragraphs: [
      'IBECHS currently offers installment plans in Block A Executive Premium with 30% down payment and 3-year payment schedule.',
    ],
  },
  {
    id: 'who-can-buy',
    question: 'Who can buy property in Gulberg Greens?',
    paragraphs: [
      'Both government employees and general public including overseas Pakistanis can purchase and sell property in Gulberg Greens Islamabad.',
    ],
  },
  {
    id: 'education',
    question: 'Are educational institutions available near Gulberg Greens?',
    paragraphs: [
      'Yes, several schools, colleges, and educational facilities are located within or near the community, making it convenient for families with children.',
    ],
  },
  {
    id: 'parks-green',
    question: 'Are there parks and green spaces in Gulberg Greens?',
    paragraphs: [
      'Yes, one of the key attractions of Gulberg Greens is its abundance of parks, green belts, and open spaces that promote a healthy and relaxing lifestyle.',
    ],
  },
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
      id: 'social-youtube',
      platform: 'youtube',
      title: 'YouTube',
      subtitle: 'Project videos, walkthroughs, and updates.',
      href: 'https://www.youtube.com/@gulberggreens_ibechs',
      embedSrc: '',
    },
    {
      id: 'social-tiktok',
      platform: 'tiktok',
      title: 'TikTok',
      subtitle: 'Short tours and on-site clips.',
      href: 'https://www.tiktok.com/@gulberggreens.ibechs',
      embedSrc: '',
    },
    {
      id: 'social-x',
      platform: 'x',
      title: 'X',
      subtitle: 'News and quick updates.',
      href: 'https://x.com/gulberg_ibechs',
      embedSrc: '',
    },
    {
      id: 'social-instagram',
      platform: 'instagram',
      title: 'Instagram',
      subtitle: 'Photos, reels, and project highlights.',
      href: 'https://www.instagram.com/gulberggreens.ibechs/?hl=en',
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
    {
      id: 'social-pinterest',
      platform: 'pinterest',
      title: 'Pinterest',
      subtitle: 'Visual inspiration and community boards.',
      href: 'https://www.pinterest.com/gulberggreensibechs/',
      embedSrc: '',
    },
    {
      id: 'social-medium',
      platform: 'medium',
      title: 'Medium',
      subtitle: 'Long-form stories and insights.',
      href: 'https://medium.com/@gulberggreens.com.pk',
      embedSrc: '',
    },
    {
      id: 'social-quora',
      platform: 'quora',
      title: 'Quora',
      subtitle: 'Answers and discussions about the project.',
      href: 'https://www.quora.com/profile/Gulberg-Greens-Islamabad-4',
      embedSrc: '',
    },
    {
      id: 'social-bluesky',
      platform: 'bluesky',
      title: 'Bluesky',
      subtitle: 'Official posts and announcements.',
      href: 'https://bsky.app/profile/gulberggreens.bsky.social',
      embedSrc: '',
    },
    {
      id: 'social-dribbble',
      platform: 'dribbble',
      title: 'Dribbble',
      subtitle: 'Design and creative work.',
      href: 'https://dribbble.com/gulberg-greens',
      embedSrc: '',
    },
  ],
}
