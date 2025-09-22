/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://ekkly.life',
  generateRobotsTxt: false, // 이미 직접 작성하므로 false
  changefreq: 'daily',
  priority: 0.7,
  // i18n 사용 시:
  alternateRefs: [
    { href: 'https://ekkly.life/ko', hreflang: 'ko' },
    // { href: 'https://ekkly.life/en', hreflang: 'en' },
  ],
};
