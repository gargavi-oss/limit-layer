import type { LLRequest } from "../types/request.ts";
import type { Rule } from "../types/rule.ts";

export async function generateKey(
  request: LLRequest,
  rule: Rule
): Promise<string> {
  if (rule.keyGenerator) {
    return await rule.keyGenerator(request);
  }

  return request.ip;
}