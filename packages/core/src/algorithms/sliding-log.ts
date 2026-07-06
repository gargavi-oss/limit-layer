import type {
  Algorithm,
  AlgorithmContext,
  AlgorithmResult,
} from "../types/algorithm.js";

import type { SlidingLogState } from "../types/state.js";

import { getWindowMs } from "../utils/algorithm.js";

export class SlidingLogAlgorithm
  implements Algorithm<SlidingLogState>
{
  async consume(
    context: AlgorithmContext<SlidingLogState>
  ): Promise<AlgorithmResult<SlidingLogState>> {
    const { rule, now } = context;

    const windowMs = getWindowMs(rule);

    let state =
      context.state ??
      ({
        timestamps: [],
      } satisfies SlidingLogState);

    // Remove expired timestamps
    state.timestamps = state.timestamps.filter(
      (timestamp) => now - timestamp < windowMs
    );

    // Allow request
    if (state.timestamps.length < rule.limit) {
      state.timestamps.push(now);

      const oldest = state.timestamps[0]!;

      const resetAt = oldest + windowMs;

      return {
        allowed: true,
        limit: rule.limit,
        remaining: rule.limit - state.timestamps.length,
        resetAt,
        retryAfter: 0,
        state,
        ttl: resetAt - now,
      };
    }

    // Reject request
    const oldest = state.timestamps[0]!;

    const retryAfter = oldest + windowMs - now;

    return {
      allowed: false,
      limit: rule.limit,
      remaining: 0,
      resetAt: oldest + windowMs,
      retryAfter,
      state,
      ttl: retryAfter,
    };
  }
}