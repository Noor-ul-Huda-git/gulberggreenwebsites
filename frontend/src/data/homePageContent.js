/** Homepage copy & navigation — June 2026 client brief (internal links appear once per URL). */

export const HOME_HERO = {
  h1: 'Gulberg Greens Islamabad — Official IBECHS Gated Community',
  body:
    "Gulberg Greens Islamabad is Pakistan's most trusted CDA-approved gated community, developed by Intelligence Bureau Employees Cooperative Housing Society (IBECHS) since 2005. Spanning over 9,000 acres on Gulberg Expressway, it is home to Islamabad's first residential waterfront lake, Pakistan's first public heliport, and a signal-free expressway underpass — making it the capital's most distinctive address.",
  image: {
    src: '/images/gulberg-greens-islamabad-official-ibechs-gated-community.webp',
    alt: 'Gulberg Greens Islamabad — Aerial view of IBECHS official gated community showing Gulberg Mall, red arch bridge and main boulevard',
    title: 'Gulberg Greens Islamabad — Official IBECHS Gated Community',
  },
}

export const HOME_TRUST_FEATURES = {
  h2: 'Why Gulberg Greens Islamabad Stands Apart',
  items: [
    {
      id: 'cda',
      title: 'CDA Approved Society',
      body: 'Gulberg Greens holds official NOC from Capital Development Authority (CDA), Rawalpindi Development Authority (RDA), FGEHF, NAB, and IESCO — giving buyers complete legal security and peace of mind.',
      icon: 'shield',
    },
    {
      id: 'expressway',
      title: 'Signal-Free Expressway Access',
      body: 'Located directly on 220-ft wide Gulberg Expressway with two completed underpasses — providing seamless, signal-free connectivity to Islamabad city center, New Islamabad Airport, and Rawalpindi.',
      icon: 'connectivity',
    },
    {
      id: 'security',
      title: '24/7 Smart Security',
      body: 'Fully enclosed boundary wall with CCTV surveillance, drone monitoring, E-tag entry gates, biometric access points, and trained security personnel across all residential and farmhouse blocks.',
      icon: 'quality',
    },
    {
      id: 'green',
      title: "Islamabad's Greenest Community",
      body: 'With nearly 80% green spaces, tree-lined streets, block parks, and a strict 20:80 construction-to-land ratio — Gulberg Greens maintains a microclimate significantly cooler than surrounding Islamabad areas.',
      icon: 'leaf',
    },
  ],
}

/** Section 3 — property-type hub links only (latest-updates lives in section 6 per link map). */
export const HOME_PLATFORM_HUB = {
  h2: 'Gulberg Greens Islamabad — Official Information Platform',
  body:
    'This is the sales and marketing digital platform of Gulberg Greens Islamabad, operated and maintained directly by FTN management. All property listings, block-wise development updates, transfer procedures, possession announcements, and investment information published on this website are verified, accurate, and sourced from society management. Whether you are a first-time buyer, seasoned investor, or overseas Pakistani — this platform gives you direct access to authentic Gulberg Greens information.',
  image: {
    src: '/images/gulberg-greens-islamabad-ftn-marketing-official-platform.webp',
    alt: 'FTN Marketing team — Official sales and marketing platform of Gulberg Greens Islamabad providing verified property information',
    title: 'Gulberg Greens Islamabad — Official Information Platform by FTN Marketing',
  },
  links: [
    { label: 'Residential Plots', to: '/properties/plots/' },
    { label: 'Farmhouses', to: '/properties/farm-house/' },
    { label: 'Houses', to: '/properties/house/' },
    { label: 'Apartments & Flats', to: '/properties/flat/' },
    { label: 'Commercial Properties', to: '/properties/commercial-plots/' },
  ],
}

