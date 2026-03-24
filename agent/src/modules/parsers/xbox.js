const config = require('../../config');

/**
 * Получить цену конкретной Xbox-игры через MS Display Catalog
 */
async function fetchGamePrice(productId, market = 'TR') {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.parsers.requestTimeout);

    const url = `${config.parsers.xbox.displayCatalog}?bigIds=${productId}&market=${market}&languages=${market.toLowerCase()}-${market}`;
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': config.parsers.userAgent }
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.log(`[Парсер] Xbox HTTP ${response.status} для ${productId}`);
      return null;
    }

    const data = await response.json();
    const product = data?.Products?.[0];
    if (!product) return null;

    // Найти цену в SKU
    const sku = product.DisplaySkuAvailabilities?.[0];
    const availability = sku?.Availabilities?.[0];
    const orderInfo = availability?.OrderManagementData;
    const listPrice = orderInfo?.Price?.ListPrice;
    const msrp = orderInfo?.Price?.MSRP;

    // Обложка
    const coverImage = product.LocalizedProperties?.[0]?.Images?.find(
      img => img.ImagePurpose === 'BoxArt' || img.ImagePurpose === 'Poster'
    );
    const coverUrl = coverImage?.Uri ? `https:${coverImage.Uri}` : null;

    const localProps = product.LocalizedProperties?.[0];

    return {
      id: (localProps?.ProductTitle || productId).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: localProps?.ProductTitle || productId,
      productId,
      prices: {
        listPrice: listPrice || null,
        msrp: msrp || null,
        salePrice: null,
        currency: market === 'TR' ? 'TRY' : 'USD'
      },
      clientPrice: null,
      coverUrl,
      platform: 'Xbox Series X|S',
      releaseDate: product.MarketProperties?.[0]?.OriginalReleaseDate || null,
      inGamePass: false,
      gamePassTier: null,
      leavingSoon: false,
      source: 'ms-catalog',
      lastUpdated: new Date().toISOString()
    };
  } catch (err) {
    console.log(`[Парсер] Xbox ошибка: ${err.message}`);
    return null;
  }
}

/**
 * Получить каталог Game Pass
 */
async function fetchGamePassCatalog(category = 'all') {
  const guids = {
    all: 'fdd9e2a7-0fee-49f6-ad69-4354098401ff',
    leaving: 'f6f1f99f-9b49-4ccd-b3bf-4d9767a77f5e',
    recent: '1c4e3566-dd5a-4a49-a81c-f4e2e6175a0a'
  };

  const guid = guids[category] || guids.all;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.parsers.requestTimeout);

    const url = `${config.parsers.xbox.gamePassCatalog}?id=${guid}&language=en-us&market=TR`;
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': config.parsers.userAgent }
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.log(`[Парсер] Xbox Game Pass HTTP ${response.status}`);
      return [];
    }

    const data = await response.json();
    // Возвращает массив {id: productId} — нужно дополнительно запрашивать Display Catalog
    return (data || [])
      .filter(item => item.id)
      .map(item => ({ productId: item.id }));
  } catch (err) {
    console.log(`[Парсер] Xbox Game Pass ошибка: ${err.message}`);
    return [];
  }
}

/**
 * Получить скидки Xbox
 */
async function fetchDeals(market = 'TR') {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.parsers.requestTimeout);

    const url = `${config.parsers.xbox.recommendations}?ItemTypes=Game&Market=${market}&Count=25&Category=Deal`;
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': config.parsers.userAgent }
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.log(`[Парсер] Xbox Deals HTTP ${response.status}`);
      return [];
    }

    const data = await response.json();
    const items = data?.Items || [];

    return items.map(item => ({
      id: (item.Title || item.Id).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: item.Title || item.Id,
      productId: item.Id,
      prices: {
        listPrice: item.Price?.ListPrice || null,
        msrp: item.Price?.MSRP || null,
        salePrice: item.Price?.SpecialPrice || null,
        currency: market === 'TR' ? 'TRY' : 'USD'
      },
      clientPrice: null,
      coverUrl: item.ImageUrl || null,
      platform: 'Xbox Series X|S',
      releaseDate: null,
      inGamePass: false,
      gamePassTier: null,
      leavingSoon: false,
      source: 'ms-reco',
      lastUpdated: new Date().toISOString()
    }));
  } catch (err) {
    console.log(`[Парсер] Xbox Deals ошибка: ${err.message}`);
    return [];
  }
}

/**
 * Получить топ продаж Xbox
 */
async function fetchTopSellers(market = 'TR') {
  // Аналогично fetchDeals, но с Category=TopPaid
  return [];
}

module.exports = {
  fetchGamePrice,
  fetchGamePassCatalog,
  fetchDeals,
  fetchTopSellers,
  name: 'xbox'
};
