import { describe, expect, it } from "vitest";

import { RuleMatcher } from "../src/services/rule-matcher.js";
import type { LLRequest } from "../src/types/request.js";
import type { Rule } from "../src/types/rule.js";

describe("RuleMatcher", () => {
  const request = (
    path: string,
    method = "GET"
  ): LLRequest => ({
    method,
    path,
    ip: "127.0.0.1",
    headers: {},
    query: {},
  });

  it("matches an exact path", () => {
    const rules: Rule[] = [
      {
        path: "/login",
        algorithm: "fixed-window",
        limit: 5,
        window: "1m",
      },
    ];

    expect(
      RuleMatcher.match(request("/login"), rules)
    ).toBe(rules[0]);
  });

  it("returns null when no path matches", () => {
    const rules: Rule[] = [
      {
        path: "/login",
        algorithm: "fixed-window",
        limit: 5,
        window: "1m",
      },
    ];

    expect(
      RuleMatcher.match(request("/register"), rules)
    ).toBeNull();
  });

  it("matches regex paths", () => {
    const rules: Rule[] = [
      {
        path: /^\/api\/v1/,
        algorithm: "fixed-window",
        limit: 10,
        window: "1m",
      },
    ];

    expect(
      RuleMatcher.match(request("/api/v1/users"), rules)
    ).toBe(rules[0]);
  });

  it("matches wildcard paths", () => {
    const rules: Rule[] = [
      {
        path: "/users/*",
        algorithm: "fixed-window",
        limit: 10,
        window: "1m",
      },
    ];

    expect(
      RuleMatcher.match(request("/users/123"), rules)
    ).toBe(rules[0]);
  });

  it("matches deep wildcard paths", () => {
    const rules: Rule[] = [
      {
        path: "/api/**",
        algorithm: "fixed-window",
        limit: 10,
        window: "1m",
      },
    ];

    expect(
      RuleMatcher.match(
        request("/api/v1/users/profile"),
        rules
      )
    ).toBe(rules[0]);
  });

  it("matches route parameters", () => {
    const rules: Rule[] = [
      {
        path: "/users/:id",
        algorithm: "fixed-window",
        limit: 10,
        window: "1m",
      },
    ];

    expect(
      RuleMatcher.match(
        request("/users/42"),
        rules
      )
    ).toBe(rules[0]);
  });

  it("matches request method", () => {
    const rules: Rule[] = [
      {
        path: "/login",
        method: "POST",
        algorithm: "fixed-window",
        limit: 5,
        window: "1m",
      },
    ];

    expect(
      RuleMatcher.match(
        request("/login", "POST"),
        rules
      )
    ).toBe(rules[0]);
  });

  it("matches one of multiple request methods", () => {
    const rules: Rule[] = [
      {
        path: "/users",
        method: ["GET", "POST"],
        algorithm: "fixed-window",
        limit: 10,
        window: "1m",
      },
    ];

    expect(
      RuleMatcher.match(
        request("/users", "POST"),
        rules
      )
    ).toBe(rules[0]);
  });

  it("does not match when method differs", () => {
    const rules: Rule[] = [
      {
        path: "/login",
        method: "POST",
        algorithm: "fixed-window",
        limit: 5,
        window: "1m",
      },
    ];

    expect(
      RuleMatcher.match(
        request("/login", "GET"),
        rules
      )
    ).toBeNull();
  });
});