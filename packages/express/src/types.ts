import type { Response } from "express";
import type { DecisionResult, HeaderMode } from "@limitlayer/core";


// export type HeaderMode =
//   | "legacy"
//   | "standard"
//   | "both"
//   | false;



export interface ExpressOptions {
  /**
   * HTTP status code returned when the request is rejected.
   *
   * @default 429
   */
  statusCode?: number;

  /**
   * Expose the selected algorithm in the
   * X-RateLimit-Algorithm response header.
   *
   * @default false
   */
  exposeAlgorithm?: boolean;

  /**
   * Controls which rate limit headers are included.
   *
   * "legacy"   -> X-RateLimit-*
   * "standard" -> RateLimit-*
   * "both"     -> Both header formats
   * false      -> Disable rate limit headers
   *
   * @default "both"
   */
  headerMode?: HeaderMode;

  /**
   * Called whenever a request exceeds the configured rate limit.
   */
  onLimitReached?: (
    response: Response,
    result: DecisionResult
  ) => void | Promise<void>;
}