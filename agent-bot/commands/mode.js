const { getModes, writeModes } = require('../utils/agentData');

const NAME_MAP = {
  'курсы': 'rates', 'курс': 'rates',
  'цены': 'prices', 'цена': 'prices',
  'скидки игр': 'gameDeals', 'скидки': 'gameDeals',
  'скидки подписок': 'subDeals', 'подписки': 'subDeals',
  'новости': 'news',
  'жизненный цикл': 'lifecycle', 'новинки': 'lifecycle',
  'гайды': 'guides', 'статьи': 'guides'
};

const DISPLAY_NAMES = {
  rates: 'Курсы',
  prices: 'Цены',
  gameDeals: 'Скидки игр',
  subDeals: 'Скидки подписок',
  news: 'Новости',
  lifecycle: 'Жизненный цикл',
  guides: 'Гайды'
};

const MODE_ICONS = {
  auto: '🟢 auto',
  approval: '🟡 approval',
  notify: '🔵 notify'
};

async function handle(ctx, text) {
  const args = text
    .replace(/^\/режим\s*/i, '')
    .replace(/^режим[а-я]*\s*/i, '')
    .replace(/^mode\s*/i, '')
    .trim();

  const modes = getModes();

  // /режим — показать все
  if (!args) {
    return showAll(ctx, modes);
  }

  // Парсить: "новости auto" или "новости"
  const parts = args.split(/\s+/);
  let targetKey = null;

  // Поиск ключа по русскому названию
  for (const [name, key] of Object.entries(NAME_MAP)) {
    if (args.toLowerCase().startsWith(name)) {
      targetKey = key;
      break;
    }
  }

  // Или по английскому ключу
  if (!targetKey && DISPLAY_NAMES[parts[0]]) {
    targetKey = parts[0];
  }

  if (!targetKey) {
    return ctx.reply(`⚠️ Неизвестный модуль: "${parts[0]}"\nДоступные: ${Object.values(DISPLAY_NAMES).join(', ')}`);
  }

  // Если указан новый режим
  const newMode = parts[parts.length - 1].toLowerCase();
  if (['auto', 'approval', 'notify'].includes(newMode) && parts.length > 1) {
    const oldMode = modes[targetKey];
    modes[targetKey] = newMode;
    writeModes(modes);
    return ctx.reply(`✅ ${DISPLAY_NAMES[targetKey]}: ${MODE_ICONS[oldMode]} → ${MODE_ICONS[newMode]}`);
  }

  // Просто показать текущий режим
  return ctx.reply(`${DISPLAY_NAMES[targetKey]}: ${MODE_ICONS[modes[targetKey]] || modes[targetKey]}`);
}

function showAll(ctx, modes) {
  const lines = ['🔧 Режимы модулей\n'];

  for (const [key, display] of Object.entries(DISPLAY_NAMES)) {
    const mode = modes[key] || 'auto';
    lines.push(`  ${display}: ${MODE_ICONS[mode] || mode}`);
  }

  lines.push('\nДоступные режимы: auto, approval, notify');
  lines.push('Пример: /режим новости auto');

  return ctx.reply(lines.join('\n'));
}

module.exports = { handle };
