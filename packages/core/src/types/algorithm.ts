import type { Rule } from "./rule.js";
import type { LLRequest } from "./request.js";
import type { DecisionResult } from "./result.js";

export interface AlgorithmContext<TState = unknown> {
  request: LLRequest;
  rule: Rule;
  key: string;
  now: number;
  state: TState | null;
}

export interface AlgorithmResult<TState = unknown>
  extends DecisionResult {
  state: TState;
  ttl?: number;
}

export interface Algorithm<TState = unknown> {
  consume(
    context: AlgorithmContext<TState>
  ): Promise<AlgorithmResult<TState>>;
}