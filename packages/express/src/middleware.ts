import type {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";

import {
  createLimitLayer,
  isLimitLayer,
  type LimitLayer,
  type LimitLayerConfig,
} from "@limitlayer/core";

import { adaptRequest } from "./adapter.js";
import { applyHeaders } from "./headers.js";
import type { ExpressOptions } from "./types.js";

export function limitLayer(
  limiter: LimitLayer,
  options?: ExpressOptions
): RequestHandler;

export function limitLayer(
  config: LimitLayerConfig,
  options?: ExpressOptions
): RequestHandler;

export function limitLayer(
  input: LimitLayer | LimitLayerConfig,
  options: ExpressOptions = {}
): RequestHandler {
  const limiter = isLimitLayer(input)
    ? input
    : createLimitLayer(input);

  const statusCode = options.statusCode ?? 429;

  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const request = adaptRequest(req);

      // Match rule (used only for optional diagnostic headers)
      const rule = limiter.findMatchingRule(request);

      const result = await limiter.consume(request);

      // No matching rule
      if (result === null) {
        return next();
      }

      // Optional diagnostic header
      if (
        options.exposeAlgorithm &&
        rule
      ) {
        res.setHeader(
          "X-RateLimit-Algorithm",
          rule.algorithm
        );
      }

      // Apply rate-limit headers
      applyHeaders(res, result);

      // Allowed
      if (result.allowed) {
        return next();
      }

      // Optional callback
      if (options.onLimitReached) {
        await options.onLimitReached(res, result);
      }

      // Default response
      return res.status(statusCode).json({
        error: "Too Many Requests",
        message: "Rate limit exceeded.",
        retryAfter: result.retryAfter,
      });
    } catch (error) {
      next(error);
    }
  };
}