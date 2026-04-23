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

/** Homepage FAQ — question + one or more answer paragraphs. */
export const homeFaqItems = [
  {
    id: 'investment-or-living',
    question: 'Is this project suitable for investment or living?',
    paragraphs: [
      'Yes, it is ideal for both investment and residential living due to its prime location, infrastructure, and facilities.',
    ],
  },
  {
    id: 'transfer-plot-2026',
    question: 'How to transfer a plot in 2026?',
    paragraphs: [
      'Required documents: Allotment Letter, NDC, CNIC, Possession Letter (if issued), Sale Agreement, Paid Slips, Transfer Fee Slip, Taxes.',
      'Transfer fee: 5 Marla (30k), 10 Marla (48k), 1 Kanal (70k), etc.',
      'Tax: Filer 3%, Non-filer 6%.',
    ],
  },
  {
    id: 'reliable-agent',
    question: 'How to find a reliable real estate agent?',
    paragraphs: ['FTN Marketing (Find The Nest) is a trusted partner for Gulberg Greens.'],
  },
  {
    id: 'possession-plot-2026',
    question: 'How to get possession of a plot in 2026?',
    paragraphs: [
      'Clear dues, submit allotment letter, CNIC, photos, and possession fee. Once verified, management issues possession letter.',
      'Possession fee: 5 Marla (18k), 1 Kanal (48k), 10 Kanal (400k), etc.',
    ],
  },
  {
    id: 'transfer-farmhouse-2026',
    question: 'How to transfer a farmhouse in 2026?',
    paragraphs: [
      'Documents: Allotment Letter, NDC, CNIC, Paid Slips, Possession Letter, Taxes.',
      'Transfer fee: 4 Kanal (250k), 5 Kanal (300k), 10 Kanal (700k).',
      'Tax: Filer 3%, Non-filer 6%.',
    ],
  },
  {
    id: 'transfer-shops-apartments',
    question: 'How to transfer shops/apartments in 2026?',
    paragraphs: [
      'Currently, Gulberg Green administration does not allow transfer of shops, apartments, or offices.',
    ],
  },
  {
    id: 'ibechs-full-form',
    question: 'What is the full form of IBECHS?',
    paragraphs: ['IBECHS stands for Intelligence Bureau Employees Cooperative Housing Scheme.'],
  },
  {
    id: 'noc-status',
    question: 'What is the NOC status?',
    paragraphs: [
      'The project has received the required approvals, including CDA-issued NOC, ensuring legal compliance. Ref# CDA/PLW-HS (127)/2009/257. MOUs with IESCO and SNGPL were also signed.',
    ],
  },
  {
    id: 'visit-site',
    question: 'How can I visit the site?',
    paragraphs: [
      'The location is easily accessible via Islamabad Expressway and is within a short drive from major areas of the city.',
    ],
  },
  {
    id: 'developer',
    question: 'Who is the developer?',
    paragraphs: ['The project is developed and managed by IBECHS.'],
  },
  {
    id: 'sectors-sizes',
    question: 'What are the sectors and sizes of Gulberg Green?',
    paragraphs: [
      'Gulberg Greens has six blocks: A-Executive, A, B, C, D, E with luxurious farmhouses of 4, 5, and 10 Kanal.',
    ],
  },
  {
    id: 'buy-installment',
    question: 'How to buy residential plots, apartments, or shops on installment?',
    paragraphs: ['Fill out the provided form, and the sales department will contact you.'],
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
