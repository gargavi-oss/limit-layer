# 🚀 LimitLayer

> A modern, framework-agnostic rate limiting library for Node.js and TypeScript.

[![CI](https://github.com/gargavi-oss/limit-layer/actions/workflows/ci.yml/badge.svg)](https://github.com/gargavi-oss/limit-layer/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@limitlayer/core)](https://www.npmjs.com/package/@limitlayer/core)
[![npm downloads](https://img.shields.io/npm/dm/@limitlayer/core)](https://www.npmjs.com/package/@limitlayer/core)
[![License](https://img.shields.io/github/license/gargavi-oss/limit-layer)](LICENSE)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-11-F69220?logo=pnpm&logoColor=white)

LimitLayer is designed to be fast, extensible, and easy to integrate. It separates the core rate-limiting engine from framework adapters, allowing the same limiter to work across Express today and other frameworks in future releases.

---

## ✨ Features

* ⚡ High-performance TypeScript implementation
* 🧩 Framework-agnostic core
* 🚀 Official Express adapter
* 📦 ESM + CommonJS support
* 🔒 Built-in Fixed Window algorithm
* 🧠 Extensible algorithm registry
* 💾 Pluggable storage architecture
* 🛠 Type-safe public API
* 📖 Simple configuration

---

## Packages

| Package               | Description               |
| --------------------- | ------------------------- |
| `@limitlayer/core`    | Core rate limiting engine |
| `@limitlayer/express` | Express middleware        |

---

## Installation

### Core

```bash
npm install @limitlayer/core
```

### Express

```bash
npm install @limitlayer/core @limitlayer/express express
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
      algorithm: "fixed-window",
      limit: 5,
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

## Express Example

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
        algorithm: "fixed-window",
        limit: 5,
        window: "1m",
      },
    ],
  })
);

app.post("/login", (_, res) => {
  res.json({
    success: true,
  });
});

app.listen(3000);
```

---

## Built-in Algorithms

| Algorithm      | Status      |
| -------------- | ----------- |
| Fixed Window   | ✅ Available |
| Sliding Window | 🚧 Planned  |
| Sliding Log    | 🚧 Planned  |
| Token Bucket   | 🚧 Planned  |
| Leaky Bucket   | 🚧 Planned  |

---

## Storage

| Storage     | Status      |
| ----------- | ----------- |
| MemoryStore | ✅ Available |
| RedisStore  | 🚧 Planned  |

---

## Roadmap

### v0.1

* Core engine
* Memory storage
* Fixed Window algorithm
* Express adapter

### v0.2

* Redis storage
* Sliding Window
* Token Bucket
* Leaky Bucket
* Sliding Log

### Future

* Fastify adapter
* Hono adapter
* Next.js adapter
* Analytics dashboard
* Hosted SaaS

---

## Development

Clone the repository:

```bash
git clone https://github.com/gargavi-oss/limitlayer.git
cd limitlayer
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

## Contributing

Contributions, bug reports, feature requests, and discussions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---

## License

MIT License.

---

Built with ❤️ using TypeScript.
