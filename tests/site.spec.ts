import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const chapterIds = ['passions', 'concert-band', 'food', 'sports', 'duke-marching-band', 'scale-coin', 'pitches']

test('all story sections render without broken requests, runtime errors, or overflow', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`) })
  await page.goto('./')
  await expect(page).toHaveTitle('Apollo Lee — Passions & Purpose')
  await expect(page.locator('h1')).toHaveText('ApolloLee.')
  await expect(page.locator('main > section')).toHaveCount(chapterIds.length)
  for (const id of chapterIds) {
    const chapter = page.locator(`#${id}`)
    await chapter.scrollIntoViewIfNeeded()
    await expect(chapter.locator('h2')).toBeVisible()
    for (const photo of await chapter.locator('img:visible').all()) {
      // The initiation strip never stops moving, so scroll without waiting for it to settle.
      await photo.evaluate(img => img.scrollIntoView({ block: 'center', inline: 'nearest' }))
      await expect.poll(() => photo.evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
      await photo.evaluate(img => (img as HTMLImageElement).decode())
    }
    // Reveal and pointer movement can change visual bounds, so check after both.
    if (id === 'scale-coin') {
      await chapter.locator('.scrolling-gallery').hover()
      await chapter.locator('.scrolling-photo .frame').first().hover({ force: true })
    } else await chapter.locator('.frame').first().hover()
    await page.waitForTimeout(120)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    if (testInfo.project.name.includes('desktop') && ['concert-band', 'food', 'scale-coin', 'pitches'].includes(id)) {
      await chapter.evaluate(el => el.querySelectorAll('[data-reveal]').forEach(item => item.classList.add('is-visible')))
      await chapter.screenshot({ path: `test-results/desktop-${id}.png`, animations: 'disabled', style: '.site-header, .skip-link { visibility: hidden; }' })
    }
  }
  await expect(page.locator('.asset-setup')).toHaveCount(0)
  await expect(page.locator('.pitch a[href$=".pdf"]')).toHaveCount(4)
  await expect(page.locator('#sports video')).toHaveCount(1)
  await expect(page.locator('#passions video')).toHaveCount(1)
  await expect(page.locator('.hero-portrait img')).toHaveCount(1)
  await expect(page.locator('.hero-portrait .frame-flourish')).toHaveCount(0)
  await expect(page.locator('video[autoplay]')).toHaveCount(0)
  await page.evaluate(() => {
    document.querySelectorAll('[data-reveal]').forEach(element => element.classList.add('is-visible'))
    window.scrollTo({ top: 0, behavior: 'instant' })
  })
  await page.screenshot({ path: `test-results/${testInfo.project.name}-full-page.png`, fullPage: true, animations: 'disabled' })
  await page.screenshot({ path: `test-results/${testInfo.project.name}-hero.png`, animations: 'disabled' })
  expect(errors).toEqual([])
})

