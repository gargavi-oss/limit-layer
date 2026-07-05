import type { Rule } from "../types/rule.js";
import { parseWindow } from "./parse-window.js";

export function getWindowMs(rule: Rule): number {
  return parseWindow(rule.window);
}

export function getCapacity(rule: Rule): number {
  return rule.burst ?? rule.limit;
}

export function clamp(
  value: number,
  min: number,
  max: number
): number {
  return Math.min(max, Math.max(min, value));
}