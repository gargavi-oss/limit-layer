import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { MemoryStore } from "@limitlayer/core";
import { limitLayer } from "../src/index.js";

describe("Expose Algorithm", () => {
  function createApp(expose: boolean) {
    const app = express();

    app.use(
      limitLayer(
        {
          storage: new MemoryStore(),
          rules: [
            {
              path: "/",
              algorithm: "fixed-window",
              limit: 5,
              window: "1m",
            },
          ],
        },
        {
          exposeAlgorithm: expose,
        }
      )
    );

    app.get("/", (_, res) => {
      res.send("ok");
    });

    return app;
  }

  it("should expose algorithm header", async () => {
    const res = await request(
      createApp(true)
    ).get("/");

    expect(
      res.headers["x-ratelimit-algorithm"]
    ).toBe("fixed-window");
  });

  it("should not expose algorithm header", async () => {
    const res = await request(
      createApp(false)
    ).get("/");

    expect(
      res.headers["x-ratelimit-algorithm"]
    ).toBeUndefined();
  });
});