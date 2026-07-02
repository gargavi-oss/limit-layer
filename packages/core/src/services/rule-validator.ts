import type { Rule } from "../types/rule.ts";
import { InvalidTimeWindowError } from "../errors/index.ts";
import { parseWindow } from "../utils/parse-window.ts";

const VALID_METHODS = new Set([
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
]);

export class RuleValidator {
  static validate(rule: Rule): void {
    if (!rule.path) {
      throw new Error("Rule path is required.");
    }

    if (rule.limit <= 0) {
      throw new Error("Rule limit must be greater than zero.");
    }

    parseWindow(rule.window);

    if (rule.method) {
      const methods = Array.isArray(rule.method)
        ? rule.method
        : [rule.method];

      for (const method of methods) {
        if (!VALID_METHODS.has(method.toUpperCase())) {
          throw new Error(`Invalid HTTP method "${method}"`);
        }
      }
    }
  }
}