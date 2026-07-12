import { LLRequest } from "./request.js";
import type { Rule, SkipFunction } from "./rule.js";
import type { StorageAdapter } from "./storage.js";

export interface AnalyticsConfig {
  enabled?: boolean;
}

export interface LoggerConfig {
  enabled?: boolean;

  level?: "debug" | "info" | "warn" | "error";
}

export interface LimitLayerConfig {
  storage: StorageAdapter;

  rules: Rule[];

  defaultKeyGenerator?: (request: any) => string | Promise<string>;

  throwOnNoRule?: boolean;

  headers?: boolean;

  logger?: {
    enabled: boolean;
  };

  analytics?: {
    enabled: boolean;
  };

  skip? : SkipFunction
}
