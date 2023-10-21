import { describe, expect, it } from "bun:test";
import { server } from "./index.ts";

describe("404 response", () => {
  it("must be triggered when path not found", async () => {
    const res = await server.fetch(`http://localhost/not-exist`);
    expect(res.status).toEqual(404);
  });
});

describe("index request", () => {
  it("must return sucess response", async () => {
    const res = await server.fetch("http://localhost/");
    const text = await res.text();
    expect(res.status).toEqual(200);
    expect(text).toEqual("the homepage");
  });
});

describe("test-html request", () => {
  it("must return success response", async () => {
    const res = await server.fetch("http://localhost/test-html");
    const text = await res.text();
    expect(res.status).toEqual(200);
    expect(text).toContain("<h1>html</h1>");
  });
});

describe("get-json request", () => {
  it("must return sucess response", async () => {
    const res = await server.fetch("http://localhost/get-json");
    const data = await res.json();
    expect(res.status).toEqual(200);
    expect(data.length).toEqual(2);
    expect(data).toEqual([
      { id: 1, name: "item 1" },
      { id: 2, name: "item 2" },
    ]);
  });

  it("must reject non GET requests", async () => {
    const invalidMethods = ["post", "delete", "patch"];
    for (const method of invalidMethods) {
      const req = new Request("http://localhost/get-json", {
        method: method,
      });
      const res = await server.fetch(req);
      expect(res.status).toEqual(405);
    }
  });
});

describe("submit-to-me request", () => {
  it("must return success response", async () => {
    const reqData = { test: "test" };
    const req = new Request("http://localhost/submit-to-me", {
      method: "post",
      body: JSON.stringify(reqData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await server.fetch(req);
    const data = await res.json();
    expect(res.status).toEqual(200);
    expect(data).toEqual(reqData);
  });

  it("must reject non POST requests", async () => {
    const invalidMethods = ["get", "delete", "patch"];
    for (const method of invalidMethods) {
      const req = new Request("http://localhost/submit-to-me", {
        method: method,
      });
      const res = await server.fetch(req);
      const text = await res.text();
      expect(res.status).toEqual(405);
      expect(text).toEqual("request not allowed");
    }
  });

  it("must return error response if missing request body", async () => {
    const req = new Request("http://localhost/submit-to-me", {
      method: "post",
      body: null,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await server.fetch(req);
    const text = await res.text();
    expect(res.status).toEqual(400);
    expect(text).toEqual("missing body");
  });

  it("must return error response if invalid content type", async () => {
    const req = new Request("http://localhost/submit-to-me", {
      method: "post",
      body: JSON.stringify({ test: "test" }),
      headers: {
        "Content-Type": "application/no-good",
      },
    });
    const res = await server.fetch(req);
    const text = await res.text();
    expect(res.status).toEqual(400);
    expect(text).toEqual("invalid content-type");
  });
});
