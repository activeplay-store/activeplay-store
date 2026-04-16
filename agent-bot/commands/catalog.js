const fs = require('fs');
const path = require('path');

const CATALOGS_DIR = path.join(process.env.AGENT_DATA_PATH || '/var/www/activeplay-store/agent/data', 'catalogs');

function loadCatalog(name) {
  try {
    return JSON.parse(fs.readFileSync(path.join(CATALOGS_DIR, `${name}.json`), 'utf8'));
  } catch {
    return { games: [], updatedAt: null };
  }
}

function formatDate(iso) {
  if (!iso) return 'нет данных';
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

async function handle(ctx, text) {
  const arg = (text || '').replace(/^\/каталог\s*/i, '').replace(/^каталог\s*/i, '').trim().toLowerCase();

  if (arg === 'essential' || arg === '') {
    const data = loadCatalog('essential');
    if (!data.games.length) {
      return ctx.reply('📦 Essential: каталог пуст\n\nИгры появятся после первого обновления.');
    }
    const lines = data.games.map((g, i) => `${i + 1}. ${g.name} (${(g.platforms || ['PS5']).join(', ')})`);
    return ctx.reply(`📦 PS Plus Essential — ${data.month || ''}\nОбновлено: ${formatDate(data.updatedAt)}\n\n${lines.join('\n')}`);
  }

  if (arg === 'extra') {
    const data = loadCatalog('extra');
    return ctx.reply(`📦 PS Plus Extra\nИгр в каталоге: ${data.games.length}\nОбновлено: ${formatDate(data.updatedAt)}`);
  }

  if (arg === 'classics' || arg === 'deluxe') {
    const data = loadCatalog('classics');
    return ctx.reply(`📦 Deluxe Classics\nИгр в каталоге: ${data.games.length}\nОбновлено: ${formatDate(data.updatedAt)}`);
  }

  if (arg === 'проверка' || arg === 'check') {
    await ctx.reply('🔍 Запуск проверки каталогов...');
    try {
      const resp = await fetch('http://localhost:3900/check-catalogs');
      const result = await resp.json();
      if (result.error) return ctx.reply(`❌ Ошибка: ${result.error}`);
      const lines = [];
      if (result.essential) lines.push(`Essential: ${result.essential.changed ? 'обновлён' : 'без изменений'}`);
      if (result.extra) lines.push(`Extra: ${result.extra.changed ? 'обновлён' : 'без изменений'}`);
      if (result.classics) lines.push(`Classics: ${result.classics.changed ? 'обновлён' : 'без изменений'}`);
      return ctx.reply(`✅ Проверка завершена\n${lines.join('\n')}`);
    } catch (err) {
      return ctx.reply(`❌ Ошибка: ${err.message}`);
    }
  }

  return ctx.reply('📦 Каталоги:\n/каталог — Essential\n/каталог extra — Extra\n/каталог classics — Classics\n/каталог проверка — ручная проверка');
}

module.exports = { handle };
