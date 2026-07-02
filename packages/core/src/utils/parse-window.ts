import { InvalidTimeWindowError } from "../errors/invalid-window.error.ts";
import type { TimeWindow } from "../types/rule.ts";

export function parseWindow(window: TimeWindow): number {
  if (typeof window === "number") {
    return window;
  }

  const match = /^(\d+)(ms|s|m|h|d)$/.exec(window);

  if (!match) {
    throw new Error(`Invalid window: ${window}`);
  }

  const value = Number(match[1]);

  switch (match[2]) {
    case "ms":
      return value;

    case "s":
      return value * 1000;

    case "m":
      return value * 60_000;

    case "h":
      return value * 3_600_000;

    case "d":
      return value * 86_400_000;
    default:
       throw new InvalidTimeWindowError(window);
    }
}
