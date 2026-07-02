import type { Algorithm } from "../types/algorithm.ts";
import type { AlgorithmType } from "../types/rule.ts";
import { AlgorithmError } from "../errors/index.ts";

const algorithms = new Map<AlgorithmType, Algorithm<any>>();

export function registerAlgorithm(
  name: AlgorithmType,
  algorithm: Algorithm<any>
): void {
  if (algorithms.has(name)) {
    throw new AlgorithmError(
      `Algorithm "${name}" is already registered.`
    );
  }

  algorithms.set(name, algorithm);
}

export function getAlgorithm(
  name: AlgorithmType
): Algorithm<any> {
  const algorithm = algorithms.get(name);

  if (!algorithm) {
    throw new AlgorithmError(
      `Algorithm "${name}" is not registered.`
    );
  }

  return algorithm;
}

export function clearAlgorithms(): void {
  algorithms.clear();
}