export const HOME_LISTINGS = {
  h2: 'Latest Properties in Gulberg Greens Islamabad',
  body: 'Listings updated daily by our verified sales team across all blocks of Gulberg Greens Islamabad.',
  cta: { label: 'Browse Properties', to: '/properties/' },
}

export const HOME_LAKE = {
  h2: "Pakistan's Largest Man-Made Residential Lake — Gulberg Greens",
  body:
    "At the heart of Gulberg Greens Islamabad sits a 1,500-kanal man-made lake — Pakistan's largest residential waterfront. This signature lake is surrounded by walking trails, leisure areas, wellness spaces, and lake-facing residences, creating a calm and refined living environment unlike any other housing society in twin cities. Properties adjacent to the lake in Block A, Block B, and Executive Block command the highest premiums in the entire society.",
  image: {
    src: '/images/gulberg-greens-islamabad-man-made-lake-aerial-view.webp',
    alt: "Aerial view of Gulberg Greens Islamabad man-made lake — residential blocks and curved roads surrounding Pakistan's largest residential waterfront",
    title: "Pakistan's Largest Man-Made Residential Lake — Gulberg Greens Islamabad",
  },
}

export const HOME_DEVELOPMENT = {
  h2: 'Gulberg Greens Islamabad — Development Status 2026',
  current: {
    h3: 'Current Progress',
    body: 'As of 2026, over 70% of Gulberg Greens is fully developed. Key milestones achieved include complete road network across all major blocks, underground electricity (IESCO), Sui Gas, fiber optic internet, and water supply infrastructure operational in developed blocks. Block A Executive II and P Block possession is officially underway following IBECHS January 2026 announcement.',
  },
  upcoming: {
    h3: 'Upcoming Projects',
    body: "Major commercial developments currently in advanced finishing stage include JW Marriott Hotel, Gulberg Mega Mall, Technology Park, and Business Square — with soft openings expected in 2026. Pakistan's first public heliport within a residential society is also under active development.",
  },
  cta: { label: 'Read All Development Updates', to: '/latest-updates/' },
  image: {
    src: '/images/gulberg-greens-islamabad-development-status-2026-aerial.webp',
    alt: 'Gulberg Greens Islamabad 2026 development status — aerial view showing Gulberg Expressway, man-made lake, residential blocks and infrastructure development',
    title: 'Gulberg Greens Islamabad — Development Status 2026',
  },
}

export const HOME_BLOCKS = {
  h2: 'Gulberg Greens Islamabad — Blocks & Plot Sizes',
  intro:
    'Gulberg Greens Islamabad is divided into residential blocks from Block A through Block V, Executive Block, A Executive Premium, D Markaz, and dedicated farmhouse zones. Each block offers different plot sizes to suit every budget and lifestyle requirement.',
  residential: {
    h3: 'Residential Plot Blocks',
    body: '5 Marla, 7 Marla, 10 Marla, 1 kanal and 2 Kanal residential plots available across multiple blocks with possession and on-installment options.',
    links: [
      { label: 'Block A', to: '/properties/plots/block-a/' },
      { label: 'Block B', to: '/properties/plots/block-b/' },
      { label: 'Block C', to: '/properties/plots/block-c/' },
      { label: 'Block D', to: '/properties/plots/block-d/' },
      { label: 'Block E', to: '/properties/plots/block-e/' },
      { label: 'Block F', to: '/properties/plots/block-f/' },
    ],
  },
  farmhouse: {
    h3: 'Farmhouse Blocks',
    body: '4 Kanal, 5 Kanal, and 10 Kanal luxury farmhouse plots in prime lake-facing and expressway-adjacent locations.',
    links: [
      { label: 'Block A', to: '/properties/farm-house/block-a/' },
      { label: 'Block B', to: '/properties/farm-house/block-b/' },
      { label: 'Block C', to: '/properties/farm-house/block-c/' },
      { label: 'Block D', to: '/properties/farm-house/block-d/' },
      { label: 'Block E', to: '/properties/farm-house/block-e/' },
    ],
  },
}

