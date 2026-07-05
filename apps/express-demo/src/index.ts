import express from "express";

import { MemoryStore } from "@limitlayer/core";
import { limitLayer } from "@limitlayer/express";

const app = express();

app.use(
  limitLayer({
    storage: new MemoryStore(),
    rules: [
      {
        path: "/hello",
        algorithm: "token-bucket",
        limit: 2,
        burst: 4,
        window: "2s",
      },
    ],
  })
);

app.get("/hello", (_, res) => {
  res.json({
    success: true,
    time: Date.now(),
  });
});

app.listen(3000, () => {
  console.log("Listening on :3000");
});