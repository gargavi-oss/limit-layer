import type { AlgorithmType } from "../types/rule.ts";
import type { Algorithm } from "../types/algorithm.ts";

export class AlgorithmRegistry {
  private readonly algorithms = new Map<
    AlgorithmType,
    Algorithm<any>
  >();

  register(
    name: AlgorithmType,
    algorithm: Algorithm<any>
  ) {
    this.algorithms.set(name, algorithm);
  }

  get(name: AlgorithmType) {
    const algorithm = this.algorithms.get(name);

    if (!algorithm) {
      throw new Error(`Algorithm "${name}" is not registered.`);
    }

    return algorithm;
  }
}