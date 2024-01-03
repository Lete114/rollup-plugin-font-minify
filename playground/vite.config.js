import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fontmin from 'rollup-plugin-fontmin'

export default defineConfig({
  plugins: [vue(), fontmin({})],
})
