import { describe, expect, it } from "vitest";

import { LeakyBucketAlgorithm } from "../src/algorithms/leaky-bucket.js";

import type { LeakyBucketState } from "../src/types/state.js";
import type { Rule } from "../src/types/rule.js";
import type { LLRequest } from "../src/types/request.js";

describe("LeakyBucketAlgorithm", () => {
  const algorithm = new LeakyBucketAlgorithm();

  const request: LLRequest = {
    method: "GET",
    path: "/api",
    ip: "127.0.0.1",
    headers: {},
    query: {},
  };

  const rule: Rule = {
    path: "/api",
    algorithm: "leaky-bucket",
    limit: 2,
    burst: 4,
    window: "2s",
  };

  it("should initialize an empty bucket", async () => {
    const result = await algorithm.consume({
      request,
      rule,
      key: "user-1",
      now: 0,
      state: null,
    });

    expect(result.allowed).toBe(true);
    expect(result.state.water).toBe(1);
  });

  it("should allow requests until the bucket is full", async () => {
    let state: LeakyBucketState | null = null;

    for (let i = 0; i < 4; i++) {
      const result = await algorithm.consume({
        request,
        rule,
        key: "user-1",
        now: 0,
        state,
      });

      expect(result.allowed).toBe(true);

      state = result.state;
    }

    expect(state!.water).toBe(4);
  });

  it("should reject requests when the bucket overflows", async () => {
    let state: LeakyBucketState | null = null;

    for (let i = 0; i < 4; i++) {
      const result = await algorithm.consume({
        request,
        rule,
        key: "user-1",
        now: 0,
        state,
      });

      state = result.state;
    }

    const blocked = await algorithm.consume({
      request,
      rule,
      key: "user-1",
      now: 0,
      state,
    });

    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it("should leak water over time", async () => {
    let state: LeakyBucketState | null = null;

    for (let i = 0; i < 4; i++) {
      const result = await algorithm.consume({
        request,
        rule,
        key: "user-1",
        now: 0,
        state,
      });

      state = result.state;
    }

 const leaked = await algorithm.consume({
  request,
  rule,
  key: "user-1",
  now: 1500,
  state,
});

expect(leaked.allowed).toBe(true);
expect(leaked.state.water).toBeCloseTo(3.5, 5);
  });

  it("should eventually empty the bucket", async () => {
    let state: LeakyBucketState | null = null;

    for (let i = 0; i < 4; i++) {
      const result = await algorithm.consume({
        request,
        rule,
        key: "user-1",
        now: 0,
        state,
      });

      state = result.state;
    }

    const emptied = await algorithm.consume({
      request,
      rule,
      key: "user-1",
      now: 10000,
      state,
    });

    expect(emptied.allowed).toBe(true);
    expect(emptied.state.water).toBe(1);
  });

  it("should never exceed bucket capacity", async () => {
    const result = await algorithm.consume({
      request,
      rule,
      key: "user-1",
      now: 0,
      state: {
        water: 100,
        lastLeak: 0,
      },
    });

    expect(result.allowed).toBe(false);
  });

  it("should return remaining capacity", async () => {
    const result = await algorithm.consume({
      request,
      rule,
      key: "user-1",
      now: 0,
      state: null,
    });

    expect(result.remaining).toBe(3);
  });

  it("should return ttl", async () => {
    const result = await algorithm.consume({
      request,
      rule,
      key: "user-1",
      now: 0,
      state: null,
    });

    expect(result.ttl).toBeGreaterThan(0);
  });

  it("should return retryAfter when blocked", async () => {
    let state: LeakyBucketState | null = null;

    for (let i = 0; i < 4; i++) {
      const result = await algorithm.consume({
        request,
        rule,
        key: "user-1",
        now: 0,
        state,
      });

      state = result.state;
    }

    const blocked = await algorithm.consume({
      request,
      rule,
      key: "user-1",
      now: 0,
      state,
    });

    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it("should leak continuously between requests", async () => {
    let state: LeakyBucketState | null = null;

    const first = await algorithm.consume({
      request,
      rule,
      key: "user-1",
      now: 0,
      state,
    });

    state = first.state;

    const second = await algorithm.consume({
      request,
      rule,
      key: "user-1",
      now: 500,
      state,
    });

    expect(second.allowed).toBe(true);
    expect(second.state.water).toBeLessThan(2);
  });
});