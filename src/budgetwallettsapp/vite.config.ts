import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: {},
  },
  server: {
    port: 3000,
      // https: {
      //   key: 'C:/SSL/localhost-key.pem',
      //   cert: 'C:/SSL/localhost.pem',
      // },
    },
})
