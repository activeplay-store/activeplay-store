#!/bin/bash
curl -s -X POST "https://yandex.com/indexnow" \
  -H "Content-Type: application/json" \
  -d '{"host":"activeplay.games","key":"activeplay2026indexnow","urlList":["https://activeplay.games/guides/kak-kupit-ps-plus-iz-rossii","https://activeplay.games/guides/ps-plus-essential-extra-deluxe-otlichiya","https://activeplay.games/guides/xbox-game-pass-kak-kupit-iz-rossii","https://activeplay.games/guides/kak-kupit-fc-points-iz-rossii","https://activeplay.games/guides/ea-play-podpiska-kak-kupit"]}'

# Пинг Google sitemap
curl -s "https://www.google.com/ping?sitemap=https://activeplay.games/sitemap.xml"
