import { describe, it, beforeAll, afterAll, expect } from "vitest";
import { buildServer } from "../../src/http/server";
import { AppDataSource } from "../../src/infrastructure/db/data-source";
import { AuditLog } from "../../src/domain/AuditLog";

let server: any;

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  await AppDataSource.initialize();
  server = await buildServer();
});

afterAll(async () => {
  if (AppDataSource.isInitialized) await AppDataSource.destroy();
  if (server) await server.close();
});

describe("HTTP - audit logs", () => {
  it("creates and lists audit logs", async () => {
    await AppDataSource.getRepository(AuditLog).clear();

    const payload = {
      actorId: "user-1",
      actorType: "USER",
      action: "CREATE",
      entityType: "TRANSACTION",
      entityId: "tx-1",
      metadata: { foo: "bar" }
    };

    const res = await server.inject({
      method: "POST",
      url: "/audit-logs",
      payload
    });
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.payload);
    expect(body.id).toBeTruthy();

    const list = await server.inject({
      method: "GET",
      url: "/audit-logs"
    });
    expect(list.statusCode).toBe(200);
    const parsed = JSON.parse(list.payload);
    expect(parsed.items.length).toBeGreaterThanOrEqual(1);
  });
});

