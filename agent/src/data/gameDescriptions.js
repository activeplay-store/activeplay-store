/**
 * Маппинг описаний и жанров игр на русском языке.
 * Приоритет: этот маппинг → RAWG description_raw (если нет в маппинге).
 */

const descriptions = {
  // ПРЕДЗАКАЗЫ (≤50 символов)
  "Darwin's Paradox!": "Платформер от ZDT Studio. Стелс-осьминог",
  "Starfield": "Космическая RPG от Bethesda. 1000+ планет",
  "The Occultist": "Хоррор от Daedalic. Мистический маятник",
  "PRAGMATA": "Sci-fi адвенчура от Capcom. Дуэт с андроидом",
  "Pragmata": "Sci-fi адвенчура от Capcom. Дуэт с андроидом",
  "Cthulhu: The Cosmic Abyss": "Хоррор от Big Bad Wolf. Лавкрафт, Р'льех",
  "Cthulhu: The Cosmic Abyss - R'lyeh Edition": "Хоррор от Big Bad Wolf. Лавкрафт, Р'льех",
  "Jay and Silent Bob: Chronic Blunt Punch": "Beat 'em up от Interabang. Кооп-аркада",
  "Sudden Strike 5": "Стратегия от KITE Games. Бои ВМВ, 300+ юнитов",
  "Sudden Strike 5 Deluxe Edition": "Стратегия от KITE Games. Бои ВМВ, 300+ юнитов",
  "Tides of Tomorrow": "Приключение от DigixArt. Решения онлайн",
  "Diablo IV: Lord of Hatred": "RPG-DLC от Blizzard. Паладин и Чернокнижник",
  "MotoGP 26": "Мотогонки от Milestone. Реальные рейтинги",
  "Aphelion": "Sci-fi адвенчура от DON'T NOD. Два астронавта",
  "SAROS": "Рогалик-шутер от Housemarque. Щит из пуль",
  "Saros": "Рогалик-шутер от Housemarque. Щит из пуль",
  "Magin: The Rat Project Stories": "Deck-builder от Daedalic. Эмоции и карты",
  "Invincible VS": "2D-файтинг от Skybound. 3v3 бои Invincible",
  "Directive 8020": "Хоррор от Supermassive. Мимики в космосе",
  "LEGO Batman: Legacy of the Dark Knight": "Адвенчура от TT Games. Открытый Готэм",
  "007 First Light": "Стелс от IO Interactive. Молодой Бонд",
  "Wandering Sword": "Wuxia-RPG. 20 концовок, два режима боя",
  "The Adventures of Elliot: The Millennium Tales": "HD-2D RPG от Square Enix. В стиле Zelda",
  "The Adventures of Elliot": "HD-2D RPG от Square Enix. В стиле Zelda",
  "DEAD OR ALIVE 6 Last Round": "3D-файтинг от Team NINJA. 29 бойцов на PS5",
  "Echoes of Aincrad": "RPG по Sword Art Online. Замок Айнкрад",
  "MARVEL Tōkon: Fighting Souls": "Файтинг от Arc System Works. 4v4 Marvel",
  "MARVEL Tokon: Fighting Souls": "Файтинг от Arc System Works. 4v4 Marvel",
  "METAL GEAR SOLID: MASTER COLLECTION Vol.2": "Стелс от Konami. MGS4 + Peace Walker",
  "Mega Man Star Force Legacy Collection": "RPG-сборник от Capcom. 7 игр, ремастер",

  // НОВИНКИ (≤50 символов)
  "Crimson Desert": "Open-world RPG от Pearl Abyss. Хардкор-бой",
  "Resident Evil Requiem": "Survival horror от Capcom. Два героя, MC 88",
  "Resident Evil 9: Requiem": "Survival horror от Capcom. Два героя, MC 88",
  "Nioh 3": "Souls-like от Team Ninja. Открытый мир, кооп",
  "Monster Hunter Stories 3": "JRPG от Capcom. 120+ монстров, HD-2D",
  "Marathon": "Extraction-шутер от Bungie. PvPvE-лутер",

  // ТОП-ПРОДАЖИ (≤50 символов)
  "EA SPORTS FC 26": "Футбол от EA Sports. HyperMotionV, 19K+ игроков",
  "UFC 5": "MMA от EA Sports. Реалистичные нокауты",
  "Grand Theft Auto V": "Open-world от Rockstar. GTA Online в комплекте",
  "Minecraft": "Песочница от Mojang. Крафтинг и выживание",
  "It Takes Two": "Кооп от Hazelight. Игра на двоих, GOTY 2021",
  "ARC Raiders": "Кооп-шутер от Embark. Роботы и выживание",
  "REANIMAL": "Хоррор от Naughty Dog. Мрачная сказка",
  "Reanimal": "Хоррор от Naughty Dog. Мрачная сказка",
  "Forza Horizon 5": "Гонки от Playground. Мексика, 800+ машин",
  "Call of Duty: Black Ops 7": "FPS от Treyarch. Мультиплеер и зомби",
};

