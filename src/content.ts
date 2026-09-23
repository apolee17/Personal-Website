// Story copy and public media paths live here.
export type Photo = {
  path: string
  label: string
  alt: string
  caption: string
  ratio?: string
  position?: string
  fit?: 'cover' | 'contain'
}
export type Film = { path: string; poster: string; title: string; caption: string; captions?: string }
export type Chapter = {
  id: string
  label: string
  nav: string
  title: string
  accent: string
  paragraphs: string[]
  photos: Photo[]
}
export const site = {
  name: 'Apollo Lee',
  eyebrow: 'A little about me.',
  university: 'Duke University',
  discipline: 'Mathematics & Statistics',
  email: 'apollo.lee@duke.edu',
  bio: 'I’m Apollo, a Mathematics and Statistics student at Duke, raised in Parkland, Florida. I’m happiest when I have something to work toward and people to share it with. That shows up in the music I play, the teams I lead, the students I teach, and whatever I order next. That same curiosity, love of numbers, and instinct to connect with people are shaping what I hope to pursue in finance.',
  hero: {
    path: 'media/hero/portrait.jpg', label: 'Apollo Lee',
    alt: 'Apollo Lee smiling in a navy suit and burgundy tie',
    caption: 'Apollo Lee', ratio: '4 / 5', position: '50% 40%',
  } satisfies Photo,
  footer: 'Apollo Lee · Duke University',
}
export type Passion = {
  id: string
  title: string
  description: string
  photo: Photo
  video?: Film
}
export const passions = {
  id: 'passions', label: 'Passion', nav: 'Passion',
  quote: 'You don’t love something because you’re good at it.',
  emphasis: 'You’re good at it because you love it.',
  intro: 'Loving the process keeps me showing up. Along the way, I’ve found people who push me, places I belong, and interests that have become a bigger part of my life.',
  items: [
    {
      id: 'lifting', title: 'Lifting With My Brother',
      description: 'On my 18th birthday, I benched 225 for the first time, with my little brother spotting me. A goal I’d worked toward for a long time became a moment we got to share.',
      photo: { path: 'media/sports/bench-225-poster.jpg', label: 'A Shared Milestone', alt: 'Apollo bench pressing 225 pounds on his 18th birthday, with his younger brother spotting him', caption: 'A Shared Milestone', ratio: '4 / 3', fit: 'contain' },
      video: { path: 'media/sports/bench-225.mp4', poster: 'media/sports/bench-225-poster.jpg', title: 'My First 225-Pound Bench Press', caption: 'My Brother Had My Back' },
    },
    {
      id: 'statistics', title: 'State Statistics Champions',
      description: 'Our team after winning the state statistics competition. A moment we worked hard for, made better by the people I got to share it with.',
      photo: { path: 'media/math-hosa/state-statistics.jpg', label: 'A Win We Built Together', alt: 'Apollo and three statistics teammates wearing medals and holding their state championship trophy', caption: 'State Statistics Champions', ratio: '4 / 3', position: '50% 32%' },
    },
    {
      id: 'collecting', title: 'Beyblade Collecting & Competing',
      description: 'A growing collection, local tournaments, and one more launch to get right. Nostalgia brings me back. The practice and time with family and friends keep me here.',
      photo: { path: 'media/beyblades/collection-detail.jpg', label: 'Still Collecting', alt: 'Apollo’s Beyblade collection arranged across a tabletop', caption: 'Collecting, Competing, Reconnecting', ratio: '4 / 3' },
    },
    {
      id: 'percussion', title: 'Percussion & Section Leadership',
      description: 'Becoming my high school’s youngest-ever percussion section leader started with loving the music. It grew into caring just as much about the people playing beside me.',
      photo: { path: 'media/concert-band/concert-performance.jpg', label: 'More Than My Own Part', alt: 'Apollo holding mallets behind a percussion instrument at his high school concert', caption: 'On Stage at My High School Concert', ratio: '4 / 3', position: '50% 40%' },
    },
    {
      id: 'musical', title: 'Our State Award-Winning Musical',
      description: 'A state award-winning musical introduced me to another side of the performing arts. New roles, new people, and the same love of making something together.',
      photo: { path: 'media/concert-band/musical-team.jpg', label: 'A Shared Stage', alt: 'Apollo and fellow musicians posing with their instruments on the stairs of the musical’s stage set', caption: 'Our State Award-Winning Musical', ratio: '4 / 3', fit: 'contain' },
    },
    {
      id: 'hosa', title: 'HOSA Anatomy: Third Internationally',
      description: 'Our anatomy team placed third internationally at HOSA. I loved learning the material, but working toward something together and celebrating with these three gave it a different kind of meaning.',
      photo: { path: 'media/math-hosa/anatomy-team.jpg', label: 'A Result Worth Sharing', alt: 'Apollo and his three HOSA anatomy teammates celebrating their international third-place medals', caption: 'Third Internationally in HOSA Anatomy', ratio: '4 / 3' },
    },
  ] satisfies Passion[],
}
export const chapters: Chapter[] = [
  {
    id: 'concert-band', label: 'Purpose', nav: 'Purpose',
    title: 'Growing up', accent: 'in Parkland.',
    paragraphs: [
      'Growing up in Parkland my whole life, I felt deeply connected to the people and places around me. When the tragedy at Marjory Stoneman Douglas High School shook the community I had grown so close to, I was part of its journey through grief and remembrance. Being there for one another gave me a lasting sense of what it means to give back to the place that raised me.',
      'My community helped turn music into both an outlet and a passion. The rehearsal room gave me somewhere to put my energy and people to work through things with. Over time, that connection grew into three Florida All-State selections, twelve superior ratings on percussion solos, and the responsibility of leading my section.',
      'As that passion grew, music became my way of giving back. I played in the 2021 Florida All-State band’s remembrance piece and performed a televised solo in a dedication connected to the tragedy. Through those performances, I could help honor the people we lost and support the community that had always supported me. That is still the part of music that means the most to me: sharing something I love in service of other people.',
    ],
    photos: [{ path: 'media/concert-band/parkland-tribute.jpg', label: 'Remembering Together', alt: 'A floral tribute in front of the Marjory Stoneman Douglas High School sign', caption: 'Remembering Together · Parkland, Florida', ratio: '16 / 9', fit: 'contain' }],
  },
  {
    id: 'duke-marching-band', label: 'Energy', nav: 'Energy',
    title: 'The energy', accent: 'carries over.',
    paragraphs: [
      'Marching band brings together so much of what I love: music, sports, and the feeling of a crowd coming alive. Some of my favorite high school memories are as simple as playing and dancing with friends in the band room. That joy is a big part of why I kept going.',
      'At Duke, I get to bring that same energy to the stands and the field. Traveling to El Paso for the Sun Bowl, wearing the uniform, and playing alongside my friends have made a new campus feel like home. I love how a section has to listen to each other while also reaching the audience. It keeps me attentive to the people around me, and reminds me that enthusiasm is something you can share.',
    ],
    photos: [{ path: 'media/duke-marching-band/el-paso.jpg', label: 'On the Road With Duke', alt: 'Apollo and a Duke marching band friend in uniform with their drums outside the Sun Bowl stadium in El Paso', caption: 'On the Road With Duke · El Paso, Texas', ratio: '4 / 5' }],
  },
  {
    id: 'sports', label: 'Sports & leadership', nav: 'Sports',
    title: 'Always better', accent: 'as a team.',
    paragraphs: [
      'Staying active is a huge part of my life. Soccer, flag football, and lifting give me something to work toward and a reason to keep showing up for other people. Captaining a nationally competitive soccer team taught me that leadership starts with the example you set, especially when a game isn’t going your way.',
      'In flag football, helping lead my teams to Parkland City League Super Bowls for three years meant building trust, staying composed, and knowing when someone else needed encouragement. I love the quick decisions and shared energy of the game. A highlight lasts a few seconds, but it takes a whole team to make it happen.',
    ],
    photos: [{ path: 'media/sports/soccer-team.jpg', label: 'The Team Behind the Captain', alt: 'Apollo and his soccer teammates in red uniforms posing together on the field', caption: 'The Team Behind the Captain', ratio: '16 / 9', fit: 'contain' }],
  },
  {
    id: 'scale-coin', label: 'Mentorship', nav: 'Mentorship',
    title: 'Scale & Coin.', accent: 'Learning, then teaching.',
    paragraphs: [
      'I came to Duke planning on premed, with little experience in business. After my first Scale & Coin application ended in a rejection, I kept learning, meeting people, and exploring that interest. By spring 2026, I was celebrating initiation with a community that had given me so much.',
      'This fall, I’m giving back as New Member Education Chair. Having just gone through the process, I want to help the next class learn, feel supported, and find their place. It’s the same passion for teaching that led me to start Apollo Tutoring.',
    ],
    photos: [
      { path: 'media/scale-coin/initiation-chapel.jpg', label: 'Where It Began', alt: 'Apollo and his Scale & Coin initiation class in front of Duke Chapel at sunset', caption: 'Spring 2026 · Initiation With My Class', ratio: '16 / 9' },
      { path: 'media/scale-coin/initiation-night.jpg', label: 'The People Who Made It', alt: 'Apollo’s Scale & Coin initiation group on the steps at night', caption: 'A Night Worth Remembering', ratio: '16 / 9' },
      { path: 'media/scale-coin/initiation-friends.jpg', label: 'Between the Photos', alt: 'Apollo and Scale & Coin friends talking outside Duke Chapel during initiation', caption: 'The Moments in Between', ratio: '16 / 9' },
      { path: 'media/scale-coin/fall-2026.jpg', label: 'The Next Chapter, Together', alt: 'Apollo with the Scale & Coin group in fall 2026, standing together outside at night', caption: 'Fall 2026 · New Member Education Chair', ratio: '4 / 3', fit: 'contain' },
    ],
  },
]
const foodAlts = [
  'A wooden sushi boat filled with colorful rolls and flowers',
  'Platters of salmon and tuna nigiri',
  'A rice dish topped with meat, vegetables, and sliced peppers',
  'Salmon, tuna, and other sashimi arranged over ice in a wooden bowl',
  'A single piece of sushi on a textured ceramic plate',
  'Shaved ice topped with fruit and a swirl of purple cream',
  'A crisp soft-shell crab dish with greens and sauce',
  'A table filled with fruit, chocolate, and colorful desserts',
  'Seared scallops with greens and a vivid purple purée',
]
export const food: Chapter = {
  id: 'food', label: 'Adventure', nav: 'Adventure',
  title: 'A different order.', accent: 'Every time.',
  paragraphs: [
    'I have one restaurant rule: never order the same thing twice. I’m always looking for the most unusual, interesting thing on the menu, especially if I don’t quite know what to expect. It’s a small way to stay curious, whether I’m close to home or somewhere completely new.',
  ],
  photos: foodAlts.map((alt, index) => ({ path: `media/food/discovery-${String(index + 1).padStart(2, '0')}.jpg`, label: 'Something New at the Table', alt, caption: '', ratio: '1 / 1' })),
}
export const sportsVideo: Film = {
  path: 'media/sports/flag-football.mp4', poster: 'media/sports/flag-football-poster.jpg',
  title: 'Flag Football, in Motion', caption: 'Under the Lights · Parkland Flag Football',
}
export const parklandVideo: Film = {
  path: 'media/concert-band/parkland-solo.mp4', poster: 'media/concert-band/parkland-solo-poster.jpg',
  title: 'My Televised Parkland Dedication Solo', caption: 'Giving Back Through Music · A Televised Solo',
}
export const marchingVideo: Film = {
  path: 'media/duke-marching-band/band-room.mp4', poster: 'media/duke-marching-band/band-room-poster.jpg',
  title: 'Playing and Dancing With Friends in the Band Room', caption: 'Where the Energy Started · High School Band Room',
}
export const pitches = {
  id: 'pitches', label: 'Pitches', nav: 'Pitches',
  title: 'What I’ve', accent: 'pitched.',
  paragraphs: [
    'Finance brings together a lot of what you’ve read here. It rewards the curiosity that has me ordering something new every time, the love of numbers behind my math and statistics, and the patience of working through a hard idea until it makes sense. What I enjoy most is digging into a company or a market, building a view I can stand behind, and sharing it with the people around me. Here are two pitches I’ve worked on so far.',
  ],
  items: [
    { title: 'Doximity', pdf: 'media/pitches/doximity.pdf',
      preview: { path: 'media/pitches/doximity-preview.jpg', label: 'Doximity', alt: 'First slide of the Doximity equity pitch by Juhee Kim, Ollie Boesch, Apollo Lee, and Santi Lattuada', caption: 'Doximity · Equity Pitch', ratio: '16 / 9', fit: 'contain' } satisfies Photo },
    { title: 'Inflation Swap Trade', pdf: 'media/pitches/rates-trade.pdf',
      preview: { path: 'media/pitches/rates-trade-preview.jpg', label: 'The Inflation Curve', alt: 'Opening macro thesis slide of Apollo’s rates trade pitch', caption: 'Rates Trade · Inflation Curve', ratio: '16 / 9', fit: 'contain' } satisfies Photo },
  ],
}
export const navigation = [passions, chapters[0], food, chapters[1], chapters[3], pitches].map(({ id, label, nav }) => ({ id, label, nav }))
