import type { StorageAdapter } from "../types/storage.ts";
import type { LLRequest } from "../types/request.ts";
import type { Rule } from "../types/rule.ts";
import type { DecisionResult } from "../types/result.ts";
import { getAlgorithm } from "./algorithm-registry.ts";
import { generateKey } from "../utils/generate-key.ts";

export class DecisionEngine {
  constructor(
    private readonly storage: StorageAdapter
  ) {}

  async consume(
    request: LLRequest,
    rule: Rule
  ): Promise<DecisionResult> {
    const identifier =
await generateKey(request, rule);

    const storageKey = `${rule.id ?? rule.path}:${identifier}`;

    const now = Date.now();

    const algorithm = getAlgorithm(rule.algorithm);

    const state = await this.storage.get(storageKey);

    const result = await algorithm.consume({
      request,
      rule,
      key: identifier,
      now,
      state,
    });

    await this.storage.set(
      storageKey,
      result.state,
      result.ttl
    );

    return result;
  }
}