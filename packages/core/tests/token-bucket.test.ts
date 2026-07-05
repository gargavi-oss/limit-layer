import { describe, expect, it } from "vitest";

import { TokenBucketAlgorithm } from "../src/algorithms/token-bucket.js";

import type { TokenBucketState } from "../src/types/state.js";
import type { Rule } from "../src/types/rule.js";
import type { LLRequest } from "../src/types/request.js";

describe("TokenBucketAlgorithm", () => {
  const algorithm = new TokenBucketAlgorithm();

  const request: LLRequest = {
    method: "GET",
    path: "/api",
    ip: "127.0.0.1",
    headers: {},
    query: {},
  };

  const rule: Rule = {
    path: "/api",
    algorithm: "token-bucket",
    limit: 2,
    burst: 4,
    window: "2s",
  };

  it("should initialize bucket with full capacity", async () => {
    const result = await algorithm.consume({
      request,
      rule,
      key: "user-1",
      now: 0,
      state: null,
    });

    expect(result.allowed).toBe(true);
    expect(result.state.tokens).toBe(3);
  });

  it("should allow requests until bucket is empty", async () => {
    let state: TokenBucketState | null = null;

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

    expect(state?.tokens).toBe(0);
  });

  it("should reject requests when no tokens remain", async () => {
    let state: TokenBucketState | null = null;

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

  it("should refill one token after one second", async () => {
    let state: TokenBucketState | null = null;

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

    const refilled = await algorithm.consume({
      request,
      rule,
      key: "user-1",
      now: 1000,
      state,
    });

    expect(refilled.allowed).toBe(true);
  });

  it("should refill to maximum capacity", async () => {
    let state: TokenBucketState | null = null;

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

    const refilled = await algorithm.consume({
      request,
      rule,
      key: "user-1",
      now: 10000,
      state,
    });

    expect(refilled.allowed).toBe(true);
    expect(refilled.state.tokens).toBe(3);
  });

  it("should never exceed bucket capacity", async () => {
    const result = await algorithm.consume({
      request,
      rule,
      key: "user-1",
      now: 100000,
      state: {
        tokens: 100,
        lastRefill: 0,
      },
    });

    expect(result.state.tokens).toBeLessThanOrEqual(3);
  });

  it("should return remaining tokens", async () => {
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
    let state: TokenBucketState | null = null;

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

    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it("should preserve fractional token refill", async () => {
    let state: TokenBucketState | null = null;

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

    const partial = await algorithm.consume({
      request,
      rule,
      key: "user-1",
      now: 500,
      state,
    });

    expect(partial.allowed).toBe(false);
    expect(partial.state.tokens).toBeCloseTo(0.5, 5);
  });
});