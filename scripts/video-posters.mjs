// Capture actual frames from the web video copies. Run while npm run dev is active.
import { chromium } from '@playwright/test'
import { writeFileSync } from 'node:fs'

const browser = await chromium.launch({ channel: 'chrome' })
try {
  const page = await browser.newPage()
  await page.goto('http://127.0.0.1:5173/Personal-Website/')
  for (const [filename, selector] of [
    ['sports/bench-225', '#passions video'],
    ['sports/flag-football', '#sports video'],
    ['concert-band/parkland-solo', '#concert-band video'],
    ['duke-marching-band/band-room', '#duke-marching-band video'],
  ]) {
    const player = page.locator(selector)
    await player.waitFor()
    const frame = await player.evaluate(async video => {
      video.preload = 'auto'
      video.load()
      await new Promise((resolve, reject) => {
        video.addEventListener('loadeddata', resolve, { once: true })
        video.addEventListener('error', () => reject(new Error('Video decoding failed')), { once: true })
      })
      video.currentTime = Math.min(2, video.duration / 3)
      await new Promise(resolve => video.addEventListener('seeked', resolve, { once: true }))
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      canvas.getContext('2d').drawImage(video, 0, 0)
      return { image: canvas.toDataURL('image/jpeg', .86).split(',')[1], width: canvas.width, height: canvas.height, duration: video.duration }
    })
    writeFileSync(`public/media/${filename}-poster.jpg`, Buffer.from(frame.image, 'base64'))
    console.log(`${filename}: ${frame.width}×${frame.height}, ${frame.duration.toFixed(1)} seconds`)
  }
} finally {
  await browser.close()
}
