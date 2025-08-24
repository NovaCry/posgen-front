import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  experimental: {
    typedPages: true,
  },

  devServer: {
    port: 8080,
  },

  app: {
    head: {
      link: [
        {
          rel: 'alternate icon',
          href: '/resources/infill/16x16-infill.png',
          type: 'image/png',
          sizes: '16x16',
        },
        {
          rel: 'alternate icon',
          href: '/resources/infill/32x32-infill.png',
          type: 'image/png',
          sizes: '32x32',
        },
        {
          rel: 'alternate icon',
          href: '/resources/infill/64x64-infill.png',
          type: 'image/png',
          sizes: '64x64',
        },
        {
          rel: 'alternate icon',
          href: '/resources/infill/128x128-infill.png',
          type: 'image/png',
          sizes: '128x128',
        },
        {
          rel: 'alternate icon',
          href: '/resources/infill/256x256-infill.png',
          type: 'image/png',
          sizes: '256x256',
        },
        {
          rel: 'icon',
          href: '/resources/infill/512x512-infill.svg',
          type: 'image/svg+xml',
          sizes: 'any',
        },
      ],
    },
  },

  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['form-data'],
    },
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    'shadcn-nuxt',
    '@pinia/nuxt',
    'motion-v/nuxt',
    '@nuxtjs/sitemap',
  ],

  sitemap: {
    urls: [
      'https://posgen.tr/',
      'https://posgen.tr/login',
      'https://posgen.tr/register',
      'https://posgen.tr/terms',
      'https://posgen.tr/privacy',
      'https://posgen.tr/about',
      'https://posgen.tr/contact',
      'https://posgen.tr/pricing',
      'https://posgen.tr/blog',
    ],
  },

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './app/components/ui',
  },

  pinia: {
    storesDirs: ['./app/store/**'],
  },

  icon: {
    mode: 'svg',
  },
});
