import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { z } from "zod";

const ActorTypeEnum = z.enum(["USER", "SYSTEM"]);

const AuditLogCreateSchema = z.object({
  actorId: z.string().min(1),
  actorType: ActorTypeEnum,
  action: z.string().min(1),
  entityType: z.string().min(1),
  entityId: z.string().min(1),
  metadata: z.optional(z.record(z.any()))
});

@Entity({ name: "audit_logs" })
export class AuditLog {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  actorId!: string;

  @Column({ type: "varchar" })
  actorType!: "USER" | "SYSTEM";

  @Column({ type: "varchar" })
  action!: string;

  @Column({ type: "varchar" })
  entityType!: string;

  @Column({ type: "varchar" })
  entityId!: string;

  @Column({ type: "jsonb", nullable: true })
  metadata?: Record<string, unknown>;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  static create(input: unknown): AuditLog {
    const parsed = AuditLogCreateSchema.parse(input);
    const log = new AuditLog();
    log.actorId = parsed.actorId;
    log.actorType = parsed.actorType;
    log.action = parsed.action;
    log.entityType = parsed.entityType;
    log.entityId = parsed.entityId;
    log.metadata = parsed.metadata;
    return log;
  }
}

export type ActorType = z.infer<typeof ActorTypeEnum>;

