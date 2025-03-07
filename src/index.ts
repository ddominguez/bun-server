import { Database } from "bun:sqlite";
import type { BunRequest } from "bun";

const db = new Database("sqlite.db", { create: true })

export type SampleData = {
  id: number;
  name: string;
}

function handleTestHtml() {
  const html = Bun.file("./src/templates/test.html");
  return new Response(html);
}

function handleGetJson(req: BunRequest<'/get-json'>) {
  if (req.method !== "GET") {
    return new Response("request not allowed.", { status: 405 });
  }
  const data: SampleData[] = [
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
}

function handleApiPosts() {
  try {
    const posts = db.query("select * from posts")
    return Response.json(posts.all());
  } catch (error) {
    console.error(error)
    return new Response("server error", { status: 500 })
  }
}

async function handleSubmitToMe(req: BunRequest<'/submit-to-me'>) {
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
}

export const server = Bun.serve({
  routes: {
    "/": { GET: () => new Response('the homepage') },
    "/test-html": { GET: handleTestHtml },
    "/get-json": handleGetJson,
    "/api/posts": { GET: handleApiPosts },
    "/submit-to-me": handleSubmitToMe
  },
  fetch() {
    return new Response("404 - page not found", { status: 404 });
  },
});

if (import.meta.path === Bun.main) {
  console.log(`Listening on http://${server.hostname}:${server.port}`);
}
