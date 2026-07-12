import { describe, expect, it, vi } from "vitest";

import { createLimitLayer } from "../src/limit-layer.js";
import { MemoryStore } from "../src/storage/memory-store.js";

describe("Skip Function", () => {
  it("should skip requests using global skip", async () => {
    const limiter = createLimitLayer({
      storage: new MemoryStore(),

      skip: (request) => request.path === "/health",

      rules: [
        {
          path: "/health",
          algorithm: "fixed-window",
          limit: 1,
          window: "1m",
        },
      ],
    });

    const result = await limiter.consume({
      method: "GET",
      path: "/health",
      ip: "127.0.0.1",
      headers: {},
      query: {},
    });

    expect(result).toBeNull();
  });

  it("should not skip normal requests", async () => {
    const limiter = createLimitLayer({
      storage: new MemoryStore(),

      skip: (request) => request.path === "/health",

      rules: [
        {
          path: "/api",
          algorithm: "fixed-window",
          limit: 1,
          window: "1m",
        },
      ],
    });

    const result = await limiter.consume({
      method: "GET",
      path: "/api",
      ip: "127.0.0.1",
      headers: {},
      query: {},
    });

    expect(result).not.toBeNull();
    expect(result?.allowed).toBe(true);
  });

  it("should support async global skip", async () => {
    const limiter = createLimitLayer({
      storage: new MemoryStore(),

      skip: async (request) => request.path === "/health",

      rules: [
        {
          path: "/health",
          algorithm: "fixed-window",
          limit: 1,
          window: "1m",
        },
      ],
    });

    const result = await limiter.consume({
      method: "GET",
      path: "/health",
      ip: "127.0.0.1",
      headers: {},
      query: {},
    });

    expect(result).toBeNull();
  });

  it("should skip using rule skip", async () => {
    const limiter = createLimitLayer({
      storage: new MemoryStore(),

      rules: [
        {
          path: "/login",
          algorithm: "fixed-window",
          limit: 1,
          window: "1m",

          skip: (request) =>
            request.headers["x-internal"] === "true",
        },
      ],
    });

    const result = await limiter.consume({
      method: "POST",
      path: "/login",
      ip: "127.0.0.1",
      headers: {
        "x-internal": "true",
      },
      query: {},
    });

    expect(result).toBeNull();
  });

  it("should execute rule skip before global skip", async () => {
    const globalSkip = vi.fn().mockResolvedValue(false);

    const ruleSkip = vi.fn().mockResolvedValue(true);

    const limiter = createLimitLayer({
      storage: new MemoryStore(),

      skip: globalSkip,

      rules: [
        {
          path: "/login",
          algorithm: "fixed-window",
          limit: 1,
          window: "1m",

          skip: ruleSkip,
        },
      ],
    });

    const result = await limiter.consume({
      method: "POST",
      path: "/login",
      ip: "127.0.0.1",
      headers: {},
      query: {},
    });

    expect(result).toBeNull();

    expect(ruleSkip).toHaveBeenCalledOnce();

    expect(globalSkip).not.toHaveBeenCalled();
  });

  it("should count requests when skip returns false", async () => {
    const limiter = createLimitLayer({
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
    });

    const first = await limiter.consume({
      method: "GET",
      path: "/api",
      ip: "127.0.0.1",
      headers: {},
      query: {},
    });

    const second = await limiter.consume({
      method: "GET",
      path: "/api",
      ip: "127.0.0.1",
      headers: {},
      query: {},
    });

    expect(first?.allowed).toBe(true);
    expect(second?.allowed).toBe(false);
  });

  it("should not consume rate limit when skipped", async () => {
    const limiter = createLimitLayer({
      storage: new MemoryStore(),

      skip: (request) => request.path === "/health",

      rules: [
        {
          path: "/health",
          algorithm: "fixed-window",
          limit: 1,
          window: "1m",
        },
      ],
    });

    await limiter.consume({
      method: "GET",
      path: "/health",
      ip: "127.0.0.1",
      headers: {},
      query: {},
    });

    await limiter.consume({
      method: "GET",
      path: "/health",
      ip: "127.0.0.1",
      headers: {},
      query: {},
    });

    const result = await limiter.consume({
      method: "GET",
      path: "/health",
      ip: "127.0.0.1",
      headers: {},
      query: {},
    });

    expect(result).toBeNull();
  });
});