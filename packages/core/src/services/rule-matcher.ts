import type { LLRequest } from "../types/request.js";
import type { Rule } from "../types/rule.js";

export class RuleMatcher {
  static match(
    request: LLRequest,
    rules: Rule[]
  ): Rule | null {

    for (const rule of rules) {

      if (
        rule.method &&
        !this.matchesMethod(request.method, rule.method)
      ) {
        continue;
      }

      if (this.matchesPath(request.path, rule.path)) {
        return rule;
      }
    }

    return null;
  }

  private static matchesMethod(
    requestMethod: string,
    ruleMethod: string | string[]
  ) {
    if (Array.isArray(ruleMethod)) {
      return ruleMethod.includes(requestMethod);
    }

    return ruleMethod === requestMethod;
  }

  private static matchesPath(
    requestPath: string,
    rulePath: string | RegExp
): boolean {

    if (rulePath instanceof RegExp) {
        return rulePath.test(requestPath);
    }

    if (rulePath.includes("*")) {

        const regex =
            new RegExp(
                "^" +
                rulePath
                    .replace(/\*\*/g, ".*")
                    .replace(/\*/g, "[^/]+") +
                "$"
            );

        return regex.test(requestPath);

    }

    if (rulePath.includes(":")) {

        const regex =
            new RegExp(
                "^" +
                rulePath.replace(/:[^/]+/g, "[^/]+") +
                "$"
            );

        return regex.test(requestPath);

    }

    return requestPath === rulePath;
}
}