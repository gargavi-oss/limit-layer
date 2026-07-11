# @limitlayer/express

> Official Express middleware for the LimitLayer rate limiting toolkit.

`@limitlayer/express` makes it easy to add fast, configurable, and production-ready rate limiting to Express applications. Built on top of `@limitlayer/core`, it supports multiple rate-limiting algorithms, Redis-backed distributed deployments, automatic HTTP rate-limit headers, and flexible per-route configuration.

Whether you're protecting authentication endpoints, REST APIs, payment services, search APIs, webhooks, or internal services, LimitLayer lets every route use the rate-limiting strategy that best fits its traffic patterns.

---

# ✨ Features

### Express Middleware

- 🚀 Official Express middleware
- ⚡ Built on top of `@limitlayer/core`
- 🎯 Per-route algorithm selection
- 🔑 Custom key generators
- 💾 MemoryStore & RedisStore support
- 🌐 Distributed rate limiting with Redis
- 📋 Legacy and RFC 9333 RateLimit headers
- 🔒 Automatic `429 Too Many Requests` responses
- 🛠 Fully typed TypeScript API
- 📦 ESM + CommonJS support

### Built-in Algorithms

- ✅ Fixed Window
- ✅ Sliding Window
- ✅ Token Bucket
- ✅ Sliding Log
- ✅ Leaky Bucket

---

# 📦 Installation

Install the middleware:

```bash
npm install express @limitlayer/core @limitlayer/express
```

For distributed deployments:

```bash
npm install redis
```

---

# ⚡ Quick Start

```ts
import express from "express";

import {
  MemoryStore,
} from "@limitlayer/core";

import {
  limitLayer,
} from "@limitlayer/express";

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

# 🌐 Distributed Rate Limiting with Redis

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
  })
);
```

Using Redis allows multiple Express instances to share the same rate-limiting state, making LimitLayer ideal for horizontally scaled applications and load-balanced deployments.

---

# 🔑 Custom Key Generator

Rate limit requests by IP address, user ID, tenant, API key, session, or any custom identifier.

```ts
app.use(
  limitLayer({
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
  })
);
```

Example identifiers:

- User ID
- API Key
- Organization ID
- Tenant ID
- Session ID
- IP Address

---

# 📋 Rate Limit Headers

LimitLayer automatically returns rate-limit headers with every request.

### Legacy Headers

```text
X-RateLimit-Limit
X-RateLimit-Remaining
X-RateLimit-Reset
Retry-After
```

### RFC 9333 Standard Headers

```text
RateLimit-Limit
RateLimit-Remaining
RateLimit-Reset
Retry-After
```

You can configure the middleware to send:

- Legacy headers
- Standard RFC 9333 headers
- Both formats
- No headers

---

# 🧠 Supported Algorithms

| Algorithm | Best For |
|------------|----------|
| ✅ Fixed Window | Public REST APIs |
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

Most Express rate limiters apply the same algorithm to every endpoint.

LimitLayer allows every route to choose the strategy that best matches its traffic patterns.

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

| Route | Recommended Algorithm |
|--------|-----------------------|
| 🔐 Login & Authentication | Sliding Window |
| 💳 Payments | Token Bucket |
| 🔍 Search | Sliding Log |
| 🔄 Webhooks | Leaky Bucket |
| 🌐 Public REST APIs | Fixed Window |

Every endpoint can use the most suitable rate-limiting strategy while sharing the same middleware, configuration model, and developer experience.

---

# 🚀 Production Ready

LimitLayer is designed for modern Express applications.

- Lightweight middleware
- Async storage adapters
- Redis support
- Distributed deployments
- Per-route algorithms
- Custom key generators
- Configurable rate-limit headers
- Fully typed TypeScript API

---

# 📚 Documentation

Complete documentation, examples, architecture guides, storage adapters, and contribution guidelines are available in the main repository.

**GitHub**

https://github.com/gargavi-oss/limit-layer

---

# 📦 Related Packages

| Package | Description |
|----------|-------------|
| **@limitlayer/core** | Framework-agnostic rate limiting engine |
| **@limitlayer/express** | Official Express middleware |

Additional adapters for Fastify, Hono, Koa, NestJS, and other frameworks are planned.

---

# 🤝 Contributing

Contributions are welcome.

Whether you're fixing bugs, improving documentation, implementing new algorithms, adding storage adapters, or building framework integrations, your contributions are appreciated.

Please read the contribution guidelines before opening a Pull Request.

---

# 📄 License

MIT

---

Built with ❤️ in TypeScript.