import { FastifyInstance } from "fastify";
import { z } from "zod";
import { AuditLogService } from "../application/AuditLogService";
import { TypeORMAuditLogRepository } from "../infrastructure/repositories/TypeORMAuditLogRepository";

export async function registerRoutes(fastify: FastifyInstance) {
  const repo = new TypeORMAuditLogRepository();
  const service = new AuditLogService(repo);

  const createBody = z.object({
    actorId: z.string(),
    actorType: z.enum(["USER", "SYSTEM"]),
    action: z.string(),
    entityType: z.string(),
    entityId: z.string(),
    metadata: z.optional(z.record(z.any()))
  });

  fastify.post("/audit-logs", async (request, reply) => {
    const dto = createBody.parse(request.body);
    const created = await service.create(dto);
    return reply.code(201).send(created);
  });

  const querySchema = z.object({
    actorId: z.optional(z.string()),
    entityType: z.optional(z.string()),
    entityId: z.optional(z.string()),
    limit: z.optional(z.preprocess((v) => Number(v), z.number().int().positive())),
    offset: z.optional(z.preprocess((v) => Number(v), z.number().int().min(0)))
  });

  fastify.get("/audit-logs", async (request, reply) => {
    const q = querySchema.parse(request.query);
    const result = await service.list(q);
    return reply.send({
      items: result.items,
      total: result.total,
      limit: q.limit ?? 100,
      offset: q.offset ?? 0
    });
  });
}

