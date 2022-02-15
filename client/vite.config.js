import fs from 'fs'
import { defineConfig } from 'vite'

export default defineConfig({
  cacheDir: 'node_modules/.vite/client',
  server: {
    port: 3001,
    https: {
      key: fs.readFileSync('../cert/localhost.key'),
      cert: fs.readFileSync('../cert/localhost.crt'),
    }
  }
})
