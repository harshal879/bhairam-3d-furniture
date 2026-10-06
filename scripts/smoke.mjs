import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const OUT = '/opt/cursor/artifacts/screenshots'
mkdirSync(OUT, { recursive: true })

const errors = []
const notes = []

async function main() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console: ${msg.text()}`)
  })

  await page.goto('http://127.0.0.1:45321/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  await page.screenshot({ path: `${OUT}/home.png`, fullPage: false })
  notes.push('Home loaded')

  await page.getByRole('link', { name: /Explore Furniture/i }).first().click()
  await page.waitForURL('**/shop**')
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${OUT}/shop.png` })
  notes.push('Shop loaded')

  // Filter wardrobes
  await page.getByRole('button', { name: 'Wardrobes' }).first().click()
  await page.waitForTimeout(400)

  await page.getByRole('link', { name: /Aalto Wardrobe/i }).first().click()
  await page.waitForURL('**/product/aalto-wardrobe**')
  await page.waitForTimeout(2000) // WebGL
  await page.screenshot({ path: `${OUT}/product-3d.png` })
  notes.push('Product detail + 3D')

  // Change material (second swatch)
  const swatches = page.locator('fieldset').filter({ hasText: 'Material' }).locator('button')
  if (await swatches.count() > 1) {
    await swatches.nth(1).click()
    await page.waitForTimeout(400)
  }

  await page.getByRole('button', { name: /Add to cart/i }).first().click()
  await page.waitForTimeout(300)

  await page.goto('http://127.0.0.1:45321/configurator')
  await page.waitForTimeout(2500)
  await page.getByRole('button', { name: /Load living room/i }).click()
  await page.waitForTimeout(1500)
  await page.screenshot({ path: `${OUT}/room-planner.png` })
  notes.push('Room planner')

  await page.goto('http://127.0.0.1:45321/cart')
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${OUT}/cart.png` })
  const cartText = await page.locator('body').innerText()
  notes.push(cartText.includes('Aalto') || cartText.includes('item') ? 'Cart has items' : 'Cart empty?')

  await page.goto('http://127.0.0.1:45321/enquiry')
  await page.fill('input[id="name"], input[type="text"]', 'H Demo')
  await page.locator('input[type="email"]').fill('h@example.com')
  await page.locator('input[type="tel"]').fill('+91 98765 43210')
  await page.locator('textarea').fill('Looking for a wardrobe configuration quote.')
  await page.getByRole('button', { name: /Submit enquiry/i }).click()
  await page.waitForTimeout(600)
  await page.screenshot({ path: `${OUT}/enquiry.png` })
  notes.push((await page.locator('body').innerText()).includes('received') ? 'Enquiry success' : 'Enquiry failed')

  // Mobile
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('http://127.0.0.1:45321/')
  await page.waitForTimeout(600)
  await page.screenshot({ path: `${OUT}/mobile-home.png` })
  notes.push('Mobile home')

  await browser.close()
  console.log(JSON.stringify({ notes, errors }, null, 2))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
