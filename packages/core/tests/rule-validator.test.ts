import { describe, expect, it } from "vitest";

import { RuleValidator } from "../src/services/rule-validator.js";
import { Rule } from "../src/index.js";

describe("RuleValidator", () => {
  it("accepts a valid rule", () => {
    const rule:Rule = {
      path: "/login",
      algorithm: "fixed-window",
      limit: 5,
      window: "1m",
    };

    expect(() =>
      RuleValidator.validate(rule)
    ).not.toThrow();
  });

  it("throws if path is missing", () => {
    expect(() =>
      RuleValidator.validate({
        algorithm: "fixed-window",
        limit: 5,
        window: "1m",
      } as any)
    ).toThrow();
  });

  it("throws if limit is zero", () => {
    expect(() =>
      RuleValidator.validate({
        path: "/login",
        algorithm: "fixed-window",
        limit: 0,
        window: "1m",
      })
    ).toThrow();
  });

  it("throws if limit is negative", () => {
    expect(() =>
      RuleValidator.validate({
        path: "/login",
        algorithm: "fixed-window",
        limit: -5,
        window: "1m",
      })
    ).toThrow();
  });

  it("throws if window is invalid", () => {
    expect(() =>
      RuleValidator.validate({
        path: "/login",
        algorithm: "fixed-window",
        limit: 5,
        window: "abc",
      } as any)
    ).toThrow();
  });

  it("accepts numeric window", () => {
    expect(() =>
      RuleValidator.validate({
        path: "/login",
        algorithm: "fixed-window",
        limit: 5,
        window: 60000,
      })
    ).not.toThrow();
  });

  it("accepts regex path", () => {
    expect(() =>
      RuleValidator.validate({
        path: /^\/api/,
        algorithm: "fixed-window",
        limit: 5,
        window: "1m",
      })
    ).not.toThrow();
  });
});