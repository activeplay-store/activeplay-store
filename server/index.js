/**
 * VK Bridge + Chatwoot Auto-Reply Server
 * PM2 process: vk-bridge, port 3600
 *
 * Endpoints:
 *   POST /chatwoot-webhook — handles Chatwoot webhooks (outgoing→VK + incoming auto-reply)
 *   POST /vk-callback     — handles VK callback API (incoming VK messages → Chatwoot)
 *
 * Deploy: copy to /opt/vk-bridge/index.js on server, then pm2 restart vk-bridge
 */

const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

// ═══════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════

const PORT = 3600;
const VK_CONFIRMATION_CODE = 'bd10b591';

const CHATWOOT_BASE = 'http://127.0.0.1:3500';
const CHATWOOT_ACCOUNT_ID = 1;
const CHATWOOT_API_TOKEN = '9Kw1x6XXKcXQJkY9D7snD2sY';

const VK_ACCESS_TOKEN = process.env.VK_ACCESS_TOKEN || '';
const VK_API_VERSION = '5.199';

// Inbox IDs in Chatwoot
const INBOX_TELEGRAM = 1;
const INBOX_WEBSITE = 2;
const INBOX_VK = 4;

// ═══════════════════════════════════════════════════════
// AUTO-REPLY LOOP PROTECTION
// ═══════════════════════════════════════════════════════

// Track conversations that already received an auto-reply
const repliedConversations = new Set();

// Clean up the set every 24 hours to prevent unbounded growth
setInterval(() => {
  repliedConversations.clear();
}, 24 * 60 * 60 * 1000);

// ═══════════════════════════════════════════════════════
// PRODUCT CODE PARSING
// ═══════════════════════════════════════════════════════

const PLATFORM_MAP = {
  psplus: 'PS Plus',
  xbox_gamepass: 'Xbox Game Pass',
  eaplay: 'EA Play',
  psstore: 'Карта PS Store',
};

const TIER_MAP = {
  essential: 'Essential',
  extra: 'Extra',
  deluxe: 'Deluxe',
  ultimate: 'Ultimate',
  core: 'Core',
  standard: 'Standard',
  basic: '',
};

const PERIOD_MAP = {
  '1m': '1 мес',
  '3m': '3 мес',
  '12m': '12 мес',
};

const REGION_MAP = {
  turkey: 'Турция',
  ukraine: 'Украина',
  india: 'Индия',
  global: 'Глобальный',
};

/**
 * Format price with thousands separator: 1490 → "1 490 ₽"
 */
function formatPrice(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
}

/**
 * Parse product code into human-readable name.
 *
 * Formats:
 *   psplus_extra_1m_turkey_1490
 *   xbox_gamepass_ultimate_1m_global_1590
 *   eaplay_basic_12m_global_1990
 *   psstore_1000tl_turkey_2900
 */
function parseProductCode(code) {
  if (!code) return null;

  // PS Store gift cards: psstore_1000tl_turkey_2900
  if (code.startsWith('psstore_')) {
    const parts = code.split('_'); // psstore, 1000tl, turkey, 2900
    const nominal = (parts[1] || '').toUpperCase().replace(/(\d+)/, '$1 ');
    const region = REGION_MAP[parts[2]] || parts[2];
    const price = parseInt(parts[3], 10) || 0;
    return `Карта PS Store ${nominal.trim()} (${region}) — ${formatPrice(price)}`;
  }

  // Xbox Game Pass: xbox_gamepass_ultimate_1m_global_1590
  if (code.startsWith('xbox_gamepass_')) {
    const parts = code.split('_'); // xbox, gamepass, ultimate, 1m, global, 1590
    const tier = TIER_MAP[parts[2]] || parts[2];
    const period = PERIOD_MAP[parts[3]] || parts[3];
    const region = REGION_MAP[parts[4]] || parts[4];
    const price = parseInt(parts[5], 10) || 0;
    return `Xbox Game Pass ${tier} (${period}, ${region}) — ${formatPrice(price)}`;
  }

  // PS Plus: psplus_extra_1m_turkey_1490
  if (code.startsWith('psplus_')) {
    const parts = code.split('_'); // psplus, extra, 1m, turkey, 1490
    const tier = TIER_MAP[parts[1]] || parts[1];
    const period = PERIOD_MAP[parts[2]] || parts[2];
    const region = REGION_MAP[parts[3]] || parts[3];
    const price = parseInt(parts[4], 10) || 0;
    return `PS Plus ${tier} (${period}, ${region}) — ${formatPrice(price)}`;
  }

  // EA Play: eaplay_basic_12m_global_1990
  if (code.startsWith('eaplay_')) {
    const parts = code.split('_'); // eaplay, basic, 12m, global, 1990
    const period = PERIOD_MAP[parts[2]] || parts[2];
    const price = parseInt(parts[4], 10) || 0;
    return `EA Play (${period}) — ${formatPrice(price)}`;
  }

  return null;
}

