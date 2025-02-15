import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()]
    ,
    server: {
        host: "0.0.0.0",
        allowedHosts: ['raspub'],
        proxy: {
            '/api': {
                target: 'http://your-backend-api.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    }
    ,
    css: {
        modules: {
            localsConvention: "camelCase",
            generateScopedName: "[local]_[hash:base64:2]"
        }

    }
})
