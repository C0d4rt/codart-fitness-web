import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'

const root = join(import.meta.dirname, '..', '.output', 'public')
const port = Number(process.argv[2] ?? 4173)
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
}

// Mirrors the CloudFront Function: `/planos` is served from `/planos/index.html`.
const fileFor = (url) => {
  const path = normalize(decodeURIComponent(new URL(url, 'http://x').pathname))
  const direct = join(root, path)
  if (!direct.startsWith(root)) return undefined
  if (existsSync(direct) && statSync(direct).isFile()) return direct
  const index = join(root, path, 'index.html')
  return existsSync(index) ? index : undefined
}

createServer((req, res) => {
  const file = fileFor(req.url ?? '/')
  if (file === undefined) {
    res.writeHead(404, { 'content-type': types['.html'] })
    createReadStream(join(root, '404.html'))
      .on('error', () => res.end())
      .pipe(res)
    return
  }
  res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' })
  createReadStream(file).pipe(res)
}).listen(port)
