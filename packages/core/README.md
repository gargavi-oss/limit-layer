# @limitlayer/core

> A modern, framework-agnostic rate limiting engine for Node.js and TypeScript.

`@limitlayer/core` provides the core rate limiting engine used by LimitLayer. It is independent of any web framework, making it suitable for HTTP servers, WebSockets, background jobs, GraphQL, RPC, and custom applications.

---

## Features

* 🚀 Framework-agnostic
* ⚡ High-performance TypeScript implementation
* 🔒 Fixed Window rate limiting
* 💾 Pluggable storage adapters
* 🧩 Extensible algorithm architecture
* 📦 ESM + CommonJS support
* 🛠 Fully typed API

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

## Built-in Components

### Algorithms

* ✅ Fixed Window
* 🚧 Sliding Window
* 🚧 Sliding Log
* 🚧 Token Bucket
* 🚧 Leaky Bucket

### Storage

* ✅ MemoryStore
* 🚧 RedisStore

---

## Documentation

The complete documentation, examples, roadmap, and framework adapters are available in the main repository.

GitHub Repository:

https://github.com/gargavi-oss/limit-layer

---

## License

MIT
