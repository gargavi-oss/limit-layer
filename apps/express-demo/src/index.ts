import express from "express";

import { MemoryStore } from "@limitlayer/core";
import { limitLayer } from "@limitlayer/express";

const app = express();

app.use(express.json());

app.use(
  limitLayer({
    storage: new MemoryStore(),
    rules: [
      {
        path: "/hello",
        algorithm: "sliding-window",
        limit: 2,
        window: "2s",
      },
    ],
  })
);

app.get("/hello", (_req, res) => {
  res.json({
    message: "Hello from Sliding Window!",
    time: Date.now(),
  });
});

app.listen(3000, () => {
  console.log("Running on http://localhost:3000");
});