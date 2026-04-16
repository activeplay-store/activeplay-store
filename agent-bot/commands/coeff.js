const { Markup } = require('telegraf');
const { getAnchors, writeAnchors, restoreAnchorsBackup } = require('../utils/agentData');

// Путь к pricing модулю агента
const PRICING_PATH = process.env.AGENT_DATA_PATH
  ? require('path').resolve(process.env.AGENT_DATA_PATH, '..', 'src', 'modules', 'pricing')
  : '/var/www/activeplay-store/agent/src/modules/pricing';

let pricing = null;
try { pricing = require(PRICING_PATH); } catch { /* не на сервере */ }

// Хранение pending изменений (для inline-кнопок)
const pendingChanges = new Map();

async function handle(ctx, text) {
  const args = text
    .replace(/^\/коэфф\s*/i, '')
    .replace(/^коэфф[а-я]*\s*/i, '')
    .replace(/^coefficient\s*/i, '')
    .trim();

  const anchors = getAnchors();
  if (!anchors) {
    return ctx.reply('⚠️ anchors.json не найден.');
  }

  // /коэфф откат
  if (args.toLowerCase().startsWith('откат') || args.toLowerCase().startsWith('rollback')) {
    const ok = restoreAnchorsBackup();
    return ctx.reply(ok ? '✅ Откат выполнен. anchors.json восстановлен из бэкапа.' : '⚠️ Бэкап не найден.');
  }

  // /коэфф TR или /коэфф UA — показать точки региона
  const regionMatch = args.match(/^(TR|UA|турци|украин)/i);
  if (regionMatch && !args.includes('-') && !args.match(/\d+\s+\d/)) {
    const region = args.toUpperCase().startsWith('T') || args.toLowerCase().startsWith('турц') ? 'TR' : 'UA';
    return showRegionAnchors(ctx, anchors, region);
  }

  // /коэфф TR 1000-1500 -0.05 — сдвиг в диапазоне
  const shiftMatch = args.match(/^(TR|UA)\s+(\d+)\s*[-–]\s*(\d+)\s+([+-]?\d+\.?\d*)(%)?\s*$/i);
  if (shiftMatch) {
    const region = shiftMatch[1].toUpperCase();
    const from = parseInt(shiftMatch[2]);
    const to = parseInt(shiftMatch[3]);
    const value = parseFloat(shiftMatch[4]);
    const isPercent = !!shiftMatch[5];
    return previewShift(ctx, anchors, region, from, to, value, isPercent);
  }

  // /коэфф TR 1200 2.65 — установить конкретную точку
  const setMatch = args.match(/^(TR|UA)\s+(\d+)\s+(\d+\.?\d*)\s*$/i);
  if (setMatch) {
    const region = setMatch[1].toUpperCase();
    const price = parseInt(setMatch[2]);
    const coeff = parseFloat(setMatch[3]);
    return previewSet(ctx, anchors, region, price, coeff);
  }

  // /коэфф — сводка
  return showSummary(ctx, anchors);
}

function showSummary(ctx, anchors) {
  const lines = ['📊 Якорные точки\n'];

  for (const region of ['TR', 'UA']) {
    const data = anchors[region];
    if (!data?.anchors) continue;

    const pts = data.anchors;
    const minCoeff = Math.min(...pts.map(p => p[1]));
    const maxCoeff = Math.max(...pts.map(p => p[1]));
    lines.push(`${region}: ${pts.length} точек, коэфф ${minCoeff}–${maxCoeff}, базовый курс ${data.baseCourse}`);
  }

  lines.push('');
  lines.push('Команды:');
  lines.push('  /коэфф TR — все точки Турции');
  lines.push('  /коэфф TR 1000-1500 -0.05 — сдвиг');
  lines.push('  /коэфф TR 1200 2.65 — установить');
  lines.push('  /коэфф откат — откат');

  return ctx.reply(lines.join('\n'));
}

function showRegionAnchors(ctx, anchors, region) {
  const data = anchors[region];
  if (!data?.anchors) return ctx.reply(`⚠️ Нет данных для ${region}`);

  const lines = [`📊 Якорные точки ${region} (базовый курс ${data.baseCourse})\n`];

  for (const [price, coeff] of data.anchors) {
    let example = '';
    if (pricing) {
      try {
        const r = pricing.calculatePrice(price, region);
        example = ` → ${r.clientPrice}₽ (маржа ${r.marginPct}%)`;
      } catch { /* skip */ }
    }
    lines.push(`  ${price} → ${coeff}${example}`);
  }

  return ctx.reply(lines.join('\n'));
}

