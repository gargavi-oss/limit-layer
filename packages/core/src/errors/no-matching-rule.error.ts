import { LimitLayerError } from "./index.js";

export class NoMatchingRuleError extends LimitLayerError {
    constructor(path: string) {
      super(`No matching rule found for "${path}"`);
      this.name = "NoMatchingRuleError";
    }
  }