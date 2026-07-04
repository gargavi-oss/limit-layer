import { describe, expect, it } from "vitest";

import { SlidingWindowAlgorithm } from "../src/algorithms/sliding-window.js";

import type { SlidingWindowState } from "../src/types/state.js";
import type { Rule } from "../src/types/rule.js";
import type { LLRequest } from "../src/types/request.js";

describe("SlidingWindowAlgorithm", () => {
  const algorithm = new SlidingWindowAlgorithm();

  const request: LLRequest = {
    method: "GET",
    path: "/login",
    ip: "127.0.0.1",
    headers: {},
    query: {},
  };

  const rule: Rule = {
    path: "/login",
    algorithm: "sliding-window",
    limit: 5,
    window: "1m",
  };

  it("should allow requests below the limit", async () => {
    let state: SlidingWindowState | null = null;

    for (let i = 0; i < 5; i++) {
      const result = await algorithm.consume({
        request,
        rule,
        key: "user-1",
        now: 0,
        state,
      });

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBeGreaterThanOrEqual(0);

      state = result.state;
    }
  });

  it("should block requests above the limit", async () => {
    let state: SlidingWindowState | null = null;

    for (let i = 0; i < 5; i++) {
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

  it("should carry over previous window into the next window", async () => {
  let state: SlidingWindowState | null = null;

  for (let i = 0; i < 5; i++) {
    const result = await algorithm.consume({
      request,
      rule,
      key: "user-1",
      now: 0,
      state,
    });

    state = result.state;
  }

  const result = await algorithm.consume({
    request,
    rule,
    key: "user-1",
    now: 60000,
    state,
  });

  // Sliding Window should still consider the previous window,
  // so this request should be blocked.
  expect(result.allowed).toBe(false);
  expect(result.state.previous).toBe(5);
  expect(result.state.current).toBe(0);
});

  it("should discard traffic after multiple skipped windows", async () => {
    let state: SlidingWindowState | null = null;

    for (let i = 0; i < 5; i++) {
      const result = await algorithm.consume({
        request,
        rule,
        key: "user-1",
        now: 0,
        state,
      });

      state = result.state;
    }

    const result = await algorithm.consume({
      request,
      rule,
      key: "user-1",
      now: 300000,
      state,
    });

    expect(result.allowed).toBe(true);
    expect(result.state.previous).toBe(0);
    expect(result.state.current).toBe(1);
  });

  it("should initialize state correctly", async () => {
    const result = await algorithm.consume({
      request,
      rule,
      key: "user-1",
      now: 0,
      state: null,
    });

    expect(result.state.current).toBe(1);
    expect(result.state.previous).toBe(0);
    expect(result.state.resetAt).toBe(60000);
  });

  it("should return a positive ttl", async () => {
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
    let state: SlidingWindowState | null = null;

    for (let i = 0; i < 5; i++) {
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

  it("should correctly carry over previous window count", async () => {
    let state: SlidingWindowState | null = null;

    for (let i = 0; i < 3; i++) {
      const result = await algorithm.consume({
        request,
        rule,
        key: "user-1",
        now: 0,
        state,
      });

      state = result.state;
    }

    const nextWindow = await algorithm.consume({
      request,
      rule,
      key: "user-1",
      now: 60000,
      state,
    });

    expect(nextWindow.allowed).toBe(true);
    expect(nextWindow.state.previous).toBe(3);
    expect(nextWindow.state.current).toBe(1);
  });
});