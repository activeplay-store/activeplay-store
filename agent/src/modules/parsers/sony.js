const config = require('../../config');

function isConfigured() {
  return !!(config.parsers.sony.hashes.getProduct);
}

async function fetchGamePrice(regionCode, conceptId) {
  if (!isConfigured()) {
    return null;
  }

  const region = config.parsers.regions[regionCode];
  if (!region) return null;

  const params = new URLSearchParams({
    operationName: 'productRetrieveForCtasWithPrice',
    variables: JSON.stringify({ productId: conceptId }),
    extensions: JSON.stringify({
      persistedQuery: {
        version: 1,
        sha256Hash: config.parsers.sony.hashes.getProduct
      }
    })
  });

  const url = `${config.parsers.sony.endpoint}?${params}`;

  for (let attempt = 0; attempt <= 1; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), config.parsers.requestTimeout);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': config.parsers.userAgent,
          'x-psn-store-locale-override': region.sonyLocale,
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });

      clearTimeout(timeout);

      if (response.status === 403) {
        console.log('[Парсер] ⚠️ Sony 403 — возможно обновились хеши');
        return null;
      }

      if (!response.ok) {
        console.log(`[Парсер] ⚠️ Sony HTTP ${response.status}`);
        return null;
      }

      const data = await response.json();

      if (data.errors) {
        console.log(`[Парсер] ⚠️ Sony Access Denied — проверить заголовки`);
        return null;
      }

      // Парсинг ответа Sony GraphQL
      const product = data?.data?.productRetrieveForCtasWithPrice;
      if (!product) return null;

      const webctas = product.webctas || [];
      const editions = [];

      for (const cta of webctas) {
        const price = cta.price;
        if (!price) continue;

        const basePrice = price.basePrice ? parseFloat(price.basePrice.replace(/[^0-9.]/g, '')) : null;
        const discountedPrice = price.discountedPrice ? parseFloat(price.discountedPrice.replace(/[^0-9.]/g, '')) : null;
        const discountText = price.discountText || '';
        const discountMatch = discountText.match(/(\d+)%/);
        const discountPct = discountMatch ? parseInt(discountMatch[1]) : 0;

        editions.push({
          name: cta.name || 'Standard',
          basePrice: basePrice,
          salePrice: discountedPrice && discountedPrice < basePrice ? discountedPrice : null,
          plusPrice: null,
          discountPct,
          saleEndDate: price.endTime || null,
          clientPrice: null,
          clientSalePrice: null
        });
      }

      if (editions.length === 0) return null;

      const coverUrl = product.media?.find(m => m.type === 'IMAGE')?.url || null;

      return {
        id: conceptId,
        name: product.name || conceptId,
        conceptId,
        prices: {
          [regionCode]: { editions }
        },
        coverUrl,
        platform: (product.platforms || []).join(' & ') || 'PS5',
        releaseDate: null,
        status: 'released',
        metacritic: null,
        sources: {
          psprices: null,
          psdeals: null,
          sony: { price: editions[0].basePrice, fetchedAt: new Date().toISOString() }
        },
        discrepancy: false,
        discrepancyDetails: null,
        firstSeen: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        priceChangedAt: null
      };
    } catch (err) {
      if (err.name === 'AbortError' && attempt === 0) {
        console.log('[Парсер] Sony таймаут, повтор...');
        continue;
      }
      console.log(`[Парсер] ⚠️ Sony ошибка: ${err.message}`);
      return null;
    }
  }

  return null;
}

async function searchGame(regionCode, gameName) {
  if (!config.parsers.sony.hashes.searchProducts) {
    return null;
  }

  // Placeholder — реализация аналогична fetchGamePrice
  return null;
}

module.exports = {
  fetchGamePrice,
  searchGame,
  isConfigured,
  name: 'sony'
};
