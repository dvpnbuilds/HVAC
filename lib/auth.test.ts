import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createSessionToken, isValidSessionToken, verifyCredentials } from "@/lib/auth";

const originalEnv = { ...process.env };

beforeEach(() => {
  process.env.ADMIN_USERNAME = "admin";
  process.env.ADMIN_PASSWORD = "hunter2";
  process.env.ADMIN_SESSION_SECRET = "test-secret";
});

afterEach(() => {
  process.env = { ...originalEnv };
});

describe("verifyCredentials", () => {
  it("accepts the configured username and password", () => {
    expect(verifyCredentials("admin", "hunter2")).toBe(true);
  });

  it("rejects wrong credentials", () => {
    expect(verifyCredentials("admin", "wrong")).toBe(false);
    expect(verifyCredentials("nope", "hunter2")).toBe(false);
  });

  it("rejects when admin credentials aren't configured", () => {
    delete process.env.ADMIN_USERNAME;
    delete process.env.ADMIN_PASSWORD;
    expect(verifyCredentials("admin", "hunter2")).toBe(false);
  });
});

describe("session tokens", () => {
  it("validates a token created for the current config", async () => {
    const token = await createSessionToken();
    expect(await isValidSessionToken(token)).toBe(true);
  });

  it("rejects a missing or wrong token", async () => {
    expect(await isValidSessionToken(undefined)).toBe(false);
    expect(await isValidSessionToken("bogus")).toBe(false);
  });
});
