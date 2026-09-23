# Apollo Lee — Passions & Purpose

A personal React + TypeScript + Vite website with Duke-blue accents, layered photo frames, moving text ribbons, and a story that runs from Parkland to life at Duke. All displayed media is supplied by Apollo. No image placeholders remain.

## Run locally

Use Node 22.12+ and npm.

```sh
npm ci
npm run dev
```

Open **http://127.0.0.1:5173/**. For the production bundle, run `npm run build`, then `npm run preview` and open **http://127.0.0.1:4173/**.

## Editing the story

Copy, captions, alt text, media paths, navigation, and the contact email live in `src/content.ts`. Components live in `src/App.tsx`, with responsive styling in `src/styles.css`.

The bio sits to the left of the portrait on desktop and above it on phones. An animated identity ribbon introduces the six-card passions grid. A second ribbon uses activities from those cards. Neither ribbon has a pause button, as requested. Both respect reduced-motion settings.

Story order:

1. Passions: lifting with a younger brother, statistics, Beyblades, percussion, musical theatre, and HOSA.
2. Growing up in Parkland: community, music as an outlet, and giving back, with the tribute photograph and televised solo.
3. Food: the never-order-the-same-thing-twice rule, with nine square photos in a 3×3 grid on every screen size.
4. Sports: soccer captaincy, flag football, and leadership.
5. Marching band: a high school band-room video and the Duke uniform photo.
6. Scale & Coin: three horizontally scrolling initiation photos, fall New Member Education Chair group, and compact Apollo Tutoring cards.
7. Pitches: clickable PDF previews with decorative frames and no summaries.
8. Contact: `apollo.lee@duke.edu`.

The passion grid has two columns from 600px up and one column below that. The initiation photos scroll horizontally, hold on hover or keyboard focus, and include a pause/resume control. Touch pauses automatic movement for manual swiping. Reduced-motion preferences show one static, scrollable set of the three photos. The three-line menu appears at every screen size with Passion, Purpose, Adventure, Energy, Mentorship, and Pitches. Story paragraphs fill the section width, with charcoal backgrounds alternating with white sections. Tutoring cards retain the scroll-stacking effect and become a static list for reduced-motion or short viewports. Decorative CSS sculptures and layered frames add depth without external assets.

## Media

Originals remain in `assets/`. Optimized public copies live in `public/media/`. The photo mapping is in `scripts/import-photos.py`. New media is connected as follows:

| Original | Placement |
| --- | --- |
| `IMG_8048 (1).jpeg` | Replacement horizontal musical photo |
| `images.jpeg` | Parkland tribute |
| `Screen Recording 2026-09-22 at 9.07.00 PM.mov` (filename uses a narrow space before PM) | Parkland televised solo |
| `IMG_0450`, `IMG_1524`, `IMG_2137`, `IMG_2208`, `IMG_2327`, `IMG_0448`, `IMG_1341`, `IMG_1914`, `IMG_2788` (`.jpeg`) | Nine food photos |
| `IMG_0834.jpeg` | Soccer team |
| `8d6b6674-ea3d-4f56-ba11-8b02e8efe044.mov` | High school band room |
| `IMG_0502.jpeg` | Duke marching band uniform |
| `IMG_2171.jpeg` | Beyblade collection, rotated horizontally with CSS |

The four videos retain their original audio, have native controls and actual-frame posters, and use `preload="none"`. None autoplays. Both pitch decks are unchanged supplied PDFs, with first-slide previews that open them in new tabs.

### Regenerating assets on macOS

`python3 scripts/import-photos.py` creates JPEG web copies with metadata stripped. Food images are capped at 1000px, other images at 1800px, and small originals are never upscaled. Use `--force` to regenerate existing copies.

`swift -module-cache-path /private/tmp/apollo-swift-cache scripts/prepare-pitches.swift` copies the PDFs and generates first-slide previews with PDFKit.

The MOVs are converted with the built-in macOS `avconvert`, using `Preset1280x720`, fast-start and default metadata filtering. For example:

```sh
avconvert --source assets/8d6b6674-ea3d-4f56-ba11-8b02e8efe044.mov --preset Preset1280x720 --output public/media/duke-marching-band/band-room.mp4 --replace
```

With the development server running, `npm run assets:posters` captures frames from all four videos using local Chrome. `npm run assets:social` regenerates the social preview. Rebuild before reviewing the production output.

## Verify

```sh
npm run build
npm run test:e2e
npm run test:e2e -- --config playwright.production.config.ts
```

Playwright uses installed Google Chrome to check mobile, tablet, desktop, and reduced-motion layouts. Checks cover real photo decoding, all four videos playing, PDF links and bytes, section order, navigation, keyboard controls, overflow, console/network errors, automated accessibility rules, the square food grid, continuously scrolling initiation photos, bio placement, tutoring cards, and the email link. Screenshots are written to `test-results/`.

The production configuration checks `dist/` at the root `/` base path. Build first.

## GitHub Pages over HTTPS

Repository: **https://github.com/apollolee29/apollolee29.github.io** (owned by the free `apollolee29` organization, which belongs to the `apolee17` account)

Live site: **https://apollolee29.github.io/**

The Vite base path defaults to **`/`** and automatically derives the repository name from `GITHUB_REPOSITORY` in Actions. User/organization repositories ending in `.github.io` use `/`. `VITE_BASE_PATH` can override this for other hosts. Canonical and Open Graph URLs in `index.html` target the repository above; update those if you change hosts. The default social image is a 1200×630 PNG in `public/social-preview.png` and the favicon is `public/favicon.svg`.

1. Authenticate Git to GitHub on this computer using GitHub's normal sign-in process. Do not paste access tokens into website source files or chat.
2. This workspace is already initialized on `main` with the supplied repository as `origin`; no commit or push has been made. Once authentication works, inspect the remote. If it already contains work, fetch and reconcile these files with its history before committing. If it is empty, configure your normal Git author identity, commit the site, and push `main`.
3. In the repository, open **Settings → Pages → Build and deployment**, and select **GitHub Actions** as the source. GitHub Pages availability for private repositories depends on the account plan.
4. The included `.github/workflows/deploy.yml` installs locked dependencies, builds, uploads `dist`, and deploys on pushes to `main`. You can also run **Deploy website to GitHub Pages** manually from the Actions tab after Pages is enabled.
5. Once the workflow succeeds, visit the HTTPS URL above. Keep **Enforce HTTPS** enabled in Pages settings. Verify the page and supplied media at that URL.

The deployment workflow only grants write permissions to the Pages deployment job. No secret is hardcoded; GitHub issues the workflow's temporary deployment credentials.

## Initial workspace audit

The supplied workspace was empty: no existing source, assets, package manifest, or Git history was available to preserve. This implementation created the standalone site from scratch. Remote inspection required GitHub credentials that were not available in the initial environment; deployment preparation must not be mistaken for a confirmed live deployment.
