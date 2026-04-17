module.exports = [
  // === ИГРОВЫЕ МЕДИАПОРТАЛЫ (RSS) ===
  // Tier 1 — обязательные крупнейшие
  { id: 'ign', name: 'IGN', url: 'https://feeds.feedburner.com/ign/all', type: 'rss', weight: 10, category: 'media' },
  { id: 'gamespot', name: 'GameSpot', url: 'https://www.gamespot.com/feeds/mashup/', type: 'rss', weight: 9, category: 'media' },
  { id: 'polygon', name: 'Polygon', url: 'https://www.polygon.com/rss/index.xml', type: 'rss', weight: 9, category: 'media', proxy: true },
  { id: 'eurogamer', name: 'Eurogamer', url: 'https://www.eurogamer.net/feed', type: 'rss', weight: 9, category: 'media' },
  { id: 'pcgamer', name: 'PC Gamer', url: 'https://www.pcgamer.com/rss/', type: 'rss', weight: 8, category: 'media' },
  { id: 'gamesradar', name: 'GamesRadar+', url: 'https://www.gamesradar.com/rss/', type: 'rss', weight: 8, category: 'media' },
  { id: 'theverge', name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', type: 'rss', weight: 8, category: 'media' },
  { id: 'vgc', name: 'VGC', url: 'https://www.videogameschronicle.com/feed', type: 'rss', weight: 9, category: 'media', proxy: true },
  { id: 'insider-gaming', name: 'Insider Gaming', url: 'https://insider-gaming.com/feed/', type: 'rss', weight: 10, category: 'media' },
  { id: 'destructoid', name: 'Destructoid', url: 'https://www.destructoid.com/feed/', type: 'rss', weight: 7, category: 'media' },
  { id: 'thegamer', name: 'TheGamer', url: 'https://www.thegamer.com/feed/', type: 'rss', weight: 7, category: 'media', proxy: true },
  { id: 'gamerant', name: 'Game Rant', url: 'https://gamerant.com/feed/', type: 'rss', weight: 7, category: 'media', proxy: true },
  { id: 'vg247', name: 'VG247', url: 'https://www.vg247.com/feed', type: 'rss', weight: 7, category: 'media' },
  { id: 'rps', name: 'Rock Paper Shotgun', url: 'https://www.rockpapershotgun.com/feed', type: 'rss', weight: 7, category: 'media' },
  { id: 'gematsu', name: 'Gematsu', url: 'https://www.gematsu.com/feed', type: 'rss', weight: 8, category: 'media', proxy: true },
  { id: 'gameinformer', name: 'Game Informer', url: 'https://www.gameinformer.com/news.xml', type: 'rss', weight: 8, category: 'media' },

  // Tier 2 — важные специализированные
  { id: 'arstechnica-gaming', name: 'Ars Technica Gaming', url: 'https://arstechnica.com/gaming/feed/', type: 'rss', weight: 7, category: 'media' },
  { id: 'escapist', name: 'The Escapist', url: 'https://www.escapistmagazine.com/feed/', type: 'rss', weight: 6, category: 'media' },
  { id: 'siliconera', name: 'Siliconera', url: 'https://www.siliconera.com/feed/', type: 'rss', weight: 7, category: 'media' },
  { id: 'rpgsite', name: 'RPG Site', url: 'https://www.rpgsite.net/feed', type: 'rss', weight: 6, category: 'media' },
  { id: 'shacknews', name: 'Shacknews', url: 'https://www.shacknews.com/feed/rss', type: 'rss', weight: 6, category: 'media' },
  { id: 'techraptor', name: 'TechRaptor', url: 'https://techraptor.net/feed', type: 'rss', weight: 5, category: 'media' },
  { id: 'wccftech-games', name: 'Wccftech Games', url: 'https://wccftech.com/topic/games/feed/', type: 'rss', weight: 6, category: 'media' },
  { id: 'guardian-games', name: 'The Guardian Games', url: 'https://www.theguardian.com/games/rss', type: 'rss', weight: 6, category: 'media' },
  { id: 'automaton-west', name: 'Automaton (JP→EN)', url: 'https://automaton-media.com/en/feed/', type: 'rss', weight: 6, category: 'media' },
  { id: 'noisy-pixel', name: 'Noisy Pixel', url: 'https://noisypixel.net/feed/', type: 'rss', weight: 5, category: 'media' },
  { id: 'nintendo-everything', name: 'Nintendo Everything', url: 'https://nintendoeverything.com/feed/', type: 'rss', weight: 6, category: 'media' },
  { id: 'playstation-lifestyle', name: 'PlayStation LifeStyle', url: 'https://www.playstationlifestyle.net/feed/', type: 'rss', weight: 5, category: 'media' },
  { id: 'thexboxhub', name: 'TheXboxHub', url: 'https://www.thexboxhub.com/feed/', type: 'rss', weight: 5, category: 'media' },
  { id: 'time-extension', name: 'Time Extension (Retro)', url: 'https://www.timeextension.com/feeds/latest', type: 'rss', weight: 4, category: 'media', proxy: true },
  { id: 'dualshockers', name: 'DualShockers', url: 'https://www.dualshockers.com/feed/', type: 'rss', weight: 5, category: 'media', proxy: true },
  { id: 'thesixthaxis', name: 'TheSixthAxis', url: 'https://www.thesixthaxis.com/feed/', type: 'rss', weight: 5, category: 'media', proxy: true },

  // Tier 3 — нишевые
  { id: 'pcgamesn', name: 'PCGamesN', url: 'https://www.pcgamesn.com/mainrss.xml', type: 'rss', weight: 6, category: 'media', proxy: true },
  { id: 'dsogaming', name: 'DSOGaming', url: 'https://www.dsogaming.com/feed/', type: 'rss', weight: 5, category: 'media' },
  { id: 'mp1st', name: 'MP1st (Multiplayer)', url: 'https://mp1st.com/feed', type: 'rss', weight: 5, category: 'media' },
  { id: 'charlieintel', name: 'CharlieIntel (CoD)', url: 'https://charlieintel.com/feed/', type: 'rss', weight: 7, category: 'media' },
  { id: 'dexerto', name: 'Dexerto', url: 'https://www.dexerto.com/feed/', type: 'rss', weight: 7, category: 'media' },
  { id: 'dotesports', name: 'Dot Esports', url: 'https://dotesports.com/feed', type: 'rss', weight: 7, category: 'media' },
  { id: 'gamingbolt', name: 'GamingBolt', url: 'https://gamingbolt.com/feed', type: 'rss', weight: 4, category: 'media' },
  { id: 'videogamer', name: 'VideoGamer (UK)', url: 'https://www.videogamer.com/feed/', type: 'rss', weight: 5, category: 'media' },
  { id: 'nichegamer', name: 'Niche Gamer', url: 'https://nichegamer.com/feed/', type: 'rss', weight: 4, category: 'media', proxy: true },
  { id: 'massivelyop', name: 'Massively Overpowered (MMO)', url: 'https://massivelyop.com/feed/', type: 'rss', weight: 5, category: 'media' },
  { id: 'n4g', name: 'N4G aggregator', url: 'https://n4g.com/rss/news', type: 'rss', weight: 3, category: 'media', proxy: true },

  // === БИЗНЕС / АНАЛИТИКА ===
  { id: 'gamesindustry', name: 'GamesIndustry.biz', url: 'https://www.gamesindustry.biz/feed', type: 'rss', weight: 8, category: 'business' },
  { id: 'forbes-games', name: 'Forbes Gaming', url: 'https://www.forbes.com/gaming/feed/', type: 'rss', weight: 7, category: 'business' },
  { id: 'gamedeveloper', name: 'Game Developer', url: 'https://www.gamedeveloper.com/rss.xml', type: 'rss', weight: 8, category: 'business', proxy: true },
  { id: 'naavik', name: 'Naavik (gaming biz)', url: 'https://naavik.substack.com/feed', type: 'rss', weight: 8, category: 'business' },
  { id: 'matthew-ball', name: 'Matthew Ball Essays', url: 'https://www.matthewball.co/all?format=rss', type: 'rss', weight: 7, category: 'business' },

  // === ПЛАТФОРМО-СПЕЦИФИЧЕСКИЕ ===
  { id: 'pushsquare', name: 'Push Square', url: 'https://www.pushsquare.com/feeds/latest', type: 'rss', weight: 9, category: 'platform' },
  { id: 'purexbox', name: 'Pure Xbox', url: 'https://www.purexbox.com/feeds/latest', type: 'rss', weight: 7, category: 'platform' },
  { id: 'nintendolife', name: 'Nintendo Life', url: 'https://www.nintendolife.com/feeds/latest', type: 'rss', weight: 7, category: 'platform' },

  // === ОФИЦИАЛЬНЫЕ БЛОГИ ===
  { id: 'psblog', name: 'PlayStation Blog', url: 'https://blog.playstation.com/feed/', type: 'rss', weight: 10, category: 'official' },
  { id: 'xboxwire', name: 'Xbox Wire', url: 'https://news.xbox.com/en-us/feed/', type: 'rss', weight: 8, category: 'official' },

  // === ПАБЛИШЕРЫ ===
  // Ubisoft news.ubisoft.com — SPA без RSS, проксируем через Google News.
  { id: 'ubisoft', name: 'Ubisoft (via Google News)', url: 'https://news.google.com/rss/search?q=site:news.ubisoft.com&hl=en-US&gl=US&ceid=US:en', type: 'rss', weight: 7, category: 'publisher' },

  // === ИНСАЙДЕРЫ ===
  // Nitter: единственный живой публичный mirror (nitter.net).
  { id: 'kepler-l2', name: 'Kepler_L2 (chip leaks)', url: 'https://nitter.net/Kepler_L2/rss', type: 'rss', weight: 9, category: 'insider', proxy: true },
  { id: 'xboxera', name: 'XboxEra (Shpeshal Nick)', url: 'https://www.xboxera.com/feed/', type: 'rss', weight: 8, category: 'insider' },

  // === ПОДКАСТЫ (insider category — даёт +6 в скорере) ===
  { id: 'podcast-natethehate', name: 'NateTheHate Podcast', url: 'https://feeds.buzzsprout.com/929602.rss', type: 'rss', weight: 8, category: 'insider' },
  { id: 'podcast-sacred-symbols', name: 'Sacred Symbols PS Podcast', url: 'https://feeds.megaphone.fm/STU5682506591', type: 'rss', weight: 8, category: 'insider' },
  { id: 'podcast-triple-click', name: 'Triple Click (Schreier)', url: 'https://feeds.simplecast.com/6WD3bDj7', type: 'rss', weight: 8, category: 'insider' },
  { id: 'podcast-xb2', name: 'XB2 Xbox Podcast (Jez Corden)', url: 'https://feeds.megaphone.fm/NSR2628308212', type: 'rss', weight: 8, category: 'insider' },
  { id: 'podcast-kindafunny', name: 'Kinda Funny Gamescast', url: 'https://feeds.megaphone.fm/ROOSTER3727935380', type: 'rss', weight: 7, category: 'insider' },
  { id: 'podcast-friends-per-sec', name: 'Friends Per Second', url: 'https://feeds.megaphone.fm/ACECREATORSPTYLTD8634310989', type: 'rss', weight: 7, category: 'insider' },
  { id: 'podcast-minnmax', name: 'MinnMax Show', url: 'https://pinecast.com/feed/the-minnmax-show', type: 'rss', weight: 7, category: 'insider' },
  { id: 'podcast-ign-unlocked', name: 'Xbox Unlocked (IGN)', url: 'https://rss.pdrl.fm/6e460d/feeds.megaphone.fm/ignunlocked', type: 'rss', weight: 7, category: 'insider' },
  { id: 'podcast-ign-beyond', name: 'IGN Podcast Beyond (PS)', url: 'https://feeds.feedburner.com/ignfeeds/podcasts/beyond', type: 'rss', weight: 6, category: 'insider' },
  { id: 'podcast-ign-nvc', name: 'Nintendo Voice Chat (IGN)', url: 'https://rss.pdrl.fm/52ee62/feeds.megaphone.fm/nvc', type: 'rss', weight: 6, category: 'insider' },
  { id: 'podcast-besties', name: 'The Besties (Polygon)', url: 'https://feeds.simplecast.com/Urk3897_', type: 'rss', weight: 6, category: 'insider' },
  { id: 'podcast-gameinformer', name: 'Game Informer Show', url: 'https://www.spreaker.com/show/6639255/episodes/feed', type: 'rss', weight: 6, category: 'insider' },

  // === REDDIT (community category — даёт +2) ===
  { id: 'reddit-leaks', name: 'r/GamingLeaksAndRumours', url: 'https://www.reddit.com/r/GamingLeaksAndRumours/hot.json', type: 'reddit', weight: 9, category: 'community' },
  { id: 'reddit-games', name: 'r/Games', url: 'https://www.reddit.com/r/Games/hot.json', type: 'reddit', weight: 9, category: 'community' },
  { id: 'reddit-pcgaming', name: 'r/pcgaming', url: 'https://www.reddit.com/r/pcgaming/hot.json', type: 'reddit', weight: 8, category: 'community' },
  { id: 'reddit-ps5', name: 'r/PS5', url: 'https://www.reddit.com/r/PS5/hot.json', type: 'reddit', weight: 8, category: 'community' },
  { id: 'reddit-switch', name: 'r/NintendoSwitch', url: 'https://www.reddit.com/r/NintendoSwitch/hot.json', type: 'reddit', weight: 7, category: 'community' },
  { id: 'reddit-xbox', name: 'r/XboxSeriesX', url: 'https://www.reddit.com/r/XboxSeriesX/hot.json', type: 'reddit', weight: 6, category: 'community' },
  { id: 'reddit-gamingnews', name: 'r/GamingNews', url: 'https://www.reddit.com/r/GamingNews/hot.json', type: 'reddit', weight: 6, category: 'community' },
  { id: 'reddit-patientgamers', name: 'r/patientgamers', url: 'https://www.reddit.com/r/patientgamers/hot.json', type: 'reddit', weight: 5, category: 'community' },
  { id: 'reddit-mmorpg', name: 'r/MMORPG', url: 'https://www.reddit.com/r/MMORPG/hot.json', type: 'reddit', weight: 4, category: 'community' },
  { id: 'reddit-jrpg', name: 'r/JRPG', url: 'https://www.reddit.com/r/JRPG/hot.json', type: 'reddit', weight: 5, category: 'community' },
  { id: 'reddit-indie', name: 'r/IndieGaming', url: 'https://www.reddit.com/r/IndieGaming/hot.json', type: 'reddit', weight: 5, category: 'community' },
  { id: 'reddit-eldenring', name: 'r/Eldenring', url: 'https://www.reddit.com/r/Eldenring/hot.json', type: 'reddit', weight: 5, category: 'community' },
  { id: 'reddit-cod', name: 'r/CallOfDuty', url: 'https://www.reddit.com/r/CallOfDuty/hot.json', type: 'reddit', weight: 5, category: 'community' },

  // === REDDIT — DEALS ===
  { id: 'reddit-ps5deals', name: 'r/PS5Deals', url: 'https://www.reddit.com/r/PS5Deals/hot.json', type: 'reddit', weight: 8, category: 'deals' },
  { id: 'reddit-gamedeals', name: 'r/GameDeals', url: 'https://www.reddit.com/r/GameDeals/hot.json', type: 'reddit', weight: 7, category: 'deals' },
  { id: 'reddit-switchdeals', name: 'r/SwitchDeals', url: 'https://www.reddit.com/r/SwitchDeals/hot.json', type: 'reddit', weight: 7, category: 'deals' },
  { id: 'reddit-xboxonedeals', name: 'r/XboxOneDeals', url: 'https://www.reddit.com/r/XboxOneDeals/hot.json', type: 'reddit', weight: 6, category: 'deals' },

  // === ИНДИ ===
  { id: 'itchio', name: 'itch.io devlogs', url: 'https://itch.io/feed/new.xml', type: 'rss', weight: 7, category: 'media' },
  { id: 'alphabetagamer', name: 'Alpha Beta Gamer', url: 'https://www.alphabetagamer.com/feed/', type: 'rss', weight: 5, category: 'media' },
  { id: 'toucharcade', name: 'TouchArcade (mobile)', url: 'https://toucharcade.com/feed/', type: 'rss', weight: 4, category: 'media' },
  { id: 'pocketgamer', name: 'Pocket Gamer (mobile)', url: 'https://www.pocketgamer.com/rss/', type: 'rss', weight: 4, category: 'media' },

  // === ESPORTS ===
  { id: 'esports-insider', name: 'Esports Insider (biz)', url: 'https://esportsinsider.com/feed', type: 'rss', weight: 5, category: 'media' },
  { id: 'upcomer', name: 'Upcomer', url: 'https://upcomer.com/feed', type: 'rss', weight: 5, category: 'media' },

  // === TELEGRAM (публичное web-превью) ===
  { id: 'tg-psprices', name: 'PSPrices RU', url: 'https://t.me/s/psprices_ru_ps4', type: 'telegram', weight: 8, category: 'deals' },
  { id: 'tg-smartplay', name: 'SmartPlay PS', url: 'https://t.me/s/smartplay_ps', type: 'telegram', weight: 7, category: 'deals' },
  { id: 'tg-panstore', name: 'PanStore', url: 'https://t.me/s/panstore_ps', type: 'telegram', weight: 7, category: 'deals' },
  { id: 'tg-psstore', name: 'PlayStation Store', url: 'https://t.me/s/PIayStationStore', type: 'telegram', weight: 6, category: 'deals' },
];
