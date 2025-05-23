import "dotenv/config"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
// import { authjsHandler, authjsSessionMiddleware } from "./server/authjs-handler"

import { vikeHandler } from "./server/vike-handler"
import { createHandler, createMiddleware } from "@universal-middleware/express"
// import { dbMiddleware } from "./server/db-middleware"
import express from "express"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const root = __dirname
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000
const hmrPort = process.env.HMR_PORT ? parseInt(process.env.HMR_PORT, 10) : 24678

export default (await startServer()) as unknown

async function startServer() {
  const app = express()

  // TODO: Add https://github.com/vikejs/vike-node

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(`${root}/dist/client`))
  } else {
    // Instantiate Vite's development server and integrate its middleware to our server.
    // ⚠️ We should instantiate it *only* in development. (It isn't needed in production
    // and would unnecessarily bloat our server in production.)
    const vite = await import("vite")
    const viteDevMiddleware = (
      await vite.createServer({
        root,
        server: { middlewareMode: true, hmr: { port: hmrPort } },
        // server: {
        //   middlewareMode: true,
        //   hmr: {
        //     port: hmrPort,
        //     host: "192.168.1.67",
        //     clientPort: hmrPort,
        //   },
        // },
      })
    ).middlewares
    app.use(viteDevMiddleware)
  }

  // app.use(createMiddleware(dbMiddleware)())

  // app.use(createMiddleware(authjsSessionMiddleware)())

  /**
   * Auth.js route
   * @link {@see https://authjs.dev/getting-started/installation}
   **/
  // app.all("/api/auth/*", createHandler(authjsHandler)())

  /**
   * Vike route
   *
   * @link {@see https://vike.dev}
   **/
  app.all("*", createHandler(vikeHandler)())

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
  })

  // app.listen(port, "0.0.0.0", () => {
  //   console.log(`Server listening on local ip & http://localhost:${port}`)
  // })

  return app
}
