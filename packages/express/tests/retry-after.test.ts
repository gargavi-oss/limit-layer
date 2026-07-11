import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { MemoryStore } from "@limitlayer/core";
import { limitLayer } from "../src/index.js";

describe("Retry-After Header", () => {
  it("should return Retry-After when limited", async () => {
    const app = express();

    app.use(
      limitLayer({
        storage: new MemoryStore(),
        rules: [
          {
            path: "/",
            algorithm: "fixed-window",
            limit: 1,
            window: "1m",
          },
        ],
      })
    );

    app.get("/", (_, res) => {
      res.send("ok");
    });

    await request(app).get("/");

    const blocked = await request(app).get("/");

    expect(blocked.status).toBe(429);

    expect(
      blocked.headers["retry-after"]
    ).toBeDefined();
  });
});