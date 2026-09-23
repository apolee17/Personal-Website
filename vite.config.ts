import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { readdirSync, existsSync } from 'node:fs'
import { resolve, relative, sep } from 'node:path'

// Discover real public assets so an unfilled photo slot never requests a missing file.
function mediaManifest(): Plugin {
  const root = resolve('public')
  const id = '\0virtual:media-manifest'
  const files = (dir: string): string[] => existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
        const path = resolve(dir, entry.name)
        return entry.isDirectory() ? files(path) : [relative(root, path).split(sep).join('/')]
      }) : []
  return {
    name: 'available-media',
    resolveId: source => source === 'virtual:media-manifest' ? id : undefined,
    load: source => source === id ? `export default ${JSON.stringify(files(resolve(root, 'media')))}` : undefined,
    configureServer(server) {
      server.watcher.add(resolve(root, 'media'))
      const refresh = (path: string) => {
        if (!path.startsWith(resolve(root, 'media'))) return
        const module = server.moduleGraph.getModuleById(id)
        if (module) server.moduleGraph.invalidateModule(module)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('add', refresh).on('unlink', refresh)
    },
  }
}

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'Personal-Website'
const inferredBase = repository && !repository.endsWith('.github.io') ? `/${repository}/` : '/'

export default defineConfig({
  base: process.env.VITE_BASE_PATH || inferredBase,
  plugins: [react(), mediaManifest()],
})
