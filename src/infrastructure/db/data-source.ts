import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { AuditLog } from "../../domain/AuditLog";

const isTest = process.env.NODE_ENV === "test";

export const AppDataSource = new DataSource({
  type: "postgres",
  database: process.env.POSTGRES_DB || (isTest ? "audit_db_test" : "audit_db"),
  host: process.env.POSTGRES_HOST || "localhost",
  port: Number(process.env.POSTGRES_PORT || 5432),
  username: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "postgres",
  synchronize: false,
  logging: false,
  entities: [AuditLog],
  migrations: [__dirname + "/migrations/*.{ts,js}"]
});

