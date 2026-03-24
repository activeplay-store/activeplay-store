const config = require('../../config');

async function fetchGamePrice(regionCode, gameName) {
  const apiKey = config.parsers.platprices.apiKey;
  if (!apiKey) {
    return null;
  }

  const regionMap = { TR: 'tr-tr', UA: 'ru-ua', IN: 'en-in' };
  const region = regionMap[regionCode];
  if (!region) return null;

  try {
    const params = new URLSearchParams({
      key: apiKey,
      name: gameName,
      region: region
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.parsers.requestTimeout);

    const response = await fetch(`${config.parsers.platprices.endpoint}?${params}`, {
      signal: controller.signal,
      headers: { 'User-Agent': config.parsers.userAgent }
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.log(`[Парсер] PlatPrices HTTP ${response.status}`);
      return null;
    }

    const data = await response.json();
    if (!data || !data.Name) return null;

    const basePrice = parseFloat(data.BasePrice) || null;
    const salePrice = parseFloat(data.SalePrice) || null;
    const plusPrice = parseFloat(data.PlusPrice) || null;
    const discountPct = parseInt(data.DiscountPercentage) || 0;

    if (!basePrice) return null;

    return {
      id: data.Name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: data.Name,
      conceptId: null,
      prices: {
        [regionCode]: {
          editions: [{
            name: 'Standard',
            basePrice,
            salePrice: salePrice && salePrice < basePrice ? salePrice : null,
            plusPrice,
            discountPct,
            saleEndDate: null,
            clientPrice: null,
            clientSalePrice: null
          }]
        }
      },
      coverUrl: data.Image || null,
      platform: 'PS5',
      releaseDate: null,
      status: 'released',
      metacritic: parseInt(data.Metacritic) || null,
      sources: {
        psprices: null,
        psdeals: null,
        sony: null,
        platprices: { price: basePrice, fetchedAt: new Date().toISOString() }
      },
      discrepancy: false,
      discrepancyDetails: null,
      firstSeen: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      priceChangedAt: null
    };
  } catch (err) {
    console.log(`[Парсер] PlatPrices ошибка: ${err.message}`);
    return null;
  }
}

module.exports = {
  fetchGamePrice,
  isConfigured: () => !!config.parsers.platprices.apiKey,
  name: 'platprices'
};
