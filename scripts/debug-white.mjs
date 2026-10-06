import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
const errors = []
const logs = []
page.on('pageerror', (e) => errors.push('PAGE: ' + e.message + '\n' + e.stack))
page.on('console', (msg) => logs.push(msg.type() + ': ' + msg.text()))
page.on('requestfailed', (req) => logs.push('FAIL: ' + req.url() + ' ' + req.failure()?.errorText))

await page.goto('http://127.0.0.1:45321/', { waitUntil: 'networkidle', timeout: 30000 })
await page.waitForTimeout(2000)
const html = await page.locator('#root').innerHTML().catch(() => 'NO ROOT')
const text = await page.locator('body').innerText().catch(() => '')
const bg = await page.evaluate(() => {
  const r = document.getElementById('root')
  const b = document.body
  return {
    rootChildren: r?.childElementCount,
    rootHTML: r?.innerHTML?.slice(0, 500),
    bodyText: b?.innerText?.slice(0, 300),
    bodyBg: getComputedStyle(b).backgroundColor,
    hasCream: !!document.querySelector('.bg-cream, [class*="cream"]'),
  }
})
console.log(JSON.stringify({ errors, logs: logs.slice(0, 40), bg, textLen: text.length, text: text.slice(0, 400) }, null, 2))
await page.screenshot({ path: '/opt/cursor/artifacts/screenshots/debug-home.png', fullPage: true })

// Also test product page
await page.goto('http://127.0.0.1:45321/product/aalto-wardrobe', { waitUntil: 'networkidle', timeout: 30000 })
await page.waitForTimeout(3000)
const p2 = await page.evaluate(() => ({
  text: document.body.innerText.slice(0, 400),
  rootLen: document.getElementById('root')?.innerHTML?.length,
}))
console.log('PRODUCT', JSON.stringify(p2, null, 2))
console.log('PRODUCT ERRORS', errors.filter(e => e.includes('PAGE')).slice(-5))
await page.screenshot({ path: '/opt/cursor/artifacts/screenshots/debug-product.png' })

await browser.close()
