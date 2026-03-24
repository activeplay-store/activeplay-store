const http = require('http');

function sendAlert(type, message, data = {}) {
  const payload = JSON.stringify({ type, message, data });

  const req = http.request({
    hostname: '127.0.0.1',
    port: 4000,
    path: '/alert',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    },
    timeout: 5000
  }, (res) => {
    res.resume();
  });

  req.on('error', (err) => {
    console.log(`[Уведомление] ⚠️ Бот недоступен: ${err.message}`);
  });

  req.write(payload);
  req.end();
}

module.exports = { sendAlert };
