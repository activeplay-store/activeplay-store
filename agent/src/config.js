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
      hashes: {
        getProduct: '',
        searchProducts: ''
      }
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
