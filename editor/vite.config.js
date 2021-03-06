import fs from 'fs'
import { defineConfig } from 'vite'

export default defineConfig({
  cacheDir: 'node_modules/.vite/editor',
  server: {
    https: {
      key: fs.readFileSync('../cert/localhost.key'),
      cert: fs.readFileSync('../cert/localhost.crt'),
    }
  }
})
