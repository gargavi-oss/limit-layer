# @limitlayer/express

Official Express middleware for the **LimitLayer** rate limiting toolkit.

`@limitlayer/express` provides a simple, type-safe way to add configurable rate limiting to Express applications. Built on top of `@limitlayer/core`, it supports multiple rate-limiting algorithms, pluggable storage adapters, automatic rate-limit headers, and a consistent developer experience.

Whether you're protecting authentication routes, REST APIs, payment endpoints, search APIs, or webhooks, LimitLayer lets you apply the most appropriate algorithm to each route.

---

## Features

- 🚀 Official Express middleware
- ⚡ Built on top of `@limitlayer/core`
- 🎯 Per-route rate-limiting configuration
- 🧩 Multiple rate-limiting algorithms
- 💾 MemoryStore and RedisStore support
- ✅ Fixed Window
- ✅ Sliding Window
- ✅ Token Bucket
- ✅ Sliding Log
- ✅ Leaky Bucket
- 📋 Standard RateLimit response headers
- 🔒 Automatic `429 Too Many Requests` responses
- 📦 ESM + CommonJS support
- 🛠 Fully typed with TypeScript

---

## Installation

```bash
npm install express @limitlayer/core @limitlayer/express
```

For distributed deployments with Redis:

```bash
npm install redis
```

---

## Quick Start

```ts
import express from "express";

import { MemoryStore } from "@limitlayer/core";
import { limitLayer } from "@limitlayer/express";

const app = express();

app.use(
  limitLayer({
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
  })
);

app.post("/login", (_, res) => {
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
```

---

## Redis Example

```ts
import express from "express";

import {
  RedisStore,
} from "@limitlayer/core";

import {
  limitLayer,
} from "@limitlayer/express";

const app = express();

app.use(
  limitLayer({
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
  })
);
```

---

## Response Headers

The middleware automatically sets standard rate-limit headers for every request.

```text
X-RateLimit-Limit
X-RateLimit-Remaining
X-RateLimit-Reset
Retry-After
```

These headers make it easy for API clients to understand their current rate-limit status.

---

## Supported Algorithms

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

Example use cases:

- 🔐 Authentication → Sliding Window
- 💳 Payment APIs → Token Bucket
- 🔍 Search APIs → Sliding Log
- 🔄 Webhooks → Leaky Bucket
- 🌐 General REST APIs → Fixed Window

This lets you choose the most appropriate rate-limiting strategy for each route while keeping a consistent middleware API.

---

## Related Packages

- **@limitlayer/core** — Framework-agnostic rate limiting engine
- **@limitlayer/express** — Official Express middleware

Additional framework adapters are planned for future releases.

---

## Documentation

Complete documentation, examples, contribution guidelines, and the project roadmap are available in the main repository:

**GitHub:** https://github.com/gargavi-oss/limit-layer

---

## License

MIT