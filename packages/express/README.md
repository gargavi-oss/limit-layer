# @limitlayer/express

> Official Express middleware for LimitLayer.

`@limitlayer/express` integrates the LimitLayer core engine with Express, providing a simple and type-safe middleware for rate limiting your routes.

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
        algorithm: "fixed-window",
        limit: 5,
        window: "1m",
      },
    ],
  })
);

app.post("/login", (_req, res) => {
  res.json({
    success: true,
  });
});

app.listen(3000);
```

---

## Features

* 🚀 Simple middleware
* ⚡ Built on `@limitlayer/core`
* 📦 ESM + CommonJS support
* 🛠 TypeScript support
* 📋 Standard RateLimit response headers
* 🔒 Framework-independent core architecture

---

## Example

```ts
app.use(
  limitLayer({
    storage: new MemoryStore(),
    rules: [
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

---

## Documentation

Complete documentation, examples, and future adapters are available in the main repository.

GitHub Repository:

https://github.com/gargavi-oss/limit-layer

---

## License

MIT
