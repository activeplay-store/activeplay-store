const { getModes } = require('../utils/agentData');

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

async function handle(ctx) {
  const modes = getModes();

  const modeLines = Object.entries(DISPLAY_NAMES)
    .map(([key, name]) => `  ${name}: ${MODE_ICONS[modes[key]] || modes[key] || 'auto'}`)
    .join('\n');

  await ctx.reply(
`⚙️ Настройки

Режимы модулей:
${modeLines}

Пороги алертов:
  Скачок курса: > 0.03₽
  Расхождение цен: > 15%

Управление: /режим, /коэфф`
  );
}

module.exports = { handle };
