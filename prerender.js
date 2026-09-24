import fs from "node:fs"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function prerender() {
  const distIndexPath = path.resolve(__dirname, "dist/index.html")
  if (!fs.existsSync(distIndexPath)) {
    throw new Error(`dist/index.html does not exist at ${distIndexPath}`)
  }

  const template = fs.readFileSync(distIndexPath, "utf-8")
  const ssrEntryPath = path.resolve(__dirname, "dist-ssr/entry-server.js")
  const ssrUrl = pathToFileURL(ssrEntryPath).href
  const { render } = await import(ssrUrl)

  const { html: appHtml } = render()

  if (!appHtml || appHtml.length === 0) {
    throw new Error("Rendered HTML is empty")
  }

  const finalHtml = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)

  fs.writeFileSync(distIndexPath, finalHtml, "utf-8")
  console.log(`✓ Prerendered static HTML successfully injected into dist/index.html (${appHtml.length} characters)`)

  // Clean up dist-ssr after prerender
  const distSsrPath = path.resolve(__dirname, "dist-ssr")
  if (fs.existsSync(distSsrPath)) {
    fs.rmSync(distSsrPath, { recursive: true, force: true })
  }
}

prerender().catch((err) => {
  console.error("Prerender failed:", err)
  process.exit(1)
})
