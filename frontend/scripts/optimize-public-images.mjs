#!/usr/bin/env node
/**
 * Build responsive WebP variants for public/images (homepage hero & sections).
 * Outputs {basename}-{640|960|1280|1920}w.webp for PageSpeed / LCP.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const IMAGES_DIR = path.join(__dirname, '../public/images')
const WIDTHS = [640, 960, 1280, 1920]
const QUALITY = 72

async function main() {
  let entries
  try {
    entries = await fs.readdir(IMAGES_DIR)
  } catch {
    console.warn('optimize-public-images: no public/images directory')
    return
  }

  const sources = entries.filter(
    (name) =>
      /\.(webp|jpe?g|png)$/i.test(name) &&
      !/-\d+w\.webp$/i.test(name),
  )

  for (const name of sources) {
    const inputPath = path.join(IMAGES_DIR, name)
    const base = name.replace(/\.(webp|jpe?g|png)$/i, '')
    const meta = await sharp(inputPath).metadata()
    const origW = meta.width ?? 1920

    for (const w of WIDTHS) {
      if (w > origW) continue
      const outName = `${base}-${w}w.webp`
      const outPath = path.join(IMAGES_DIR, outName)
      await sharp(inputPath)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 6 })
        .toFile(outPath)
      const stat = await fs.stat(outPath)
      console.log(`  ${outName} (${Math.round(stat.size / 1024)} KiB)`)
    }
  }

  console.log(`Optimized ${sources.length} source image(s) in public/images/`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
