import {
  createClient,
  type RedisClientType,
} from "redis";

import type { StorageAdapter } from "../types/storage.js";


export interface RedisStoreOptions {
  client?: RedisClientType;
  url?: string;
}

export class RedisStore implements StorageAdapter {
  private readonly client: RedisClientType;

  private readonly ownsClient: boolean;

  private connectionPromise?: Promise<void>;

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
    }
  }

private async ensureConnected(): Promise<void> {
  if (this.client.isOpen) {
    return;
  }

  if (!this.connectionPromise) {
    this.connectionPromise = this.client
      .connect()
      .then(() => {})
      .finally(() => {
        this.connectionPromise = undefined;
      });
  }

  await this.connectionPromise;
}

  async get<T>(key: string): Promise<T |null> {
    await this.ensureConnected();

    const value = await this.client.get(key);

    return value ? (JSON.parse(value) as T) : null;
  }

  async set<T>(
    key: string,
    value: T,
    ttl?: number
  ): Promise<void> {
    await this.ensureConnected();

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
    await this.ensureConnected();

    await this.client.del(key);
  }

  

  async has(key: string): Promise<boolean> {
    await this.ensureConnected();

    return (await this.client.exists(key)) === 1;
  }

  async clear(): Promise<void> {
    await this.ensureConnected();

    await this.client.flushDb();
  }

async disconnect(): Promise<void> {
  if (this.ownsClient && this.client.isOpen) {
    await this.client.quit();
  }

  this.connectionPromise = undefined;
}
}