const server = Bun.serve({
  async fetch(req) {
    const url = new URL(req.url)

    if (url.pathname === '/') {
      return new Response('the homepage')
    }

    if (url.pathname === '/test') {
      const html = Bun.file("./templates/test.html")
      return new Response(html)
    }

    if (url.pathname === '/get-data') {
      if (req.method !== 'GET') {
        return new Response('request not allowed.', { status: 405 })
      }
      const data = [
        {
          id: 1,
          name: 'item 1'
        },
        {
          id: 2,
          name: 'item 2'
        }
      ]
      return Response.json(data)
    }

    if (url.pathname === '/submit-to-me') {
      if (req.method !== 'POST') {
        return new Response('request not allowed', { status: 405 })
      }

      if (req.headers.get('content-type') !== 'application/json') {
        return new Response('invalid content-type', { status: 400 })
      }

      if (!req.body) {
        return new Response('missing body', { status: 400 })
      }

      const reqBody = await req.json()
      return Response.json(reqBody)
    }

    return new Response('404 - page not found', { status: 404 })
  }
})

console.log(`Listening on http://${server.hostname}:${server.port}`)

