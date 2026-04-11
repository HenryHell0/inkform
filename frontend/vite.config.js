import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Sitemap from 'vite-plugin-sitemap'
import fs from 'fs'

const useHttps = fs.existsSync('./keys/dev-key.pem') && fs.existsSync('./keys/dev-cert.pem')

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		vueDevTools(),
		Sitemap({
			hostname: 'https://inkform.io',
			// dynamicRoutes: ['/path1', '/path2'], // Manually add dynamic paths if needed
		}),
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	base: '/',
	server: {
		host: true,
		port: 8000,
		...(useHttps && {
			https: {
				key: fs.readFileSync('./keys/dev-key.pem'),
				cert: fs.readFileSync('./keys/dev-cert.pem'),
			},
		}),
		proxy: {
			'/api/predict': {
				target: 'http://127.0.0.1:8000',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ''),
			},
			'/api/feedback': {
				target: 'http://127.0.0.1:3100',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ''),
			},
		},
	},
})
