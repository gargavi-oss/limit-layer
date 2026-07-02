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
  
        const result = await limiter.consume(request);
  
        // No matching rule
        if (result === null) {
          return next();
        }
  
        // Apply rate-limit headers
        applyHeaders(res, result);
  
        // Request allowed
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
        return next(error);
      }
    };
  }