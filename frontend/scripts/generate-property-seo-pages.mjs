import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  PROPERTY_BLOCK_OPTIONS,
  PROPERTY_CATEGORY_SEO,
  propertyBlockSeo,
} from '../src/data/propertyListingTypes.js'
import { STATIC_PAGE_SEO } from '../src/data/staticPageSeo.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const frontendRoot = path.resolve(__dirname, '..')
const distRoot = path.join(frontendRoot, 'dist')
const distIndexPath = path.join(distRoot, 'index.html')

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function injectSeo(html, seo) {
  const title = `<title>${escapeHtml(seo.metaTitle)}</title>`
  const description = `<meta name="description" content="${escapeHtml(seo.metaDescription)}" />`
  const canonical = `<link rel="canonical" href="${escapeHtml(seo.canonical)}" />`
  const robots = '<meta name="robots" content="index, follow" />'

  let next = html
    .replace(/<title>[\s\S]*?<\/title>/i, title)
    .replace(/\s*<meta\s+name=["']description["'][^>]*>\s*/gi, '\n')
    .replace(/\s*<meta\s+name=["']robots["'][^>]*>\s*/gi, '\n')
    .replace(/\s*<link\s+rel=["']canonical["'][^>]*>\s*/gi, '\n')

  next = next.replace(
    /(<meta\s+name=["']viewport["'][^>]*>\s*)/i,
    `$1\n    ${description}\n    ${canonical}\n    ${robots}\n    `,
  )

  return next
}

const html = await readFile(distIndexPath, 'utf8')

function routeDir(route) {
  const clean = route.replace(/^\/|\/$/g, '')
  return clean ? path.join(distRoot, clean) : distRoot
}

await writeFile(distIndexPath, injectSeo(html, STATIC_PAGE_SEO.home))

await Promise.all(
  Object.entries(PROPERTY_CATEGORY_SEO).map(async ([slug, seo]) => {
    const routeDir = path.join(distRoot, 'properties', slug)
    await mkdir(routeDir, { recursive: true })
    await writeFile(path.join(routeDir, 'index.html'), injectSeo(html, seo))
  }),
)

const staticSeoPages = [
  STATIC_PAGE_SEO.properties,
  STATIC_PAGE_SEO.latestUpdates,
  STATIC_PAGE_SEO.gulbergMap,
  STATIC_PAGE_SEO.contact,
]

await Promise.all(
  staticSeoPages.map(async (seo) => {
    const dir = routeDir(seo.route)
    await mkdir(dir, { recursive: true })
    await writeFile(path.join(dir, 'index.html'), injectSeo(html, seo))
  }),
)

const blockSeoPages = Object.keys(PROPERTY_CATEGORY_SEO).flatMap((categorySlug) =>
  PROPERTY_BLOCK_OPTIONS.map((block) => propertyBlockSeo(categorySlug, block)).filter(Boolean),
)

await Promise.all(
  blockSeoPages.map(async (seo) => {
    const dir = routeDir(new URL(seo.canonical).pathname)
    await mkdir(dir, { recursive: true })
    await writeFile(path.join(dir, 'index.html'), injectSeo(html, seo))
  }),
)

console.log(
  `Generated ${Object.keys(PROPERTY_CATEGORY_SEO).length} property SEO HTML pages, ${blockSeoPages.length} block SEO HTML pages, and ${staticSeoPages.length + 1} static SEO HTML pages.`,
)