// Маппинг жанров для топ-продаж (приоритет над RAWG)
const topSellerGenres = {
  "Resident Evil Requiem": "Survival Horror",
  "EA SPORTS FC 26": "Спорт",
  "UFC 5": "Файтинг",
  "Grand Theft Auto V": "Экшен / Open World",
  "Minecraft": "Песочница",
  "It Takes Two": "Кооп-адвенчура",
  "ARC Raiders": "Шутер / Кооп",
  "REANIMAL": "Хоррор-адвенчура",
  "Reanimal": "Хоррор-адвенчура",
  "Forza Horizon 5": "Гонки / Open World",
  "Call of Duty: Black Ops 7": "Шутер / FPS",
};

// Жанры для предзаказов, у которых RAWG не возвращает жанр
const preorderGenreOverrides = {
  "Starfield": "Экшен-RPG",
  "Aphelion": "Экшен-адвенчура",
  "Diablo IV: Lord of Hatred": "Экшен-RPG",
  "Cthulhu: The Cosmic Abyss": "Хоррор",
  "Cthulhu: The Cosmic Abyss - R'lyeh Edition": "Хоррор",
  "Magin: The Rat Project Stories": "Карточная RPG",
  "Tides of Tomorrow": "Приключения",
  "DEAD OR ALIVE 6 Last Round": "Файтинг",
  "Echoes of Aincrad": "Экшен-RPG",
};

const genres = {
  "Action": "Экшен",
  "RPG": "RPG",
  "Shooter": "Шутер",
  "Fighting": "Файтинг",
  "Racing": "Гонки",
  "Strategy": "Стратегия",
  "Adventure": "Приключения",
  "Platformer": "Платформер",
  "Simulation": "Симулятор",
  "Sports": "Спорт",
  "Puzzle": "Головоломка",
  "Indie": "Инди",
  "Casual": "Казуальная",
  "Arcade": "Аркада",
  "Horror": "Хоррор",
  "Action RPG": "Экшен-RPG",
  "Action Soulslike": "Souls-like",
  "Survival Horror": "Survival Horror",
  "Action-adventure": "Экшен-адвенчура",
  "Massively Multiplayer": "MMO",
  "Board Games": "Настольные",
  "Educational": "Обучающие",
  "Card": "Карточная",
  "Family": "Семейная",
};

/**
 * Translate RAWG genre to Russian using the mapping.
 * Returns original if no mapping found.
 */
function translateGenre(genre) {
  if (!genre) return '';
  return genres[genre] || genre;
}

/**
 * Get Russian description for a game by name.
 * Falls back to null if not found.
 */
function getDescription(gameName) {
  if (!gameName) return null;
  return descriptions[gameName] || descriptions[gameName.trim()] || null;
}

function getTopSellerGenre(gameName) {
  return topSellerGenres[gameName] || null;
}

function getPreorderGenreOverride(gameName) {
  return preorderGenreOverrides[gameName] || null;
}

module.exports = { descriptions, genres, topSellerGenres, preorderGenreOverrides, translateGenre, getDescription, getTopSellerGenre, getPreorderGenreOverride };
