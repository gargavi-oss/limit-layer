// import { Bench } from "tinybench";

// import {
//   MemoryStore,
//   createLimitLayer,
// } from "@limitlayer/core";

// const limiter = createLimitLayer({
//   storage: new MemoryStore(),

//   rules: [
//     {
//       path: "/api",
//       algorithm: "fixed-window",
//       limit: 100,
//       window: "1m",
//     },
//   ],
// });

// const bench = new Bench({
//   time: 1000,
// });

// bench.add("Fixed Window", async () => {
//   await limiter.consume({
//     method: "GET",
//     path: "/api",
//     ip: "127.0.0.1",
//     headers: {},
//     query: {},
//   });
// });

// await bench.run();

// console.table(
//   bench.tasks.map((task) => ({
//     name: task.name,
//     hz: task.result?.hz.toFixed(2),
//     mean: `${(task.result?.mean ?? 0) * 1000} ms`,
//     samples: task.result?.samples.length,
//   }))
// );