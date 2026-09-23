import { chromium } from '@playwright/test'

const browser = await chromium.launch({ channel: 'chrome' })
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
  await page.setContent(`<!doctype html><html><head><style>
    *{box-sizing:border-box}body{margin:0;background:#1245d9;color:#f8faff;font-family:Arial,sans-serif;padding:55px 65px;overflow:hidden}
    header{display:flex;justify-content:space-between;font-size:15px;letter-spacing:1px;border-bottom:1px solid #718ff0;padding-bottom:25px}
    h1{font-size:155px;line-height:.88;letter-spacing:-10px;font-weight:500;margin:55px 0 25px}em{font-family:Georgia,serif;font-weight:400;color:#dce8ff}
    p{font-size:22px;line-height:1.5;max-width:530px;color:#dce8ff;margin-top:28px}.circle{position:absolute;width:470px;height:470px;border:1px solid #6a95ff;border-radius:50%;right:-70px;bottom:-70px}.circle::before,.circle::after{content:'';position:absolute;inset:55px;border:1px solid #6a95ff;border-radius:50%}.circle::after{inset:110px}footer{position:absolute;bottom:48px;font-size:15px;letter-spacing:1px}
    </style></head><body><header><span>OFF THE PAGE.</span><span>DUKE UNIVERSITY</span></header><h1>Apollo <em>Lee.</em></h1><p>Music. Teamwork. Curiosity.<br>And the people who make them mean more.</p><div class="circle"></div><footer>MATHEMATICS & STATISTICS</footer></body></html>`)
  await page.screenshot({ path: 'public/social-preview.png' })
} finally {
  await browser.close()
}
