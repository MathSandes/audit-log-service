import { AppDataSource } from "../db/data-source";
import { AuditLog } from "../../domain/AuditLog";
import { AuditLogRepository } from "../../domain/AuditLogRepository";
import { Repository } from "typeorm";

export class TypeORMAuditLogRepository implements AuditLogRepository {
  private repo: Repository<AuditLog>;

  constructor() {
    this.repo = AppDataSource.getRepository(AuditLog);
  }

  async save(auditLog: AuditLog): Promise<AuditLog> {
    return this.repo.save(auditLog);
  }

  async find(filters: any): Promise<{ items: AuditLog[]; total: number }> {
    const qb = this.repo.createQueryBuilder("audit");

    if (filters.actorId) {
      qb.andWhere("audit.actorId = :actorId", { actorId: filters.actorId });
    }
    if (filters.entityType) {
      qb.andWhere("audit.entityType = :entityType", { entityType: filters.entityType });
    }
    if (filters.entityId) {
      qb.andWhere("audit.entityId = :entityId", { entityId: filters.entityId });
    }

    const limit = Math.min(Number(filters.limit || 100), 100);
    const offset = Number(filters.offset || 0);

    qb.orderBy("audit.createdAt", "DESC").limit(limit).offset(offset);

    const [items, total] = await qb.getManyAndCount();
    return { items, total };
  }

  async findById(id: string): Promise<AuditLog | null> {
    return this.repo.findOneBy({ id });
  }
}

