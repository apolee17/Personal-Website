import { useEffect, useRef, useState, type ReactNode, type PointerEvent, type CSSProperties } from 'react'
import mediaPaths from 'virtual:media-manifest'
import { chapters, food, navigation, passions, pitches, site, sportsVideo, parklandVideo, marchingVideo, type Chapter, type Photo, type Passion, type Film } from './content'

const availableMedia = new Set(mediaPaths)
const mediaUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`
const hasMedia = (path: string) => availableMedia.has(path)

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? '↗' : '↘'}</span>
}

function Icon({ name = 'passions' }: { name?: string }) {
  const paths: Record<string, ReactNode> = {
    passions: <path d="m12 2 2.7 7.3L22 12l-7.3 2.7L12 22l-2.7-7.3L2 12l7.3-2.7Z" />,
    'concert-band': <><path d="M9 18V5l11-2v13M9 8l11-2" /><ellipse cx="6" cy="18" rx="3" ry="2" /><ellipse cx="17" cy="16" rx="3" ry="2" /></>,
    food: <><circle cx="12" cy="12" r="9" /><path d="m16 8-3 5-5 3 3-5Z" /></>,
    sports: <><path d="M7 3h10v6a5 5 0 0 1-10 0ZM7 5H3v3a4 4 0 0 0 4 4m10-7h4v3a4 4 0 0 1-4 4M12 14v6m-4 1h8" /></>,
    'duke-marching-band': <path d="m13 2-8 12h6l-1 8 9-13h-7Z" />,
    'scale-coin': <><path d="m2 8 10-5 10 5-10 5Zm4 2v7q6 5 12 0v-7m4-2v9" /></>,
    pitches: <><path d="M3 3v18h18M6 15l5-5 4 3 6-7m-5 0h5v5" /></>,
  }
  return <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.passions}</svg>
}

function usePointerDepth() {
  const element = useRef<HTMLDivElement>(null)
  function move(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== 'mouse' || !window.matchMedia('(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)').matches) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    element.current?.style.setProperty('--ry', `${(x - .5) * 7}deg`)
    element.current?.style.setProperty('--rx', `${(y - .5) * -7}deg`)
    element.current?.style.setProperty('--mx', `${x * 100}%`)
    element.current?.style.setProperty('--my', `${y * 100}%`)
  }
  function reset() {
    element.current?.style.setProperty('--ry', '0deg')
    element.current?.style.setProperty('--rx', '0deg')
  }
  return { element, move, reset }
}

function Frame({ children, className = '', interactive = true, flourish = true }: { children: ReactNode; className?: string; interactive?: boolean; flourish?: boolean }) {
  const { element, move, reset } = usePointerDepth()
  return <div className={`frame ${interactive ? 'interactive-frame' : ''} ${className}`} ref={element} onPointerMove={interactive ? move : undefined} onPointerLeave={interactive ? reset : undefined}>
    <span className="frame-layer layer-one" aria-hidden="true" />
    <span className="frame-layer layer-two" aria-hidden="true" />
    <span className="frame-layer layer-three" aria-hidden="true" />
    {flourish && <span className="frame-flourish" aria-hidden="true"><Icon /></span>}
    <div className="frame-content">{children}</div>
  </div>
}

function PhotoSurface({ photo, priority = false }: { photo: Photo; priority?: boolean }) {
  return <div className="photo-surface" style={{ aspectRatio: photo.ratio || '4 / 3' }}>
    <img src={mediaUrl(photo.path)} alt={photo.alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" style={{ objectPosition: photo.position || 'center', objectFit: photo.fit || 'cover' }} />
  </div>
}

function VideoPlayer({ film }: { film: Film }) {
  return <video controls playsInline preload="none" poster={mediaUrl(film.poster)} aria-label={film.title}>
    <source src={mediaUrl(film.path)} type="video/mp4" />
    {film.captions && hasMedia(film.captions) && <track kind="captions" src={mediaUrl(film.captions)} srcLang="en" label="English" default />}
    Your browser does not support embedded video. <a href={mediaUrl(film.path)}>Watch the video</a>.
  </video>
}

function PassionTile({ passion }: { passion: Passion }) {
  return <article className={`passion-tile passion-${passion.id}`} data-reveal>
    <Frame className="passion-card">
      <div className="passion-media">
        {passion.video ? <div className="passion-video"><VideoPlayer film={passion.video} /></div> : <PhotoSurface photo={passion.photo} />}
      </div>
      <div className="passion-caption"><span className="passion-icon"><Icon name={passion.id === 'lifting' ? 'sports' : passion.id === 'percussion' || passion.id === 'musical' ? 'concert-band' : passion.id === 'statistics' ? 'pitches' : passion.id === 'hosa' ? 'scale-coin' : 'passions'} /></span><h3>{passion.title}</h3><p>{passion.description}</p></div>
    </Frame>
  </article>
}

function Passions() {
  return <section className="chapter page-width passions-chapter" id={passions.id} aria-labelledby="passions-title">
    <ChapterLabel chapter={passions} />
    <div className="passions-intro" data-reveal>
      <blockquote><h2 id="passions-title">“{passions.quote}<br /><em>{passions.emphasis}</em>”</h2></blockquote>
      <p>{passions.intro}</p>
    </div>
    <div className="passions-grid">
      {passions.items.map(passion => <PassionTile key={passion.id} passion={passion} />)}
    </div>
  </section>
}

function PassionBanner({ intro = false }: { intro?: boolean }) {
  const words = intro
    ? ['Oldest Child', 'Percussionist', 'Team Captain', 'Foodie', 'Tutor', 'New Member Education Chair', 'Parkland → Duke']
    : ['Lifting With My Brother', 'Statistics Competitor', 'Beyblade Collector', 'Section Leader', 'Musical Performer', 'HOSA Teammate']
  return <div className={`passion-banner ${intro ? 'identity-banner' : ''}`} role="region" aria-label={words.join('. ')}>
    <div className="banner-window" aria-hidden="true"><div className="banner-track">
      {[0, 1].map(copy => <div className="banner-group" key={copy}>{words.map(word => <span key={word}>{word}<i>✳</i></span>)}</div>)}
    </div></div>
  </div>
}

function Sculpture({ className = '' }: { className?: string }) {
  return <div className={`sculpture ${className}`} aria-hidden="true"><i /><i /><i /><span /></div>
}

function ScrollingGallery({ photos }: { photos: Photo[] }) {
  const [still, setStill] = useState(false)
  const viewport = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let previous = 0
    const advance = (time: number) => {
      const element = viewport.current
      if (element && previous) {
        const groupWidth = element.querySelector<HTMLElement>('.scrolling-group')?.offsetWidth || 0
        element.scrollLeft += Math.min(time - previous, 50) * .045
        if (groupWidth && element.scrollLeft >= groupWidth) element.scrollLeft -= groupWidth
      }
      previous = time
      frame = requestAnimationFrame(advance)
    }
    const update = () => {
      cancelAnimationFrame(frame)
      previous = 0
      setStill(motion.matches)
      if (!motion.matches) frame = requestAnimationFrame(advance)
    }
    update()
    motion.addEventListener('change', update)
    return () => { cancelAnimationFrame(frame); motion.removeEventListener('change', update) }
  }, [])
  return <div className="scrolling-gallery" role="region" aria-label="Scale & Coin initiation photos">
    <div className="gallery-toolbar"><span><Icon name="scale-coin" /> A few moments, together.</span></div>
    <div className="gallery-window" ref={viewport} tabIndex={still ? 0 : undefined} aria-label={still ? 'Initiation photos. Scroll horizontally to explore.' : undefined}>
      <div className="scrolling-track">
        {[0, 1].map(copy => <div className="scrolling-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
          {photos.map(photo => <div className="scrolling-photo" key={photo.path}><Frame interactive={false}><figure><PhotoSurface photo={copy ? { ...photo, alt: '' } : photo} /><figcaption>{photo.caption}</figcaption></figure></Frame></div>)}
        </div>)}
      </div>
    </div>
  </div>
}

function Tutoring() {
  const stats = [
    { number: '20+', title: 'Students taught', detail: 'Through my own tutoring business.' },
    { number: '150-200', unit: 'points', title: 'Average SAT score increase', detail: 'Helping students turn preparation into progress.' },
    { number: 'ACT', title: 'The 3 subjects I teach', detail: 'Sharing a broad range of knowledge and my expertise across all three areas.', subjects: true },
  ]
  return <div className="tutoring" aria-labelledby="tutoring-title">
    <div className="tutoring-heading" data-reveal><h3 id="tutoring-title">Apollo <em>Tutoring</em></h3><p>I started Apollo Tutoring to help students build confidence in subjects I love. I help students prepare for the ACT, SAT, and Math Competitions, working through difficult ideas until they make sense.</p></div>
    <div className="tutoring-stack">
      {stats.map((stat, index) => <article className={`stat-card stat-card-${index + 1}`} key={stat.title} style={{ '--card-index': index } as CSSProperties}>
        <div className="stat-face">
          <p className={`stat-number ${stat.subjects ? 'stat-subjects' : ''}`}>{stat.subjects ? <><span>ACT,</span>{' '}<span>SAT, and</span>{' '}<span>Math Competitions</span></> : <>{stat.number}{stat.unit && <span>{stat.unit}</span>}</>}</p>
          <h4>{stat.title}</h4><p className="stat-description">{stat.detail}</p>
        </div>
      </article>)}
    </div>
  </div>
}

function Photograph({ photo, className = '', priority = false }: { photo: Photo; className?: string; priority?: boolean }) {
  return <div className={`photograph ${className}`} data-reveal>
    <Frame flourish={!priority}><figure><PhotoSurface photo={photo} priority={priority} />{!priority && photo.caption && <figcaption>{photo.caption}</figcaption>}</figure></Frame>
  </div>
}

function Collage({ photos, className = '' }: { photos: Photo[]; className?: string }) {
  return <div className={`collage ${className}`} data-reveal>
    <Frame><div className="collage-grid">
      {photos.map(photo => <figure key={photo.path}>
        <PhotoSurface photo={photo} />
          </figure>)}
    </div></Frame>
  </div>
}

function ChapterLabel({ chapter }: { chapter: Pick<Chapter, 'id' | 'label'> }) {
  return <div className="chapter-label"><a href={`#${chapter.id}`}><Icon name={chapter.id} /><span>{chapter.label}</span></a></div>
}

