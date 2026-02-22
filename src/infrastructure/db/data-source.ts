import "reflect-metadata";
import { DataSource } from "typeorm";
import { AuditLog } from "../../domain/AuditLog";

const isTest = process.env.NODE_ENV === "test";

export const AppDataSource = new DataSource({
  type: isTest ? "sqlite" : "postgres",
  database: isTest ? ":memory:" : process.env.POSTGRES_DB || "audit_db",
  host: isTest ? undefined : process.env.POSTGRES_HOST || "localhost",
  port: isTest ? undefined : Number(process.env.POSTGRES_PORT || 5432),
  username: isTest ? undefined : process.env.POSTGRES_USER || "postgres",
  password: isTest ? undefined : process.env.POSTGRES_PASSWORD || "postgres",
  synchronize: false,
  logging: false,
  entities: [AuditLog],
  migrations: [__dirname + "/migrations/*.{ts,js}"]
});

