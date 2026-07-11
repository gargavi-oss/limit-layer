# @limitlayer/core

> A modern, framework-agnostic rate limiting engine for Node.js and TypeScript.

`@limitlayer/core` is the foundation of the **LimitLayer** ecosystem. It provides a fast, extensible, and framework-agnostic rate limiting engine that works with Express, Fastify, Hono, GraphQL, WebSockets, RPC services, background workers, API gateways, and custom applications.

Built with TypeScript from the ground up, LimitLayer supports multiple rate-limiting algorithms, pluggable storage adapters, distributed Redis deployments, and per-route configuration—all through a clean and consistent API.

---

## ✨ Features

### Core

- 🚀 Framework-agnostic architecture
- ⚡ High-performance TypeScript implementation
- 🧩 Per-route algorithm selection
- 🔑 Custom key generators
- 💾 Pluggable storage adapters
- 🌐 Distributed rate limiting with Redis
- 📦 ESM + CommonJS support
- 🛠 Fully typed API
- 🔧 Extensible architecture

### Built-in Algorithms

- ✅ Fixed Window
- ✅ Sliding Window
- ✅ Token Bucket
- ✅ Sliding Log
- ✅ Leaky Bucket

### Storage Adapters

- ✅ MemoryStore
- ✅ RedisStore

---

# 📦 Installation

Install the core package:

```bash
npm install @limitlayer/core
```

For distributed rate limiting with Redis:

```bash
npm install redis
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

# 🌐 Distributed Rate Limiting with Redis

```ts
import {
  RedisStore,
  createLimitLayer,
} from "@limitlayer/core";

const limiter = createLimitLayer({
  storage: new RedisStore({
    url: process.env.REDIS_URL,
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

Using Redis allows multiple application instances to share the same rate-limiting state, making LimitLayer suitable for horizontally scaled deployments.

---

# 🔑 Custom Key Generator

Rate limit by IP, user ID, tenant, API key, or any custom identifier.

```ts
const limiter = createLimitLayer({
  storage: new MemoryStore(),

  rules: [
    {
      path: "/api/*",
      algorithm: "token-bucket",
      limit: 100,
      window: "1m",

      keyGenerator(request) {
        return request.headers["x-api-key"] as string;
      },
    },
  ],
});
```

Examples include:

- User ID
- API Key
- Organization ID
- Tenant ID
- Session ID
- IP Address

---

# 🧠 Built-in Algorithms

| Algorithm | Best For |
|------------|----------|
| ✅ Fixed Window | Public APIs |
| ✅ Sliding Window | Authentication & Login |
| ✅ Token Bucket | Payments & APIs with bursts |
| ✅ Sliding Log | Search APIs |
| ✅ Leaky Bucket | Webhooks & Queue-like traffic |

---

# 💾 Storage Adapters

| Storage | Status |
|----------|--------|
| ✅ MemoryStore | Available |
| ✅ RedisStore | Available |
| 🚧 Upstash Redis | Planned |
| 🚧 PostgreSQL | Planned |
| 🚧 MongoDB | Planned |

---

# 🎯 Why LimitLayer?

Most rate limiting libraries force you to use one algorithm across your entire application.

LimitLayer lets every endpoint choose the strategy that best matches its traffic patterns.

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

Typical recommendations:

| Endpoint | Recommended Algorithm |
|----------|-----------------------|
| 🔐 Authentication | Sliding Window |
| 💳 Payments | Token Bucket |
| 🔍 Search | Sliding Log |
| 🔄 Webhooks | Leaky Bucket |
| 🌐 Public APIs | Fixed Window |

This modular approach allows applications to use the most suitable algorithm for every endpoint without changing architecture or middleware.

---

# 🚀 Performance

LimitLayer is designed for production workloads.

- Lightweight architecture
- Minimal allocations
- Async storage adapters
- Redis support for distributed deployments
- Per-route algorithm selection
- Fully typed TypeScript API

Benchmark results will be published in future releases.

---

# 🛣️ Roadmap

### Storage

- 🚧 Upstash Redis
- 🚧 PostgreSQL
- 🚧 MongoDB

### Frameworks

- 🚧 Fastify
- 🚧 Hono
- 🚧 Koa
- 🚧 NestJS

### Features

- 🚧 Performance benchmarks
- 🚧 Prometheus metrics
- 🚧 OpenTelemetry integration
- 🚧 Analytics dashboard
- 🚧 Additional algorithms

---

# 📚 Documentation

Complete documentation, examples, architecture guides, and contribution guidelines are available in the main repository.

**GitHub**

https://github.com/gargavi-oss/limit-layer

---

# 📦 Related Packages

| Package | Description |
|----------|-------------|
| **@limitlayer/core** | Framework-agnostic rate limiting engine |
| **@limitlayer/express** | Official Express middleware |

More adapters will be added as the LimitLayer ecosystem grows.

---

# 🤝 Contributing

Contributions are welcome.

Whether you're fixing bugs, improving documentation, implementing algorithms, adding storage adapters, or building framework integrations, your contributions are appreciated.

Please read the contribution guidelines before opening a Pull Request.

---

# 📄 License

MIT

---

Built with ❤️ in TypeScript.