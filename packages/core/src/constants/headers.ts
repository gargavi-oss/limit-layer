export const RATE_LIMIT_HEADERS = {
    LIMIT: "RateLimit-Limit",
    REMAINING: "RateLimit-Remaining",
    RESET: "RateLimit-Reset",
    RETRY_AFTER: "Retry-After",
  } as const;