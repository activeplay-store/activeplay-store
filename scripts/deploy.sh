#!/bin/bash
# Production deploy script. Triggered by /usr/bin/webhook on POST /hooks/deploy.
# Hook config: /var/www/hooks.json → execute-command: this file.
set -e
cd /var/www/activeplay-store
git pull origin main
npm install
(cd agent && npm install --production)
npm run build
pm2 restart activeplay ap-agent ap-agent-bot
echo "Deploy done: $(date)"
