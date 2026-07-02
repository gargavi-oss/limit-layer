import type { Response } from "express";
import type { DecisionResult } from "@limitlayer/core";

export interface ExpressOptions {
  /**
   * HTTP status code when rate limit is exceeded.
   * @default 429
   */
  statusCode?: number;

  /**
   * Called when a request is blocked.
   */
  onLimitReached?(
    res: Response,
    result: DecisionResult
  ): void | Promise<void>;
}