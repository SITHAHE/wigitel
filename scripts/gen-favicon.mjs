// Генерация растровых иконок из SVG через реальный Chrome (puppeteer-core).
// Рендерим два мастера:
//   public/favicon.svg      — скруглённый (для favicon.ico и превью во вкладке)
//   scripts/_icon-full.svg  — полноразмерный (для apple-touch и PWA-иконок)
// Затем упаковываем favicon.ico вручную (ICO с PNG-данными, размеры 16/32/48).

import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const PUB = join(ROOT, 'public')

const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
]
const chromePath = CHROME_CANDIDATES.find((p) => existsSync(p))
if (!chromePath) { console.error('❌ Chrome/Edge не найден'); process.exit(1) }

const roundedSvg = await readFile(join(PUB, 'favicon.svg'), 'utf8')
const fullSvg = await readFile(join(__dirname, '_icon-full.svg'), 'utf8')

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu', '--force-color-profile=srgb'],
})

async function renderPNG(svg, size) {
  const page = await browser.newPage()
  await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 })
  const html = `<!doctype html><meta charset="utf-8">
    <style>html,body{margin:0;padding:0}svg{display:block;width:${size}px;height:${size}px}</style>
    ${svg}`
  await page.setContent(html, { waitUntil: 'networkidle0' })
  const el = await page.$('svg')
  const buf = await el.screenshot({ omitBackground: true, type: 'png' })
  await page.close()
  return buf
}

// --- растровые файлы ---
const jobs = [
  ['favicon-16.png', roundedSvg, 16],
  ['favicon-32.png', roundedSvg, 32],
  ['favicon-48.png', roundedSvg, 48],
  ['apple-touch-icon.png', fullSvg, 180],
  ['icon-192.png', fullSvg, 192],
  ['icon-512.png', fullSvg, 512],
]
const pngs = {}
for (const [name, svg, size] of jobs) {
  const buf = await renderPNG(svg, size)
  pngs[size] = buf
  await writeFile(join(PUB, name), buf)
  console.log(`✅ ${name} (${size}px, ${buf.length} b)`)
}

// --- favicon.ico из PNG 16/32/48 ---
function buildIco(images) {
  const count = images.length
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)      // reserved
  header.writeUInt16LE(1, 2)      // type: icon
  header.writeUInt16LE(count, 4)  // image count

  const dir = Buffer.alloc(16 * count)
  let offset = 6 + 16 * count
  const chunks = []
  images.forEach((img, i) => {
    const d = i * 16
    dir.writeUInt8(img.size >= 256 ? 0 : img.size, d + 0) // width
    dir.writeUInt8(img.size >= 256 ? 0 : img.size, d + 1) // height
    dir.writeUInt8(0, d + 2)  // palette
    dir.writeUInt8(0, d + 3)  // reserved
    dir.writeUInt16LE(1, d + 4)   // color planes
    dir.writeUInt16LE(32, d + 6)  // bpp
    dir.writeUInt32LE(img.data.length, d + 8)  // size
    dir.writeUInt32LE(offset, d + 12)          // offset
    offset += img.data.length
    chunks.push(img.data)
  })
  return Buffer.concat([header, dir, ...chunks])
}

const ico = buildIco([
  { size: 16, data: pngs[16] },
  { size: 32, data: pngs[32] },
  { size: 48, data: pngs[48] },
])
await writeFile(join(PUB, 'favicon.ico'), ico)
console.log(`✅ favicon.ico (16/32/48, ${ico.length} b)`)

await browser.close()
console.log('🎉 Готово')
