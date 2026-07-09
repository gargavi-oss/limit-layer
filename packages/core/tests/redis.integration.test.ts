import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import { RedisStore } from "../src/storage/redis.js";

describe("RedisStore Integration", () => {
let store: RedisStore;

beforeAll(async () => {
  store = new RedisStore({
    url:
      process.env.REDIS_URL ??
      "redis://localhost:6379",
  });

  await store.clear();
});


  beforeEach(async () => {
    await store.clear();
  });

  afterAll(async () => {
    await store.clear();
    await store.disconnect();
  });

  it("should set and get values", async () => {
    await store.set("user:1", {
      count: 5,
      resetAt: 100,
    });

    const value = await store.get<{
      count: number;
      resetAt: number;
    }>("user:1");

    expect(value).toEqual({
      count: 5,
      resetAt: 100,
    });
  });

  it("should return null for missing keys", async () => {
    const value = await store.get("missing");

    expect(value).toBeNull();
  });

  it("should report existing keys", async () => {
    await store.set("exists", {
      hello: "world",
    });

    expect(await store.has("exists")).toBe(true);
  });

  it("should report missing keys", async () => {
    expect(await store.has("missing")).toBe(false);
  });

  it("should delete keys", async () => {
    await store.set("temp", {
      value: 123,
    });

    expect(await store.has("temp")).toBe(true);

    await store.delete("temp");

    expect(await store.has("temp")).toBe(false);
  });

  it("should clear the database", async () => {
    await store.set("a", 1);
    await store.set("b", 2);

    expect(await store.has("a")).toBe(true);
    expect(await store.has("b")).toBe(true);

    await store.clear();

    expect(await store.has("a")).toBe(false);
    expect(await store.has("b")).toBe(false);
  });

  it("should expire keys after ttl", async () => {
    await store.set(
      "ttl-key",
      {
        hello: "redis",
      },
      100
    );

    expect(await store.get("ttl-key")).not.toBeNull();

    await new Promise((resolve) =>
      setTimeout(resolve, 150)
    );

    expect(await store.get("ttl-key")).toBeNull();
  });

  it("should overwrite existing values", async () => {
    await store.set("counter", {
      count: 1,
    });

    await store.set("counter", {
      count: 2,
    });

    const value = await store.get<{
      count: number;
    }>("counter");

    expect(value).toEqual({
      count: 2,
    });
  });

  it("should store complex objects", async () => {
    const state = {
      previous: 4,
      current: 7,
      resetAt: Date.now(),
    };

    await store.set("state", state);

    const restored =
      await store.get<typeof state>("state");

    expect(restored).toEqual(state);
  });
});