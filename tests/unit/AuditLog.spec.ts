import { describe, it, expect } from "vitest";
import { AuditLog } from "../../src/domain/AuditLog";

describe("AuditLog entity", () => {
  it("creates with valid input", () => {
    const dto = {
      actorId: "user-1",
      actorType: "USER" as const,
      action: "CREATE",
      entityType: "TRANSACTION",
      entityId: "tx-1",
      metadata: { amount: 100 }
    };

    const a = AuditLog.create(dto);
    expect(a).toBeInstanceOf(AuditLog);
    expect(a.actorId).toBe("user-1");
    expect(a.action).toBe("CREATE");
  });
});

