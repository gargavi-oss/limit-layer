import type {
  Algorithm,
  AlgorithmContext,
  AlgorithmResult,
} from "../types/algorithm.js";

import type { TokenBucketState } from "../types/state.js";
import { getCapacity, getWindowMs } from "../utils/algorithm.js";

import { parseWindow } from "../utils/parse-window.js";

export class TokenBucketAlgorithm
  implements Algorithm<TokenBucketState>
{
  async consume(
    context: AlgorithmContext<TokenBucketState>
  ): Promise<AlgorithmResult<TokenBucketState>> {

    const { rule, now } = context;

    
const windowMs = getWindowMs(rule);

    const capacity = getCapacity(rule);

    const refillRate =
      rule.limit / windowMs;

    let state =
      context.state ??
      ({
        tokens: capacity,
        lastRefill: now,
      } satisfies TokenBucketState);

    // Refill tokens
    const elapsed =
      now - state.lastRefill;

    const refill =
      elapsed * refillRate;

    state.tokens = Math.min(
      capacity,
      state.tokens + refill
    );

    state.lastRefill = now;

    if (state.tokens >= 1) {

      state.tokens--;

      const resetAt =
    now + ((capacity - state.tokens) / refillRate);

return {
    allowed: true,
    limit: capacity,
    remaining: Math.floor(state.tokens),
    resetAt,
    retryAfter: 0,
    state,
    ttl: resetAt - now,
};
    }

    const retryAfter =
    (1 - state.tokens) / refillRate;

const resetAt =
    now + retryAfter;

return {
    allowed:false,
    limit:capacity,
    remaining:0,
    resetAt,
    retryAfter,
    state,
    ttl: retryAfter,
};
  }
}