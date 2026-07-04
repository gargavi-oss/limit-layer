# @limitlayer/core

A modern, framework-agnostic rate limiting engine for Node.js and TypeScript.

`@limitlayer/core` is the heart of the **LimitLayer** ecosystem. It provides a flexible, extensible rate-limiting engine that can be used with any framework or runtime, including Express, Fastify, Hono, GraphQL, WebSockets, background workers, RPC services, and custom applications.

---

## Features

* 🚀 Framework-agnostic
* ⚡ High-performance TypeScript implementation
* 🧩 Pluggable rate-limiting algorithms
* ✅ Fixed Window algorithm
* ✅ Sliding Window algorithm
* 💾 Pluggable storage adapters
* 📦 ESM + CommonJS support
* 🛠 Fully typed API
* 🔧 Extensible architecture for custom algorithms

---

## Installation

```bash
npm install @limitlayer/core
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

## Built-in Algorithms

| Algorithm        | Status    |
| ---------------- | --------- |
| ✅ Fixed Window   | Available |
| ✅ Sliding Window | Available |
| 🚧 Token Bucket  | Planned   |
| 🚧 Sliding Log   | Planned   |
| 🚧 Leaky Bucket  | Planned   |

---

## Storage Adapters

| Storage          | Status    |
| ---------------- | --------- |
| ✅ MemoryStore    | Available |
| 🚧 RedisStore    | Planned   |
| 🚧 Upstash Redis | Planned   |
| 🚧 PostgreSQL    | Planned   |
| 🚧 MongoDB       | Planned   |

---

## Why LimitLayer?

LimitLayer is designed around a modular architecture where different endpoints can use different rate-limiting strategies.

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
    algorithm: "fixed-window",
    limit: 20,
    window: "1m",
  },
]
```

This makes it easy to choose the most appropriate algorithm for each endpoint without changing your application's architecture.

---

## Roadmap

Upcoming features include:

* Token Bucket algorithm
* Sliding Log algorithm
* Leaky Bucket algorithm
* Redis storage adapter
* Additional storage strategies
* Performance benchmarking
* Additional framework adapters

---

## Related Packages

* **@limitlayer/core** — Framework-agnostic rate limiting engine
* **@limitlayer/express** — Official Express middleware

More adapters will be added as the ecosystem grows.

---

## Documentation

For complete documentation, examples, contribution guidelines, and the project roadmap, visit the main repository:

**GitHub:** https://github.com/gargavi-oss/limit-layer

---

## License

MIT
