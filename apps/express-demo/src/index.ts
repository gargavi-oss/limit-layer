// Import the express in typescript file
import express from 'express';
import { MemoryStore } from "@limitlayer/core";
import { limitLayer } from "@limitlayer/express";



// Initialize the express engine
const app: express.Application = express();

// Take a port 3000 for running server.
const port: number = 3000;

app.use(express.json());
app.use(
    limitLayer({
      storage: new MemoryStore(),
      rules: [
        {
          path: "/",
          algorithm: "fixed-window",
          limit: 5,
          window: "5s",
        },
        {
            path: "/hello",
            algorithm: "sliding-window",
            limit: 2,
            window: "2s",
          },
      ],
    })
  );

// Handling '/' Request
app.get('/', (_req, _res) => {
    _res.send("TypeScript With Express");
});

app.get("/hello",(_req,_res)=>{
    _res.send("hello")
})
// Server setup
app.listen(port, () => {
    console.log(`TypeScript with Express 
         http://localhost:${port}/`);
});

