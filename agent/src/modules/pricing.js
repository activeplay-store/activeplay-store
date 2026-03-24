const fs = require('fs');
const config = require('../config');
const currency = require('./currency');

// Дефолтные якорные точки — Турция (TRY), базовый курс 2.00
const DEFAULT_ANCHORS_TR = [
  [100, 6.15], [150, 5.64], [200, 4.62], [250, 4.31], [300, 3.90],
  [350, 3.69], [400, 3.59], [450, 3.38], [500, 3.28],
  [750, 3.18], [1000, 2.87], [1200, 2.77], [1400, 2.67],
  [1600, 2.56], [1800, 2.46], [2000, 2.41], [3000, 2.36],
  [4000, 2.31], [5000, 2.26], [10000, 2.21], [15000, 2.15]
];

// Дефолтные якорные точки — Украина (UAH), базовый курс 2.01
const DEFAULT_ANCHORS_UA = [
  [100, 8.00], [150, 6.45], [200, 5.55], [250, 5.05], [300, 4.65],
  [350, 4.40], [400, 4.20], [450, 4.05], [500, 3.90],
  [750, 3.60], [1000, 3.28], [1200, 3.06], [1400, 2.94],
  [1600, 2.83], [1800, 2.73], [2000, 2.68], [3000, 2.55],
  [4000, 2.42], [5000, 2.35], [6000, 2.28], [7000, 2.25],
  [8000, 2.23], [9000, 2.22], [10000, 2.20], [15000, 2.18]
];

// Текущие якорные точки (загружаются из файла или дефолтные)
let anchorsData = null;

/**
 * Загрузить якорные точки из файла или создать дефолтные
 */
function loadAnchors() {
  try {
    if (fs.existsSync(config.pricing.anchorsFile)) {
      anchorsData = JSON.parse(fs.readFileSync(config.pricing.anchorsFile, 'utf8'));
      return anchorsData;
    }
  } catch (err) {
    console.log(`[Цены] ⚠️ Ошибка чтения anchors.json: ${err.message}`);
  }

  // Создать дефолтные
  anchorsData = {
    updatedAt: new Date().toISOString(),
    TR: {
      baseCourse: config.pricing.baseCourses.TRY,
      anchors: DEFAULT_ANCHORS_TR
    },
    UA: {
      baseCourse: config.pricing.baseCourses.UAH,
      anchors: DEFAULT_ANCHORS_UA
    }
  };

  saveAnchors();
  return anchorsData;
}

/**
 * Сохранить якорные точки в файл
 */
function saveAnchors() {
  if (!anchorsData) return;
  anchorsData.updatedAt = new Date().toISOString();

  const dir = require('path').dirname(config.pricing.anchorsFile);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(config.pricing.anchorsFile, JSON.stringify(anchorsData, null, 2), 'utf8');
}

/**
 * Получить якорные точки для региона
 */
function getAnchors(region) {
  if (!anchorsData) loadAnchors();
  const data = anchorsData[region];
  return data ? data.anchors : null;
}

/**
 * Линейная интерполяция коэффициента по якорным точкам
 */
function getBaseCoefficient(price, anchors) {
  if (price <= anchors[0][0]) return anchors[0][1];
  if (price >= anchors[anchors.length - 1][0]) return anchors[anchors.length - 1][1];

  for (let i = 0; i < anchors.length - 1; i++) {
    const [p1, c1] = anchors[i];
    const [p2, c2] = anchors[i + 1];
    if (price >= p1 && price <= p2) {
      const coeff = c1 + (c2 - c1) * (price - p1) / (p2 - p1);
      return Math.round(coeff * 100) / 100;
    }
  }

  return anchors[anchors.length - 1][1];
}

/**
 * Получить текущий внутренний курс для региона
 */
function getCurrentRate(region) {
  const currencyCode = region === 'TR' ? 'TRY' : 'UAH';
  const rate = currency.getInternalRate(currencyCode);
  if (!rate) {
    return config.pricing.baseCourses[currencyCode];
  }
  return rate;
}

/**
 * Получить коэффициент с адаптацией к текущему курсу
 */
function getCoefficient(priceForeign, region) {
  if (!anchorsData) loadAnchors();

  const regionData = anchorsData[region];
  if (!regionData) throw new Error(`Неизвестный регион: ${region}`);

  const baseCoeff = getBaseCoefficient(priceForeign, regionData.anchors);
  const currentRate = getCurrentRate(region);
  const baseCourse = regionData.baseCourse;

  // Адаптация: базовый_курс / текущий_курс
  const adjusted = Math.round(baseCoeff * (baseCourse / currentRate) * 100) / 100;

  return adjusted;
}

/**
 * Рассчитать цену для товара
 */
function calculatePrice(priceForeign, region) {
  if (!anchorsData) loadAnchors();

  const regionData = anchorsData[region];
  if (!regionData) throw new Error(`Неизвестный регион: ${region}`);

  const currentRate = getCurrentRate(region);
  const baseCourse = regionData.baseCourse;
  const baseCoeff = getBaseCoefficient(priceForeign, regionData.anchors);

  // Адаптация коэффициента
  const adjusted = Math.round(baseCoeff * (baseCourse / currentRate) * 100) / 100;

  // Цена клиенту (округление вверх до 50₽)
  const rawPrice = priceForeign * adjusted;
  const clientPrice = Math.ceil(rawPrice / config.pricing.roundTo) * config.pricing.roundTo;

  // Себестоимость
  const costPrice = Math.round(priceForeign * currentRate + config.pricing.managerFee);

  // Маржа
  const marginRub = clientPrice - costPrice;
  const marginPct = Math.round((marginRub / clientPrice) * 1000) / 10;

  return {
    clientPrice,
    costPrice,
    marginRub,
    marginPct,
    coefficient: adjusted,
    baseCoefficient: baseCoeff,
    rate: currentRate,
    region,
    priceForeign
  };
}

/**
 * Пакетный расчёт — массив товаров
 */
function calculateBatch(items, region) {
  return items.map(item => {
    const price = typeof item === 'number' ? item : item.price;
    const name = typeof item === 'number' ? null : item.name;
    const result = calculatePrice(price, region);
    if (name) result.name = name;
    return result;
  });
}

module.exports = {
  calculatePrice,
  calculateBatch,
  getCoefficient,
  loadAnchors,
  saveAnchors,
  getAnchors
};
