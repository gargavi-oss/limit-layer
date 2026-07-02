import type { Algorithm } from "../types/algorithm.ts";

export class AlgorithmRegistry {
  private readonly algorithms = new Map<
    string,
    Algorithm<any>
  >();

  register(
    name: string,
    algorithm: Algorithm<any>
  ): void {
    if (this.algorithms.has(name)) {
      throw new Error(
        `Algorithm "${name}" already exists.`
      );
    }

    this.algorithms.set(name, algorithm);
  }

  get(name: string): Algorithm<any> {
    const algorithm = this.algorithms.get(name);

    if (!algorithm) {
      throw new Error(
        `Algorithm "${name}" not found.`
      );
    }

    return algorithm;
  }

  has(name: string): boolean {
    return this.algorithms.has(name);
  }

  clear(): void {
    this.algorithms.clear();
  }
}