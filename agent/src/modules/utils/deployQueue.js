/**
 * Centralized deploy queue — единственное место откуда идёт git push.
 * Все модули (publisher, siteWriter) вызывают queueDeploy() вместо execSync.
 * Деплой собирает все изменения и пушит пачкой раз в 2 минуты.
 */
const { execFileSync } = require('child_process');

const REPO_ROOT = process.env.SITE_ROOT || '/var/www/activeplay-store';
const DEPLOY_INTERVAL = 2 * 60 * 1000; // 2 минуты
let pendingFiles = new Set();
let deployLock = false;
let deployTimer = null;

function queueDeploy(files) {
  if (Array.isArray(files)) {
    files.forEach(f => pendingFiles.add(f));
  } else {
    pendingFiles.add(files);
  }

  if (!deployTimer) {
    deployTimer = setTimeout(() => flushDeploy(), DEPLOY_INTERVAL);
  }
}

async function flushDeploy() {
  if (deployLock) {
    console.log('[DEPLOY] Already deploying, skipping');
    return;
  }
  if (pendingFiles.size === 0) {
    deployTimer = null;
    return;
  }

  deployLock = true;
  const files = [...pendingFiles];
  pendingFiles.clear();
  deployTimer = null;

  try {
    execFileSync('git', ['add', ...files], { cwd: REPO_ROOT, timeout: 30000 });

    try {
      execFileSync('git', ['diff', '--cached', '--quiet'], { cwd: REPO_ROOT });
      console.log('[DEPLOY] Nothing to commit');
      deployLock = false;
      return;
    } catch (e) {
      // diff --cached --quiet exits 1 if there are staged changes — normal
    }

    const msg = `auto: update ${files.length} file(s) — ${new Date().toISOString()}`;
    execFileSync('git', ['commit', '-m', msg], { cwd: REPO_ROOT, timeout: 30000 });
    execFileSync('git', ['push'], { cwd: REPO_ROOT, timeout: 60000 });

    console.log(`[DEPLOY] Pushed ${files.length} files: ${files.join(', ')}`);
  } catch (err) {
    console.error('[DEPLOY] Error:', err.message);
    files.forEach(f => pendingFiles.add(f));
    deployTimer = setTimeout(() => flushDeploy(), 5 * 60 * 1000);
  } finally {
    deployLock = false;
  }
}

module.exports = { queueDeploy, flushDeploy };
