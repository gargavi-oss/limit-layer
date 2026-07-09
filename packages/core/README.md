# @limitlayer/core

A modern, framework-agnostic rate limiting engine for Node.js and TypeScript.

`@limitlayer/core` is the foundation of the **LimitLayer** ecosystem. It provides a flexible, extensible rate-limiting engine that works with any framework or runtime, including Express, Fastify, Hono, GraphQL, WebSockets, background workers, RPC services, and custom applications.

---

## Features

- 🚀 Framework-agnostic architecture
- ⚡ High-performance TypeScript implementation
- 🧩 Pluggable rate-limiting algorithms
- 💾 Multiple storage adapters
- ✅ Fixed Window
- ✅ Sliding Window
- ✅ Token Bucket
- ✅ Sliding Log
- ✅ Leaky Bucket
- ✅ MemoryStore
- ✅ RedisStore
- 📦 ESM + CommonJS support
- 🛠 Fully typed API
- 🔧 Extensible architecture for custom algorithms and storage adapters

---

## Installation

```bash
npm install @limitlayer/core
```

For Redis support:

```bash
npm install redis
```

---

## Quick Start

```ts
import {
  MemoryStore,
  createLimitLayer,
} from "@limitlayer/core";

const limiter = createLimitLayer({
  storage: new MemoryStore(),
  rules: [
    {
      path: "/login",
      algorithm: "sliding-window",
      limit: 5,
      window: "1m",
    },
    {
      path: "/payments",
      algorithm: "token-bucket",
      limit: 20,
      burst: 40,
      window: "1m",
    },
    {
      path: "/search",
      algorithm: "sliding-log",
      limit: 30,
      window: "1m",
    },
    {
      path: "/webhooks/*",
      algorithm: "leaky-bucket",
      limit: 60,
      burst: 100,
      window: "1m",
    },
    {
      path: "/api/*",
      algorithm: "fixed-window",
      limit: 100,
      window: "1m",
    },
  ],
});

const result = await limiter.consume({
  method: "POST",
  path: "/login",
  ip: "127.0.0.1",
  headers: {},
  query: {},
});

console.log(result);
```

---

## Redis Example

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
      algorithm: "token-bucket",
      limit: 100,
      burst: 200,
      window: "1m",
    },
  ],
});
```

---

## Built-in Algorithms

| Algorithm | Status |
|-----------|--------|
| ✅ Fixed Window | Available |
| ✅ Sliding Window | Available |
| ✅ Token Bucket | Available |
| ✅ Sliding Log | Available |
| ✅ Leaky Bucket | Available |

---

## Storage Adapters

| Storage | Status |
|---------|--------|
| ✅ MemoryStore | Available |
| ✅ RedisStore | Available |
| 🚧 Upstash Redis | Planned |
| 🚧 PostgreSQL | Planned |
| 🚧 MongoDB | Planned |

---

## Why LimitLayer?

Different endpoints often require different rate-limiting strategies.

```ts
rules: [
  {
    path: "/login",
    algorithm: "sliding-window",
    limit: 5,
    window: "1m",
  },
  {
    path: "/payments",
    algorithm: "token-bucket",
    limit: 20,
    burst: 40,
    window: "1m",
  },
  {
    path: "/search",
    algorithm: "sliding-log",
    limit: 30,
    window: "1m",
  },
  {
    path: "/webhooks/*",
    algorithm: "leaky-bucket",
    limit: 60,
    burst: 100,
    window: "1m",
  },
  {
    path: "/api/*",
    algorithm: "fixed-window",
    limit: 100,
    window: "1m",
  },
]
```

Examples:

- 🔐 Authentication → Sliding Window
- 💳 Payments → Token Bucket
- 🔍 Search → Sliding Log
- 🔄 Webhooks → Leaky Bucket
- 🌐 General APIs → Fixed Window

LimitLayer allows every endpoint to use the algorithm that best matches its traffic pattern while keeping a consistent API and configuration model.

---

## Roadmap

Upcoming features:

- Upstash Redis adapter
- PostgreSQL adapter
- MongoDB adapter
- Performance benchmarking
- Additional framework adapters
- Custom metrics and analytics

---

## Related Packages

- **@limitlayer/core** — Framework-agnostic rate limiting engine
- **@limitlayer/express** — Official Express middleware

The LimitLayer ecosystem will continue to grow with additional framework adapters and storage backends.

---

## Documentation

Complete documentation, examples, contribution guidelines, and the project roadmap are available in the main repository:

**GitHub:** https://github.com/gargavi-oss/limit-layer

---

## License

MIT