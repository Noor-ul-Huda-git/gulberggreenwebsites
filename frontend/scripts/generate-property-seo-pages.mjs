import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  PROPERTY_BLOCK_OPTIONS,
  PROPERTY_CATEGORY_SEO,
  propertyBlockSeo,
} from '../src/data/propertyListingTypes.js'
import { STATIC_PAGE_SEO } from '../src/data/staticPageSeo.js'
import {
  buildHomeSchemas,
  buildNewsArticleSchema,
  buildOrganizationSchema,
  buildPropertySchema,
  fetchAllFromApi,
  injectSeo,
  newsPageSeo,
  propertyPageSeo,
  routeDir,
} from './seo-build-utils.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const frontendRoot = path.resolve(__dirname, '..')
const distRoot = path.join(frontendRoot, 'dist')
const distIndexPath = path.join(distRoot, 'index.html')

const html = await readFile(distIndexPath, 'utf8')
const defaultJsonLd = [buildOrganizationSchema()]

async function writeSeoPage(routePath, seo, jsonLd = defaultJsonLd) {
  const dir = routeDir(distRoot, routePath)
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, 'index.html'), injectSeo(html, seo, { jsonLd }))
}

await writeSeoPage('/', STATIC_PAGE_SEO.home, buildHomeSchemas())

await Promise.all(
  Object.entries(PROPERTY_CATEGORY_SEO).map(async ([slug, seo]) => {
    await writeSeoPage(`/properties/${slug}/`, seo)
  }),
)

const staticSeoPages = [
  STATIC_PAGE_SEO.properties,
  STATIC_PAGE_SEO.latestUpdates,
  STATIC_PAGE_SEO.gulbergMap,
  STATIC_PAGE_SEO.contact,
]

await Promise.all(staticSeoPages.map((seo) => writeSeoPage(seo.route, seo)))

const blockSeoPages = Object.keys(PROPERTY_CATEGORY_SEO).flatMap((categorySlug) =>
  PROPERTY_BLOCK_OPTIONS.map((block) => propertyBlockSeo(categorySlug, block)).filter(Boolean),
)

await Promise.all(
  blockSeoPages.map(async (seo) => {
    await writeSeoPage(new URL(seo.canonical).pathname, seo)
  }),
)

let propertyCount = 0
let newsCount = 0

try {
  const properties = await fetchAllFromApi('/properties/')
  await Promise.all(
    properties.map(async (property) => {
      if (!property.canonical_url) return
      const seo = propertyPageSeo(property)
      const jsonLd = [buildOrganizationSchema(), buildPropertySchema(property, seo.canonical)]
      await writeSeoPage(new URL(seo.canonical).pathname, seo, jsonLd)
      propertyCount += 1
    }),
  )
} catch (error) {
  console.warn('Property SEO prerender skipped:', error.message)
}

try {
  const newsPosts = await fetchAllFromApi('/news/')
  await Promise.all(
    newsPosts.map(async (post) => {
      if (!post.slug) return
      const seo = newsPageSeo(post)
      const jsonLd = [buildOrganizationSchema(), buildNewsArticleSchema(post, seo.canonical)]
      await writeSeoPage(new URL(seo.canonical).pathname, seo, jsonLd)
      newsCount += 1
    }),
  )
} catch (error) {
  console.warn('News SEO prerender skipped:', error.message)
}

console.log(
  `Generated SEO HTML: home + ${Object.keys(PROPERTY_CATEGORY_SEO).length} category pages, ${blockSeoPages.length} block pages, ${staticSeoPages.length} static pages, ${propertyCount} property pages, ${newsCount} news pages.`,
)
