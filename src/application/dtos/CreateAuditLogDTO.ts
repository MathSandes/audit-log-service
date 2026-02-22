export interface CreateAuditLogDTO {
  actorId: string;
  actorType: "USER" | "SYSTEM";
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
}

