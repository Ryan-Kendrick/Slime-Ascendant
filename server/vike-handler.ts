import { renderPage } from "vike/server"
import type { Get, UniversalHandler } from "@universal-middleware/core"

export const vikeHandler: Get<[], UniversalHandler> = () => async (request, context, runtime) => {
  console.log("Vike handler called for:", request.url)

  const pageContextInit = {
    ...context,
    ...runtime,
    urlOriginal: request.url,
    headersOriginal: request.headers,
  }

  const pageContext = await renderPage(pageContextInit)
  console.log("Page context:", {
    url: pageContext.urlOriginal,
    hasResponse: !!pageContext.httpResponse,
    errorWhileRendering: pageContext.errorWhileRendering,
  })

  const response = pageContext.httpResponse

  if (!response) {
    console.log("No response from Vike")
    return new Response(null, { status: 404 })
  }

  return new Response(response.body, {
    status: response.statusCode,
    headers: response.headers,
  })
}
