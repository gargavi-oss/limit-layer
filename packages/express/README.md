# @limitlayer/express

Official Express middleware for the **LimitLayer** rate limiting engine.

`@limitlayer/express` seamlessly integrates **LimitLayer** with Express applications, providing a simple, type-safe middleware for applying configurable rate limiting to your routes.

Built on top of `@limitlayer/core`, it supports multiple rate-limiting algorithms, automatic response headers, and a modular architecture that grows with your application.

---

## Installation

```bash
npm install express @limitlayer/core @limitlayer/express
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

app.post("/payments", (_, res) => {
  res.json({ success: true });
});

app.get("/search", (_, res) => {
  res.json([]);
});

app.post("/webhooks/github", (_, res) => {
  res.sendStatus(200);
});

app.get("/api/users", (_, res) => {
  res.json([]);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
```

---

## Features

- 🚀 Official Express middleware
- ⚡ Powered by `@limitlayer/core`
- 🧩 Supports multiple rate-limiting algorithms
- ✅ Fixed Window algorithm
- ✅ Sliding Window algorithm
- ✅ Token Bucket algorithm
- ✅ Sliding Log algorithm
- ✅ Leaky Bucket algorithm
- 📦 ESM + CommonJS support
- 🛠 Fully typed with TypeScript
- 📋 Standard RateLimit response headers
- 🔒 Automatic `429 Too Many Requests` responses
- 🎯 Per-route algorithm configuration

---

## Response Headers

The middleware automatically sets standard rate-limit headers.

```
X-RateLimit-Limit
X-RateLimit-Remaining
X-RateLimit-Reset
Retry-After
```

---

## Example Configuration

```ts
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
```

Different endpoints can use different rate-limiting algorithms based on their traffic patterns and security requirements.

---

## Supported Algorithms

| Algorithm        | Status    |
| ---------------- | --------- |
| ✅ Fixed Window   | Available |
| ✅ Sliding Window | Available |
| ✅ Token Bucket   | Available |
| ✅ Sliding Log    | Available |
| ✅ Leaky Bucket  | Available  |

---

## Roadmap

Future releases will include:

* Redis storage adapter
* Additional storage strategies
* Fastify adapter
* Hono adapter
* Koa adapter
* NestJS integration
* Performance benchmarks

---

## Documentation

For complete documentation, examples, contribution guidelines, and the project roadmap, visit the main repository:

**GitHub:** https://github.com/gargavi-oss/limit-layer

---

## Related Packages

* **@limitlayer/core** — Framework-agnostic rate limiting engine
* **@limitlayer/express** — Express middleware

More adapters will be added in future releases.

---

## License

MIT
