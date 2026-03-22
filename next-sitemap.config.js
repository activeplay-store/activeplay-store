/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://activeplay.games',
  generateRobotsTxt: false,
  outDir: 'public',
  changefreq: 'weekly',
  priority: 0.7,
  additionalPaths: async () => [
    { loc: '/', changefreq: 'daily', priority: 1.0 },
    { loc: '/ps-plus-essential', changefreq: 'weekly', priority: 0.9 },
    { loc: '/ps-plus-extra', changefreq: 'weekly', priority: 0.9 },
    { loc: '/ps-plus-deluxe', changefreq: 'weekly', priority: 0.9 },
    { loc: '/ea-play', changefreq: 'weekly', priority: 0.9 },
    { loc: '/igrovaya-valyuta', changefreq: 'weekly', priority: 0.8 },
  ],
}
