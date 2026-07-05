import type { Response } from "express";
import type { DecisionResult } from "@limitlayer/core";

export interface ExpressOptions {
  statusCode?: number;

  exposeAlgorithm?: boolean;

  onLimitReached?: (
    response: Response,
    result: DecisionResult
  ) => void | Promise<void>;
}