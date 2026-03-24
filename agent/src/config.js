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
  }
};
