const http = require('http');
const { getRates, getAnchors, getGames } = require('../utils/agentData');

function checkAgent() {
  return new Promise(resolve => {
    const req = http.get('http://localhost:3900/', { timeout: 3000 }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ ok: true, uptime: json.uptime });
        } catch {
          resolve({ ok: true, uptime: null });
        }
      });
    });
    req.on('error', () => resolve({ ok: false }));
    req.on('timeout', () => { req.destroy(); resolve({ ok: false }); });
  });
}

function formatDate(isoStr) {
  if (!isoStr) return 'неизвестно';
  return new Date(isoStr).toLocaleString('ru-RU', {
    timeZone: 'Europe/Moscow',
    day: '2-digit', month: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
}

async function handle(ctx) {
  // Курсы
  const rates = getRates();
  let ratesStatus;
  if (rates) {
    ratesStatus = `✅ (обновлено ${formatDate(rates.updatedAt)})`;
  } else {
    ratesStatus = '⚠️ не запущен';
  }

  // Калькулятор
  const anchors = getAnchors();
  let calcStatus;
  if (anchors) {
    const trPts = anchors.TR?.anchors?.length || 0;
    const uaPts = anchors.UA?.anchors?.length || 0;
    calcStatus = `✅ (TR: ${trPts} точек, UA: ${uaPts} точек)`;
  } else {
    calcStatus = '⚠️ не запущен';
  }

  // Парсер
  const games = getGames();
  let parserStatus;
  let lastParse = '';
  if (games && games.games) {
    const total = games.games.length;
    const deals = games.games.filter(g =>
      Object.values(g.prices).some(r => r.editions?.some(e => e.salePrice))
    ).length;
    const preorders = games.games.filter(g => g.status === 'preorder').length;
    parserStatus = `✅ (${total} игр, ${deals} со скидкой, ${preorders} предзаказов)`;
    lastParse = `\nПоследний парсинг: ${formatDate(games.updatedAt)}`;
  } else {
    parserStatus = '⚠️ не запущен';
  }

  // Агент
  const agent = await checkAgent();
  const agentStatus = agent.ok ? '🟢 работает' : '🔴 не отвечает';

  // Бот
  const uptimeSec = process.uptime();
  const hours = Math.floor(uptimeSec / 3600);
  const mins = Math.floor((uptimeSec % 3600) / 60);
  const botUptime = hours > 0 ? `${hours}ч ${mins}м` : `${mins}м`;

  await ctx.reply(
`📊 Статус AI-агента

Модули:
  📈 Курсы: ${ratesStatus} (10:00, 17:00 МСК)
  💰 Калькулятор: ${calcStatus}
  🎮 Парсер: ${parserStatus}
  📋 Essential: 8-го числа 4:00 МСК
  📋 Extra/Deluxe: 20-го числа 4:00 МСК
${lastParse}
Расписание: парсинг 3:00 МСК, курс 10:00+17:00

Агент (ap-agent): ${agentStatus}
Бот (ap-agent-bot): 🟢 аптайм ${botUptime}

Ручной запуск: /парсинг`
  );
}

module.exports = { handle };
