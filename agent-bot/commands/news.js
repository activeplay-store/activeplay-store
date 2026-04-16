const http = require('http');

function agentPost(path) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3900,
      path,
      method: 'POST',
      timeout: 8000,
      headers: { 'Content-Type': 'application/json', 'Content-Length': 0 },
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve(data);
        else reject(new Error(`HTTP ${res.statusCode}: ${data}`));
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.end();
  });
}

async function handle(ctx) {
  await ctx.reply('🔄 Запускаю сбор новостей... ~1-2 минуты');
  try {
    await agentPost('/trigger-news');
    return ctx.reply('✅ Цикл запущен. Новости придут на одобрение.');
  } catch (err) {
    console.error('[news] Error:', err.message);
    return ctx.reply(`⚠️ Агент не отвечает: ${err.message}`);
  }
}

module.exports = { handle };
