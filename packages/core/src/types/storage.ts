export interface StorageAdapter {
    get<T = unknown>(key: string): Promise<T | null>;
    set<T = unknown>(
      key: string,
      value: T,
      ttl?: number
    ): Promise<void>;
    delete(key: string): Promise<void>;
    has?(key: string): Promise<boolean>;
    clear?(): Promise<void>;
  }