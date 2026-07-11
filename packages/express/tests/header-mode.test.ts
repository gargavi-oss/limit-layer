import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { MemoryStore } from "@limitlayer/core";
import { limitLayer } from "../src/index.js";

function createApp(
  headerMode:
    | "legacy"
    | "standard"
    | "both"
    | false
) {
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
        headerMode,
      }
    )
  );

  app.get("/", (_, res) => {
    res.send("ok");
  });

  return app;
}

describe("Header Modes", () => {
it("should send legacy headers", async () => {
  const res = await request(
    createApp("legacy")
  ).get("/");

  console.log(res.headers);

  expect(
    res.headers["x-ratelimit-limit"]
  ).toBeDefined();

  expect(
    res.headers["ratelimit-limit"]
  ).toBeUndefined();
});
  it("should send standard headers", async () => {
    const res = await request(
      createApp("standard")
    ).get("/");

    expect(
      res.headers["ratelimit-limit"]
    ).toBeDefined();

    expect(
      res.headers["x-ratelimit-limit"]
    ).toBeUndefined();
  });

  it("should send both header formats", async () => {
    const res = await request(
      createApp("both")
    ).get("/");

    expect(
      res.headers["x-ratelimit-limit"]
    ).toBeDefined();

    expect(
      res.headers["ratelimit-limit"]
    ).toBeDefined();
  });

  it("should disable headers", async () => {
    const res = await request(
      createApp(false)
    ).get("/");

    expect(
      res.headers["x-ratelimit-limit"]
    ).toBeUndefined();

    expect(
      res.headers["ratelimit-limit"]
    ).toBeUndefined();
  });
});