function ChapterTitle({ chapter }: { chapter: Pick<Chapter, 'id' | 'title' | 'accent'> }) {
  return <h2 id={`${chapter.id}-title`}>{chapter.title}<br /><em>{chapter.accent}</em></h2>
}

function Copy({ chapter }: { chapter: Pick<Chapter, 'paragraphs'> }) {
  return <div className="story-copy">{chapter.paragraphs.map(paragraph => <p key={paragraph.slice(0, 35)}>{paragraph}</p>)}</div>
}

function FilmFrame({ film, className = '' }: { film: Film; className?: string }) {
  return <div className={`story-film ${className}`} data-reveal>
    <Frame><figure><div className="video-surface"><VideoPlayer film={film} /></div><figcaption>{film.caption}</figcaption></figure></Frame>
  </div>
}

function Pitch({ pitch }: { pitch: typeof pitches.items[number] }) {
  return <article className="pitch" data-reveal>
    <a className="pitch-preview" href={mediaUrl(pitch.pdf)} target="_blank" rel="noopener noreferrer" aria-label={`Open ${pitch.title} pitch PDF in a new tab`}>
      <Frame><PhotoSurface photo={pitch.preview} /></Frame><span className="preview-open" aria-hidden="true">Read the pitch ↗</span>
    </a>
    <div className="pitch-heading"><h3>{pitch.title}</h3><a className="pdf-link" href={mediaUrl(pitch.pdf)} target="_blank" rel="noopener noreferrer" aria-label={`Read ${pitch.title} PDF in a new tab`}><Arrow diagonal /></a></div>
  </article>
}

