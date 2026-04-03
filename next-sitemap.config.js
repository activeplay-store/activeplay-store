/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://activeplay.games',
  generateRobotsTxt: true,
  outDir: 'public',
  changefreq: 'weekly',
  priority: 0.7,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
  },
  additionalPaths: async () => [
    { loc: '/', changefreq: 'daily', priority: 1.0 },
    { loc: '/ps-plus-essential', changefreq: 'weekly', priority: 0.9 },
    { loc: '/ps-plus-extra', changefreq: 'weekly', priority: 0.9 },
    { loc: '/ps-plus-deluxe', changefreq: 'weekly', priority: 0.9 },
    { loc: '/xbox-game-pass-essential', changefreq: 'weekly', priority: 0.9 },
    { loc: '/xbox-game-pass-premium', changefreq: 'weekly', priority: 0.9 },
    { loc: '/xbox-game-pass-ultimate', changefreq: 'weekly', priority: 0.9 },
    { loc: '/ea-play', changefreq: 'weekly', priority: 0.9 },
    { loc: '/sale', changefreq: 'daily', priority: 0.8 },
    { loc: '/news', changefreq: 'daily', priority: 0.8 },
    { loc: '/guides', changefreq: 'weekly', priority: 0.7 },
  ],
}
