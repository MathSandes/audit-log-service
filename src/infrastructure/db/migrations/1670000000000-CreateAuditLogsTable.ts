import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateAuditLogsTable1670000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "audit_logs",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isNullable: false,
            default: "gen_random_uuid()"
          },
          { name: "actorId", type: "varchar", isNullable: false },
          { name: "actorType", type: "varchar", isNullable: false },
          { name: "action", type: "varchar", isNullable: false },
          { name: "entityType", type: "varchar", isNullable: false },
          { name: "entityId", type: "varchar", isNullable: false },
          { name: "metadata", type: "jsonb", isNullable: true },
          { name: "createdAt", type: "timestamptz", isNullable: false, default: "now()" }
        ]
      }),
      true
    );

    await queryRunner.createIndex(
      "audit_logs",
      new TableIndex({
        name: "IDX_audit_logs_entityType_entityId",
        columnNames: ["entityType", "entityId"]
      })
    );

    await queryRunner.createIndex(
      "audit_logs",
      new TableIndex({
        name: "IDX_audit_logs_actorId",
        columnNames: ["actorId"]
      })
    );

    await queryRunner.createIndex(
      "audit_logs",
      new TableIndex({
        name: "IDX_audit_logs_createdAt",
        columnNames: ["createdAt"]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("audit_logs", true);
  }
}

