# Getting Started

This guide will help you integrate LimitLayer into your application in just a few minutes.

## Installation

Core package:

```bash
npm install @limitlayer/core
```

Express middleware:

```bash
npm install express @limitlayer/core @limitlayer/express
```

---

## Create Your First Limiter

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
```

---

## Consume a Request

```ts
const result = await limiter.consume({
  method: "POST",
  path: "/login",
  ip: "127.0.0.1",
  headers: {},
  query: {},
});

console.log(result);
```

The returned object includes:

* `allowed`
* `remaining`
* `limit`
* `resetAt`
* `retryAfter`

---

## Using Express

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
    ],
  })
);

app.listen(3000);
```

---

## Multiple Rules

Different endpoints can use different algorithms and limits.

```ts
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
]
```

---

## Next Steps

After getting started, explore the rest of the documentation:

* **Architecture** — Learn how LimitLayer works internally.
* **Algorithms** — Understand when to use each rate-limiting strategy.
* **Storage** *(coming soon)* — Learn how storage adapters work.
* **Custom Algorithms** *(coming soon)* — Build your own algorithm implementations.
