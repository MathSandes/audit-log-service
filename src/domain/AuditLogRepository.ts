import { AuditLog } from "./AuditLog";

export interface AuditLogFilter {
  actorId?: string;
  entityType?: string;
  entityId?: string;
  limit?: number;
  offset?: number;
}

export interface AuditLogRepository {
  save(auditLog: AuditLog): Promise<AuditLog>;
  find(filters: AuditLogFilter): Promise<{ items: AuditLog[]; total: number }>;
  findById(id: string): Promise<AuditLog | null>;
}

