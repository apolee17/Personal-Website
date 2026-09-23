import { defineConfig } from '@playwright/test'
import base from './playwright.config'

export default defineConfig({
  ...base,
  testMatch: 'site.spec.ts',
  grep: /all story sections/,
  outputDir: 'test-results/production',
  projects: [
    { name: 'production-mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    { name: 'production-desktop', use: { viewport: { width: 1280, height: 900 } } },
  ],
  use: { ...base.use, baseURL: 'http://127.0.0.1:4173/Personal-Website/' },
  webServer: {
    command: 'npm run preview -- --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173/Personal-Website/',
    reuseExistingServer: !process.env.CI,
  },
})
