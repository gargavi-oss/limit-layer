import { describe, expect, it } from "vitest";

import { SlidingLogAlgorithm } from "../src/algorithms/sliding-log.js";

import type { SlidingLogState } from "../src/types/state.js";
import type { Rule } from "../src/types/rule.js";
import type { LLRequest } from "../src/types/request.js";

describe("SlidingLogAlgorithm", () => {
  const algorithm = new SlidingLogAlgorithm();

  const request: LLRequest = {
    method: "GET",
    path: "/login",
    ip: "127.0.0.1",
    headers: {},
    query: {},
  };

  const rule: Rule = {
    path: "/login",
    algorithm: "sliding-log",
    limit: 5,
    window: "1m",
  };

  it("should initialize an empty log", async () => {
    const result = await algorithm.consume({
      request,
      rule,
      key: "user-1",
      now: 0,
      state: null,
    });

    expect(result.allowed).toBe(true);
    expect(result.state.timestamps.length).toBe(1);
    expect(result.remaining).toBe(4);
  });

  it("should allow requests below the limit", async () => {
    let state: SlidingLogState | null = null;

    for (let i = 0; i < 5; i++) {
      const result = await algorithm.consume({
        request,
        rule,
        key: "user-1",
        now: i * 1000,
        state,
      });

      expect(result.allowed).toBe(true);

      state = result.state;
    }
  });

  it("should reject requests above the limit", async () => {
    let state: SlidingLogState | null = null;

    for (let i = 0; i < 5; i++) {
      const result = await algorithm.consume({
        request,
        rule,
        key: "user-1",
        now: i * 1000,
        state,
      });

      state = result.state;
    }

    const blocked = await algorithm.consume({
      request,
      rule,
      key: "user-1",
      now: 5000,
      state,
    });

    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it("should remove expired timestamps", async () => {
    let state: SlidingLogState | null = null;

    for (let i = 0; i < 5; i++) {
      const result = await algorithm.consume({
        request,
        rule,
        key: "user-1",
        now: i * 1000,
        state,
      });

      state = result.state;
    }

    const result = await algorithm.consume({
      request,
      rule,
      key: "user-1",
      now: 61000,
      state,
    });

    expect(result.allowed).toBe(true);
    expect(result.state.timestamps.length).toBeLessThanOrEqual(5);
  });

  it("should keep timestamps sorted", async () => {
    let state: SlidingLogState | null = null;

    const times = [1000, 2000, 3000, 4000];

    for (const now of times) {
      const result = await algorithm.consume({
        request,
        rule,
        key: "user-1",
        now,
        state,
      });

      state = result.state;
    }

    expect(state!.timestamps).toEqual(times);
  });

  it("should compute remaining requests correctly", async () => {
    let state: SlidingLogState | null = null;

    const first = await algorithm.consume({
      request,
      rule,
      key: "user-1",
      now: 0,
      state,
    });

    expect(first.remaining).toBe(4);

    const second = await algorithm.consume({
      request,
      rule,
      key: "user-1",
      now: 1000,
      state: first.state,
    });

    expect(second.remaining).toBe(3);
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
    let state: SlidingLogState | null = null;

    for (let i = 0; i < 5; i++) {
      const result = await algorithm.consume({
        request,
        rule,
        key: "user-1",
        now: i * 1000,
        state,
      });

      state = result.state;
    }

    const blocked = await algorithm.consume({
      request,
      rule,
      key: "user-1",
      now: 5000,
      state,
    });

    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it("should completely clear expired logs after multiple windows", async () => {
    let state: SlidingLogState | null = null;

    for (let i = 0; i < 5; i++) {
      const result = await algorithm.consume({
        request,
        rule,
        key: "user-1",
        now: i * 1000,
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
    expect(result.state.timestamps.length).toBe(1);
  });

  it("should maintain the log size equal to the number of valid requests", async () => {
    let state: SlidingLogState | null = null;

    for (let i = 0; i < 3; i++) {
      const result = await algorithm.consume({
        request,
        rule,
        key: "user-1",
        now: i * 1000,
        state,
      });

      state = result.state;
    }

    expect(state!.timestamps.length).toBe(3);
  });
});