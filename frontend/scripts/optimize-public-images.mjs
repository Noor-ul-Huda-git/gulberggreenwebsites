#!/usr/bin/env node
/**
 * Mobile-only WebP variants for public/images (480w + 640w, higher compression).
 * Desktop keeps original full-size sources in the React app.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const IMAGES_DIR = path.join(__dirname, '../public/images')
const LOGO_SRC = path.join(__dirname, '../src/assets/logo-gulberg-greens-0.png')
const LOGO_MOBILE_OUT = path.join(__dirname, '../public/logo-gulberg-greens-mobile.webp')
/** Phone / mobile PageSpeed — 480w for narrow, 640w for larger phones */
const MOBILE_WIDTHS = [480, 640]
const MOBILE_QUALITY = 62

async function optimizePublicImages() {
  let entries
  try {
    entries = await fs.readdir(IMAGES_DIR)
  } catch {
    console.warn('optimize-public-images: no public/images directory')
    return
  }

  const sources = entries.filter(
    (name) => /\.(webp|jpe?g|png)$/i.test(name) && !/-\d+w\.webp$/i.test(name),
  )

  for (const name of sources) {
    const inputPath = path.join(IMAGES_DIR, name)
    const base = name.replace(/\.(webp|jpe?g|png)$/i, '')
    const meta = await sharp(inputPath).metadata()
    const origW = meta.width ?? 1920

    for (const w of MOBILE_WIDTHS) {
      if (w > origW) continue
      const outName = `${base}-${w}w.webp`
      const outPath = path.join(IMAGES_DIR, outName)
      await sharp(inputPath)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: MOBILE_QUALITY, effort: 6 })
        .toFile(outPath)
      const stat = await fs.stat(outPath)
      console.log(`  ${outName} (${Math.round(stat.size / 1024)} KiB)`)
    }
  }

  console.log(`Optimized ${sources.length} homepage image(s) for mobile`)
}

async function optimizeLogo() {
  try {
    await fs.access(LOGO_SRC)
  } catch {
    console.warn('optimize-public-images: logo source not found, skipping')
    return
  }
  await sharp(LOGO_SRC)
    .resize({ width: 560, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 })
    .toFile(LOGO_MOBILE_OUT)
  const stat = await fs.stat(LOGO_MOBILE_OUT)
  console.log(`  logo-gulberg-greens-mobile.webp (${Math.round(stat.size / 1024)} KiB)`)
}

async function main() {
  await optimizePublicImages()
  await optimizeLogo()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
