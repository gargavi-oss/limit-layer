# 🚀 LimitLayer

> A modern, framework-agnostic rate limiting toolkit for Node.js and TypeScript.

[![CI](https://github.com/gargavi-oss/limit-layer/actions/workflows/ci.yml/badge.svg)](https://github.com/gargavi-oss/limit-layer/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@limitlayer/core)](https://www.npmjs.com/package/@limitlayer/core)
[![npm downloads](https://img.shields.io/npm/dm/@limitlayer/core)](https://www.npmjs.com/package/@limitlayer/core)
[![License](https://img.shields.io/github/license/gargavi-oss/limit-layer)](LICENSE)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript\&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js\&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-11-F69220?logo=pnpm\&logoColor=white)

LimitLayer is an extensible rate-limiting toolkit for modern backend applications. It separates the core rate-limiting engine from framework adapters, allowing you to apply different algorithms to different endpoints while maintaining a consistent developer experience.

Whether you're protecting authentication endpoints, public APIs, payment services, webhooks, or internal services, LimitLayer provides a modular foundation that can grow with your application.

---

# ✨ Features

* 🚀 Framework-agnostic core
* ⚡ High-performance TypeScript implementation
* 🎯 Per-route algorithm selection
* 🧩 Modular architecture
- ✅ Fixed Window algorithm
- ✅ Sliding Window algorithm
- ✅ Token Bucket algorithm
- ✅ Sliding Log algorithm
- ✅ Leaky Bucket algorithm
* 💾 Pluggable storage architecture
* 🧠 Extensible algorithm registry
* 📦 ESM + CommonJS support
* 🛠 Fully typed public API
* 🚀 Official Express adapter
* 📖 Simple declarative configuration
* 🧪 Unit tested
* ⚙️ GitHub Actions CI

---

# 🏗️ Architecture

```mermaid
flowchart TD

    APP[Application]

    EXPRESS["@limitlayer/express"]

    CORE["@limitlayer/core"]

    LIMITER[LimitLayer]

    ENGINE[Decision Engine]

    MATCHER[Rule Matcher]

    REGISTRY[Algorithm Registry]

    FW[Fixed Window]
    SW[Sliding Window]
    TB[Token Bucket]
    SL[Sliding Log]
    LB[Leaky Bucket]

    STORAGE[Storage Adapter]

    MEMORY[MemoryStore]
    REDIS[RedisStore (Planned)]

    APP --> EXPRESS
    EXPRESS --> CORE

    CORE --> LIMITER
    LIMITER --> ENGINE

    ENGINE --> MATCHER
    ENGINE --> REGISTRY
    ENGINE --> STORAGE

    REGISTRY --> FW
    REGISTRY --> SW
    REGISTRY --> TB
    REGISTRY --> SL
    REGISTRY --> LB

    STORAGE --> MEMORY
    STORAGE -.-> REDIS
```

---

# 📦 Packages

| Package               | Description                             |
| --------------------- | --------------------------------------- |
| `@limitlayer/core`    | Framework-agnostic rate limiting engine |
| `@limitlayer/express` | Official Express middleware             |

More framework adapters will be added in future releases.

---

# 🚀 Installation

### Core

```bash
npm install @limitlayer/core
```

### Express

```bash
npm install express @limitlayer/core @limitlayer/express
```

---

# ⚡ Quick Start

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

# 🌐 Express Example

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

# 🎯 Why LimitLayer?

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
  ],
```

> 💡 LimitLayer allows different endpoints to use different rate-limiting algorithms within the same application. Choose the strategy that best fits each endpoint's traffic patterns and requirements.

---

# 🧠 Built-in Algorithms

| Algorithm        | Status    |
| ---------------- | --------- |
| ✅ Fixed Window   | Available |
| ✅ Sliding Window | Available |
| ✅ Token Bucket  | Available  |
| ✅ Sliding Log   | Available  |
| ✅ Leaky Bucket  | Available  |

---

# 💾 Storage Adapters

| Storage          | Status    |
| ---------------- | --------- |
| ✅ MemoryStore    | Available |
| 🚧 RedisStore    | Planned   |
| 🚧 Upstash Redis | Planned   |
| 🚧 PostgreSQL    | Planned   |
| 🚧 MongoDB       | Planned   |

---

# 📚 Documentation

Learn more about LimitLayer through the project documentation.

| Guide                                           | Description                                           |
| ----------------------------------------------- | ----------------------------------------------------- |
| 📖 [Getting Started](./docs/getting-started.md) | Installation, configuration and first limiter         |
| 🏗️ [Architecture](./docs/architecture.md)      | Understand the internal architecture and request flow |
| 🧠 [Algorithms](./docs/algorithms.md)           | Learn how each algorithm works and when to use it     |

Additional guides covering storage adapters, custom algorithms, and framework integrations will be added in future releases.

---

### v0.2

- ✅ Core engine
- ✅ MemoryStore
- ✅ Fixed Window
- ✅ Sliding Window
- ✅ Token Bucket
- ✅ Sliding Log
- ✅ Leaky Bucket
- ✅ Express adapter
- ✅ TypeScript support
- ✅ GitHub Actions
- ✅ Unit tests
- ✅ Documentation

### Upcoming

* Redis storage adapter
* Additional storage adapters
* Performance benchmarks
* More examples

### Future

* Fastify adapter
* Hono adapter
* Koa adapter
* NestJS integration
* Next.js integration
* Analytics dashboard
* Hosted SaaS platform

---

# 🛠️ Development

Clone the repository:

```bash
git clone https://github.com/gargavi-oss/limit-layer.git
cd limit-layer
pnpm install
```

Build all packages:

```bash
pnpm build
```

Run tests:

```bash
pnpm test
```

---

# 🤝 Contributing

Contributions are welcome.

Whether you're fixing bugs, improving documentation, implementing algorithms, adding storage adapters, or building framework integrations, your contributions are appreciated.

Please read the contribution guidelines before opening a Pull Request.

---

# 📄 License

MIT License.

---

Built with ❤️ in TypeScript.