export const HOME_INVESTMENT = {
  h2: "Gulberg Islamabad — Islamabad's Top Real Estate Investment 2026",
  body: 'Gulberg Greens Islamabad has recorded consistent annual property appreciation over the past decade. With CDA-approved legal status, rapid infrastructure completion, increasing demand from overseas Pakistanis, and landmark commercial projects entering their final phase — 2026 presents a strong window for both end-users and long-term investors. Underground utilities, zero-loadshedding in developed blocks, and a strict construction code ensure long-term property value protection for all buyers.',
  installment: {
    h3: 'New Installment Plans Available — 2026',
    body: 'IBECHS has announced new residential plots on installment in Block A Executive Premium — 5 Marla, 7 Marla, 10 Marla 1 Kanal and 2 Kanal — with 30% down payment and a 2-year simple installment plan. CDA layout plan approved. Both Pakistani residents and overseas Pakistanis are eligible to apply.',
  },
  cta: { label: 'Contact Our Investment Team', to: '/contact/' },
  image: {
    src: '/images/gulberg-greens-islamabad-investment-gulberg-mall-night-view.webp',
    alt: 'Gulberg Greens Islamabad night aerial view — Gulberg Mall illuminated with red arch bridge and lake reflection showing prime real estate investment destination',
    title: 'Gulberg Greens Islamabad — Prime Real Estate Investment Destination 2026',
  },
}

export const HOME_LIFESTYLE = {
  h2: 'Life Inside Gulberg Greens — Community & Amenities',
  body: 'Residents of Gulberg Greens Islamabad enjoy a complete, self-sufficient lifestyle within a secure green environment. The society is home to top educational institutions including Beaconhouse, Roots International Schools, and Froebel\'s International. Banking facilities include Bank of Punjab, Soneri Bank, and Standard Chartered. Healthcare, retail centers, sports grounds, and recreational parks are developed across all major blocks — making Gulberg Greens Islamabad the most livable gated community in the twin cities.',
}

export const HOME_APPROVALS = {
  h2: 'Official Approvals & Registrations — Gulberg Greens Islamabad',
  body: 'Gulberg Greens Islamabad is one of the few housing societies in Pakistan that holds approval from all major regulatory authorities. These approvals provide complete legal protection to all buyers and investors.',
  marqueeTitle: 'Some Authentic Registrations of Gulberg Islamabad',
}

export const HOME_FAQ_SECTION = {
  h2: 'Frequently Asked Questions — Gulberg Greens Islamabad',
}

export const HOME_LOCATION = {
  h2: 'Gulberg Greens Location — Gulberg Expressway, Islamabad',
  body: 'Gulberg Greens Islamabad is located on Gulberg Expressway (formerly Lehtrar Road), Zone IV Islamabad — directly accessible from Islamabad Expressway via signal-free underpass. The society is approximately 15 minutes from Islamabad city center and 20 minutes from New Islamabad International Airport.',
  visit: {
    h3: 'How to Visit Gulberg Greens Sales Office',
    lines: [
      'Sales Office: HM Tower, 5th Floor, Office No. 402, Gulberg Greens Islamabad',
      'Mon–Sat: 9:00 AM – 6:00 PM  |  Sunday by appointment',
      'Phone: +92 331 000 0060',
      'Email: info@gulberggreens.com.pk',
    ],
  },
  cta: { label: 'View on Map', to: '/gulberg-map/' },
}

export const HOME_FOOTER_BLURB = {
  h3: 'Gulberg Greens Islamabad — IBECHS Sales & Marketing Platform',
  body: 'Gulberg Greens Islamabad is developed by IBECHS — Intelligence Bureau Employees Cooperative Housing Society. This official website provides verified property listings, block maps, transfer guidance, possession updates, and investment information for all residential, farmhouse, and commercial properties within Gulberg Greens Islamabad.',
}
