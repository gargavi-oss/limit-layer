import {
  createClient,
  type RedisClientType,
} from "redis";

import type { StorageAdapter } from "../types/storage.js";

export interface RedisStoreOptions {
  /**
   * Existing Redis client.
   * If omitted, a client will be created using `url`.
   */
  client?: RedisClientType;

  /**
   * Redis connection URL.
   * Example: redis://localhost:6379
   */
  url?: string;
}

export class RedisStore implements StorageAdapter {
  private readonly client: RedisClientType;

  private readonly ownsClient: boolean;

  constructor(options: RedisStoreOptions = {}) {
    if (options.client) {
      this.client = options.client;
      this.ownsClient = false;
    } else {
      this.client = createClient({
        url: options.url,
      });

      this.ownsClient = true;

      this.client.on("error", (error) => {
        console.error("[LimitLayer Redis]", error);
      });

      // Fire-and-forget connection
      void this.client.connect();
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);

    if (value === null) {
      return null;
    }

    return JSON.parse(value) as T;
  }

  async set<T>(
    key: string,
    value: T,
    ttl?: number
  ): Promise<void> {
    const serialized = JSON.stringify(value);

    if (ttl !== undefined) {
      await this.client.set(key, serialized, {
        PX: Math.max(1, Math.ceil(ttl)),
      });

      return;
    }

    await this.client.set(key, serialized);
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async has(key: string): Promise<boolean> {
    return (await this.client.exists(key)) === 1;
  }

  async clear(): Promise<void> {
    await this.client.flushDb();
  }

  /**
   * Disconnect the Redis client if this store created it.
   */
  async disconnect(): Promise<void> {
    if (this.ownsClient && this.client.isOpen) {
      await this.client.quit();
    }
  }
}