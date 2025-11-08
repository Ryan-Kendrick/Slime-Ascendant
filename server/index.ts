import "dotenv/config"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import express from "express"
import { createDevMiddleware, renderPage } from "vike/server"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const root = join(__dirname, "..")
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000
// const hmrPort = process.env.HMR_PORT ? parseInt(process.env.HMR_PORT, 10) : 24678

export default (await startServer()) as unknown

async function startServer() {
  const app = express()

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(`${root}/dist/client`))
  } else {
    const { devMiddleware } = await createDevMiddleware({
      root,
    })
    app.use(devMiddleware)

    app.get("*", async (req, res) => {
      const pageContext = await renderPage({ urlOriginal: req.originalUrl })
      const { body, statusCode, headers } = pageContext.httpResponse
      headers.forEach(([name, value]) => res.setHeader(name, value))
      res.status(statusCode).send(body)
    })
  }

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
  })

  return app
}
