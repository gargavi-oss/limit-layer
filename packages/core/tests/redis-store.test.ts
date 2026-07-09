import { describe, expect, it, vi, beforeEach } from "vitest";

import { RedisStore } from "../src/storage/index";

describe("RedisStore", () => {
  let client: any;
  let store: RedisStore;

  beforeEach(() => {
    client = {
      get: vi.fn(),
      set: vi.fn(),
      del: vi.fn(),
      exists: vi.fn(),
      flushDb: vi.fn(),
      quit: vi.fn(),
      on: vi.fn(),
      connect: vi.fn(),
      isOpen: true,
    };

    store = new RedisStore({
      client,
    });
  });

  it("should return null when key does not exist", async () => {
    client.get.mockResolvedValue(null);

    const value = await store.get("test");

    expect(value).toBeNull();
  });

  it("should deserialize stored values", async () => {
    client.get.mockResolvedValue(
      JSON.stringify({
        count: 5,
      })
    );

    const value = await store.get<{
      count: number;
    }>("test");

    expect(value).toEqual({
      count: 5,
    });
  });

  it("should serialize values when setting", async () => {
    await store.set("key", {
      hello: "world",
    });

    expect(client.set).toHaveBeenCalledWith(
      "key",
      JSON.stringify({
        hello: "world",
      })
    );
  });

  it("should set ttl when provided", async () => {
    await store.set(
      "key",
      {
        count: 1,
      },
      5000
    );

    expect(client.set).toHaveBeenCalledWith(
      "key",
      JSON.stringify({
        count: 1,
      }),
      {
        PX: 5000,
      }
    );
  });

  it("should delete keys", async () => {
    await store.delete("abc");

    expect(client.del).toHaveBeenCalledWith(
      "abc"
    );
  });

  it("should detect existing keys", async () => {
    client.exists.mockResolvedValue(1);

    expect(await store.has("abc")).toBe(true);
  });

  it("should detect missing keys", async () => {
    client.exists.mockResolvedValue(0);

    expect(await store.has("abc")).toBe(false);
  });

  it("should clear the database", async () => {
    await store.clear();

    expect(client.flushDb).toHaveBeenCalled();
  });

  it("should disconnect owned clients", async () => {
    const owned = new RedisStore({
      url: "redis://localhost:6379",
    });

    (owned as any).client = client;
    (owned as any).ownsClient = true;

    await owned.disconnect();

    expect(client.quit).toHaveBeenCalled();
  });

  it("should not disconnect injected clients", async () => {
    await store.disconnect();

    expect(client.quit).not.toHaveBeenCalled();
  });
});