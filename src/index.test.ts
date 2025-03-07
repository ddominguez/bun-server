import { describe, expect, it } from "bun:test";
import { server } from "./index.ts";
import type { SampleData } from "./index.ts"

describe("404 response", () => {
  it("must be triggered when path not found", async () => {
    const res = await fetch(`${server.url}not-exist`);
    expect(res.status).toEqual(404);
  });
});

describe("index request", () => {
  it("must return sucess response", async () => {
    const res = await fetch(server.url);
    const text = await res.text();
    expect(res.status).toEqual(200);
    expect(text).toEqual("the homepage");
  });
});

describe("test-html request", () => {
  it("must return success response", async () => {
    const res = await fetch(`${server.url}test-html`);
    const text = await res.text();
    expect(res.status).toEqual(200);
    expect(text).toContain("<h1>html</h1>");
  });
});

describe("get-json request", () => {
  it("must return success response", async () => {
    const res = await fetch(`${server.url}get-json`);
    const data = await res.json() as SampleData[];
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
      const res = await fetch(`${server.url}get-json`, { method });
      expect(res.status).toEqual(405);
    }
  });
});

describe("submit-to-me request", () => {
  const url = `${server.url}submit-to-me`;

  it("must return success response", async () => {
    const reqData = { test: "test" };
    const res = await fetch(url, {
      method: "post",
      body: JSON.stringify(reqData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    expect(res.status).toEqual(200);
    expect(data).toEqual(reqData);
  });

  it("must reject non POST requests", async () => {
    const invalidMethods = ["get", "delete", "patch"];
    for (const method of invalidMethods) {
      const res = await fetch(url, { method });
      const text = await res.text();
      expect(res.status).toEqual(405);
      expect(text).toEqual("request not allowed");
    }
  });

  it("must return error response if missing request body", async () => {
    const res = await fetch(url, {
      method: "post",
      body: null,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const text = await res.text();
    expect(res.status).toEqual(400);
    expect(text).toEqual("missing body");
  });

  it("must return error response if invalid content type", async () => {
    const res = await fetch(url, {
      method: "post",
      body: JSON.stringify({ test: "test" }),
      headers: {
        "Content-Type": "application/no-good",
      },
    });
    const text = await res.text();
    expect(res.status).toEqual(400);
    expect(text).toEqual("invalid content-type");
  });
});
