## audit-log-service

Service de audit log em Node.js + TypeScript usando Fastify, TypeORM e Postgres, organizado em camadas (domain / application / infrastructure / http) com foco em simplicidade e portfólio.

### Stack

- **Node.js + TypeScript**
- **Fastify**
- **TypeORM + Postgres (JSONB)**
- **Zod** (validação)
- **Vitest** (testes)
- **Docker / Docker Compose**
- **GitHub Actions (CI)**

### Arquitetura (resumo)

- **`src/domain`**
  - `AuditLog.ts`: entidade rica de domínio + entidade TypeORM (uma classe só).
  - `AuditLogRepository.ts`: contrato do repositório.
- **`src/application`**
  - `AuditLogService.ts`: regras de criação e listagem com filtros/paginação.
  - `dtos/`: DTOs de criação (`CreateAuditLogDTO`) e filtro (`AuditLogFilter`).
- **`src/infrastructure`**
  - `db/`
    - `data-source.ts`: configuração do TypeORM para Postgres.
    - `migrations/1670000000000-CreateAuditLogsTable.ts`: criação da tabela `audit_logs`, índices e `pgcrypto`.
  - `repositories/TypeORMAuditLogRepository.ts`: implementação do `AuditLogRepository` com filtros e paginação.
- **`src/http`**
  - `server.ts`: bootstrap do Fastify.
  - `routes.ts`: rotas HTTP da API (`POST`/`GET /audit-logs`).

### Como rodar localmente

**Pré‑requisitos:**

- **Docker + Docker Compose**
- **Node.js 20+**

```bash
# clonar o repositório
git clone https://github.com/MathSandes/audit-log-service.git
cd audit-log-service

# subir Postgres
docker-compose up -d db

# instalar dependências
npm ci

# rodar migrations (cria tabela audit_logs, índices e extensão)
npm run migrate:run

# subir o servidor em desenvolvimento
npm run dev  # API disponível em http://localhost:3000
```

### Variáveis de ambiente

O projeto usa `.env` (veja `.env.example`):

- **`POSTGRES_HOST`** (default: `localhost`)
- **`POSTGRES_PORT`** (default: `5432`)
- **`POSTGRES_USER`** (default: `postgres`)
- **`POSTGRES_PASSWORD`** (default: `postgres`)
- **`POSTGRES_DB`** (default: `audit_db`)
- **`PORT`** (default: `3000`)
- **`NODE_ENV`** (default: `development`)

### Endpoints

#### POST /audit-logs

Cria um audit log.

**Request body:**

```json
{
  "actorId": "user-1",
  "actorType": "USER",
  "action": "CREATE",
  "entityType": "TRANSACTION",
  "entityId": "tx-1",
  "metadata": { "amount": 100 }
}
```

**Resposta `201`:**

```json
{
  "id": "uuid-gerado",
  "actorId": "user-1",
  "actorType": "USER",
  "action": "CREATE",
  "entityType": "TRANSACTION",
  "entityId": "tx-1",
  "metadata": { "amount": 100 },
  "createdAt": "2026-02-23T20:20:00.000Z"
}
```

#### GET /audit-logs

Lista logs com filtros e paginação.

**Query params:**

- `actorId?`
- `entityType?`
- `entityId?`
- `limit?` (default `100`, máximo `100`)
- `offset?` (default `0`)

**Exemplo:**

```bash
GET /audit-logs?actorId=user-1&entityType=TRANSACTION&entityId=tx-1&limit=10&offset=0
```

**Resposta `200`:**

```json
{
  "items": [
    {
      "id": "uuid-gerado",
      "actorId": "user-1",
      "actorType": "USER",
      "action": "CREATE",
      "entityType": "TRANSACTION",
      "entityId": "tx-1",
      "metadata": { "amount": 100 },
      "createdAt": "2026-02-23T20:20:00.000Z"
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0
}
```

### Testes

Rodar testes localmente:

```bash
# todos os testes (unitário + integração)
npm test

# apenas teste unitário de domínio
npm test -- tests/unit/AuditLog.spec.ts
```

- Testes usam **Vitest**.
- Teste unitário valida a factory da entidade `AuditLog`.
- Teste de integração usa **fastify.inject()** para chamar `POST /audit-logs` e `GET /audit-logs`.

No CI (GitHub Actions):

- Workflow `CI`:
  - sobe Postgres em serviço,
  - roda `npm ci` e `npm run migrate:run`,
  - executa o teste unitário de domínio (`AuditLog.spec.ts`).

### Decisões de design

- **Entidade única para domínio + TypeORM**: `AuditLog` serve tanto como entidade rica quanto como entidade de persistência (decorators), simplificando o MVP.
- **Migrations em vez de `synchronize: true`**: banco gerenciado via migrations (`synchronize: false`), mais próximo de ambiente real.
- **Validação com Zod**: usada na factory da entidade e nos DTOs da camada HTTP.
- **Paginação simples**: `limit/offset` com limite máximo de 100 por página.

