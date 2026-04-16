module.exports = [
  // === ИГРОВЫЕ МЕДИАПОРТАЛЫ (RSS) ===
  { id: 'ign', name: 'IGN', url: 'https://feeds.feedburner.com/ign/all', type: 'rss', weight: 10, category: 'media' },
  { id: 'gamespot', name: 'GameSpot', url: 'https://www.gamespot.com/feeds/mashup/', type: 'rss', weight: 9, category: 'media' },
  { id: 'kotaku', name: 'Kotaku', url: 'https://kotaku.com/rss', type: 'rss', weight: 9, category: 'media' },
  { id: 'polygon', name: 'Polygon', url: 'https://www.polygon.com/rss/index.xml', type: 'rss', weight: 9, category: 'media' },
  { id: 'eurogamer', name: 'Eurogamer', url: 'https://www.eurogamer.net/feed', type: 'rss', weight: 9, category: 'media' },
  { id: 'pcgamer', name: 'PC Gamer', url: 'https://www.pcgamer.com/rss/', type: 'rss', weight: 8, category: 'media' },
  { id: 'gamesradar', name: 'GamesRadar+', url: 'https://www.gamesradar.com/rss/', type: 'rss', weight: 8, category: 'media' },
  { id: 'theverge', name: 'The Verge Gaming', url: 'https://www.theverge.com/games/rss/index.xml', type: 'rss', weight: 8, category: 'media' },
  { id: 'vgc', name: 'VGC', url: 'https://www.videogameschronicle.com/feed', type: 'rss', weight: 9, category: 'media' },
  { id: 'insidergaming', name: 'Insider Gaming', url: 'https://insidergaming.com/feed', type: 'rss', weight: 10, category: 'media' },
  { id: 'destructoid', name: 'Destructoid', url: 'https://www.destructoid.com/feed/', type: 'rss', weight: 7, category: 'media' },
  { id: 'thegamer', name: 'TheGamer', url: 'https://www.thegamer.com/feed/', type: 'rss', weight: 7, category: 'media' },
  { id: 'gamerant', name: 'Game Rant', url: 'https://gamerant.com/feed/', type: 'rss', weight: 7, category: 'media' },
  { id: 'vg247', name: 'VG247', url: 'https://www.vg247.com/feed', type: 'rss', weight: 7, category: 'media' },
  { id: 'rps', name: 'Rock Paper Shotgun', url: 'https://www.rockpapershotgun.com/feed', type: 'rss', weight: 7, category: 'media' },
  { id: 'gematsu', name: 'Gematsu', url: 'https://www.gematsu.com/feed', type: 'rss', weight: 8, category: 'media' },
  { id: 'giantbomb', name: 'Giant Bomb', url: 'https://www.giantbomb.com/feeds/mashup/', type: 'rss', weight: 7, category: 'media' },
  { id: 'gamesindustry', name: 'GamesIndustry.biz', url: 'https://www.gamesindustry.biz/feed', type: 'rss', weight: 8, category: 'business' },

  // === ПЛАТФОРМО-СПЕЦИФИЧЕСКИЕ ===
  { id: 'pushsquare', name: 'Push Square', url: 'https://www.pushsquare.com/feeds/latest', type: 'rss', weight: 9, category: 'platform' },
  { id: 'purexbox', name: 'Pure Xbox', url: 'https://www.purexbox.com/feeds/latest', type: 'rss', weight: 7, category: 'platform' },
  { id: 'nintendolife', name: 'Nintendo Life', url: 'https://www.nintendolife.com/feeds/latest', type: 'rss', weight: 7, category: 'platform' },

  // === ОФИЦИАЛЬНЫЕ БЛОГИ ===
  { id: 'psblog', name: 'PlayStation Blog', url: 'https://blog.playstation.com/feed/', type: 'rss', weight: 10, category: 'official' },
  { id: 'xboxwire', name: 'Xbox Wire', url: 'https://news.xbox.com/en-us/feed/', type: 'rss', weight: 8, category: 'official' },

  // === ПАБЛИШЕРЫ ===
  { id: 'ea', name: 'EA News', url: 'https://www.ea.com/en-gb/news/feed', type: 'rss', weight: 8, category: 'publisher' },
  { id: 'ubisoft', name: 'Ubisoft News', url: 'https://news.ubisoft.com/en-us/feed/', type: 'rss', weight: 7, category: 'publisher' },
  { id: 'bethesda', name: 'Bethesda', url: 'https://bethesda.net/en/news/feed', type: 'rss', weight: 8, category: 'publisher' },

  // === REDDIT ===
  { id: 'reddit-leaks', name: 'r/GamingLeaksAndRumours', url: 'https://www.reddit.com/r/GamingLeaksAndRumours/hot.json', type: 'reddit', weight: 9, category: 'community' },
  { id: 'reddit-games', name: 'r/Games', url: 'https://www.reddit.com/r/Games/hot.json', type: 'reddit', weight: 9, category: 'community' },
  { id: 'reddit-ps5', name: 'r/PS5', url: 'https://www.reddit.com/r/PS5/hot.json', type: 'reddit', weight: 8, category: 'community' },
  { id: 'reddit-xbox', name: 'r/XboxSeriesX', url: 'https://www.reddit.com/r/XboxSeriesX/hot.json', type: 'reddit', weight: 6, category: 'community' },
  { id: 'reddit-ps5deals', name: 'r/PS5Deals', url: 'https://www.reddit.com/r/PS5Deals/hot.json', type: 'reddit', weight: 8, category: 'deals' },
  { id: 'reddit-gamedeals', name: 'r/GameDeals', url: 'https://www.reddit.com/r/GameDeals/hot.json', type: 'reddit', weight: 7, category: 'deals' },

  // === YOUTUBE (бесплатный RSS по channel_id) ===
  { id: 'yt-digitalfoundry', name: 'Digital Foundry', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC9PBzalIcEQCsiIkq36PyUA', type: 'rss', weight: 7, category: 'media' },
  { id: 'yt-gamexplain', name: 'GameXplain', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCfAPTv1LgeEWevG8X_6PUOQ', type: 'rss', weight: 6, category: 'media' },

  // === BLUESKY RSS замены (Nitter мёртв) ===
  // Инсайдеры
  { id: 'bsky-schreier', name: 'Jason Schreier (Bluesky)', url: 'https://bsky.app/profile/jasonschreier.bsky.social/rss', type: 'rss', weight: 10, category: 'insider' },
  { id: 'bsky-grubb', name: 'Jeff Grubb (Bluesky)', url: 'https://bsky.app/profile/jeffgrubb.bsky.social/rss', type: 'rss', weight: 9, category: 'insider' },
  { id: 'bsky-keighley', name: 'Geoff Keighley (Bluesky)', url: 'https://bsky.app/profile/geoffkeighley.bsky.social/rss', type: 'rss', weight: 9, category: 'industry' },
  // Официальные — прямые RSS (дубли psblog/xboxwire уже выше, добавляем только Rockstar)
  { id: 'rockstar', name: 'Rockstar Newswire', url: 'https://www.rockstargames.com/newswire/feed', type: 'rss', weight: 10, category: 'official' },

  // === TELEGRAM (публичное web-превью) ===
  { id: 'tg-psprices', name: 'PSPrices RU', url: 'https://t.me/s/psprices_ru_ps4', type: 'telegram', weight: 8, category: 'deals' },
  { id: 'tg-smartplay', name: 'SmartPlay PS', url: 'https://t.me/s/smartplay_ps', type: 'telegram', weight: 7, category: 'deals' },
  { id: 'tg-panstore', name: 'PanStore', url: 'https://t.me/s/panstore_ps', type: 'telegram', weight: 7, category: 'deals' },
  { id: 'tg-psstore', name: 'PlayStation Store', url: 'https://t.me/s/PIayStationStore', type: 'telegram', weight: 6, category: 'deals' },
];
