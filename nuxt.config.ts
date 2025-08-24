import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {
    enabled: false,

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
    '@nuxtjs/sitemap'
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
    ]
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
