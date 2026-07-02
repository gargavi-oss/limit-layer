import { describe, expect, it } from "vitest";

import { FixedWindowAlgorithm } from "../src/algorithms/fixed-window.js";
import type { AlgorithmContext } from "../src/types/algorithm.js";
import type { FixedWindowState } from "../src/types/state.js";

describe("FixedWindowAlgorithm", () => {
  const algorithm = new FixedWindowAlgorithm();

  const createContext = (
    state: FixedWindowState | null,
    now = 0
  ): AlgorithmContext<FixedWindowState> => ({
    request: {
      method: "POST",
      path: "/login",
      ip: "127.0.0.1",
      headers: {},
      query: {},
    },

    rule: {
      path: "/login",
      algorithm: "fixed-window",
      limit: 5,
      window: "1m",
    },

    key: "127.0.0.1",

    now,

    state,
  });

  it("allows the first request", async () => {
    const result = await algorithm.consume(
      createContext(null)
    );

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
    expect(result.state.count).toBe(1);
  });

  it("allows requests until the limit", async () => {
    let state: FixedWindowState | null = null;

    for (let i = 1; i <= 5; i++) {
      const result = await algorithm.consume(
        createContext(state)
      );

      state = result.state;

      expect(result.allowed).toBe(true);
      expect(result.state.count).toBe(i);
    }
  });

  it("blocks requests after the limit", async () => {
    const state: FixedWindowState = {
      count: 5,
      resetAt: 60000,
    };

    const result = await algorithm.consume(
      createContext(state)
    );

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.retryAfter).toBe(60000);
  });

  it("resets the window after expiry", async () => {
    const expiredState: FixedWindowState = {
      count: 5,
      resetAt: 1000,
    };

    const result = await algorithm.consume(
      createContext(expiredState, 1000)
    );

    expect(result.allowed).toBe(true);
    expect(result.state.count).toBe(1);
    expect(result.remaining).toBe(4);
  });

  it("returns correct ttl", async () => {
    const result = await algorithm.consume(
      createContext(null)
    );

    expect(result.ttl).toBe(60000);
  });

  it("returns retryAfter when blocked", async () => {
    const state: FixedWindowState = {
      count: 5,
      resetAt: 60000,
    };

    const result = await algorithm.consume(
      createContext(state)
    );

    expect(result.allowed).toBe(false);
    expect(result.retryAfter).toBe(60000);
  });

  it("updates remaining correctly", async () => {
    const first = await algorithm.consume(
      createContext(null)
    );

    const second = await algorithm.consume(
      createContext(first.state)
    );

    expect(second.remaining).toBe(3);
  });
}); 