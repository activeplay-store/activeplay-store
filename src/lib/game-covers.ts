/**
 * Multi-source game cover system.
 * Priority: Steam CDN → Hardcoded URLs → Placeholder
 *
 * Steam CDN: cdn.akamai.steamstatic.com/steam/apps/{APPID}/library_600x900.jpg
 * No API key needed. URLs stable for years.
 */

const STEAM_CDN = 'https://cdn.cloudflare.steamstatic.com/steam/apps';

// Keys = game IDs from eaPlayGames.ts / eaPlayProGames.ts
export const STEAM_APP_IDS: Record<string, number> = {
  // === EA Play base (PlayStation) ===
  'dead-space-2023': 1693980,
  'dragon-age-veilguard': 1845910,
  'it-takes-two': 1426210,
  'a-way-out': 1222700,
  'fe': 0,
  'immortals-aveum': 2009350,
  'lost-in-random': 1462570,
  'mirrors-edge-catalyst': 1233570,
  'sea-of-solitude': 1225590,
  'tales-of-kenzera': 1919630,
  'wild-hearts': 1938010,
  'battlefield-1': 1238840,
  'battlefield-4': 1238860,
  'battlefield-v': 1238810,
  'battlefield-2042': 1517290,
  'battlefield-hardline': 1238880,
  'pvz-gw1': 0,
  'pvz-gw2': 0,
  'pvz-bfn': 0,
  'swbf2': 1237980,
  'titanfall-2': 1237970,
  'jedi-fallen-order': 1172380,
  'jedi-survivor': 1774580,
  'sw-squadrons': 1222730,
  'me-andromeda': 1238000,
  'me-legendary': 1328670,
  'burnout-paradise': 1222740,
  'dirt-5': 1038250,
  'dirt-rally-2': 690790,
  'f1-23': 2108330,
  'f1-24': 2488620,
  'f1-25': 0,
  'f1-2021': 1134570,
  'ea-wrc': 1849250,
  'grid-legends': 1307710,
  'grid-2019': 703860,
  'nfs-2015': 1262540,
  'nfs-heat': 1222680,
  'nfs-hp-remastered': 1328660,
  'nfs-payback': 1262560,
  'nfs-rivals': 1262580,
  'nfs-unbound': 1846380,
  'fc-24': 2195250,
  'fc-25': 2669320,
  'pga-tour': 0,
  'smb-3': 988910,
  'smb-4': 0,
  'sims-4': 1222670,
  'unravel': 1225560,
  'unravel-two': 1225570,
  'apex-legends': 1172470,
  'da-inquisition': 1222690,
  'rocket-arena': 0,
  'swbf-2015': 1237950,
  // === EA Play Pro (PC exclusives) ===
  'cnc-remastered': 1213210,
  'cnc-ra3': 17480,
  'cnc3-tiberium': 24790,
  'cnc-generals': 2229850,
  'crysis-1': 1593500,
  'crysis-2': 108800,
  'crysis-3': 1222040,
  'dead-space-2008': 17470,
  'dead-space-2': 47780,
  'dead-space-3': 1238060,
  'dao': 47810,
  'da2': 1238040,
  'simcity-4': 24780,
  'simcity-2013': 1222670,
  'spore': 17390,
  'sims-3-pro': 47890,
  'kotor': 32370,
  'kotor-2': 208580,
  'sw-jk-academy': 6020,
  'sw-jk2-outcast': 6030,
  'sw-empire': 32470,
  'sw-republic-commando': 6000,
  'sw-bf-2004': 1058020,
  'sw-bf2-2005': 6060,
  'sw-ep1-racer': 808910,
  'sw-force-unleashed': 32430,
  'sw-force-unleashed-2': 32500,
  'bf3-pro': 1238820,
  'moh-2010': 47790,
  'moh-warfighter': 1238100,
  'moh-airborne': 24840,
  'mirrors-edge-og': 17410,
  'titanfall-1-pro': 1237960,
  'me1-pro': 17460,
  'me2-pro': 24980,
  'me3-pro': 1238020,
  'ftl': 212680,
  'inside': 304430,
  'limbo': 48000,
  'into-the-breach': 590380,
  'northgard': 466560,
  'untitled-goose': 837470,
  'overcooked-2': 728880,
  'sonic-mania-pro': 584400,
  'plague-innocence': 752590,
  'biomutant-pro': 597820,
  'darksiders-3': 606280,
  'ghost-of-tale': 417290,
  'surge-1': 378540,
  'surge-2': 644830,
  'tropico-6': 492720,
  'wh40k-mechanicus': 673880,
  'wreckfest-pro': 228380,
  'they-are-billions': 644930,
  'darkwood-pro': 274520,
};

