const http = require('http');

function agentPost(path) {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:3900${path}`, { timeout: 5000 }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

async function handle(ctx, text) {
  const arg = text
    .replace(/^\/парсинг\s*/i, '')
    .replace(/^парсинг[а-я]*\s*/i, '')
    .trim()
    .toLowerCase();

  if (arg === 'essential') {
    await ctx.reply('Запускаю проверку Essential...');
    try {
      await agentPost('/check-essential');
      return ctx.reply('Запущено. Результат придёт алертом.');
    } catch { return ctx.reply('Агент не отвечает.'); }
  }

  if (arg.includes('каталог') || arg === 'extra' || arg === 'deluxe') {
    await ctx.reply('Запускаю проверку каталогов...');
    try {
      await agentPost('/check-catalogs');
      return ctx.reply('Запущено. Результат придёт алертом.');
    } catch { return ctx.reply('Агент не отвечает.'); }
  }

  if (arg === 'курс' || arg === 'курсы') {
    await ctx.reply('Обновляю курс...');
    try {
      await agentPost('/update-rates');
      return ctx.reply('Курс обновлён.');
    } catch { return ctx.reply('Агент не отвечает.'); }
  }

  // Default: full parse
  await ctx.reply('Запускаю ночной парсинг... Это займёт 5-10 минут.');
  try {
    await agentPost('/parse');
    return ctx.reply('Парсинг запущен. Результат придёт алертом.');
  } catch {
    return ctx.reply('Агент не отвечает.');
  }
}

module.exports = { handle };
