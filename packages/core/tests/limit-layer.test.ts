import { describe, expect, it } from "vitest";

import {
  MemoryStore,
  createLimitLayer,
} from "../src/index.js";

describe("LimitLayer", () => {
  const createLimiter = () =>
    createLimitLayer({
      storage: new MemoryStore(),
      rules: [
        {
          path: "/login",
          algorithm: "fixed-window",
          limit: 5,
          window: "1m",
        },
      ],
    });

  const request = {
    method: "POST",
    path: "/login",
    ip: "127.0.0.1",
    headers: {},
    query: {},
  };

  it("creates a limiter instance", () => {
    const limiter = createLimiter();

    expect(limiter).toBeDefined();
    expect(typeof limiter.consume).toBe("function");
  });

  it("allows requests within the limit", async () => {
    const limiter = createLimiter();

    const result = await limiter.consume(request);

    expect(result).not.toBeNull();
    expect(result!.allowed).toBe(true);
    expect(result!.remaining).toBe(4);
  });

  it("blocks requests after exceeding the limit", async () => {
    const limiter = createLimiter();

    let result = null;

    for (let i = 0; i < 6; i++) {
      result = await limiter.consume(request);
    }

    expect(result).not.toBeNull();
    expect(result!.allowed).toBe(false);
    expect(result!.remaining).toBe(0);
    expect(result!.retryAfter).toBeGreaterThan(0);
  });

  it("tracks different IPs independently", async () => {
    const limiter = createLimiter();

    const first = await limiter.consume({
      ...request,
      ip: "192.168.1.1",
    });

    const second = await limiter.consume({
      ...request,
      ip: "192.168.1.2",
    });

    expect(first!.remaining).toBe(4);
    expect(second!.remaining).toBe(4);
  });

  it("returns null when no rule matches", async () => {
    const limiter = createLimiter();

    const result = await limiter.consume({
      ...request,
      path: "/register",
    });

    expect(result).toBeNull();
  });

  it("supports custom key generators", async () => {
    const limiter = createLimitLayer({
      storage: new MemoryStore(),
      rules: [
        {
          path: "/login",
          algorithm: "fixed-window",
          limit: 5,
          window: "1m",
          keyGenerator: () => "user-1",
        },
      ],
    });

    const first = await limiter.consume(request);
    const second = await limiter.consume(request);

    expect(first!.remaining).toBe(4);
    expect(second!.remaining).toBe(3);
  });

  it("returns a copy of rules", () => {
    const limiter = createLimiter();

    const rules = limiter.getRules();

    expect(rules).toHaveLength(1);

    rules.pop();

    expect(limiter.getRules()).toHaveLength(1);
  });

  it("allows registering custom algorithms", () => {
    const limiter = createLimiter();

    expect(() =>
      limiter.registerAlgorithm(
        "fixed-window",
        {} as any
      )
    ).toThrow();
  });
});