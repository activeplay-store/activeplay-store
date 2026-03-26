/**
 * Маппинг описаний и жанров игр на русском языке.
 * Приоритет: этот маппинг → RAWG description_raw (если нет в маппинге).
 */

const descriptions = {
  // ПРЕДЗАКАЗЫ
  "Darwin's Paradox!": "Экшен-платформер от ZDT Studio и Konami. Стелс, маскировка и чернила осьминога",
  "Starfield": "Экшен-RPG в открытом космосе от Bethesda. Тысячи планет в звёздных системах",
  "The Occultist": "Хоррор-приключение от DALOAR и Daedalic. Паранормальное расследование с мистическим маятником",
  "PRAGMATA": "Sci-fi экшен-адвенчура от Capcom. Дуэт человека и андроида-хакера",
  "Pragmata": "Sci-fi экшен-адвенчура от Capcom. Дуэт человека и андроида-хакера",
  "Cthulhu: The Cosmic Abyss": "Нарративный хоррор от Big Bad Wolf и Nacon. Лавкрафтовское расследование в затонувшем Р'льехе",
  "Cthulhu: The Cosmic Abyss - R'lyeh Edition": "Нарративный хоррор от Big Bad Wolf и Nacon. Лавкрафтовское расследование в затонувшем Р'льехе",
  "Jay and Silent Bob: Chronic Blunt Punch": "Аркадный beat 'em up от Interabang и Digital Eclipse. Кооп с озвучкой Кевина Смита",
  "Sudden Strike 5": "Тактическая стратегия от KITE Games и Kalypso. Масштабные бои Второй мировой, 300+ юнитов",
  "Sudden Strike 5 Deluxe Edition": "Тактическая стратегия от KITE Games и Kalypso. Масштабные бои Второй мировой, 300+ юнитов",
  "Tides of Tomorrow": "Нарративное приключение от DigixArt и THQ Nordic. Решения других игроков меняют твою историю",
  "Diablo IV: Lord of Hatred": "Экшен-RPG дополнение от Blizzard. Два новых класса — Паладин и Чернокнижник",
  "MotoGP 26": "Мотогоночный симулятор от Milestone. Динамические рейтинги гонщиков по реальным заездам",
  "Aphelion": "Sci-fi экшен-адвенчура от DON'T NOD. Два астронавта выживают на ледяной девятой планете",
  "SAROS": "Рогалик-шутер от Housemarque и PlayStation Studios. Поглощай вражеские пули щитом и бей в ответ",
  "Saros": "Рогалик-шутер от Housemarque и PlayStation Studios. Поглощай вражеские пули щитом и бей в ответ",
  "Magin: The Rat Project Stories": "Нарративный deck-builder от The Rat Project и Daedalic. Эмоции героев влияют на карточные бои",
  "Invincible VS": "2D-файтинг от Quarter Up и Skybound. Брутальные 3v3 бои героев Invincible",
  "Directive 8020": "Sci-fi хоррор-драма от Supermassive Games. Выживи среди инопланетных мимиков",
  "LEGO Batman: Legacy of the Dark Knight": "Экшен-адвенчура от TT Games и Warner Bros. Открытый мир Готэма, 100 костюмов Бэтмена",
  "007 First Light": "Стелс-экшен от IO Interactive. Оригинальная история молодого Джеймса Бонда",
  "Wandering Sword": "Wuxia-RPG от The Swordman Studio. 20 концовок и два режима боя",
  "The Adventures of Elliot: The Millennium Tales": "HD-2D экшен-RPG от Square Enix (Team Asano). Приключение с феей в стиле Zelda",
  "The Adventures of Elliot": "HD-2D экшен-RPG от Square Enix (Team Asano). Приключение с феей в стиле Zelda",
  "DEAD OR ALIVE 6 Last Round": "3D-файтинг от Team NINJA и Koei Tecmo. Финальная версия DOA6 — 29 бойцов на PS5",
  "Echoes of Aincrad": "Экшен-RPG от Bandai Namco по Sword Art Online. Создай героя и покоряй замок Айнкрад",
  "MARVEL Tōkon: Fighting Souls": "2.5D файтинг от Arc System Works и PlayStation Studios. Зрелищные 4v4 бои героев Marvel",
  "MARVEL Tokon: Fighting Souls": "2.5D файтинг от Arc System Works и PlayStation Studios. Зрелищные 4v4 бои героев Marvel",
  "METAL GEAR SOLID: MASTER COLLECTION Vol.2": "Стелс-экшен коллекция от Konami. MGS4, Peace Walker и Ghost Babel — впервые на PS5",
  "Mega Man Star Force Legacy Collection": "Экшен-RPG сборник от Capcom. Все 7 версий Mega Man Star Force — ремастер на PS5",

  // НОВИНКИ
  "Crimson Desert": "Open-world экшен-RPG от Pearl Abyss. Огромный мир, хардкорный бой, 3 млн копий за неделю",
  "Resident Evil Requiem": "Survival horror от Capcom. Два героя, классический RE, Metacritic 88",
  "Resident Evil 9: Requiem": "Survival horror от Capcom. Два героя, классический RE, Metacritic 88",
  "Nioh 3": "Souls-like экшен от Team Ninja. Открытый мир, кооператив, Metacritic 86",
  "Monster Hunter Stories 3": "JRPG от Capcom. 120+ монстров, пошаговые бои, HD-2D графика",
  "Marathon": "Extraction-шутер от Bungie и PlayStation Studios. PvPvE: добудь снаряжение или потеряй всё",

  // ТОП-ПРОДАЖИ (для generateTopSellers)
  "EA SPORTS FC 26": "Футбольный симулятор от EA Sports. Новый движок, 19 000+ игроков, HyperMotionV",
  "UFC 5": "MMA-симулятор от EA Sports. Новый урон, реалистичные нокауты, 250+ бойцов",
  "Grand Theft Auto V": "Open-world экшен от Rockstar Games. Три героя в Лос-Сантосе, GTA Online в комплекте",
  "Minecraft": "Песочница от Mojang Studios. Бесконечный мир, крафтинг, выживание и креатив",
  "It Takes Two": "Кооп-адвенчура от Hazelight Studios. Сюжетная игра на двоих, Game of the Year 2021",
  "ARC Raiders": "Sci-fi кооп-шутер от Embark Studios. Сражения с роботами на пост-апокалиптической Земле",
  "REANIMAL": "Хоррор-адвенчура от Naughty Dog. Мрачная сказка, два ребёнка и их чудовище-друг",
  "Reanimal": "Хоррор-адвенчура от Naughty Dog. Мрачная сказка, два ребёнка и их чудовище-друг",
  "Forza Horizon 5": "Аркадные гонки от Playground Games. Мексика, 800+ машин, открытый мир",
  "Call of Duty: Black Ops 7": "Тактический FPS от Treyarch. Мультиплеер, зомби-режим, кампания",
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

module.exports = { descriptions, genres, translateGenre, getDescription };
