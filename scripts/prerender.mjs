// Пре-рендер собранного сайта в статический HTML (для SEO — прежде всего Яндекс,
// который плохо исполняет JS). Поднимаем мини-сервер на dist/, открываем страницу
// в реальном Chrome (headless), прокручиваем до конца — чтобы сработали все
// whileInView-reveal и «собрались» scramble-заголовки, — и сохраняем итоговый DOM
// обратно в dist/index.html. Клиент по-прежнему получает полноценный React
// (бандл в HTML остаётся и перемонтирует приложение), а краулеры видят весь текст.

import http from 'node:http'
import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, extname, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DIST = join(ROOT, 'dist')
const PORT = 4185

const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
]
const chromePath = CHROME_CANDIDATES.find((p) => existsSync(p))
if (!chromePath) { console.error('❌ Chrome/Edge не найден'); process.exit(1) }

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.json': 'application/json',
  '.xml': 'application/xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ico': 'image/x-icon',
}

const server = http.createServer(async (req, res) => {
  let p = decodeURIComponent((req.url || '/').split('?')[0])
  if (p === '/' || p.endsWith('/')) p = '/index.html'
  try {
    const data = await readFile(join(DIST, p))
    res.setHeader('Content-Type', MIME[extname(p)] || 'application/octet-stream')
    res.end(data)
  } catch {
    res.statusCode = 404
    res.end('404')
  }
})

await new Promise((r) => server.listen(PORT, r))
console.log(`▶ dist сервируется на http://localhost:${PORT}`)

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
})

try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
  // 'domcontentloaded', а не 'networkidle0': если внешний запрос (Google Fonts)
  // висит, «тишина сети» не наступает и navigation вылетает по таймауту.
  // Достаточно дождаться DOM + дать React смонтироваться фиксированной паузой.
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await new Promise((r) => setTimeout(r, 2500))

  // Прокручиваем всю страницу шагами — так срабатывают все IntersectionObserver
  // (reveal) и запускаются scramble-заголовки. Через lenis, если он есть.
  await page.evaluate(async () => {
    await new Promise((res) => {
      let y = 0
      const step = () => {
        y += 350
        if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true })
        else window.scrollTo(0, y)
        if (y < document.body.scrollHeight) setTimeout(step, 110)
        else setTimeout(res, 500)
      }
      step()
    })
  })
  // Возврат наверх + пауза, чтобы reveal (once:true) остались раскрытыми и всё устаканилось
  await page.evaluate(() => { if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true }); else window.scrollTo(0, 0) })
  await new Promise((r) => setTimeout(r, 1800))

  let html = await page.content()

  // Санити-проверка: в теле должен появиться реальный текст
  const ok = /продают ваш продукт|Избранные|Сайты под ключ/i.test(html)
  const textNodes = (html.match(/>[А-Яа-я][^<]{3,}/g) || []).length
  console.log(`Проверка: ключевой текст ${ok ? 'ЕСТЬ' : 'НЕТ'}, текстовых узлов ~${textNodes}`)
  if (!ok || textNodes < 30) {
    console.error('❌ Пре-рендер не собрал контент — index.html НЕ перезаписан')
    process.exitCode = 1
  } else {
    await writeFile(join(DIST, 'index.html'), html, 'utf8')
    console.log('✅ dist/index.html перезаписан пре-рендеренной версией')
  }
} finally {
  await browser.close()
  server.close()
}
