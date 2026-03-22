export interface EAPlayGame {
  id: string;
  title: string;
  platform: string[];
  genre: string;
  genreRu: string;
  metacritic: number | null;
  tier: 'ea-play' | 'ea-play-pro';
}

export const eaPlayGames: EAPlayGame[] = [
  // Экшен и приключения
  { id: 'dead-space-2023', title: 'Dead Space (2023 Remake)', platform: ['PS5'], genre: 'action', genreRu: 'Survival Horror', metacritic: 89, tier: 'ea-play' },
  { id: 'dragon-age-veilguard', title: 'Dragon Age: The Veilguard', platform: ['PS5'], genre: 'rpg', genreRu: 'Action RPG', metacritic: 84, tier: 'ea-play' },
  { id: 'it-takes-two', title: 'It Takes Two', platform: ['PS5', 'PS4'], genre: 'action', genreRu: 'Кооп-экшен', metacritic: 88, tier: 'ea-play' },
  { id: 'a-way-out', title: 'A Way Out', platform: ['PS4'], genre: 'action', genreRu: 'Кооп-экшен', metacritic: 78, tier: 'ea-play' },
  { id: 'fe', title: 'Fe', platform: ['PS4'], genre: 'action', genreRu: 'Платформер', metacritic: 73, tier: 'ea-play' },
  { id: 'immortals-aveum', title: 'Immortals of Aveum', platform: ['PS5'], genre: 'action', genreRu: 'FPS/экшен', metacritic: 62, tier: 'ea-play' },
  { id: 'lost-in-random', title: 'Lost in Random', platform: ['PS5', 'PS4'], genre: 'action', genreRu: 'Экшен/приключения', metacritic: 76, tier: 'ea-play' },
  { id: 'mirrors-edge-catalyst', title: "Mirror's Edge Catalyst", platform: ['PS4'], genre: 'action', genreRu: 'Паркур/экшен', metacritic: 69, tier: 'ea-play' },
  { id: 'sea-of-solitude', title: 'Sea of Solitude', platform: ['PS4'], genre: 'action', genreRu: 'Приключения', metacritic: 70, tier: 'ea-play' },
  { id: 'tales-of-kenzera', title: 'Tales of Kenzera: ZAU', platform: ['PS5'], genre: 'action', genreRu: 'Экшен-платформер', metacritic: 72, tier: 'ea-play' },
  { id: 'wild-hearts', title: 'Wild Hearts', platform: ['PS5'], genre: 'rpg', genreRu: 'Action RPG', metacritic: 72, tier: 'ea-play' },
  // Шутеры
  { id: 'battlefield-1', title: 'Battlefield 1', platform: ['PS4'], genre: 'shooter', genreRu: 'FPS', metacritic: 88, tier: 'ea-play' },
  { id: 'battlefield-4', title: 'Battlefield 4', platform: ['PS4'], genre: 'shooter', genreRu: 'FPS', metacritic: 85, tier: 'ea-play' },
  { id: 'battlefield-v', title: 'Battlefield V', platform: ['PS4'], genre: 'shooter', genreRu: 'FPS', metacritic: 73, tier: 'ea-play' },
  { id: 'battlefield-2042', title: 'Battlefield 2042', platform: ['PS5', 'PS4'], genre: 'shooter', genreRu: 'FPS', metacritic: 68, tier: 'ea-play' },
  { id: 'battlefield-hardline', title: 'Battlefield Hardline', platform: ['PS4'], genre: 'shooter', genreRu: 'FPS', metacritic: 71, tier: 'ea-play' },
  { id: 'pvz-gw1', title: 'Plants vs. Zombies: Garden Warfare', platform: ['PS4'], genre: 'shooter', genreRu: 'TPS', metacritic: 76, tier: 'ea-play' },
  { id: 'pvz-gw2', title: 'Plants vs. Zombies: Garden Warfare 2', platform: ['PS4'], genre: 'shooter', genreRu: 'TPS', metacritic: 80, tier: 'ea-play' },
  { id: 'pvz-bfn', title: 'Plants vs. Zombies: Battle for Neighborville', platform: ['PS4'], genre: 'shooter', genreRu: 'TPS', metacritic: 72, tier: 'ea-play' },
  { id: 'swbf2', title: 'Star Wars Battlefront II', platform: ['PS4'], genre: 'starwars', genreRu: 'FPS/TPS', metacritic: 68, tier: 'ea-play' },
  { id: 'titanfall-2', title: 'Titanfall 2', platform: ['PS4'], genre: 'shooter', genreRu: 'FPS', metacritic: 89, tier: 'ea-play' },
  // Star Wars
  { id: 'jedi-fallen-order', title: 'Star Wars Jedi: Fallen Order', platform: ['PS4', 'PS5'], genre: 'starwars', genreRu: 'Экшен', metacritic: 79, tier: 'ea-play' },
  { id: 'jedi-survivor', title: 'Star Wars Jedi: Survivor', platform: ['PS5'], genre: 'starwars', genreRu: 'Экшен', metacritic: 85, tier: 'ea-play' },
  { id: 'sw-squadrons', title: 'Star Wars: Squadrons', platform: ['PS4'], genre: 'starwars', genreRu: 'Космический бой', metacritic: 79, tier: 'ea-play' },
  // RPG
  { id: 'me-andromeda', title: 'Mass Effect: Andromeda', platform: ['PS4'], genre: 'rpg', genreRu: 'Action RPG', metacritic: 71, tier: 'ea-play' },
  { id: 'me-legendary', title: 'Mass Effect Legendary Edition', platform: ['PS4'], genre: 'rpg', genreRu: 'Action RPG', metacritic: 87, tier: 'ea-play' },
  // Гонки
  { id: 'burnout-paradise', title: 'Burnout Paradise Remastered', platform: ['PS4'], genre: 'racing', genreRu: 'Аркадные гонки', metacritic: 82, tier: 'ea-play' },
  { id: 'dirt-5', title: 'DIRT 5', platform: ['PS5', 'PS4'], genre: 'racing', genreRu: 'Гонки', metacritic: 81, tier: 'ea-play' },
  { id: 'dirt-rally-2', title: 'DiRT Rally 2.0', platform: ['PS4'], genre: 'racing', genreRu: 'Ралли', metacritic: 84, tier: 'ea-play' },
  { id: 'f1-23', title: 'EA SPORTS F1 23', platform: ['PS5', 'PS4'], genre: 'racing', genreRu: 'Формула 1', metacritic: 79, tier: 'ea-play' },
  { id: 'f1-24', title: 'EA SPORTS F1 24', platform: ['PS5', 'PS4'], genre: 'racing', genreRu: 'Формула 1', metacritic: 80, tier: 'ea-play' },
  { id: 'f1-25', title: 'EA SPORTS F1 25', platform: ['PS5', 'PS4'], genre: 'racing', genreRu: 'Формула 1', metacritic: 80, tier: 'ea-play' },
  { id: 'ea-wrc', title: 'EA SPORTS WRC', platform: ['PS5', 'PS4'], genre: 'racing', genreRu: 'Ралли', metacritic: 78, tier: 'ea-play' },
  { id: 'grid-legends', title: 'GRID Legends', platform: ['PS5', 'PS4'], genre: 'racing', genreRu: 'Кольцевые гонки', metacritic: 77, tier: 'ea-play' },
  { id: 'nfs-2015', title: 'Need for Speed (2015)', platform: ['PS4'], genre: 'racing', genreRu: 'Аркадные гонки', metacritic: 66, tier: 'ea-play' },
  { id: 'nfs-heat', title: 'Need for Speed Heat', platform: ['PS4'], genre: 'racing', genreRu: 'Аркадные гонки', metacritic: 72, tier: 'ea-play' },
  { id: 'nfs-hp-remastered', title: 'Need for Speed: Hot Pursuit Remastered', platform: ['PS4'], genre: 'racing', genreRu: 'Аркадные гонки', metacritic: 80, tier: 'ea-play' },
  { id: 'nfs-payback', title: 'Need for Speed: Payback', platform: ['PS4'], genre: 'racing', genreRu: 'Аркадные гонки', metacritic: 62, tier: 'ea-play' },
  { id: 'nfs-rivals', title: 'Need for Speed: Rivals', platform: ['PS4'], genre: 'racing', genreRu: 'Аркадные гонки', metacritic: 73, tier: 'ea-play' },
  { id: 'nfs-unbound', title: 'Need for Speed Unbound', platform: ['PS5'], genre: 'racing', genreRu: 'Аркадные гонки', metacritic: 73, tier: 'ea-play' },
  // Спорт — Футбол
  { id: 'fc-24', title: 'EA SPORTS FC 24', platform: ['PS5', 'PS4'], genre: 'sport', genreRu: 'Футбол', metacritic: 75, tier: 'ea-play' },
  { id: 'fc-25', title: 'EA SPORTS FC 25', platform: ['PS5', 'PS4'], genre: 'sport', genreRu: 'Футбол', metacritic: 73, tier: 'ea-play' },
  // Спорт — Амер. футбол
  { id: 'cfb-25', title: 'EA SPORTS College Football 25', platform: ['PS5'], genre: 'sport', genreRu: 'Студенческий футбол', metacritic: 82, tier: 'ea-play' },
  { id: 'cfb-26', title: 'EA SPORTS College Football 26', platform: ['PS5'], genre: 'sport', genreRu: 'Студенческий футбол', metacritic: null, tier: 'ea-play' },
  { id: 'madden-25', title: 'EA SPORTS Madden NFL 25', platform: ['PS5', 'PS4'], genre: 'sport', genreRu: 'NFL', metacritic: 68, tier: 'ea-play' },
  { id: 'madden-26', title: 'EA SPORTS Madden NFL 26', platform: ['PS5', 'PS4'], genre: 'sport', genreRu: 'NFL', metacritic: null, tier: 'ea-play' },
  // Спорт — Хоккей
  { id: 'nhl-24', title: 'NHL 24', platform: ['PS5', 'PS4'], genre: 'sport', genreRu: 'Хоккей', metacritic: 72, tier: 'ea-play' },
  { id: 'nhl-25', title: 'NHL 25', platform: ['PS5'], genre: 'sport', genreRu: 'Хоккей', metacritic: 74, tier: 'ea-play' },
  // Спорт — Другие
  { id: 'pga-tour', title: 'EA SPORTS PGA Tour', platform: ['PS5'], genre: 'sport', genreRu: 'Гольф', metacritic: 74, tier: 'ea-play' },
  { id: 'smb-3', title: 'Super Mega Baseball 3', platform: ['PS4'], genre: 'sport', genreRu: 'Бейсбол', metacritic: 84, tier: 'ea-play' },
  { id: 'smb-4', title: 'Super Mega Baseball 4', platform: ['PS5', 'PS4'], genre: 'sport', genreRu: 'Бейсбол', metacritic: 79, tier: 'ea-play' },
  { id: 'ufc-4', title: 'UFC 4', platform: ['PS4'], genre: 'sport', genreRu: 'Единоборства', metacritic: 73, tier: 'ea-play' },
  { id: 'ufc-5', title: 'UFC 5', platform: ['PS5'], genre: 'sport', genreRu: 'Единоборства', metacritic: 76, tier: 'ea-play' },
  // Симуляторы и паззлы
  { id: 'peggle-2', title: 'Peggle 2', platform: ['PS4'], genre: 'sim', genreRu: 'Паззл', metacritic: 79, tier: 'ea-play' },
  { id: 'sims-4', title: 'The Sims 4', platform: ['PS4'], genre: 'sim', genreRu: 'Симулятор жизни', metacritic: 70, tier: 'ea-play' },
  { id: 'unravel', title: 'Unravel', platform: ['PS4'], genre: 'sim', genreRu: 'Паззл-платформер', metacritic: 75, tier: 'ea-play' },
  { id: 'unravel-two', title: 'Unravel Two', platform: ['PS4'], genre: 'sim', genreRu: 'Паззл-платформер', metacritic: 78, tier: 'ea-play' },
  // Недостающие до 63
  { id: 'apex-legends', title: 'Apex Legends', platform: ['PS5', 'PS4'], genre: 'shooter', genreRu: 'Батл-рояль', metacritic: 89, tier: 'ea-play' },
  { id: 'da-inquisition', title: 'Dragon Age: Inquisition', platform: ['PS4'], genre: 'rpg', genreRu: 'Action RPG', metacritic: 85, tier: 'ea-play' },
  { id: 'f1-2021', title: 'F1 2021', platform: ['PS5', 'PS4'], genre: 'racing', genreRu: 'Формула 1', metacritic: 82, tier: 'ea-play' },
  { id: 'grid-2019', title: 'GRID (2019)', platform: ['PS4'], genre: 'racing', genreRu: 'Гонки', metacritic: 74, tier: 'ea-play' },
  { id: 'nhl-94-rewind', title: 'NHL 94 Rewind', platform: ['PS4'], genre: 'sport', genreRu: 'Хоккей (ретро)', metacritic: null, tier: 'ea-play' },
  { id: 'rocket-arena', title: 'Rocket Arena', platform: ['PS4'], genre: 'shooter', genreRu: 'Шутер', metacritic: 66, tier: 'ea-play' },
  { id: 'swbf-2015', title: 'Star Wars: Battlefront (2015)', platform: ['PS4'], genre: 'starwars', genreRu: 'FPS', metacritic: 73, tier: 'ea-play' },
];

