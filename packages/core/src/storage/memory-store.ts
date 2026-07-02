import type { StorageAdapter } from "../types/storage.js";

interface MemoryEntry<T> {
  value: T;
  expiresAt?: number;
}

class MemoryStore implements StorageAdapter {
  private readonly store = new Map<string, MemoryEntry<unknown>>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);

    if (!entry) {
      return null;
    }

    if (
      entry.expiresAt !== undefined &&
      Date.now() >= entry.expiresAt
    ) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set<T>(
    key: string,
    value: T,
    ttl?: number
  ): Promise<void> {
    this.store.set(key, {
      value,
      expiresAt: ttl ? Date.now() + ttl : undefined,
    });
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  async has(key: string): Promise<boolean> {
    return (await this.get(key)) !== null;
  }

  async clear(): Promise<void> {
    this.store.clear();
  }
}

export {MemoryStore}