#!/bin/bash
# Одноразовый скрипт настройки деплоя на сервере.
# Запустить: bash /var/www/activeplay-store/deploy-setup.sh "sk-proj-..."
#
# Аргумент $1 — OPENAI_API_KEY (обязательный при первом запуске)

set -e
cd /var/www/activeplay-store

echo "=== 1. Установка зависимостей агента ==="
cd agent && npm install --production && cd ..

echo "=== 2. Добавление OPENAI_API_KEY в agent/.env ==="
if ! grep -q 'OPENAI_API_KEY=' agent/.env 2>/dev/null; then
  if [ -z "$1" ]; then
    echo "  ОШИБКА: передай OPENAI_API_KEY как аргумент: bash deploy-setup.sh 'sk-proj-...'"
    exit 1
  fi
  echo "OPENAI_API_KEY=$1" >> agent/.env
  echo "  -> Добавлен OPENAI_API_KEY"
else
  echo "  -> OPENAI_API_KEY уже есть"
fi

echo "=== 3. Добавление KZ_PROXY_URL в agent/.env ==="
if ! grep -q 'KZ_PROXY_URL=' agent/.env 2>/dev/null; then
  echo 'KZ_PROXY_URL=http://activeplay:Jfhx5ODqLUOY4oH2APdYWpHG@89.207.254.146:3128' >> agent/.env
  echo "  -> Добавлен KZ_PROXY_URL"
else
  echo "  -> KZ_PROXY_URL уже есть"
fi

echo "=== 4. Запуск webhook-сервера ==="
if pm2 describe webhook > /dev/null 2>&1; then
  pm2 restart webhook
  echo "  -> webhook перезапущен"
else
  pm2 start webhook.js --name webhook --cwd /var/www/activeplay-store
  pm2 save
  echo "  -> webhook запущен"
fi

echo "=== 5. Перезапуск агента и бота ==="
pm2 restart ap-agent ap-agent-bot
echo "  -> ap-agent и ap-agent-bot перезапущены"

echo ""
echo "=== ГОТОВО ==="
echo "Webhook слушает на порту 9000."
echo "Настрой GitHub webhook: Settings -> Webhooks -> Add webhook"
echo "  URL: http://31.130.144.44:9000"
echo "  Content type: application/json"
echo "  Secret: activeplay-deploy-2026"
echo "  Events: Just the push event"
