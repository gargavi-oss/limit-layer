import { describe, expect, it } from "vitest";

import { MemoryStore } from "../src/storage/memory-store.js";

describe("MemoryStore", () => {

  it("stores a value", async () => {

    const store = new MemoryStore();

    await store.set(
      "user1",
      { count: 3 },
      1000
    );

    expect(
      await store.get("user1")
    ).toEqual({
      count: 3,
    });

  });

  it("returns null for missing key", async () => {

    const store = new MemoryStore();

    expect(
      await store.get("missing")
    ).toBeNull();

  });

  it("overwrites existing values", async () => {

    const store = new MemoryStore();

    await store.set(
      "user",
      { count: 1 },
      1000
    );

    await store.set(
      "user",
      { count: 5 },
      1000
    );

    expect(
      await store.get("user")
    ).toEqual({
      count: 5,
    });

  });

});