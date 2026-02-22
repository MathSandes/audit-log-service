import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

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

  @Column()
  actorId!: string;

  @Column()
  actorType!: "USER" | "SYSTEM";

  @Column()
  action!: string;

  @Column()
  entityType!: string;

  @Column()
  entityId!: string;

  @Column({ type: "jsonb", nullable: true })
  metadata?: Record<string, unknown>;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  private constructor(props: {
    id?: string;
    actorId: string;
    actorType: "USER" | "SYSTEM";
    action: string;
    entityType: string;
    entityId: string;
    metadata?: Record<string, unknown>;
  }) {
    if (props.id) this.id = props.id;
    this.actorId = props.actorId;
    this.actorType = props.actorType;
    this.action = props.action;
    this.entityType = props.entityType;
    this.entityId = props.entityId;
    this.metadata = props.metadata;
  }

  static create(input: unknown): AuditLog {
    const parsed = AuditLogCreateSchema.parse(input);
    const id = uuidv4();
    return new AuditLog({
      id,
      actorId: parsed.actorId,
      actorType: parsed.actorType,
      action: parsed.action,
      entityType: parsed.entityType,
      entityId: parsed.entityId,
      metadata: parsed.metadata
    });
  }
}

export type ActorType = z.infer<typeof ActorTypeEnum>;

