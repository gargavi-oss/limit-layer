import { describe, expect, it } from "vitest";

import { DecisionEngine } from "../src/engine/decision-engine.js";
import { AlgorithmRegistry } from "../src/engine/algorithm-registry.js";
import { FixedWindowAlgorithm } from "../src/algorithms/fixed-window.js";
import { MemoryStore } from "../src/storage/memory-store.js";
import { Rule } from "../src/index.js";

describe("DecisionEngine", () => {
  const createEngine = () => {
    const registry = new AlgorithmRegistry();

    registry.register(
      "fixed-window",
      new FixedWindowAlgorithm()
    );

    return new DecisionEngine(
      new MemoryStore(),
      registry
    );
  };

  const rule:Rule = {
    path: "/login",
    algorithm: "fixed-window" as const,
    limit: 5,
    window: "1m",
  };

  const request = {
    method: "POST",
    path: "/login",
    ip: "127.0.0.1",
    headers: {},
    query: {},
  };

  it("allows the first request", async () => {
    const engine = createEngine();

    const result = await engine.consume(
      request,
      rule
    );

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("blocks after the limit is exceeded", async () => {
    const engine = createEngine();

    let result;

    for (let i = 0; i < 6; i++) {
      result = await engine.consume(
        request,
        rule
      );
    }

    expect(result!.allowed).toBe(false);
    expect(result!.remaining).toBe(0);
  });

  it("tracks different IPs independently", async () => {
    const engine = createEngine();

    const first = await engine.consume(
      {
        ...request,
        ip: "1.1.1.1",
      },
      rule
    );

    const second = await engine.consume(
      {
        ...request,
        ip: "2.2.2.2",
      },
      rule
    );

    expect(first.remaining).toBe(4);
    expect(second.remaining).toBe(4);
  });

  it("uses a custom key generator", async () => {
    const engine = createEngine();

    const customRule = {
      ...rule,

      keyGenerator: () => "user-123",
    };

    const first = await engine.consume(
      request,
      customRule
    );

    const second = await engine.consume(
      request,
      customRule
    );

    expect(first.remaining).toBe(4);
    expect(second.remaining).toBe(3);
  });

  it("returns retryAfter when blocked", async () => {
    const engine = createEngine();

    let result;

    for (let i = 0; i < 6; i++) {
      result = await engine.consume(
        request,
        rule
      );
    }

    expect(result!.retryAfter).toBeGreaterThan(0);
  });
});