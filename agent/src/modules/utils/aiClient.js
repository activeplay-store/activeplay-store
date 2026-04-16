const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');

// Казахский прокси — для обхода блокировки OpenAI из России
const proxyAgent = process.env.KZ_PROXY_URL
  ? new HttpsProxyAgent(process.env.KZ_PROXY_URL)
  : undefined;

if (proxyAgent) console.log('[AI] Proxy configured via KZ_PROXY_URL');

const MODEL = 'gpt-4o';
const MODEL_FAST = 'gpt-4o-mini';

/**
 * Вызов OpenAI Chat Completions через казахский прокси.
 * Fallback: gpt-4o → gpt-4o-mini при ошибке.
 */
async function chatCompletion(messages, options = {}) {
  const {
    model = MODEL,
    temperature = 0.7,
    maxTokens = 4000,
    retries = 1,
    timeout = 90000,
  } = options;

  const models = [model];
  if (model === MODEL && !models.includes(MODEL_FAST)) models.push(MODEL_FAST);

  for (let i = 0; i < models.length; i++) {
    const m = models[i];
    try {
      const start = Date.now();
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: m,
        messages,
        temperature,
        max_tokens: maxTokens,
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        httpsAgent: proxyAgent,
        timeout,
      });

      const content = response.data.choices?.[0]?.message?.content;
      if (!content) throw new Error('Empty response from OpenAI');

      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      console.log(`[AI] ${m} response in ${elapsed}s (${content.length} chars)`);
      return content;
    } catch (err) {
      const status = err.response?.status || 0;
      const msg = err.response?.data?.error?.message || err.message;
      console.error(`[AI] ${m} failed (${status}): ${msg.substring(0, 150)}`);

      if (i < models.length - 1) {
        await new Promise(r => setTimeout(r, 2000));
        continue;
      }
      throw err;
    }
  }
}

/**
 * Парсинг JSON из ответа LLM. Убирает ```json обёртки.
 */
function parseJsonResponse(text) {
  const cleaned = text
    .replace(/```json\s*/g, '')
    .replace(/```\s*/g, '')
    .trim();
  return JSON.parse(cleaned);
}

/**
 * Генерация картинки через DALL-E 3 (через казахский прокси).
 * Возвращает URL картинки или null.
 */
async function generateImage(prompt) {
  try {
    const response = await axios.post('https://api.openai.com/v1/images/generations', {
      model: 'dall-e-3',
      prompt: prompt.slice(0, 4000),
      n: 1,
      size: '1792x1024',
      quality: 'standard',
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      httpsAgent: proxyAgent,
      timeout: 60000,
    });

    const imageUrl = response.data?.data?.[0]?.url;
    if (!imageUrl) return null;

    console.log('[AI] DALL-E 3 image generated');
    return imageUrl;
  } catch (err) {
    console.error('[AI] DALL-E error:', err.response?.data?.error?.message || err.message);
    return null;
  }
}

module.exports = { chatCompletion, parseJsonResponse, generateImage, proxyAgent, MODEL, MODEL_FAST };