test('six passions follow the bio, form the responsive grid, and respond to the pointer', async ({ page }, testInfo) => {
  await page.goto('./')
  await expect(page.locator('main > section').first()).toHaveAttribute('id', 'passions')
  await expect(page.locator('.story-link')).toHaveAttribute('href', '#passions')
  await expect(page.locator('.passion-tile')).toHaveCount(6)
  const tiles = page.locator('.passion-tile')
  await tiles.first().scrollIntoViewIfNeeded()
  await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-visible')))
  await page.waitForTimeout(850)
  const columns = await page.locator('.passions-grid').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length)
  expect(columns).toBe(['desktop', 'tablet'].includes(testInfo.project.name) ? 2 : 1)
  await expect(page.locator('.passions-grid > .passion-tile > .frame')).toHaveCount(6)
  await expect(page.locator('.passion-collecting img')).toHaveCount(1)
  await expect(page.locator('.passion-collecting img')).toHaveAttribute('src', /collection-detail/)
  await expect(page.locator('.chapter-number, .nav-number, .placeholder')).toHaveCount(0)
  await expect(page.locator('.passion-hosa img')).toHaveAttribute('src', /anatomy-team/)
  await expect(page.locator('.passion-musical img')).toHaveAttribute('src', /musical-team/)
  const media = tiles.first().locator('.passion-card')
  await media.hover({ position: { x: 30, y: 40 } })
  if (testInfo.project.name === 'desktop' || testInfo.project.name === 'tablet') {
    expect(await media.evaluate(el => (el as HTMLElement).style.getPropertyValue('--ry'))).not.toBe('')
    await expect.poll(() => media.evaluate(el => getComputedStyle(el).getPropertyValue('--lift').trim())).toBe('-9px')
    await page.mouse.move(5, 90)
    await expect.poll(() => media.evaluate(el => (el as HTMLElement).style.getPropertyValue('--ry'))).toBe('0deg')
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await media.hover()
    await expect(media).toHaveCSS('transform', 'none')
  } else {
    expect(await media.evaluate(el => (el as HTMLElement).style.getPropertyValue('--ry'))).toBe('')
    if (testInfo.project.name === 'reduced-motion') await expect(media).toHaveCSS('transform', 'none')
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  for (const photo of await page.locator('#passions img').all()) {
    await photo.scrollIntoViewIfNeeded()
    await expect.poll(() => photo.evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
      await photo.evaluate(img => (img as HTMLImageElement).decode())
  }
  await page.locator('#passions').screenshot({ path: `test-results/${testInfo.project.name}-passions.png`, animations: 'disabled', style: '.site-header, .skip-link { visibility: hidden; }' })
})

test('navigation, menu, keyboard focus, and every anchor work', async ({ page }, testInfo) => {
  await page.goto('./')
  await page.keyboard.press('Tab')
  await expect(page.locator('.skip-link')).toBeFocused()
  await expect(page.locator('.skip-link')).toBeInViewport()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#main$/)
  const mobile = await page.getByRole('button', { name: /menu/i }).isVisible()
  if (mobile) {
    await page.getByRole('button', { name: /menu/i }).click()
    await expect(page.locator('#chapter-nav')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', { name: /menu/i })).toBeFocused()
    await expect(page.locator('#chapter-nav')).toBeHidden()
  }
  await expect(page.locator('#chapter-nav a')).toHaveText(['Passion', 'Purpose', 'Adventure', 'Energy', 'Mentorship', 'Pitches'].map(label => new RegExp(label)))
  for (const id of chapterIds.filter(id => id !== 'sports')) {
    if (mobile) await page.getByRole('button', { name: /menu/i }).click()
    await page.locator(`nav a[href="#${id}"]`).click()
    await expect(page).toHaveURL(new RegExp(`#${id}$`))
    await expect.poll(async () => page.locator(`#${id}`).evaluate(el => Math.abs(el.getBoundingClientRect().top - 87) < 60), { timeout: 5000 }).toBe(true)
    if (mobile) await expect(page.locator('#chapter-nav')).toBeHidden()
  }
  const deadAnchors = await page.locator('a[href^="#"]').evaluateAll(links => links.filter(link => !document.getElementById(link.getAttribute('href')!.slice(1))).map(link => link.getAttribute('href')))
  expect(deadAnchors).toEqual([])
  expect(await page.locator('a[href^="#"]').evaluateAll(links => links.filter(link => /[↗↘↑]/.test(link.textContent || '')).length)).toBe(0)
  await page.getByText('Back to the beginning').click()
  await expect(page).toHaveURL(/#top$/)
})

test('WCAG AA checks pass across the updated sections', async ({ page }) => {
  await page.goto('./')
  await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(element => element.classList.add('is-visible')))
  await page.locator('#pitches').scrollIntoViewIfNeeded()
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(results.violations).toEqual([])
})

test('motion follows device and accessibility preferences', async ({ page }, testInfo) => {
  await page.goto('./')
  const frame = page.locator('.hero-portrait .frame')
  await frame.hover({ position: { x: 20, y: 20 } })
  if (testInfo.project.name === 'reduced-motion') {
    await expect(frame).toHaveCSS('transform', 'none')
    await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto')
    await expect(page.locator('.hero-portrait')).toHaveCSS('transform', 'none')
    await expect(page.locator('.will-reveal:not(.is-visible)')).toHaveCount(0)
  } else if (testInfo.project.name === 'mobile') {
    expect(await frame.evaluate(el => (el as HTMLElement).style.getPropertyValue('--rx'))).toBe('')
  } else {
    expect(await frame.evaluate(el => (el as HTMLElement).style.getPropertyValue('--rx'))).not.toBe('')
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(frame).toHaveCSS('transform', 'none')
    await expect(page.locator('.will-reveal:not(.is-visible)')).toHaveCount(0)
  }
})


test('responsive photo grids and moving identity bars follow the revised design', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Desktop breakpoint regression.')
  await page.goto('./')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const width of [600, 768, 900, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    const boxes = await page.locator('.passion-tile').evaluateAll(tiles => tiles.map(tile => ({ top: tile.getBoundingClientRect().top, left: tile.getBoundingClientRect().left })))
    expect(new Set(boxes.map(box => box.top)).size).toBe(3)
    expect(new Set(boxes.map(box => box.left)).size).toBe(2)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
  await page.setViewportSize({ width: 390, height: 844 })
  const squares = await page.locator('.food-collage .photo-surface').evaluateAll(photos => photos.map(photo => ({ width: photo.getBoundingClientRect().width, height: photo.getBoundingClientRect().height, left: photo.getBoundingClientRect().left })))
  expect(squares).toHaveLength(9)
  expect(new Set(squares.map(photo => photo.left)).size).toBe(3)
  squares.forEach(photo => expect(Math.abs(photo.width - photo.height)).toBeLessThan(1))
  await expect(page.locator('.passion-banner button')).toHaveCount(0)
  await expect(page.locator('.identity-banner')).toHaveAttribute('aria-label', /Oldest Child.*Foodie/)
  await expect(page.locator('.passion-banner:not(.identity-banner)')).toHaveAttribute('aria-label', /Beyblade Collector/)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  for (const track of await page.locator('.banner-track').all()) await expect(track).toHaveCSS('animation-play-state', 'running')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const track of await page.locator('.banner-track').all()) await expect(track).toHaveCSS('animation-name', 'none')
})

test('bio placement, scrolling photos, compact tutoring cards, and contact work', async ({ page }, testInfo) => {
  await page.goto('./')
  await expect(page.locator('.wordmark')).toHaveText('Apollo Lee.')
  await expect(page.locator('.bio-interests, .stat-mark, .pitch > p, .pitch-intro')).toHaveCount(0)
  await expect(page.locator('.contact-email')).toHaveAttribute('href', 'mailto:apollo.lee@duke.edu')
  const bio = await page.locator('.hero-bio').boundingBox()
  const portrait = await page.locator('.hero-portrait').boundingBox()
  if (['desktop', 'tablet'].includes(testInfo.project.name)) {
    expect(bio!.x + bio!.width).toBeLessThan(portrait!.x)
    expect(bio!.y).toBeLessThan(portrait!.y + portrait!.height)
  } else expect(bio!.y).toBeLessThan(portrait!.y)
  const gallery = page.locator('.gallery-window')
  await gallery.scrollIntoViewIfNeeded()
  await expect(page.locator('.scrolling-group').first().locator('.scrolling-photo')).toHaveCount(3)
  await expect(page.locator('.scrolling-gallery button')).toHaveCount(0)
  if (testInfo.project.name === 'reduced-motion') {
    await expect(page.locator('.scrolling-group[aria-hidden="true"]')).toBeHidden()
  } else {
    await expect(gallery).toHaveCSS('overflow-x', 'hidden')
    await gallery.hover()
    const start = await gallery.evaluate(el => el.scrollLeft)
    await expect.poll(() => gallery.evaluate(el => el.scrollLeft)).toBeGreaterThan(start + 10)
  }
  const cards = page.locator('.stat-card')
  await expect(cards).toHaveCount(3)
  for (const card of await cards.all()) {
    await card.scrollIntoViewIfNeeded()
    await expect(card.locator('h4')).toBeInViewport()
    expect(await card.locator('.stat-face').evaluate(el => el.getBoundingClientRect().height)).toBeLessThan(300)
  }
  const subjectSizes = await page.locator('.stat-subjects > span').evaluateAll(items => items.map(el => getComputedStyle(el).fontSize))
  expect(new Set(subjectSizes).size).toBe(1)
  await expect(page.locator('.stat-subjects')).not.toContainText('·')
  if (testInfo.project.name === 'reduced-motion') {
    await expect(cards.first()).toHaveCSS('position', 'relative')
    await expect(cards.first().locator('.stat-face')).toHaveCSS('transform', 'none')
  } else {
    await expect(cards.first()).toHaveCSS('position', 'sticky')
    await cards.nth(1).evaluate(el => window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - 210, behavior: 'instant' }))
    await expect.poll(() => cards.first().evaluate(el => el.getBoundingClientRect().top)).toBeLessThan(150)
    expect(await cards.first().evaluate(el => Number((el as HTMLElement).style.getPropertyValue('--card-scale')))).toBeLessThan(1)
    await page.screenshot({ path: `test-results/${testInfo.project.name}-tutoring-stack.png`, animations: 'disabled' })
  }
  const tinyText = await page.locator('body *').evaluateAll(elements => elements.filter(el => {
    if (el.closest('[aria-hidden="true"]') || !(el as HTMLElement).offsetWidth) return false
    return [...el.childNodes].some(node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) && parseFloat(getComputedStyle(el).fontSize) < 16
  }).map(el => el.textContent?.trim().slice(0, 70)))
  expect(tinyText).toEqual([])
  const sectionOrder = await page.locator('main > section').evaluateAll(items => items.map(el => el.id))
  expect(sectionOrder).toEqual(chapterIds)
  await expect(page.locator('#concert-band h2')).toHaveText('Growing upin Parkland.')
  await expect(page.locator('#concert-band .story-copy p').first()).toContainText('Growing up in Parkland my whole life')
  await expect(page.locator('#food .story-copy')).toContainText('never order the same thing twice')
  expect(await page.locator('main p').allTextContents()).not.toEqual(expect.arrayContaining([expect.stringContaining(';')]))
})
