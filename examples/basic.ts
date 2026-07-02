import {
    DecisionEngine,
    MemoryStore,
    FixedWindowAlgorithm,
    registerAlgorithm,
    Rule,
  } from "../packages/core/src/index.ts";

registerAlgorithm(
    "fixed-window",
    new FixedWindowAlgorithm()
);

const storage = new MemoryStore();

const engine = new DecisionEngine(storage);

const rule:Rule = {
    id: "login",

    path: "/login",

    algorithm: "fixed-window",

    limit: 6,

    window: "1m",
};

const request = {
    method: "POST",

    path: "/login",

    ip: "127.0.0.1",

    headers: {},

    query: {},
};

for (let i = 1; i <= 8; i++) {
    const result = await engine.consume(
        request,
        rule
    );

    console.log(i, result);
}