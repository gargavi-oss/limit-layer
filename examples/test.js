const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function hit(label) {
  const res = await fetch("http://localhost:3000/hello");

  console.log(
    `${label.padEnd(15)} ${res.status}`
  );
}

(async () => {
  console.log("\n===== Initial Burst =====");

  await hit("Request 1");
  await hit("Request 2");
  await hit("Request 3");
  await hit("Request 4");

  console.log("\n===== Bucket Empty =====");

  await hit("Request 5");
  await hit("Request 6");

  console.log("\nWaiting 1 second...\n");

  await delay(1000);

  await hit("After 1 sec");

  console.log("\nWaiting another 1 second...\n");

  await delay(1000);

  await hit("After 2 sec");
  await hit("After 2 sec");

  console.log("\nWaiting 4 seconds...\n");

  await delay(4000);

  await hit("After 6 sec");
  await hit("After 6 sec");
  await hit("After 6 sec");
  await hit("After 6 sec");
  await hit("After 6 sec");
})();