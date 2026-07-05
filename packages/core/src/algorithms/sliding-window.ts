import type {
  Algorithm,
  AlgorithmContext,
  AlgorithmResult,
} from "../types/algorithm.js";

import type { SlidingWindowState } from "../types/state.js";
import { getWindowMs } from "../utils/algorithm.js";



export class SlidingWindowAlgorithm
  implements Algorithm<SlidingWindowState>
{
  async consume(
    context: AlgorithmContext<SlidingWindowState>
  ): Promise<AlgorithmResult<SlidingWindowState>> {
    const { rule, now } = context;

    
const windowMs = getWindowMs(rule);

    let state =
      context.state ??
      ({
        previous: 0,
        current: 0,
        resetAt: now + windowMs,
      } satisfies SlidingWindowState);

    // Advance the window if necessary
    if (now >= state.resetAt) {
      const windowsPassed =
        Math.floor((now - state.resetAt) / windowMs) + 1;

      if (windowsPassed === 1) {
        state = {
          previous: state.current,
          current: 0,
          resetAt: state.resetAt + windowMs,
        };
      } else {
        // More than one full window passed.
        // Older requests no longer contribute.
        state = {
          previous: 0,
          current: 0,
          resetAt:
            state.resetAt + windowsPassed * windowMs,
        };
      }
    }

    // Time elapsed within the current window
    const elapsed =
      windowMs - (state.resetAt - now);

    // Weight of previous window
    const weight = elapsed / windowMs;

    // Sliding Window Counter estimate
    const estimatedCount =
      state.previous * (1 - weight) +
      state.current;

    if (estimatedCount < rule.limit) {
      state.current++;

      return {
        allowed: true,
        limit: rule.limit,
        remaining: Math.max(
          0,
          Math.floor(
            rule.limit -
              (estimatedCount + 1)
          )
        ),
        resetAt: state.resetAt,
        retryAfter: 0,
        state,
        ttl: state.resetAt - now,
      };
    }

    return {
      allowed: false,
      limit: rule.limit,
      remaining: 0,
      resetAt: state.resetAt,
      retryAfter: state.resetAt - now,
      state,
      ttl: state.resetAt - now,
    };
  }
}