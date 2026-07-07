import type {
  Algorithm,
  AlgorithmContext,
  AlgorithmResult,
} from "../types/algorithm.js";

import type { LeakyBucketState } from "../types/state.js";

import {
  getCapacity,
  getWindowMs,
} from "../utils/algorithm.js";

export class LeakyBucketAlgorithm
  implements Algorithm<LeakyBucketState>
{
  async consume(
    context: AlgorithmContext<LeakyBucketState>
  ): Promise<AlgorithmResult<LeakyBucketState>> {
    const { rule, now } = context;
    const windowMs = getWindowMs(rule);
    const capacity = getCapacity(rule);
    const leakRate = rule.limit / windowMs;
    let state =
      context.state ??
      ({
        water: 0,
        lastLeak: now,
      } satisfies LeakyBucketState);
    const elapsed = now - state.lastLeak;
    const leaked = elapsed * leakRate;
    state.water = Math.max(
      0,
      state.water - leaked
    );
    state.lastLeak = now;
    if (state.water >= capacity) {
      const retryAfter =
        (state.water - capacity + 1) / leakRate;
      return {
        allowed: false,
        limit: capacity,
        remaining: 0,
        resetAt: now + retryAfter,
        retryAfter,
        state,
        ttl: retryAfter,
      };
    }
    state.water++;
    const remaining = Math.max(
      0,
      Math.floor(capacity - state.water)
    );
    const emptyAfter =
      state.water / leakRate;
    return {
      allowed: true,
      limit: capacity,
      remaining,
      resetAt: now + emptyAfter,
      retryAfter: 0,
      state,
      ttl: emptyAfter,
    };
  }
}