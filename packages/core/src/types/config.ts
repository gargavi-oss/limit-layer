import type { Rule } from "./rule.ts";
import type { StorageAdapter } from "./storage.ts";

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

  analytics?: AnalyticsConfig;

  logger?: LoggerConfig;
}