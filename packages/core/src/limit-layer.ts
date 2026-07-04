import type { LLRequest } from "./types/request.js";
import type { DecisionResult } from "./types/result.js";
import type { Rule } from "./types/rule.js";
import type { LimitLayerConfig } from "./types/config.js";
import type { Algorithm } from "./types/algorithm.js";

import { RuleValidator } from "./services/rule-validator.js";
import { RuleMatcher } from "./services/rule-matcher.js";

import { DecisionEngine } from "./engine/decision-engine.js";
import { AlgorithmRegistry } from "./engine/algorithm-registry.js";

import { FixedWindowAlgorithm } from "./algorithms/fixed-window.js";
import { NoMatchingRuleError } from "./errors/no-matching-rule.error.js";
import { SlidingWindowAlgorithm } from "./algorithms/sliding-window.js";

export class LimitLayer {
  private readonly engine: DecisionEngine;

  private readonly registry = new AlgorithmRegistry();

  constructor(
    private readonly config: LimitLayerConfig
  ) {
    // Register built-in algorithms
    this.registerBuiltinAlgorithms();

    // Validate rules
    for (const rule of config.rules) {
      RuleValidator.validate(rule);
    }

    // Sort by priority (highest first)
    this.config = {
        ...config,
        rules: [...config.rules].sort(
          (a, b) => (b.priority ?? 0) - (a.priority ?? 0)
        ),
      };

    this.engine = new DecisionEngine(
      config.storage,
      this.registry
    );
  }

  private registerBuiltinAlgorithms(): void {
    if (!this.registry.has("fixed-window")) {
      this.registry.register(
        "fixed-window",
        new FixedWindowAlgorithm()
      );
    }
    if (!this.registry.has("sliding-window")) {
      this.registry.register(
        "sliding-window",
        new SlidingWindowAlgorithm()
      );  
  }
    
  }

  public registerAlgorithm(
    name: string,
    algorithm: Algorithm<unknown>
  ): this {
    this.registry.register(name, algorithm);
    return this;
  }

  public findMatchingRule(
  request: LLRequest
): Rule | null {
  return RuleMatcher.match(
    request,
    this.config.rules
  );
}

async consume(
  request: LLRequest
): Promise<DecisionResult | null> {

  const rule = this.findMatchingRule(request);

  if (!rule) {
    if (this.config.throwOnNoRule) {
      throw new NoMatchingRuleError(request.path);
    }

    return null;
  }

  return this.engine.consume(
    request,
    rule
  );
}


  getRules(): Rule[] {
    return [...this.config.rules];
  }
}

export function createLimitLayer(
    config: LimitLayerConfig
  ): LimitLayer {
    return new LimitLayer(config);
  }
  export function isLimitLayer(
    value: unknown
  ): value is LimitLayer {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof (value as { consume?: unknown }).consume === "function"
    );
  }