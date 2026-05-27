# � Flow ERP

[![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.x-2b90d9)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)
[![Jest](https://img.shields.io/badge/Jest-30.x-cyan)](https://jestjs.io/)
[![Docker](https://img.shields.io/badge/Docker-Yes-2496ed)](https://www.docker.com/)

## Sobre o projeto

Flow ERP é um ERP para pequenas e médias empresas (PME) focado em controle de estoque e vendas. A solução possui backend construído com **Node.js**, **TypeScript**, **Express** e **Prisma ORM**, utilizando **PostgreSQL** como banco de dados.

## Módulos implementados

- **Auth**: autenticação JWT com bcrypt, middleware de roles (ADMIN, VENDEDOR, ESTOQUISTA)
- **Users**: CRUD completo com proteção de roles, hash de senha no update e proteção do último ADMIN
- **Categories**: CRUD com proteção contra exclusão de categoria com produtos vinculados
- **Products**: CRUD com soft delete (deactivate), estoque inicial na criação, preço de custo e venda, SKU único
- **Customers**: CRUD com soft delete, validação matemática de CPF e CNPJ, proteção contra exclusão com vendas vinculadas
- **Stock**: controle de estoque com soft lock (reserve/release), entrada, saída, ajuste manual, alerta de estoque baixo e histórico de movimentações
- **Sales**: criação de pedido com múltiplos itens, reserva de estoque, confirmação de pagamento, cancelamento com liberação de estoque, correlationId para rastreamento
- **Payments**: processamento de pagamento com idempotency key, estorno com devolução ao estoque
- **AuditLog**: rastreamento de todas as operações com correlationId, listagem por usuário e por operação

## Stack

- Runtime: **Node.js**
- Linguagem: **TypeScript**
- Framework: **Express**
- ORM: **Prisma v7**
- Banco de dados: **PostgreSQL**
- Autenticação: **JWT** (`jsonwebtoken`)
- Hash de senha: **bcrypt**
- Testes: **Jest**, **ts-jest**, **jest-mock-extended**
- Documentação: **Swagger** (`swagger-ui-express`, `swagger-jsdoc`)
- Container: **Docker**

## Arquitetura

Padrão **Route → Controller → Service → Prisma → PostgreSQL**

- `routes/`: definição das rotas com middlewares de autenticação e autorização por role
- `controllers/`: recebe a requisição HTTP, valida entrada básica e chama o service
- `services/`: lógica de negócio, validações e transações
- `middleware/`: `isAuthenticated` (JWT) e `isAuthorized` (roles)
- `shared/errors.ts`: classe `AppError` com `statusCode` para padronizar erros HTTP
- `shared/validators.ts`: validação matemática de CPF e CNPJ (algoritmo Receita Federal)
- `lib/prisma.ts`: instância global de `PrismaClient` com adapter `PrismaPg`
- `docs/`: `swagger.ts` + arquivos YML por módulo

## Fluxo principal de venda

1. `POST /sales` → valida cliente, usuário e estoque → cria venda → reserva estoque (soft lock) → gera `correlationId`
2. `PATCH /sales/:id/payment` → confirma pagamento com idempotency key → baixa definitiva no estoque → registra no AuditLog
3. `PATCH /sales/:id/cancel` → cancela venda → libera estoque reservado → registra no AuditLog
4. `PATCH /payments/:id/refund` → estorna pagamento → devolve ao estoque → registra no AuditLog

## Rotas disponíveis

Todas as rotas têm prefixo `/api/v1`

- **Auth**: `POST /sessions`
- **Users**: `GET /users`, `POST /users`, `PUT /users/:id`, `DELETE /users/:id`
- **Me**: `GET /me`
- **Categories**: `GET /categories`, `POST /categories`, `PUT /categories/:id`, `DELETE /categories/:id`
- **Products**: `GET /products`, `GET /products/:id`, `POST /products`, `PUT /products/:id`, `PATCH /products/:id/deactivate`
- **Customers**: `GET /customers`, `GET /customers/:id`, `POST /customers`, `PUT /customers/:id`, `PATCH /customers/:id/deactivate`
- **Stock**: `GET /stock/:productId`, `GET /stock/:productId/movements`, `GET /stock/low`, `POST /stock/entry`, `POST /stock/adjustment`
- **Sales**: `GET /sales`, `GET /sales/:id`, `POST /sales`, `PATCH /sales/:id/payment`, `PATCH /sales/:id/cancel`
- **Payments**: `GET /payments`, `GET /payments/:id`, `POST /payments`, `PATCH /payments/:id/refund`
- **Audit**: `GET /audit`, `GET /audit/user/:userId`, `GET /audit/correlation/:correlationId`
- **Docs**: `GET /api/v1/docs` (Swagger UI)

## Variáveis de ambiente necessárias

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/bold_stock"
PORT=3000
NODE_ENV=development
JWT_SECRET="sua_chave_secreta"
```

## Scripts disponíveis

```bash
npm run dev          # inicia em modo desenvolvimento
npm run build        # compila TypeScript
npm test             # roda os testes
npm run test:coverage # testa com relatório de cobertura
```

## Estrutura de pastas

```text
backend/
├── prisma/
│   └── schema.prisma
└── src/
    ├── controllers/
    ├── services/
    ├── routes/
    ├── middleware/
    ├── shared/
    ├── lib/
    ├── docs/
    ├── __tests__/
    └── server.ts
```

## Modelos do banco de dados

- `User`
- `Customer`
- `Category`
- `Product`
- `Stock`
- `StockMovement`
- `Sale`
- `SaleItem`
- `Payment`
- `AuditLog`

## Enums

- `Role`: `ADMIN`, `VENDEDOR`, `ESTOQUISTA`
- `SaleStatus`: `PENDING`, `CONFIRMED`, `CANCELLED`
- `PaymentMethod`: `PIX`, `CARD`, `CASH`
- `PaymentStatus`: `PENDING`, `CONFIRMED`, `FAILED`, `REFUNDED`
- `MovementType`: `ENTRY`, `EXIT`, `RESERVE`, `RELEASE`, `ADJUSTMENT`

## Proteção por roles

- **ADMIN**: acesso total
- **VENDEDOR**: clientes, leitura de produtos, vendas e fiscal
- **ESTOQUISTA**: produtos, estoque e categorias

## Testes

- Framework: **Jest** com **ts-jest**
- Mock: **jest-mock-extended** para simular Prisma sem banco real
- Cobertura: **85%** geral
- Casos: **91 testes** no total
- Arquivos: `src/__tests__/` com um arquivo por módulo

## Documentação Swagger

A documentação da API está disponível em:

- `GET /api/v1/docs`

---

## Observações

- Configure o `.env` antes de iniciar o servidor
- Execute `npm run migrate` após configurar o banco
- Use o Swagger para explorar os endpoints e testar a API

> ⚠️ Projeto em desenvolvimento. Novas funcionalidades estão previstas para futuras versões.

---

Produced by **Zenith Software** - **Gomezz.Dev**
