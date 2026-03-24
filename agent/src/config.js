const path = require('path');

module.exports = {
  currencies: ['TRY', 'UAH', 'INR'],

  cbr: {
    primary: 'https://www.cbr.ru/scripts/XML_daily.asp',
    fallback: 'https://www.cbr-xml-daily.ru/daily_json.js'
  },

  markup: 0.10,
  threshold: 0.03,
  cronSchedule: '0 9 * * *',
  ratesFile: path.join(__dirname, '..', 'data', 'rates.json'),
  requestTimeout: 15000,

  // Калькулятор цен
  pricing: {
    managerFee: 250,
    roundTo: 50,
    baseCourses: {
      TRY: 2.00,
      UAH: 2.01
    },
    anchorsFile: path.join(__dirname, '..', 'data', 'anchors.json'),
  },

  // Парсер цен
  parsers: {
    requestTimeout: 20000,
    politenessDelay: 2000,
    maxRetries: 2,
    discrepancyThreshold: 15,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',

    regions: {
      TR: {
        currency: 'TRY',
        psprices: 'region-tr',
        psdeals: 'store/turkey',
        sonyLocale: 'tr-TR',
        psStore: 'en-tr'
      },
      UA: {
        currency: 'UAH',
        psprices: 'region-ua',
        psdeals: 'store/ukraine',
        sonyLocale: 'uk-UA',
        psStore: 'ru-ua'
      },
      IN: {
        currency: 'INR',
        psprices: 'region-in',
        psdeals: 'store/india',
        sonyLocale: 'en-IN',
        psStore: 'en-in'
      }
    },

    cronSchedule: '30 */3 * * *',
    preordersCronSchedule: '0 10 1,8,15,22,29 * *',
    gamesFile: path.join(__dirname, '..', 'data', 'games.json'),

    sony: {
      endpoint: 'https://web.np.playstation.com/api/graphql/v1/op',

      // Актуальные sha256-хеши (получены 24.03.2026)
      // ⚠️ Могут устареть при обновлении Sony — проверять если начнутся ошибки
      hashes: {
        categoryGridRetrieve: '257713466fc3264850aa473409a29088e3a4115e6e69e9fb3e061c8dd5b9f5c6',
        productRetrieveForCtasWithPrice: '737838e0e3fe50986b4087b51327970a71c80497576bea07904e9ecf4a2dab02'
      },

      // ID категорий PS Store
      categories: {
        deals: {
          TR: '3f772501-f6f8-49b7-abac-874a88ca4897'
          // UA и IN — добавить позже
        },
        preorders: {
          // TR, UA — добавить позже
        }
      },

      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9'
      },

      pageSize: 24
    },

    platprices: {
      endpoint: 'https://platprices.com/api.php',
      apiKey: '',
    },

    xbox: {
      displayCatalog: 'https://displaycatalog.mp.microsoft.com/v7.0/products',
      gamePassCatalog: 'https://catalog.gamepass.com/sigls/v2',
      recommendations: 'https://reco-public.rec.mp.microsoft.com/channels/Reco/V8.0/Lists/api/list/'
    }
  }
};
