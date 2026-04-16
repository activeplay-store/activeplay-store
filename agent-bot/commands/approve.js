const http = require('http');
const { Markup } = require('telegraf');

// Pending approvals: id → { type, preview, data, messageIds }
const pending = new Map();

// Очистка через 24 часа
setInterval(() => {
  const now = Date.now();
  for (const [id, item] of pending) {
    if (now - item.createdAt > 86400000) pending.delete(id);
  }
}, 3600000);

async function handleApprove(req, res, bot, allowedIds) {
  // Проверка localhost
  const ip = req.socket.remoteAddress;
  if (ip !== '127.0.0.1' && ip !== '::1' && ip !== '::ffff:127.0.0.1') {
    res.statusCode = 403;
    res.end(JSON.stringify({ error: 'forbidden' }));
    return;
  }

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

  const { id, type, preview } = data;
  if (!id || !type || !preview) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'id, type, preview required' }));
    return;
  }

  const TYPE_NAMES = {
    news: 'Новость',
    gameDeals: 'Скидки игр',
    subDeals: 'Скидки подписок',
    lifecycle: 'Жизненный цикл',
    guides: 'Гайд'
  };

  const title = TYPE_NAMES[type] || type;
  const text = `📋 Одобрение: ${title}\n\n${preview}`;

  pending.set(id, { ...data, createdAt: Date.now(), messageIds: [] });

  console.log(`[Бот] Запрос одобрения: ${id} (${type})`);

  let sent = 0;
  for (const userId of allowedIds) {
    try {
      const msg = await bot.telegram.sendMessage(userId, text, Markup.inlineKeyboard([
        Markup.button.callback('✅ Опубликовать', `approve_${id}`),
        Markup.button.callback('❌ Отклонить', `reject_${id}`)
      ]));
      pending.get(id).messageIds.push({ chatId: userId, messageId: msg.message_id });
      sent++;
    } catch (err) {
      console.error(`[Бот] Не удалось отправить одобрение ${userId}: ${err.message}`);
    }
  }

  res.end(JSON.stringify({ ok: true, sent }));
}

async function handleCallback(ctx, data) {
  const isApprove = data.startsWith('approve_');
  const id = data.replace(/^(approve_|reject_)/, '');
  const item = pending.get(id);

  if (!item) {
    return ctx.editMessageText('⚠️ Запрос истёк или уже обработан.');
  }

  const approved = isApprove;
  const statusText = approved ? '✅ Опубликовано' : '❌ Отклонено';

  // Отправить решение агенту
  try {
    await new Promise((resolve, reject) => {
      const postData = JSON.stringify({ id, approved });
      const req = http.request({
        hostname: 'localhost',
        port: 3900,
        path: '/publish',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      }, res => {
        let body = '';
        res.on('data', c => body += c);
        res.on('end', () => resolve(body));
      });
      req.on('error', reject);
      req.write(postData);
      req.end();
    });
  } catch (err) {
    console.error(`[Бот] Ошибка отправки решения: ${err.message}`);
  }

  // Обновить все сообщения
  for (const { chatId, messageId } of item.messageIds) {
    try {
      await ctx.telegram.editMessageText(chatId, messageId, null,
        `${item.preview || ''}\n\n${statusText} (${ctx.from.first_name})`
      );
    } catch { /* уже обновлено */ }
  }

  pending.delete(id);
  console.log(`[Бот] Одобрение ${id}: ${statusText}`);
}

module.exports = { handleApprove, handleCallback };
