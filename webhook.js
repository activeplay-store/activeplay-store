/**
 * GitHub Webhook → Auto-Deploy
 * PM2 process: webhook, port 9000
 *
 * Listens for push events to main branch.
 * On push: git pull → npm install (agent) → npm run build → pm2 restart.
 */

const http = require('http');
const crypto = require('crypto');
const { execFile } = require('child_process');

const PORT = 9000;
const SECRET = process.env.GITHUB_WEBHOOK_SECRET || 'activeplay-deploy-2026';
const REPO_DIR = '/var/www/activeplay-store';

let deploying = false;

function verifySignature(body, signature) {
  if (!SECRET || !signature) return !SECRET; // no secret = no check
  const hmac = crypto.createHmac('sha256', SECRET);
  hmac.update(body);
  const expected = 'sha256=' + hmac.digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

function deploy() {
  if (deploying) {
    console.log('[DEPLOY] Already deploying, skipping');
    return;
  }
  deploying = true;
  const start = Date.now();

  const script = `
    cd ${REPO_DIR} &&
    git fetch origin main &&
    git reset --hard origin/main &&
    cd agent && npm install --production &&
    cd ${REPO_DIR} && npm run build &&
    pm2 restart activeplay ap-agent ap-agent-bot
  `;

  console.log('[DEPLOY] Starting...');
  execFile('bash', ['-c', script], { timeout: 300000 }, (err, stdout, stderr) => {
    deploying = false;
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);

    if (err) {
      console.error(`[DEPLOY] FAILED in ${elapsed}s:`, err.message);
      if (stderr) console.error('[DEPLOY] stderr:', stderr.slice(-500));
    } else {
      console.log(`[DEPLOY] OK in ${elapsed}s`);
      if (stdout) console.log('[DEPLOY] stdout:', stdout.slice(-300));
    }
  });
}

const server = http.createServer((req, res) => {
  // Health check
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', deploying, uptime: process.uptime() }));
    return;
  }

  if (req.method !== 'POST') {
    res.writeHead(405);
    res.end('Method Not Allowed');
    return;
  }

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    // Verify GitHub signature
    const sig = req.headers['x-hub-signature-256'];
    if (SECRET && !verifySignature(body, sig)) {
      console.warn('[WEBHOOK] Invalid signature');
      res.writeHead(401);
      res.end('Unauthorized');
      return;
    }

    try {
      const payload = JSON.parse(body);
      const ref = payload.ref || '';
      const event = req.headers['x-github-event'] || '';

      console.log(`[WEBHOOK] Event: ${event}, ref: ${ref}`);

      // Only deploy on push to main
      if (event === 'push' && ref === 'refs/heads/main') {
        const commits = (payload.commits || []).map(c => c.message).join('; ');
        console.log(`[WEBHOOK] Push to main: ${commits.slice(0, 200)}`);
        deploy();
        res.writeHead(200);
        res.end('Deploy started');
      } else {
        res.writeHead(200);
        res.end('OK (ignored)');
      }
    } catch (err) {
      console.error('[WEBHOOK] Parse error:', err.message);
      res.writeHead(400);
      res.end('Bad Request');
    }
  });
});

server.listen(PORT, () => {
  console.log(`[WEBHOOK] Listening on port ${PORT}`);
});
