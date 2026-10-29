import { brand } from './app/brand'

export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: false },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxtjs/i18n',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    'nuxt-schema-org',
  ],
  typescript: { strict: true },
  css: ['~/assets/css/main.css'],
  fonts: {
    defaults: { weights: [400, 500, 700], styles: ['normal'], subsets: ['latin', 'latin-ext'] },
    families: [{ name: 'Satoshi', provider: 'fontshare', weights: [400, 500, 700] }],
  },
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'pt',
    baseUrl: brand.siteUrl,
    detectBrowserLanguage: false,
    locales: [
      { code: 'pt', language: 'pt-BR', name: 'Português', file: 'pt-BR.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en-US.json' },
    ],
    customRoutes: 'config',
    pages: {
      index: { en: '/' },
      planos: { en: '/plans' },
      recursos: { en: '/features' },
      termos: { en: '/terms' },
      privacidade: { en: '/privacy' },
      creditos: { en: '/credits' },
      contato: { en: '/contact' },
      '404': { en: false },
    },
  },
  site: {
    url: brand.siteUrl,
    name: brand.name,
    defaultLocale: 'pt-BR',
  },
  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
    },
  },
  runtimeConfig: {
    public: {
      whatsappNumber: '',
      gaId: '',
      metaPixelId: '',
    },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/planos',
        '/recursos',
        '/termos',
        '/privacidade',
        '/creditos',
        '/contato',
        '/en',
        '/en/plans',
        '/en/features',
        '/en/terms',
        '/en/privacy',
        '/en/credits',
        '/en/contact',
        '/404',
        '/sitemap.xml',
        '/sitemap_index.xml',
        '/robots.txt',
        '/llms.txt',
      ],
      failOnError: true,
    },
    hooks: {
      // CloudFront answers a missing key with /404.html, so the real page is written there.
      'prerender:generate'(route) {
        if (route.route === '/404') {
          route.fileName = '404.html'
        }
      },
    },
  },
  sitemap: { exclude: ['/404'] },
  eslint: {
    config: { stylistic: false },
  },
})