async function previewShift(ctx, anchors, region, from, to, value, isPercent) {
  const data = anchors[region];
  if (!data?.anchors) return ctx.reply(`⚠️ Нет данных для ${region}`);

  const affected = data.anchors.filter(([p]) => p >= from && p <= to);
  if (affected.length === 0) return ctx.reply(`⚠️ Нет точек в диапазоне ${from}–${to}`);

  const changeLabel = isPercent ? `${value > 0 ? '+' : ''}${value}%` : `${value > 0 ? '+' : ''}${value}`;

  const lines = [`📊 Изменение коэффициентов ${region}\n`];
  lines.push(`Диапазон: ${from}–${to}`);
  lines.push(`Сдвиг: ${changeLabel}`);
  lines.push(`Затронуто точек: ${affected.length}\n`);
  lines.push('Примеры пересчёта:');

  // Показать до 3 примеров
  const samples = affected.length <= 3 ? affected : [affected[0], affected[Math.floor(affected.length / 2)], affected[affected.length - 1]];
  for (const [price, oldCoeff] of samples) {
    const newCoeff = isPercent
      ? Math.round(oldCoeff * (1 + value / 100) * 100) / 100
      : Math.round((oldCoeff + value) * 100) / 100;

    let example = '';
    if (pricing) {
      try {
        const oldR = pricing.calculatePrice(price, region);
        // Для нового — нужно временный расчёт, просто покажем разницу по коэфф
        const newClientPrice = Math.ceil(price * newCoeff / 50) * 50;
        example = ` (было ${oldR.clientPrice}₽ → стало ${newClientPrice}₽)`;
      } catch { /* skip */ }
    }
    lines.push(`  ${price}: ${oldCoeff} → ${newCoeff}${example}`);
  }

  lines.push('\nПрименить?');

  // Сохранить pending
  const key = `${Date.now()}`;
  pendingChanges.set(key, { type: 'shift', region, from, to, value, isPercent });

  // Очистка через 5 мин
  setTimeout(() => pendingChanges.delete(key), 300000);

  return ctx.reply(lines.join('\n'), Markup.inlineKeyboard([
    Markup.button.callback('✅ Применить', `coeff_apply_${key}`),
    Markup.button.callback('❌ Отмена', `coeff_cancel_${key}`)
  ]));
}

async function previewSet(ctx, anchors, region, price, coeff) {
  const data = anchors[region];
  if (!data?.anchors) return ctx.reply(`⚠️ Нет данных для ${region}`);

  const existing = data.anchors.find(([p]) => p === price);
  const action = existing ? `заменить ${existing[1]} → ${coeff}` : `добавить новую точку`;

  const lines = [`📊 Установка точки ${region}\n`];
  lines.push(`Цена: ${price}`);
  lines.push(`Коэффициент: ${coeff}`);
  lines.push(`Действие: ${action}`);
  lines.push('\nПрименить?');

  const key = `${Date.now()}`;
  pendingChanges.set(key, { type: 'set', region, price, coeff });
  setTimeout(() => pendingChanges.delete(key), 300000);

  return ctx.reply(lines.join('\n'), Markup.inlineKeyboard([
    Markup.button.callback('✅ Применить', `coeff_apply_${key}`),
    Markup.button.callback('❌ Отмена', `coeff_cancel_${key}`)
  ]));
}

async function handleCallback(ctx, data) {
  const [, action, key] = data.split('_');

  if (action === 'cancel') {
    pendingChanges.delete(key);
    return ctx.editMessageText('❌ Отменено.');
  }

  if (action === 'apply') {
    const change = pendingChanges.get(key);
    if (!change) return ctx.editMessageText('⚠️ Изменение истекло. Повтори команду.');

    const anchors = getAnchors();
    if (!anchors) return ctx.editMessageText('⚠️ anchors.json не найден.');

    const regionData = anchors[change.region];
    if (!regionData?.anchors) return ctx.editMessageText('⚠️ Нет данных региона.');

    if (change.type === 'shift') {
      for (let i = 0; i < regionData.anchors.length; i++) {
        const [price, coeff] = regionData.anchors[i];
        if (price >= change.from && price <= change.to) {
          const newCoeff = change.isPercent
            ? Math.round(coeff * (1 + change.value / 100) * 100) / 100
            : Math.round((coeff + change.value) * 100) / 100;
          regionData.anchors[i] = [price, newCoeff];
        }
      }
    } else if (change.type === 'set') {
      const idx = regionData.anchors.findIndex(([p]) => p === change.price);
      if (idx >= 0) {
        regionData.anchors[idx] = [change.price, change.coeff];
      } else {
        regionData.anchors.push([change.price, change.coeff]);
        regionData.anchors.sort((a, b) => a[0] - b[0]);
      }
    }

    const ok = writeAnchors(anchors);
    pendingChanges.delete(key);

    return ctx.editMessageText(ok ? '✅ Применено. Бэкап сохранён в anchors.backup.json.' : '⚠️ Ошибка записи.');
  }
}

module.exports = { handle, handleCallback };
