const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const MAX_ENTRIES = 500;

function appendLog(filename, entry) {
  const filePath = path.join(DATA_DIR, filename);
  let log = [];
  try {
    if (fs.existsSync(filePath)) {
      log = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch { log = []; }

  log.push({ timestamp: new Date().toISOString(), ...entry });

  if (log.length > MAX_ENTRIES) {
    log = log.slice(-MAX_ENTRIES);
  }

  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(log, null, 2), 'utf8');
}

function logRate(data) { appendLog('rates-log.json', data); }
function logPrice(data) { appendLog('prices-log.json', data); }
function logPublish(data) { appendLog('publish-log.json', data); }

module.exports = { logRate, logPrice, logPublish };
