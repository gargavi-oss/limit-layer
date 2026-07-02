import type { Rule } from "./rule.ts";
import type { LLRequest } from "./request.ts";
import type { DecisionResult } from "./result.ts";

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