// Источники игровых новостей (RSS/Atom)
module.exports = [
  {
    name: 'PlayStation Blog',
    url: 'https://blog.playstation.com/feed/',
    lang: 'en',
    weight: 1.5,       // Множитель приоритета
    category: 'official',
  },
  {
    name: 'Xbox Wire',
    url: 'https://news.xbox.com/en-us/feed/',
    lang: 'en',
    weight: 1.3,
    category: 'official',
  },
  {
    name: 'IGN',
    url: 'https://feeds.feedburner.com/ign/all',
    lang: 'en',
    weight: 1.2,
    category: 'media',
  },
  {
    name: 'Eurogamer',
    url: 'https://www.eurogamer.net/feed',
    lang: 'en',
    weight: 1.1,
    category: 'media',
  },
  {
    name: 'VGC',
    url: 'https://www.videogameschronicle.com/feed',
    lang: 'en',
    weight: 1.2,
    category: 'media',
  },
  {
    name: 'Push Square',
    url: 'https://www.pushsquare.com/feeds/latest',
    lang: 'en',
    weight: 1.1,
    category: 'media',
  },
  {
    name: 'GamesRadar',
    url: 'https://www.gamesradar.com/rss/',
    lang: 'en',
    weight: 1.0,
    category: 'media',
  },
  {
    name: 'Kotaku',
    url: 'https://kotaku.com/rss',
    lang: 'en',
    weight: 1.0,
    category: 'media',
  },
  {
    name: 'PC Gamer',
    url: 'https://www.pcgamer.com/rss/',
    lang: 'en',
    weight: 0.9,
    category: 'media',
  },
  {
    name: 'The Verge Gaming',
    url: 'https://www.theverge.com/rss/games/index.xml',
    lang: 'en',
    weight: 0.8,
    category: 'media',
  },
];