/**
 * Extract product name from incoming message text.
 * Supports:
 *   "/start psplus_extra_1m_turkey_1490" (Telegram)
 *   "Хочу оформить: PS Plus Extra ..." (website chat)
 */
function extractProductFromMessage(text) {
  if (!text) return null;

  // Telegram bot /start command
  const startMatch = text.match(/^\/start\s+(\S+)/);
  if (startMatch) {
    return parseProductCode(startMatch[1]);
  }

  // Website chat: already human-readable
  const orderMatch = text.match(/^Хочу оформить:\s*(.+)/);
  if (orderMatch) {
    return orderMatch[1].trim();
  }

  // Check if the text itself is a product code
  const parsed = parseProductCode(text.trim());
  if (parsed) return parsed;

  return null;
}

// ═══════════════════════════════════════════════════════
// CHATWOOT API HELPERS
// ═══════════════════════════════════════════════════════

async function sendChatwootMessage(conversationId, content) {
  const url = `${CHATWOOT_BASE}/api/v1/accounts/${CHATWOOT_ACCOUNT_ID}/conversations/${conversationId}/messages`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        api_access_token: CHATWOOT_API_TOKEN,
      },
      body: JSON.stringify({
        content,
        message_type: 'outgoing',
      }),
    });
    if (!res.ok) {
      console.error(`[Chatwoot] Failed to send message to conv ${conversationId}: ${res.status}`);
    }
  } catch (err) {
    console.error(`[Chatwoot] Error sending message:`, err.message);
  }
}

// ═══════════════════════════════════════════════════════
// VK API HELPERS
// ═══════════════════════════════════════════════════════

async function sendVkMessage(userId, message) {
  const url = `https://api.vk.com/method/messages.send?` +
    `user_id=${userId}` +
    `&message=${encodeURIComponent(message)}` +
    `&random_id=${Date.now()}` +
    `&access_token=${VK_ACCESS_TOKEN}` +
    `&v=${VK_API_VERSION}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.error) {
      console.error(`[VK] Error sending message:`, data.error);
    }
  } catch (err) {
    console.error(`[VK] Request error:`, err.message);
  }
}

// ═══════════════════════════════════════════════════════
// CHATWOOT WEBHOOK
// ═══════════════════════════════════════════════════════

app.post('/chatwoot-webhook', async (req, res) => {
  try {
    const { event, data } = req.body || {};

    // Only handle message_created events
    if (event !== 'message_created' || !data) {
      return res.status(200).json({ ok: true });
    }

    const messageType = data.message_type;
    const inboxId = data.inbox?.id;
    const conversationId = data.conversation?.id;
    const content = data.content || '';

    // ── 1. OUTGOING messages to VK (existing logic) ──
    if (messageType === 'outgoing' && inboxId === INBOX_VK) {
      const contactId = data.conversation?.contact_inbox?.source_id;
      if (contactId && content) {
        await sendVkMessage(contactId, content);
        console.log(`[VK] Sent message to user ${contactId}`);
      }
      return res.status(200).json({ ok: true });
    }

    // ── 2. INCOMING messages — auto-reply on first message with product info ──
    if (messageType === 'incoming' && conversationId) {
      // Only auto-reply once per conversation
      if (repliedConversations.has(conversationId)) {
        return res.status(200).json({ ok: true });
      }

      const productName = extractProductFromMessage(content);
      if (productName) {
        repliedConversations.add(conversationId);

        const replyText =
          `Заявка на ${productName} принята! ✅\n\n` +
          `Для оформления предоставьте, пожалуйста, логин (почта) и пароль от вашего аккаунта.\n\n` +
          `Менеджер подключится в течение 2–3 минут.`;

        await sendChatwootMessage(conversationId, replyText);
        console.log(`[AutoReply] Sent to conversation ${conversationId}: ${productName}`);
      }

      return res.status(200).json({ ok: true });
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[Webhook] Error:', err.message);
    res.status(200).json({ ok: true });
  }
});

// ═══════════════════════════════════════════════════════
// VK CALLBACK API
// ═══════════════════════════════════════════════════════

app.post('/vk-callback', async (req, res) => {
  try {
    const { type, object, group_id } = req.body || {};

    // VK server confirmation
    if (type === 'confirmation') {
      return res.send(VK_CONFIRMATION_CODE);
    }

    // Incoming VK message → forward to Chatwoot
    if (type === 'message_new' && object?.message) {
      const msg = object.message;
      const userId = msg.from_id;
      const text = msg.text || '';

      console.log(`[VK] Incoming message from ${userId}: ${text}`);

      // Forward to Chatwoot via API (create/update conversation)
      // This is handled by Chatwoot's VK inbox integration natively
    }

    res.send('ok');
  } catch (err) {
    console.error('[VK Callback] Error:', err.message);
    res.send('ok');
  }
});

// ═══════════════════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════════════════

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    repliedConversations: repliedConversations.size,
  });
});

// ═══════════════════════════════════════════════════════
// START
// ═══════════════════════════════════════════════════════

app.listen(PORT, () => {
  console.log(`[VK Bridge] Server running on port ${PORT}`);
});
