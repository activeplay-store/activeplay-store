const ALERT_ICONS = {
  rate_spike: '🚨',
  source_down: '⚠️',
  sub_deal: '🎉',
  price_discrepancy: '⚡',
  cbr_error: '🔴',
  parse_complete: '✅',
  new_deals: '🆕',
  new_preorders: '📦'
};

const ALERT_TITLES = {
  rate_spike: 'Скачок курса',
  source_down: 'Источник недоступен',
  sub_deal: 'Скидка на подписку',
  price_discrepancy: 'Расхождение цен',
  cbr_error: 'Ошибка ЦБ',
  parse_complete: 'Парсинг завершён',
  new_deals: 'Новые скидки',
  new_preorders: 'Новые предзаказы'
};

async function handleAlert(req, res, bot, allowedIds) {
  // Проверка localhost
  const ip = req.socket.remoteAddress;
  if (ip !== '127.0.0.1' && ip !== '::1' && ip !== '::ffff:127.0.0.1') {
    res.statusCode = 403;
    res.end(JSON.stringify({ error: 'forbidden' }));
    return;
  }

  // Парсинг body
  let body = '';
  for await (const chunk of req) body += chunk;

  let data;
  try {
    data = JSON.parse(body);
  } catch {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'invalid json' }));
    return;
  }

  const { type, message } = data;
  if (!type || !message) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'type and message required' }));
    return;
  }

  const icon = ALERT_ICONS[type] || '📢';
  const title = ALERT_TITLES[type] || type;
  const text = `${icon} Алерт: ${title}\n\n${message}`;

  console.log(`[Бот] Алерт ${type}: ${message}`);

  // Отправить всем
  let sent = 0;
  for (const id of allowedIds) {
    try {
      await bot.telegram.sendMessage(id, text);
      sent++;
    } catch (err) {
      console.error(`[Бот] Не удалось отправить алерт ${id}: ${err.message}`);
    }
  }

  res.end(JSON.stringify({ ok: true, sent }));
}

module.exports = { handleAlert };
