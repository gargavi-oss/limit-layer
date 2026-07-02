import type { LLRequest } from "./request.ts";

export type AlgorithmType =
  | "fixed-window"
  | "sliding-window"
  | "sliding-log"
  | "token-bucket"
  | "leaky-bucket";

export type TimeWindow = number | `${number}${"ms" | "s" | "m" | "h" | "d"}`;

export interface Rule {
  id?: string;

  name?: string;

  enabled?: boolean;

  path: string | RegExp;

  method?: string | string[];

  algorithm: AlgorithmType;

  limit: number;

  window: TimeWindow;

  burst?: number;

  priority?: number;

  keyGenerator?: (request: LLRequest) => string | Promise<string>;

  skip?: (request: LLRequest) => boolean | Promise<boolean>;

  metadata?: Record<string, unknown>;
}
