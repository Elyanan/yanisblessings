/**
 * After `next build`, copy static assets into the standalone output (required for cPanel / self-hosted).
 */
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const standalone = path.join(root, '.next', 'standalone')
const staticSrc = path.join(root, '.next', 'static')
const staticDest = path.join(standalone, '.next', 'static')
const publicSrc = path.join(root, 'public')
const publicDest = path.join(standalone, 'public')

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name)
    const to = path.join(dest, entry.name)
    if (entry.isDirectory()) copyRecursive(from, to)
    else fs.copyFileSync(from, to)
  }
}

if (!fs.existsSync(standalone)) {
  console.warn('[copy-standalone-assets] No .next/standalone — skip (run npm run build first).')
  process.exit(0)
}

copyRecursive(staticSrc, staticDest)
copyRecursive(publicSrc, publicDest)
console.log('[copy-standalone-assets] Copied .next/static and public into standalone output.')
