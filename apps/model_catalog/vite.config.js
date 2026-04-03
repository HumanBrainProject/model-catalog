import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import commonjs from 'vite-plugin-commonjs'
import http from 'node:http'
import https from 'node:https'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(),
    commonjs(),
    {
      name: 'dev-env-config',
      configureServer(server) {
        server.middlewares.use('/env-config.js', (req, res) => {
          res.setHeader('Content-Type', 'application/javascript');
          const baseUrl = process.env.VALIDATION_SERVICE_BASE_URL || "https://model-validation-api.apps.dev-adacloud.ebrains.eu";
          res.end(`window.__env = { baseUrl: "${baseUrl}" };`);
        });
      },
    },
    {
      name: 'dev-cors-proxy',
      configureServer(server) {
        server.middlewares.use('/cors-proxy', (req, res) => {
          const follow = (url) => {
            const lib = url.protocol === 'https:' ? https : http
            const proxyReq = lib.request(
              { hostname: url.hostname, path: url.pathname + url.search, method: req.method,
                headers: { ...req.headers, host: url.hostname } },
              (proxyRes) => {
                if ([301, 302, 303, 307, 308].includes(proxyRes.statusCode) && proxyRes.headers.location) {
                  proxyRes.resume()
                  follow(new URL(proxyRes.headers.location, url))
                } else {
                  res.writeHead(proxyRes.statusCode, proxyRes.headers)
                  proxyRes.pipe(res)
                }
              }
            )
            proxyReq.on('error', (e) => { res.writeHead(502); res.end(e.message) })
            proxyReq.end()
          }
          follow(new URL(req.url.slice(1)))
        })
      },
    },
  ],
})
