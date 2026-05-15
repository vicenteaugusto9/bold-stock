# 🐳 Guia de Configuração com Docker

Este guia descreve como configurar e rodar a aplicação usando Docker.

## 📋 Pré-requisitos

- [Docker](https://www.docker.com/products/docker-desktop) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado

Verifique a instalação:
```bash
docker --version
docker-compose --version
```

## 🚀 Iniciar a Aplicação com Docker

### 1. Preparar Arquivo de Ambiente

Copie as variáveis de ambiente para Docker:

```bash
cp .env.docker .env.local.docker
```

Edite se necessário (geralmente não é):
```bash
cat .env.docker
```

### 2. Iniciar os Serviços

```bash
docker-compose up -d
```

Ou com rebuild da imagem:
```bash
docker-compose up -d --build
```

### 3. Aguarde os Serviços Iniciarem

Verifique o status:
```bash
docker-compose ps
```

Esperado:
- ✅ `bold-stock-db` - Rodando (PostgreSQL)
- ✅ `bold-stock-api` - Rodando (Express API)

### 4. Executar Migrações

Após o banco de dados estar pronto, execute as migrações:

```bash
docker-compose exec api npm run migrate
```

Ou se quiser usar Prisma Studio:

```bash
docker-compose exec api npx prisma studio
```

## 🔍 Visualizar Dados com Prisma Studio

Inicie o Prisma Studio separadamente:

```bash
docker-compose --profile studio up -d prisma-studio
```

Acesse em: http://localhost:5555

## 📊 Verificar Logs

Ver logs de todos os serviços:
```bash
docker-compose logs -f
```

Ver logs apenas da API:
```bash
docker-compose logs -f api
```

Ver logs apenas do banco de dados:
```bash
docker-compose logs -f db
```

## ⚙️ Comandos Úteis

### Parar os Serviços
```bash
docker-compose down
```

### Parar e Remover Volumes (limpar dados)
```bash
docker-compose down -v
```

### Reiniciar um Serviço
```bash
docker-compose restart api
```

### Executar Comando na API
```bash
docker-compose exec api npm run <comando>
```

Exemplos:
```bash
docker-compose exec api npm run build
docker-compose exec api npx prisma generate
docker-compose exec api npm run prisma:studio
```

### Acessar Terminal do Container
```bash
docker-compose exec api sh
```

### Acessar Terminal do PostgreSQL
```bash
docker-compose exec db psql -U postgres -d bold_stock
```

## 🌐 Endpoints Disponíveis

- **Health Check**: http://localhost:3000/api/health
- **Prisma Studio**: http://localhost:5555 (quando ativo com `--profile studio`)

## 🗄️ Backup e Restore do Banco de Dados

### Fazer Backup
```bash
docker-compose exec -T db pg_dump -U postgres bold_stock > backup.sql
```

### Restaurar Backup
```bash
docker-compose exec -T db psql -U postgres bold_stock < backup.sql
```

## 🐛 Troubleshooting

### Porta já está em uso
Se a porta 3000 ou 5432 está em uso:

Edite `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Mude a porta externa
```

### Banco de dados não inicia
Verifique permissões:
```bash
docker-compose logs db
```

Limpe e recrie:
```bash
docker-compose down -v
docker-compose up -d
```

### Migrações falhando
Verifique a conexão do banco:
```bash
docker-compose exec api npx prisma db push
```

## 📝 Estrutura de Variáveis de Ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `POSTGRES_DB` | `bold_stock` | Nome do banco de dados |
| `POSTGRES_USER` | `postgres` | Usuário do PostgreSQL |
| `POSTGRES_PASSWORD` | `postgres` | Senha do PostgreSQL |
| `DB_PORT` | `5432` | Porta do PostgreSQL |
| `PORT` | `3000` | Porta da API |
| `NODE_ENV` | `development` | Ambiente |
| `DATABASE_URL` | - | URL de conexão Prisma |

## ✅ Próximos Passos

1. ✅ Docker configurado
2. ⏭️ Execute: `docker-compose up -d`
3. ⏭️ Execute: `docker-compose exec api npm run migrate`
4. ⏭️ Comece a desenvolver!

## 📚 Referências

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Node Docker Image](https://hub.docker.com/_/node)