// EA Play Pro exclusive games (PC only — adds to base EA Play catalog)
export const eaPlayProGames: EAPlayGame[] = [
  // Классика EA
  { id: 'cnc-remastered', title: 'Command & Conquer Remastered Collection', platform: ['PC'], genre: 'strategy', genreRu: 'Стратегия', metacritic: 82, tier: 'ea-play-pro' },
  { id: 'cnc-ra3', title: 'Command & Conquer: Red Alert 3', platform: ['PC'], genre: 'strategy', genreRu: 'Стратегия', metacritic: 79, tier: 'ea-play-pro' },
  { id: 'cnc3-tiberium', title: 'Command & Conquer 3: Tiberium Wars', platform: ['PC'], genre: 'strategy', genreRu: 'Стратегия', metacritic: 85, tier: 'ea-play-pro' },
  { id: 'cnc-generals', title: 'Command & Conquer: Generals', platform: ['PC'], genre: 'strategy', genreRu: 'Стратегия', metacritic: 84, tier: 'ea-play-pro' },
  { id: 'crysis-1', title: 'Crysis', platform: ['PC'], genre: 'fps', genreRu: 'FPS', metacritic: 91, tier: 'ea-play-pro' },
  { id: 'crysis-2', title: 'Crysis 2 Maximum Edition', platform: ['PC'], genre: 'fps', genreRu: 'FPS', metacritic: 84, tier: 'ea-play-pro' },
  { id: 'crysis-3', title: 'Crysis 3', platform: ['PC'], genre: 'fps', genreRu: 'FPS', metacritic: 76, tier: 'ea-play-pro' },
  { id: 'dead-space-2008', title: 'Dead Space (2008)', platform: ['PC'], genre: 'action', genreRu: 'Horror', metacritic: 86, tier: 'ea-play-pro' },
  { id: 'dead-space-2', title: 'Dead Space 2', platform: ['PC'], genre: 'action', genreRu: 'Horror', metacritic: 87, tier: 'ea-play-pro' },
  { id: 'dead-space-3', title: 'Dead Space 3', platform: ['PC'], genre: 'action', genreRu: 'Horror', metacritic: 78, tier: 'ea-play-pro' },
  { id: 'dao', title: 'Dragon Age: Origins', platform: ['PC'], genre: 'rpg', genreRu: 'RPG', metacritic: 91, tier: 'ea-play-pro' },
  { id: 'da2', title: 'Dragon Age II', platform: ['PC'], genre: 'rpg', genreRu: 'RPG', metacritic: 82, tier: 'ea-play-pro' },
  { id: 'simcity-4', title: 'SimCity 4 Deluxe Edition', platform: ['PC'], genre: 'sim', genreRu: 'Симулятор', metacritic: 84, tier: 'ea-play-pro' },
  { id: 'simcity-2013', title: 'SimCity (2013)', platform: ['PC'], genre: 'sim', genreRu: 'Симулятор', metacritic: 64, tier: 'ea-play-pro' },
  { id: 'simcity-2000', title: 'SimCity 2000', platform: ['PC'], genre: 'sim', genreRu: 'Симулятор', metacritic: null, tier: 'ea-play-pro' },
  { id: 'spore', title: 'SPORE', platform: ['PC'], genre: 'sim', genreRu: 'Симулятор', metacritic: 84, tier: 'ea-play-pro' },
  { id: 'dungeon-keeper', title: 'Dungeon Keeper', platform: ['PC'], genre: 'strategy', genreRu: 'Стратегия', metacritic: null, tier: 'ea-play-pro' },
  { id: 'dungeon-keeper-2', title: 'Dungeon Keeper 2', platform: ['PC'], genre: 'strategy', genreRu: 'Стратегия', metacritic: null, tier: 'ea-play-pro' },
  { id: 'theme-hospital', title: 'Theme Hospital', platform: ['PC'], genre: 'sim', genreRu: 'Симулятор', metacritic: null, tier: 'ea-play-pro' },
  { id: 'populous-pro', title: 'Populous', platform: ['PC'], genre: 'strategy', genreRu: 'Стратегия', metacritic: null, tier: 'ea-play-pro' },
  // Star Wars классика
  { id: 'kotor', title: 'Star Wars: Knights of the Old Republic', platform: ['PC'], genre: 'starwars', genreRu: 'RPG', metacritic: 93, tier: 'ea-play-pro' },
  { id: 'kotor-2', title: 'Star Wars: Knights of the Old Republic II', platform: ['PC'], genre: 'starwars', genreRu: 'RPG', metacritic: 85, tier: 'ea-play-pro' },
  { id: 'sw-dark-forces', title: 'Star Wars: Dark Forces', platform: ['PC'], genre: 'starwars', genreRu: 'FPS', metacritic: null, tier: 'ea-play-pro' },
  { id: 'sw-jk-df2', title: 'Star Wars Jedi Knight: Dark Forces II', platform: ['PC'], genre: 'starwars', genreRu: 'FPS', metacritic: null, tier: 'ea-play-pro' },
  { id: 'sw-jk2-outcast', title: 'Star Wars Jedi Knight II: Jedi Outcast', platform: ['PC'], genre: 'starwars', genreRu: 'FPS', metacritic: 81, tier: 'ea-play-pro' },
  { id: 'sw-jk-academy', title: 'Star Wars Jedi Knight: Jedi Academy', platform: ['PC'], genre: 'starwars', genreRu: 'Экшен', metacritic: 81, tier: 'ea-play-pro' },
  { id: 'sw-force-unleashed', title: 'Star Wars: The Force Unleashed', platform: ['PC'], genre: 'starwars', genreRu: 'Экшен', metacritic: 73, tier: 'ea-play-pro' },
  { id: 'sw-force-unleashed-2', title: 'Star Wars: The Force Unleashed II', platform: ['PC'], genre: 'starwars', genreRu: 'Экшен', metacritic: 60, tier: 'ea-play-pro' },
  { id: 'sw-republic-commando', title: 'Star Wars Republic Commando', platform: ['PC'], genre: 'starwars', genreRu: 'FPS', metacritic: 78, tier: 'ea-play-pro' },
  { id: 'sw-bf-2004', title: 'Star Wars Battlefront (2004)', platform: ['PC'], genre: 'starwars', genreRu: 'Шутер', metacritic: 82, tier: 'ea-play-pro' },
  { id: 'sw-bf2-2005', title: 'Star Wars Battlefront II (2005)', platform: ['PC'], genre: 'starwars', genreRu: 'Шутер', metacritic: 84, tier: 'ea-play-pro' },
  { id: 'sw-empire', title: 'Star Wars: Empire at War — Gold Pack', platform: ['PC'], genre: 'starwars', genreRu: 'Стратегия', metacritic: 79, tier: 'ea-play-pro' },
  { id: 'sw-galactic-bg', title: 'Star Wars Galactic Battlegrounds Saga', platform: ['PC'], genre: 'starwars', genreRu: 'Стратегия', metacritic: null, tier: 'ea-play-pro' },
  { id: 'sw-rebellion', title: 'Star Wars: Rebellion', platform: ['PC'], genre: 'starwars', genreRu: 'Стратегия', metacritic: null, tier: 'ea-play-pro' },
  { id: 'sw-ep1-racer', title: 'Star Wars Episode I: Racer', platform: ['PC'], genre: 'starwars', genreRu: 'Гонки', metacritic: 74, tier: 'ea-play-pro' },
  { id: 'sw-xwing', title: 'Star Wars: X-Wing Special Edition', platform: ['PC'], genre: 'starwars', genreRu: 'Космосим', metacritic: null, tier: 'ea-play-pro' },
  { id: 'sw-xwing-alliance', title: 'Star Wars: X-Wing Alliance', platform: ['PC'], genre: 'starwars', genreRu: 'Космосим', metacritic: null, tier: 'ea-play-pro' },
  { id: 'sw-tie-fighter', title: 'Star Wars: TIE Fighter', platform: ['PC'], genre: 'starwars', genreRu: 'Космосим', metacritic: null, tier: 'ea-play-pro' },
  { id: 'sw-rogue-squadron', title: 'Star Wars: Rogue Squadron 3D', platform: ['PC'], genre: 'starwars', genreRu: 'Экшен', metacritic: null, tier: 'ea-play-pro' },
  { id: 'sw-starfighter', title: 'Star Wars Starfighter', platform: ['PC'], genre: 'starwars', genreRu: 'Экшен', metacritic: null, tier: 'ea-play-pro' },
  // Sims
  { id: 'sims-3-pro', title: 'The Sims 3', platform: ['PC'], genre: 'sim', genreRu: 'Симулятор', metacritic: 86, tier: 'ea-play-pro' },
  { id: 'mysims-cozy', title: 'MySims: Cozy Bundle', platform: ['PC'], genre: 'sim', genreRu: 'Симулятор', metacritic: null, tier: 'ea-play-pro' },
  // Шутеры ПК
  { id: 'bf3-pro', title: 'Battlefield 3', platform: ['PC'], genre: 'fps', genreRu: 'FPS', metacritic: 89, tier: 'ea-play-pro' },
  { id: 'moh-2010', title: 'Medal of Honor (2010)', platform: ['PC'], genre: 'fps', genreRu: 'FPS', metacritic: 74, tier: 'ea-play-pro' },
  { id: 'moh-warfighter', title: 'Medal of Honor: Warfighter', platform: ['PC'], genre: 'fps', genreRu: 'FPS', metacritic: 55, tier: 'ea-play-pro' },
  { id: 'moh-airborne', title: 'Medal of Honor: Airborne', platform: ['PC'], genre: 'fps', genreRu: 'FPS', metacritic: 75, tier: 'ea-play-pro' },
  { id: 'mirrors-edge-og', title: "Mirror's Edge (2008)", platform: ['PC'], genre: 'action', genreRu: 'Экшен', metacritic: 81, tier: 'ea-play-pro' },
  { id: 'titanfall-1-pro', title: 'Titanfall', platform: ['PC'], genre: 'fps', genreRu: 'FPS', metacritic: 86, tier: 'ea-play-pro' },
  // RPG ПК
  { id: 'me1-pro', title: 'Mass Effect', platform: ['PC'], genre: 'rpg', genreRu: 'RPG', metacritic: 89, tier: 'ea-play-pro' },
  { id: 'me2-pro', title: 'Mass Effect 2', platform: ['PC'], genre: 'rpg', genreRu: 'RPG', metacritic: 94, tier: 'ea-play-pro' },
  { id: 'me3-pro', title: 'Mass Effect 3', platform: ['PC'], genre: 'rpg', genreRu: 'RPG', metacritic: 89, tier: 'ea-play-pro' },
  // Инди/AA
  { id: 'plague-innocence', title: 'A Plague Tale: Innocence', platform: ['PC'], genre: 'action', genreRu: 'Экшен', metacritic: 81, tier: 'ea-play-pro' },
  { id: 'biomutant-pro', title: 'Biomutant', platform: ['PC'], genre: 'rpg', genreRu: 'Action RPG', metacritic: 65, tier: 'ea-play-pro' },
  { id: 'darksiders-3', title: 'Darksiders III', platform: ['PC'], genre: 'rpg', genreRu: 'Action RPG', metacritic: 65, tier: 'ea-play-pro' },
  { id: 'ftl', title: 'FTL: Faster Than Light', platform: ['PC'], genre: 'indie', genreRu: 'Roguelike', metacritic: 84, tier: 'ea-play-pro' },
  { id: 'ghost-of-tale', title: 'Ghost of a Tale', platform: ['PC'], genre: 'indie', genreRu: 'Приключение', metacritic: 76, tier: 'ea-play-pro' },
  { id: 'inside', title: 'INSIDE', platform: ['PC'], genre: 'indie', genreRu: 'Платформер', metacritic: 93, tier: 'ea-play-pro' },
  { id: 'into-the-breach', title: 'Into the Breach', platform: ['PC'], genre: 'strategy', genreRu: 'Стратегия', metacritic: 90, tier: 'ea-play-pro' },
  { id: 'limbo', title: 'LIMBO', platform: ['PC'], genre: 'indie', genreRu: 'Платформер', metacritic: 90, tier: 'ea-play-pro' },
  { id: 'northgard', title: 'Northgard', platform: ['PC'], genre: 'strategy', genreRu: 'RTS', metacritic: 78, tier: 'ea-play-pro' },
  { id: 'sonic-mania-pro', title: 'Sonic Mania', platform: ['PC'], genre: 'indie', genreRu: 'Платформер', metacritic: 86, tier: 'ea-play-pro' },
  { id: 'surge-1', title: 'The Surge', platform: ['PC'], genre: 'rpg', genreRu: 'Action RPG', metacritic: 72, tier: 'ea-play-pro' },
  { id: 'surge-2', title: 'The Surge 2', platform: ['PC'], genre: 'rpg', genreRu: 'Action RPG', metacritic: 78, tier: 'ea-play-pro' },
  { id: 'tropico-6', title: 'Tropico 6', platform: ['PC'], genre: 'strategy', genreRu: 'Стратегия', metacritic: 76, tier: 'ea-play-pro' },
  { id: 'wh40k-mechanicus', title: 'Warhammer 40K: Mechanicus', platform: ['PC'], genre: 'strategy', genreRu: 'Стратегия', metacritic: 78, tier: 'ea-play-pro' },
  { id: 'wreckfest-pro', title: 'Wreckfest', platform: ['PC'], genre: 'racing', genreRu: 'Гонки', metacritic: 79, tier: 'ea-play-pro' },
  { id: 'they-are-billions', title: 'They Are Billions', platform: ['PC'], genre: 'strategy', genreRu: 'Стратегия', metacritic: 74, tier: 'ea-play-pro' },
  { id: 'darkwood-pro', title: 'Darkwood', platform: ['PC'], genre: 'indie', genreRu: 'Хоррор', metacritic: 77, tier: 'ea-play-pro' },
  { id: 'untitled-goose', title: 'Untitled Goose Game', platform: ['PC'], genre: 'indie', genreRu: 'Приключения', metacritic: 79, tier: 'ea-play-pro' },
  { id: 'overcooked-2', title: 'Overcooked! 2', platform: ['PC'], genre: 'indie', genreRu: 'Кооператив', metacritic: 81, tier: 'ea-play-pro' },
  // Новинки Pro (полный доступ)
  { id: 'fc-26-pro', title: 'EA SPORTS FC 26', platform: ['PC'], genre: 'sport', genreRu: 'Футбол', metacritic: null, tier: 'ea-play-pro' },
  { id: 'bf6-pro', title: 'Battlefield 6', platform: ['PC'], genre: 'fps', genreRu: 'FPS', metacritic: null, tier: 'ea-play-pro' },
  { id: 'nhl-26-pro', title: 'NHL 26', platform: ['PC'], genre: 'sport', genreRu: 'Хоккей', metacritic: null, tier: 'ea-play-pro' },
  { id: 'pvz-replanted', title: 'Plants vs. Zombies: Replanted', platform: ['PC'], genre: 'strategy', genreRu: 'Стратегия', metacritic: null, tier: 'ea-play-pro' },
];

export const eaPlayGenreFilters = [
  { key: 'all', label: 'Все' },
  { key: 'action', label: 'Экшен' },
  { key: 'shooter', label: 'Шутеры' },
  { key: 'sport', label: 'Спорт' },
  { key: 'racing', label: 'Гонки' },
  { key: 'rpg', label: 'RPG' },
  { key: 'starwars', label: 'Star Wars' },
  { key: 'sim', label: 'Симуляторы' },
];

export const eaPlayProGenreFilters = [
  { key: 'all', label: 'Все' },
  { key: 'starwars', label: 'Star Wars' },
  { key: 'strategy', label: 'Стратегии' },
  { key: 'fps', label: 'FPS' },
  { key: 'rpg', label: 'RPG' },
  { key: 'indie', label: 'Инди' },
  { key: 'action', label: 'Экшен' },
  { key: 'sport', label: 'Спорт' },
  { key: 'racing', label: 'Гонки' },
  { key: 'sim', label: 'Симуляторы' },
];
