import { Database } from "bun:sqlite";

const db = new Database("sqlite.db", { create: true })

const server = Bun.serve({
  routes: {
    "/": {
      GET: () => new Response('the homepage')
    },
    "/test-html": {
      GET: () => {
        const html = Bun.file("./src/templates/test.html");
        return new Response(html);
      }
    },
    "/get-json": (req) => {
      if (req.method !== "GET") {
        return new Response("request not allowed.", { status: 405 });
      }
      const data = [
        {
          id: 1,
          name: "item 1",
        },
        {
          id: 2,
          name: "item 2",
        },
      ];
      return Response.json(data);
    },
    "/api/posts": {
      GET: () => {
        try {
          const posts = db.query("select * from posts")
          return Response.json(posts.all());
        } catch (error) {
          console.error(error)
          return new Response("server error", { status: 500 })
        }
      }
    },
    "/submit-to-me": async (req) => {
      if (req.method !== "POST") {
        return new Response("request not allowed", { status: 405 });
      }

      if (req.headers.get("content-type") !== "application/json") {
        return new Response("invalid content-type", { status: 400 });
      }

      if (!req.body) {
        return new Response("missing body", { status: 400 });
      }

      const reqBody = await req.json();
      return Response.json(reqBody);
    },
  },
  fetch() {
    return new Response("404 - page not found", { status: 404 });
  },
});

if (import.meta.path === Bun.main) {
  console.log(`Listening on http://${server.hostname}:${server.port}`);
}

export { server };
