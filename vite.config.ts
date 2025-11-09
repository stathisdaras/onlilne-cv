import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const repoName = 'onlilne-cv'

export default defineConfig({
  plugins: [react()],
  base: `/${repoName}/`,
})
