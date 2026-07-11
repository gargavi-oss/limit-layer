import type { Response } from "express";

import {
    HeaderMode,
  RATE_LIMIT_HEADERS,
  type DecisionResult,
} from "@limitlayer/core";



export function applyHeaders(
  res: Response,
  result: DecisionResult,
  mode: HeaderMode = "both"
): void {
 if (mode === false) {
    return;
  }


  const limit = String(result.limit);
  const remaining = String(result.remaining);
  const reset = String(
    Math.ceil(result.resetAt / 1000)
  );

  const retryAfter = String(
    Math.ceil(result.retryAfter / 1000)
  );

  console.log(mode);

if (mode === "legacy" || mode === "both") {
  res.setHeader(RATE_LIMIT_HEADERS.LIMIT, limit);
  res.setHeader(RATE_LIMIT_HEADERS.REMAINING, remaining);
  res.setHeader(RATE_LIMIT_HEADERS.RESET, reset);

  if (!result.allowed) {
    res.setHeader(RATE_LIMIT_HEADERS.RETRY_AFTER, retryAfter);
  }
}

if (mode === "standard" || mode === "both") {
  res.setHeader(RATE_LIMIT_HEADERS.STANDARD_LIMIT, limit);
  res.setHeader(RATE_LIMIT_HEADERS.STANDARD_REMAINING, remaining);
  res.setHeader(RATE_LIMIT_HEADERS.STANDARD_RESET, reset);

  if (!result.allowed) {
    res.setHeader(RATE_LIMIT_HEADERS.RETRY_AFTER, retryAfter);
  }
}

}