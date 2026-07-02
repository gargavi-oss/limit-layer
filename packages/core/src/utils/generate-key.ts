import type { LLRequest } from "../types/request.js";
import type { Rule } from "../types/rule.js";

export async function generateKey(
  request: LLRequest,
  rule: Rule
): Promise<string> {
  if (rule.keyGenerator) {
    return await rule.keyGenerator(request);
  }

  return request.ip;
}