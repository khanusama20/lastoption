// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Enable full SSR for SEO and fast First Contentful Paint
  ssr: true,

  // Development server configuration
  devServer: {
    port: 3000,
    host: 'localhost',
  },

  // Global CSS
  css: ['~/assets/css/main.css'],

  // Component auto-imports configuration
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  // Modules
  modules: [
    '@nuxtjs/tailwindcss'
  ],

  // PostCSS config to silence nesting resolver warning in Nuxt 4
  postcss: {
    plugins: {
      'tailwindcss/nesting': false
    }
  },

  // Vite optimization
  vite: {
    optimizeDeps: {
      include: ['@vue/devtools-core']
    }
  },

  // Global SEO & Head Metadata
  app: {
    head: {
      title: "Last Option | Men's Premium Jackets",
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: "Last Option — Exclusive direct-to-consumer premium men's outerwear and jackets. Structured elegance, built to endure."
        },
        { name: 'theme-color', content: '#0B0D10' },
        { property: 'og:site_name', content: 'Last Option' },
        { property: 'og:type', content: 'website' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
        }
      ]
    }
  },

  // Runtime environment configuration
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1',
      whatsappNumber: process.env.NUXT_PUBLIC_WHATSAPP_NUMBER || '',
    }
  }
})
