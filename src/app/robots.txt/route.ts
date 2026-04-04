export function GET() {
  const body = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/

User-agent: Yandex
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Crawl-delay: 1
Clean-param: utm_source&utm_medium&utm_campaign&utm_content

Host: https://activeplay.games
Sitemap: https://activeplay.games/sitemap.xml
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
