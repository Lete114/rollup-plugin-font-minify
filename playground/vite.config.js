import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fontmin from 'rollup-plugin-font-minify'

export default defineConfig({
  plugins: [vue(), fontmin({})],
})
