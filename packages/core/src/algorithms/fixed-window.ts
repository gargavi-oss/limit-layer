import type {
    Algorithm,
    AlgorithmContext,
    AlgorithmResult,
  } from "../types/algorithm.ts";
  import type { FixedWindowState } from "../types/state.ts";
  import { parseWindow } from "../utils/parse-window.ts";
  
  export class FixedWindowAlgorithm
    implements Algorithm<FixedWindowState>
  {
    async consume(
      context: AlgorithmContext<FixedWindowState>
    ): Promise<AlgorithmResult<FixedWindowState>> {
      const { rule, now } = context;
  
      const windowMs = parseWindow(rule.window);
  
      let state =
        context.state ??
        ({
          count: 0,
          resetAt: now + windowMs,
        } satisfies FixedWindowState);
  
      // Reset the window if it has expired
      if (now >= state.resetAt) {
        state = {
          count: 0,
          resetAt: now + windowMs,
        };
      }
  
      // Allow request
      if (state.count < rule.limit) {
        state.count++;
  
        return {
          allowed: true,
          limit: rule.limit,
          remaining: rule.limit - state.count,
          resetAt: state.resetAt,
          retryAfter: 0,
          state,
          ttl: state.resetAt - now,
        };
      }
  
      // Reject request
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