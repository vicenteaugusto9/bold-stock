# Bold Stock Backend API

API backend para o sistema de gerenciamento de estoque e vendas, construída com **Express**, **TypeScript** e **Prisma ORM**.

## � Começar Rápido com Docker

**Recomendado!** Use Docker para desenvolvimento e produção:

```bash
# Inicie tudo com um comando
docker-compose up -d

# Execute as migrações
docker-compose exec api npm run migrate

# Acesse a API
curl http://localhost:3000/api/health
```

📖 Veja [DOCKER-QUICKSTART.md](DOCKER-QUICKSTART.md) para instruções rápidas.

📚 Veja [DOCKER.md](DOCKER.md) para documentação completa sobre Docker.

---

## �🚀 Configuração Inicial

### 1. Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure sua conexão com o banco de dados:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do banco de dados PostgreSQL:

```
DATABASE_URL="postgresql://username:password@localhost:5432/bold_stock"
PORT=3000
NODE_ENV=development
```

### 2. Instalação de Dependências

As dependências já foram instaladas automaticamente durante a configuração inicial.

### 3. Configurar Banco de Dados

#### Opção A: PostgreSQL Local

1. Instale PostgreSQL em sua máquina
2. Crie um banco de dados:
   ```bash
   createdb bold_stock
   ```
3. Configure a `DATABASE_URL` no `.env`

#### Opção B: PostgreSQL em Docker

```bash
docker run --name bold-stock-db \
  -e POSTGRES_DB=bold_stock \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:latest
```

#### Opção C: PostgreSQL Cloud (Supabase, Railway, etc.)

Gere uma conexão PostgreSQL em um serviço cloud e adicione à `DATABASE_URL`

### 4. Aplicar Migrações

```bash
npm run migrate
```

Isso vai executar as migrações do Prisma e criar as tabelas no banco de dados.

## 📁 Estrutura do Projeto

```
src/
├── server.ts           # Arquivo principal da aplicação
├── controllers/        # Controladores da API
├── services/          # Lógica de negócio
├── routes/            # Definição de rotas
├── middleware/        # Middlewares customizados
├── lib/               # Utilitários e configurações
│   └── prisma.ts      # Cliente Prisma
└── utils/             # Funções utilitárias

prisma/
├── schema.prisma      # Definição do modelo de dados
└── migrations/        # Histórico de migrações
```

## 🛠️ Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev                 # Inicia o servidor em modo desenvolvimento

# Build
npm run build              # Compila TypeScript para JavaScript

# Produção
npm start                  # Inicia o servidor compilado

# Banco de Dados
npm run migrate            # Executa migrações pendentes
npm run migrate:prod       # Executa migrações em produção
npm run prisma:generate    # Regenera cliente Prisma
npm run prisma:studio      # Abre Prisma Studio (GUI para BD)
```

## 📝 Definir Modelos no Prisma

Edite `prisma/schema.prisma` para adicionar seus modelos:

```prisma
model Product {
  id        Int      @id @default(autoincrement())
  name      String
  price     Float
  stock     Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Depois execute:
```bash
npm run migrate
```

## 🔌 Criar Rotas

1. Crie o controller em `src/controllers/`
2. Crie a rota em `src/routes/`
3. Importe em `src/server.ts`

Exemplo:

```typescript
// src/controllers/productController.ts
export const getProducts = async (req: Request, res: Response) => {
  const products = await prisma.product.findMany();
  res.json(products);
};

// src/routes/productRoutes.ts
import { Router } from 'express';
import { getProducts } from '../controllers/productController';

const router = Router();
router.get('/', getProducts);
export default router;

// src/server.ts
import productRoutes from './routes/productRoutes';
app.use('/api/products', productRoutes);
```

## 📚 Documentação

- [Express Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## ✅ Status

✨ Configuração inicial completa!

Próximos passos:
1. Configurar `.env` com suas credenciais de banco de dados
2. Executar `npm run migrate` para criar as tabelas
3. Começar a desenvolver seus modelos e rotas
