// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  build: {
    postcss: false,
    terser: false
  },

  css: [
    "~/public/assets/css/global.css",
    "~/public/assets/css/magic-stone.css"
  ],

  compatibilityDate: "2024-08-02"
})