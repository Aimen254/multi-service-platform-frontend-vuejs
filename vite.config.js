import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import inject from '@rollup/plugin-inject'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    inject({   // => that should be first under plugins array
      $: 'jquery',
      jQuery: 'jquery',
    //   options: {
    //     include: '**/*.css', // Restrict the plugin to CSS files
    //   },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@composables': fileURLToPath(new URL('./src/composables', import.meta.url)),
      '@stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@views': fileURLToPath(new URL('./src/views', import.meta.url)),
    }
  },
  optimizeDeps: {
    include: ['jquery'],
  },
})
