import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'

test('all four supplied videos have posters and play with native controls', async ({ page }) => {
  await page.goto('./')
  for (const selector of ['#passions video', '#sports video', '#concert-band video', '#duke-marching-band video']) {
    const player = page.locator(selector)
    await player.scrollIntoViewIfNeeded()
    await expect(player).toHaveAttribute('controls', '')
    await expect(player).toHaveAttribute('playsinline', '')
    await expect(player).toHaveAttribute('preload', 'none')
    expect(await player.evaluate(video => (video as HTMLVideoElement).paused)).toBe(true)
    const poster = await player.getAttribute('poster')
    expect(poster).toMatch(/-poster\.jpg$/)
    expect((await page.request.get(poster!)).status()).toBe(200)
    await player.evaluate(video => {
      // Keep automated verification quiet; the actual site preserves original audio.
      (video as HTMLVideoElement).muted = true
      return (video as HTMLVideoElement).play()
    })
    await expect.poll(() => player.evaluate(video => (video as HTMLVideoElement).currentTime)).toBeGreaterThan(0)
    const dimensions = await player.evaluate(video => ({ width: (video as HTMLVideoElement).videoWidth, height: (video as HTMLVideoElement).videoHeight }))
    expect(dimensions.width).toBeGreaterThan(0)
    expect(dimensions.height).toBeGreaterThan(0)
    if (selector.includes('passions')) expect(dimensions.height).toBeGreaterThan(dimensions.width)
    await player.evaluate(video => (video as HTMLVideoElement).pause())
    expect(await player.evaluate(video => (video as HTMLVideoElement).error)).toBeNull()
  }
})

test('both supplied pitch PDFs open from their first-slide previews', async ({ page }) => {
  await page.goto('./')
  await page.locator('#pitches').scrollIntoViewIfNeeded()
  for (const [name, original] of [['doximity', 'Doximity_Pitch.pdf'], ['rates-trade', 'Rates_Trade.pdf']]) {
    const link = page.locator(`.pitch-preview[href$="${name}.pdf"]`)
    await expect(link.locator('img')).toHaveCount(1)
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    const response = await page.request.get((await link.getAttribute('href'))!)
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('application/pdf')
    expect((await response.body()).equals(readFileSync(`assets/${original}`))).toBe(true)
    const popupPromise = page.waitForEvent('popup')
    await link.click()
    const popup = await popupPromise
    await expect(popup).toHaveURL(new RegExp(`${name}\\.pdf$`))
    await popup.close()
  }
})
