import type { LLRequest } from "./types/request.ts";
import type { DecisionResult } from "./types/result.ts";
import type { Rule } from "./types/rule.ts";
import type { LimitLayerConfig } from "./types/config.ts";
import type { Algorithm } from "./types/algorithm.ts";

import { RuleValidator } from "./services/rule-validator.ts";
import { RuleMatcher } from "./services/rule-matcher.ts";

import { DecisionEngine } from "./engine/decision-engine.ts";
import { AlgorithmRegistry } from "./engine/algorithm-registry.ts";

import { FixedWindowAlgorithm } from "./algorithms/fixed-window.ts";
import { NoMatchingRuleError } from "./errors/no-matching-rule.error.ts";

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
    config.rules.sort(
      (a, b) => (b.priority ?? 0) - (a.priority ?? 0)
    );

    this.engine = new DecisionEngine(
      config.storage,
      this.registry
    );
  }

  private registerBuiltinAlgorithms(): void {
    this.registry.register(
      "fixed-window",
      new FixedWindowAlgorithm()
    );
  }

  public registerAlgorithm(
    name: string,
    algorithm: Algorithm<any>
  ): this {
    this.registry.register(name, algorithm);
    return this;
  }

  async consume(
    request: LLRequest
  ): Promise<DecisionResult | null> {
    const rule = RuleMatcher.match(
      request,
      this.config.rules
    );

    if (!rule) {
      if (this.config.throwOnNoRule) {
        throw new NoMatchingRuleError(request.path);
      }

      return null;
    }

    return this.engine.consume(request, rule);
  }

  getRules(): Rule[] {
    return [...this.config.rules];
  }
}

export function createLimitLayer(
    config: LimitLayerConfig
  ) {
    return new LimitLayer(config);
  }