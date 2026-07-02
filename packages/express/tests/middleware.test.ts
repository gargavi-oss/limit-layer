import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { MemoryStore } from "@limitlayer/core";
import { limitLayer } from "../src/index.js";

describe("Express Middleware", () => {
  function createApp() {
    const app = express();

    app.use(express.json());

    app.use(
      limitLayer({
        storage: new MemoryStore(),
        rules: [
          {
            path: "/login",
            algorithm: "fixed-window",
            limit: 5,
            window: "1m",
          },
        ],
      })
    );

    app.post("/login", (_req, res) => {
      res.status(200).json({
        success: true,
      });
    });

    app.get("/health", (_req, res) => {
      res.status(200).json({
        ok: true,
      });
    });

    return app;
  }

  it("allows requests within the limit", async () => {
    const app = createApp();

    const response = await request(app).post("/login");

    expect(response.status).toBe(200);
  });

  it("blocks after exceeding the limit", async () => {
    const app = createApp();

    let response;

    for (let i = 0; i < 6; i++) {
      response = await request(app).post("/login");
    }

    expect(response!.status).toBe(429);
  });

  it("sets rate limit headers", async () => {
    const app = createApp();

    const response = await request(app).post("/login");

    expect(response.headers["ratelimit-limit"]).toBeDefined();
    expect(response.headers["ratelimit-remaining"]).toBeDefined();
    expect(response.headers["ratelimit-reset"]).toBeDefined();
  });

  it("does not affect routes without matching rules", async () => {
    const app = createApp();

    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
  });

  it("resets counters for different IPs", async () => {
    const app = createApp();

    const first = await request(app)
      .post("/login")
      .set("X-Forwarded-For", "1.1.1.1");

    const second = await request(app)
      .post("/login")
      .set("X-Forwarded-For", "2.2.2.2");

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
  });

  it("returns retryAfter when blocked", async () => {
    const app = createApp();

    let response;

    for (let i = 0; i < 6; i++) {
      response = await request(app).post("/login");
    }

    expect(response!.body.retryAfter).toBeGreaterThan(0);
  });
});
