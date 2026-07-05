const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function hit() {
  const start = Date.now();

  const res = await fetch("http://localhost:3000/hello");

  console.log(
    `${Date.now() - start}ms`,
    new Date().toISOString(),
    res.status
  );
}

(async () => {
  for (let i = 0; i < 15; i++) {
    await hit();
    await delay(250);
  }
})();