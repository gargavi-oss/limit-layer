# Storage Adapters

LimitLayer separates **rate-limiting algorithms** from **state storage** through a pluggable storage adapter interface. This allows the same limiter configuration to work with different storage backends depending on your deployment architecture.

For development and single-instance applications, `MemoryStore` provides a simple in-memory implementation. For distributed deployments, `RedisStore` enables rate limiting across multiple application instances.

---

# Built-in Storage Adapters

| Adapter | Status | Best For |
|---------|--------|----------|
| ✅ MemoryStore | Available | Local development, single-instance deployments |
| ✅ RedisStore | Available | Distributed systems, load-balanced applications |
| 🚧 Upstash Redis | Planned | Serverless deployments |
| 🚧 PostgreSQL | Planned | Persistent storage |
| 🚧 MongoDB | Planned | Document databases |

---

# MemoryStore

`MemoryStore` keeps all limiter state inside the application's memory.

## Advantages

- Extremely fast
- Zero configuration
- No external dependencies
- Great for local development
- Ideal for small applications

## Limitations

- State is lost when the process restarts
- Cannot share rate limits across multiple servers
- Not suitable for horizontally scaled deployments

### Example

```ts
import {
  MemoryStore,
  createLimitLayer,
} from "@limitlayer/core";

const limiter = createLimitLayer({
  storage: new MemoryStore(),
  rules: [
    {
      path: "/api/*",
      algorithm: "fixed-window",
      limit: 100,
      window: "1m",
    },
  ],
});
```

---

# RedisStore

`RedisStore` stores limiter state inside Redis, allowing multiple application instances to share rate-limit information.

This is the recommended storage adapter for production deployments.

## Advantages

- Shared state across multiple servers
- Horizontally scalable
- Fast in-memory performance
- Automatic key expiration
- Suitable for Kubernetes and load-balanced deployments

## Installation

```bash
npm install redis
```

## Example

```ts
import {
  RedisStore,
  createLimitLayer,
} from "@limitlayer/core";

const limiter = createLimitLayer({
  storage: new RedisStore({
    url: "redis://localhost:6379",
  }),
  rules: [
    {
      path: "/api/*",
      algorithm: "sliding-window",
      limit: 100,
      window: "1m",
    },
  ],
});
```

---

# Using an Existing Redis Client

If your application already manages a Redis connection, you can reuse it.

```ts
import { createClient } from "redis";

import {
  RedisStore,
  createLimitLayer,
} from "@limitlayer/core";

const client = createClient({
  url: process.env.REDIS_URL,
});

await client.connect();

const limiter = createLimitLayer({
  storage: new RedisStore({
    client,
  }),
  rules: [
    {
      path: "/api/*",
      algorithm: "fixed-window",
      limit: 100,
      window: "1m",
    },
  ],
});
```

---

# Storage Interface

Every storage adapter implements the same interface.

```ts
interface StorageAdapter {
  get<T>(key: string): Promise<T | null>;

  set<T>(
    key: string,
    value: T,
    ttl?: number
  ): Promise<void>;

  delete(key: string): Promise<void>;

  has(key: string): Promise<boolean>;

  clear(): Promise<void>;
}
```

This abstraction allows LimitLayer to swap storage implementations without changing application code.

---

# Choosing the Right Storage

| Deployment | Recommended Adapter |
|------------|---------------------|
| Local development | MemoryStore |
| Single VPS | MemoryStore |
| Docker Compose | RedisStore |
| Kubernetes | RedisStore |
| AWS ECS | RedisStore |
| Railway | RedisStore |
| Render | RedisStore |
| Fly.io | RedisStore |
| Multiple API instances | RedisStore |

---

# Upcoming Storage Adapters

LimitLayer's storage layer is designed to be extensible. Future releases will introduce additional adapters for different deployment environments.

### Upstash Redis

Ideal for serverless platforms such as:

- Vercel
- Netlify
- Cloudflare Workers

### PostgreSQL

Suitable for applications that already depend on PostgreSQL and prefer not to maintain a separate Redis instance.

### MongoDB

Provides document-based storage for teams already using MongoDB.

---

# Creating a Custom Storage Adapter

You can integrate any database by implementing the `StorageAdapter` interface.

```ts
import type { StorageAdapter } from "@limitlayer/core";

export class CustomStore implements StorageAdapter {
  async get(key) {
    // Fetch state
  }

  async set(key, value, ttl) {
    // Save state
  }

  async delete(key) {
    // Remove state
  }

  async has(key) {
    // Check existence
  }

  async clear() {
    // Clear all limiter data
  }
}
```

Once implemented, it can be used exactly like the built-in adapters.

```ts
const limiter = createLimitLayer({
  storage: new CustomStore(),
  rules: [
    {
      path: "/api/*",
      algorithm: "token-bucket",
      limit: 100,
      burst: 200,
      window: "1m",
    },
  ],
});
```

---

# Best Practices

- Use **MemoryStore** for development and small single-instance applications.
- Use **RedisStore** for production deployments with multiple application instances.
- Reuse an existing Redis client when your application already manages one.
- Prefer Redis for algorithms that maintain more state, such as Sliding Log and Token Bucket.
- Keep Redis close to your application servers to minimize latency.

---

# Next Steps

- 📖 [Getting Started](./getting-started.md)
- 🧠 [Algorithms](./algorithms.md)
- 🏗️ [Architecture](./architecture.md)