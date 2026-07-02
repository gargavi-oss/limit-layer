import {
    MemoryStore,
    createLimitLayer,
  } from "../packages/core/src/index.ts";



const request = {
    method: "POST",
    path: "/login",
    ip: "127.0.0.1",
    headers: {},
    query: {},
};



const limiter = createLimitLayer({
    storage:new MemoryStore(),
    rules:[
        {
            path:"/login",
            algorithm:"fixed-window",
            limit:5,
            window:"1m"
        }
    ]
});

for (let i = 1; i <= 8; i++) {
    const result = await limiter.consume(request);
    console.log(i, result);
}