function useStoryMotion() {
  const [active, setActive] = useState('')
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main > section[id]'))
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const revealElements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: .08 })
    if (!mediaQuery.matches) revealElements.forEach(element => {
      element.classList.add('will-reveal')
      observer.observe(element)
    })
    const hero = document.querySelector<HTMLElement>('.hero-portrait')
    const cards = Array.from(document.querySelectorAll<HTMLElement>('.stat-card'))
    let frame = 0
    const update = () => {
      frame = 0
      const current = sections.filter(section => section.getBoundingClientRect().top < window.innerHeight * .42).at(-1)
      setActive(current?.id || '')
      document.documentElement.style.setProperty('--reading-progress', String(window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)))
      if (hero) hero.style.setProperty('--parallax', mediaQuery.matches ? '0px' : `${Math.min(window.scrollY * .035, 20)}px`)
      const bounds = cards.map(card => card.getBoundingClientRect())
      cards.forEach((card, index) => {
        const entering = Math.max(0, Math.min(1, (bounds[index].top - 160) / (window.innerHeight * .8)))
        const next = bounds[index + 1]
        const covered = next ? Math.max(0, Math.min(1, 1 - (next.top - bounds[index].top) / bounds[index].height)) : 0
        card.style.setProperty('--card-tilt', mediaQuery.matches ? '0deg' : `${entering * 12}deg`)
        card.style.setProperty('--card-scale', mediaQuery.matches ? '1' : String(1 - covered * .045))
      })
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    const onMotionChange = () => {
      if (mediaQuery.matches) revealElements.forEach(element => element.classList.add('is-visible'))
      update()
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    mediaQuery.addEventListener('change', onMotionChange)
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      mediaQuery.removeEventListener('change', onMotionChange)
      cancelAnimationFrame(frame)
      revealElements.forEach(element => element.classList.remove('will-reveal'))
    }
  }, [])
  return active
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useStoryMotion()
  const menuButton = useRef<HTMLButtonElement>(null)
  const [concert, duke, sports, scale] = chapters

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false)
        menuButton.current?.focus()
      }
    }
    const outside = (event: MouseEvent) => { if (!(event.target as Element).closest('.site-header')) setMenuOpen(false) }
    document.addEventListener('keydown', close)
    document.addEventListener('click', outside)
    return () => { document.removeEventListener('keydown', close); document.removeEventListener('click', outside) }
  }, [menuOpen])

  return <>
    <a className="skip-link" href="#main">Skip to the story</a>
    <header className="site-header" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setMenuOpen(false) }}>
      <div className="header-inner">
        <a className="wordmark" href="#top" aria-label="Apollo Lee, back to top">Apollo Lee<span className="wordmark-dot" aria-hidden="true">.</span></a>
        <button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="chapter-nav" onClick={() => setMenuOpen(!menuOpen)} ref={menuButton}><span className="menu-lines" aria-hidden="true"><i /><i /><i /></span></button>
        <nav id="chapter-nav" className={menuOpen ? 'chapter-nav is-open' : 'chapter-nav'} aria-label="Website sections">
          {navigation.map(item => <a key={item.id} href={`#${item.id}`} aria-current={active === item.id || (active === 'sports' && item.id === 'passions') ? 'location' : undefined} onClick={() => { setMenuOpen(false); const target = document.getElementById(item.id); target?.setAttribute('tabindex', '-1'); target?.focus({ preventScroll: true }) }}><Icon name={item.id} /><span>{item.nav}</span></a>)}
        </nav>
      </div>
    </header>

    <main id="main">
      <div className="hero page-width" id="top">
        <div className="hero-topline"><span>{site.eyebrow}</span><span className="hero-location">{site.university}</span></div>
        <div className="hero-grid">
          <div className="hero-copy">
            <h1>Apollo<br /><span>Lee</span><span className="name-period" aria-hidden="true">.</span></h1>
            <p className="hero-discipline">{site.discipline}</p>
            <div className="bio-block"><p className="hero-bio">{site.bio}</p></div>
            <a className="story-link" href="#passions">For the love of it</a>
          </div>
          <div className="hero-portrait"><Sculpture className="hero-sculpture" /><Photograph photo={site.hero} priority /><span className="portrait-stamp" aria-hidden="true">PARKLAND, FL<br />DURHAM, NC</span></div>
        </div>

      </div>

      <PassionBanner intro />
      <Passions />
      <PassionBanner />

      <section className="chapter concert-chapter section-tone tone-dark" id={concert.id} aria-labelledby={`${concert.id}-title`}>
        <div className="page-width">
        <ChapterLabel chapter={concert} />
        <div className="chapter-intro" data-reveal><ChapterTitle chapter={concert} /><Copy chapter={concert} /></div>
        <div className="parkland-media"><Photograph photo={concert.photos[0]} /><FilmFrame film={parklandVideo} /></div>
        </div>
      </section>

      <section className="chapter page-width food-chapter" id={food.id} aria-labelledby={`${food.id}-title`}>
        <ChapterLabel chapter={food} />
        <div className="chapter-intro" data-reveal><ChapterTitle chapter={food} /><Copy chapter={food} /></div>
        <div className="food-display"><span className="food-stamp" aria-hidden="true">ALWAYS<br /><em>Something New</em></span><Collage photos={food.photos} className="food-collage" /></div>
      </section>

      <section className="chapter sports-chapter section-tone tone-gray" id={sports.id} aria-labelledby={`${sports.id}-title`}>
        <div className="page-width">
          <ChapterLabel chapter={sports} />
          <div className="chapter-intro" data-reveal><ChapterTitle chapter={sports} /><Copy chapter={sports} /></div>
          <div className="sports-gallery"><Photograph photo={sports.photos[0]} /><FilmFrame film={sportsVideo} /></div>
        </div>
      </section>

      <section className="chapter page-width duke-chapter" id={duke.id} aria-labelledby={`${duke.id}-title`}>
        <ChapterLabel chapter={duke} />
        <div className="chapter-intro" data-reveal><ChapterTitle chapter={duke} /><Copy chapter={duke} /></div>
        <div className="duke-gallery"><FilmFrame film={marchingVideo} /><Photograph photo={duke.photos[0]} /></div>
      </section>

      <section className="chapter scale-chapter section-tone tone-gray" id={scale.id} aria-labelledby={`${scale.id}-title`}>
        <div className="page-width">
        <ChapterLabel chapter={scale} />
        <div className="chapter-intro" data-reveal><ChapterTitle chapter={scale} /><Copy chapter={scale} /></div>
        <div className="mentorship-timeline">
          <h3 className="gallery-title">Spring 2026 · Training & initiation</h3>
          <ScrollingGallery photos={scale.photos.slice(0, 3)} />
          <h3 className="gallery-title">Fall 2026 · New Member Education Chair</h3>
          <div className="nme-gallery"><Photograph photo={scale.photos[3]} /></div>
        </div>
        <Tutoring />
        </div>
      </section>

      <section className="chapter pitches-chapter section-tone tone-dark" id={pitches.id} aria-labelledby={`${pitches.id}-title`}>
        <div className="page-width">
        <ChapterLabel chapter={pitches} />
        <div className="chapter-intro pitches-intro" data-reveal><ChapterTitle chapter={pitches} /><Copy chapter={pitches} /><Sculpture className="pitch-sculpture" /></div>
        <div className="pitches-grid">{pitches.items.map(pitch => <Pitch pitch={pitch} key={pitch.title} />)}</div>
        </div>
      </section>
    </main>

    <footer className="site-footer page-width" id="contact">
      <div className="contact-block"><div><span className="contact-label">Keep in touch</span><h2>Let’s <em>connect.</em></h2></div><a className="contact-email" href={`mailto:${site.email}`}>{site.email}<Arrow diagonal /></a></div>
      <div className="footer-bottom"><span>{site.footer}</span><a href="#top">Back to the beginning</a></div>
    </footer>
  </>
}
