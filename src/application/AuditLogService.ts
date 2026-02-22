import { AuditLog } from "../domain/AuditLog";
import { AuditLogRepository } from "../domain/AuditLogRepository";
import { CreateAuditLogDTO } from "./dtos/CreateAuditLogDTO";

export class AuditLogService {
  constructor(private repo: AuditLogRepository) {}

  async create(dto: CreateAuditLogDTO): Promise<AuditLog> {
    const audit = AuditLog.create(dto);
    const saved = await this.repo.save(audit);
    return saved;
  }

  async list(filters: {
    actorId?: string;
    entityType?: string;
    entityId?: string;
    limit?: number;
    offset?: number;
  }) {
    return this.repo.find(filters);
  }
}

