import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { MemoryStore } from "@limitlayer/core";

import { limitLayer } from "../src/index.js";

describe("Skip Middleware", () => {
  it("should skip requests using global skip", async () => {
    const app = express();

    app.use(
      limitLayer({
        storage: new MemoryStore(),

        skip: (req) => req.path === "/health",

        rules: [
          {
            path: "/health",
            algorithm: "fixed-window",
            limit: 1,
            window: "1m",
          },
        ],
      })
    );

    app.get("/health", (_, res) => {
      res.send("OK");
    });

    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.text).toBe("OK");

    expect(res.headers["x-ratelimit-limit"]).toBeUndefined();
    expect(res.headers["ratelimit-limit"]).toBeUndefined();
  });

  it("should skip requests using rule skip", async () => {
    const app = express();

    app.use(
      limitLayer({
        storage: new MemoryStore(),

        rules: [
          {
            path: "/login",
            algorithm: "fixed-window",
            limit: 1,
            window: "1m",

            skip: (req) =>
              req.headers["x-internal"] === "true",
          },
        ],
      })
    );

    app.get("/login", (_, res) => {
      res.send("OK");
    });

    const res = await request(app)
      .get("/login")
      .set("x-internal", "true");

    expect(res.status).toBe(200);
    expect(res.text).toBe("OK");

    expect(res.headers["x-ratelimit-limit"]).toBeUndefined();
    expect(res.headers["ratelimit-limit"]).toBeUndefined();
  });

  it("should rate limit when skip returns false", async () => {
    const app = express();

    app.use(
      limitLayer({
        storage: new MemoryStore(),

        skip: () => false,

        rules: [
          {
            path: "/api",
            algorithm: "fixed-window",
            limit: 1,
            window: "1m",
          },
        ],
      })
    );

    app.get("/api", (_, res) => {
      res.send("OK");
    });

    const first = await request(app).get("/api");
    const second = await request(app).get("/api");

    expect(first.status).toBe(200);
    expect(second.status).toBe(429);
  });

  it("should support async global skip", async () => {
    const app = express();

    app.use(
      limitLayer({
        storage: new MemoryStore(),

        skip: async (req) => req.path === "/health",

        rules: [
          {
            path: "/health",
            algorithm: "fixed-window",
            limit: 1,
            window: "1m",
          },
        ],
      })
    );

    app.get("/health", (_, res) => {
      res.send("OK");
    });

    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.text).toBe("OK");
  });

  it("should not skip normal requests", async () => {
    const app = express();

    app.use(
      limitLayer({
        storage: new MemoryStore(),

        skip: (req) => req.path === "/health",

        rules: [
          {
            path: "/api",
            algorithm: "fixed-window",
            limit: 1,
            window: "1m",
          },
        ],
      })
    );

    app.get("/api", (_, res) => {
      res.send("OK");
    });

    const first = await request(app).get("/api");
    const second = await request(app).get("/api");

    expect(first.status).toBe(200);
    expect(second.status).toBe(429);
  });

  it("should prioritize rule skip over global skip", async () => {
    const app = express();

    app.use(
      limitLayer({
        storage: new MemoryStore(),

        skip: () => false,

        rules: [
          {
            path: "/login",
            algorithm: "fixed-window",
            limit: 1,
            window: "1m",

            skip: () => true,
          },
        ],
      })
    );

    app.get("/login", (_, res) => {
      res.send("OK");
    });

    const first = await request(app).get("/login");
    const second = await request(app).get("/login");

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);

    expect(first.headers["x-ratelimit-limit"]).toBeUndefined();
    expect(second.headers["x-ratelimit-limit"]).toBeUndefined();
  });
});