// Hardcoded URLs — console exclusives + games with broken Steam capsules
export const HARDCODED_COVERS: Record<string, string> = {
  // EA games with broken/missing Steam library capsules
  'pvz-gw1': 'https://media.rawg.io/media/games/9cd/9cddf72caf9ca14267121975270149dd.jpg',
  'pvz-gw2': 'https://media.rawg.io/media/games/be0/be0d885cdbdd0e5c808ad874d34d7444.jpg',
  'pvz-bfn': 'https://media.rawg.io/media/games/621/6217d52e35fe5137b3746367827e80e0.jpg',
  'f1-25': 'https://media.rawg.io/media/games/882/8820b0bc5ec9c135aca22389d105b566.jpg',
  'pga-tour': 'https://media.rawg.io/media/games/969/96911ffdc5bb01893eef4fd2af340498.jpg',
  'smb-4': 'https://media.rawg.io/media/screenshots/306/3063640fc57f696bd3aee95a93844393.jpg',
  'rocket-arena': 'https://media.rawg.io/media/games/69d/69d984a5952c3f471792abf19606533f.jpg',
  'fe': 'https://media.rawg.io/media/games/d0a/d0af1da58587a84096462df773ed40b7.jpg',
  'nhl-24': 'https://image.api.playstation.com/vulcan/ap/rnd/202310/2612/45455844ea8256d301d894d41a007a291c000afee1df1638.png',
  'nhl-25': 'https://image.api.playstation.com/vulcan/ap/rnd/202502/1121/0f466021fe2735e27a44855e8e0db8bafa20d2bc7d53ad50.png',
  'nhl-94-rewind': 'https://media.rawg.io/media/games/4a4/4a41a5886a7bbd2dd3fdcdf0e8ae3907.jpg',
  'nhl-26-pro': 'https://media.rawg.io/media/games/576/5764a182aafe5b5fddc25fdfd15170d6.jpg',
  'ufc-4': 'https://media.rawg.io/media/games/263/263f39f29a81c68a120e4f1559682dad.jpg',
  'ufc-5': 'https://media.rawg.io/media/games/1b9/1b9b1b82d204e9656019f73c577cb804.jpg',
  'peggle-2': 'https://image.api.playstation.com/vulcan/img/rnd/202010/1520/zqd51u7H8G0P9dM8oelsM3Td.png',
  'cfb-25': 'https://image.api.playstation.com/vulcan/ap/rnd/202408/2112/53bb3272acee41261191c35a5ad15736775c417bd3160be4.png',
  'cfb-26': 'https://image.api.playstation.com/vulcan/ap/rnd/202507/0314/f2481238d1b0fb8cdd7fb2e80da8d40265f33fb0b4f874b5.png',
  'madden-25': 'https://image.api.playstation.com/vulcan/ap/rnd/202406/1011/5ef862d797e340bb0f2443e8feb9b0057867e8992b0963db.png',
  'madden-26': 'https://image.api.playstation.com/vulcan/ap/rnd/202505/2813/91b39d9b05c4a3284df3a6ef5b34768e3bd4301d354e1a85.png',
  'fc-26-pro': 'https://media.rawg.io/media/screenshots/928/9289953b354ac641e3f1b83d43e18521.jpg',
  'bf6-pro': 'https://media.rawg.io/media/games/af2/af2b640fa820e8a8135948a4cd399539.jpg',
  'pvz-replanted': 'https://media.rawg.io/media/screenshots/928/9289953b354ac641e3f1b83d43e18521.jpg',
  'mysims-cozy': 'https://media.rawg.io/media/games/e44/e445335e611b4ccf03af71fffcbd30a4.jpg',
  'simcity-2000': 'https://media.rawg.io/media/games/e44/e445335e611b4ccf03af71fffcbd30a4.jpg',
  'dungeon-keeper': 'https://media.rawg.io/media/screenshots/928/9289953b354ac641e3f1b83d43e18521.jpg',
  'dungeon-keeper-2': 'https://media.rawg.io/media/screenshots/928/9289953b354ac641e3f1b83d43e18521.jpg',
  'theme-hospital': 'https://media.rawg.io/media/screenshots/928/9289953b354ac641e3f1b83d43e18521.jpg',
  'populous-pro': 'https://media.rawg.io/media/screenshots/928/9289953b354ac641e3f1b83d43e18521.jpg',
  'sw-dark-forces': 'https://media.rawg.io/media/games/3e4/3e43e29ae126ef951842393f5ff7f33a.jpg',
  'sw-jk-df2': 'https://media.rawg.io/media/games/3e4/3e43e29ae126ef951842393f5ff7f33a.jpg',
  'sw-galactic-bg': 'https://media.rawg.io/media/games/3e4/3e43e29ae126ef951842393f5ff7f33a.jpg',
  'sw-rebellion': 'https://media.rawg.io/media/games/3e4/3e43e29ae126ef951842393f5ff7f33a.jpg',
  'sw-xwing': 'https://media.rawg.io/media/games/3e4/3e43e29ae126ef951842393f5ff7f33a.jpg',
  'sw-xwing-alliance': 'https://media.rawg.io/media/games/3e4/3e43e29ae126ef951842393f5ff7f33a.jpg',
  'sw-tie-fighter': 'https://media.rawg.io/media/games/3e4/3e43e29ae126ef951842393f5ff7f33a.jpg',
  'sw-rogue-squadron': 'https://media.rawg.io/media/games/3e4/3e43e29ae126ef951842393f5ff7f33a.jpg',
  'sw-starfighter': 'https://media.rawg.io/media/games/3e4/3e43e29ae126ef951842393f5ff7f33a.jpg',
};

const PLACEHOLDER = '/images/covers/discounts/baldurs-gate-3.jpg';

/** Get vertical game cover (600x900) — prefers local file, falls back to Steam CDN */
export function getGameCover(id: string): string {
  const appId = STEAM_APP_IDS[id];
  // Local cover downloaded from Steam CDN (works regardless of geo-blocks)
  if (appId && appId > 0) return `/images/covers/ea/${id}.jpg`;
  const hc = HARDCODED_COVERS[id];
  if (hc) return hc;
  return PLACEHOLDER;
}

/** Get horizontal game banner (460x215) */
export function getGameBanner(id: string): string {
  const appId = STEAM_APP_IDS[id];
  if (appId && appId > 0) return `${STEAM_CDN}/${appId}/header.jpg`;
  return getGameCover(id);
}
