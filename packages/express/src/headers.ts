import type { Response } from "express";

import {
  RATE_LIMIT_HEADERS,
  type DecisionResult,
} from "@limitlayer/core";

export function applyHeaders(
  res: Response,
  result: DecisionResult
): void {
  res.setHeader(
    RATE_LIMIT_HEADERS.LIMIT,
    result.limit
  );

  res.setHeader(
    RATE_LIMIT_HEADERS.REMAINING,
    result.remaining
  );

  res.setHeader(
    RATE_LIMIT_HEADERS.RESET,
    Math.ceil(result.resetAt / 1000)
  );

  if (!result.allowed) {
    res.setHeader(
      RATE_LIMIT_HEADERS.RETRY_AFTER,
      Math.ceil(result.retryAfter / 1000)
    );
  }
}