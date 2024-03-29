import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import  {resolve}  from 'path'

export default defineConfig({
  plugins: [vue()],
  server: {
    open: false,
    hmr: true,
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://117.33.255.178:22:8082/zhifou-study', // 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },

})
