import type { Request } from "express";
import type { LLRequest } from "@limitlayer/core";

export function adaptRequest(req: Request): LLRequest {
  return {
    method: req.method,
    path: req.path,
    ip: req.ip || req.socket.remoteAddress || "unknown",

    headers: Object.fromEntries(
      Object.entries(req.headers).map(([key, value]) => [
        key,
        Array.isArray(value)
          ? value.join(", ")
          : String(value ?? ""),
      ])
    ),

    query: req.query,

    body: req.body,
  };
}