# 🚀 Docker Quick Start

Inicie a aplicação com Docker em 3 passos:

## 1️⃣ Inicie os Serviços

**Windows:**
```bash
manage-docker.bat start
```

**Linux/Mac:**
```bash
chmod +x manage-docker.sh
./manage-docker.sh start
```

**Ou com Docker Compose diretamente:**
```bash
docker-compose up -d
```

## 2️⃣ Execute Migrações

**Com script:**
```bash
manage-docker.bat migrate
```

**Ou com Docker Compose:**
```bash
docker-compose exec api npm run migrate
```

## 3️⃣ Acesse a API

✅ Health Check: http://localhost:3000/api/health

```bash
curl http://localhost:3000/api/health
```

Resposta esperada:
```json
{
  "status": "OK",
  "message": "API Health Check",
  "timestamp": "2026-05-15T10:30:45.123Z"
}
```

## 📊 Visualizar Banco de Dados

```bash
manage-docker.bat studio
```

Acesse: http://localhost:5555

## 📋 Comandos Úteis Rápidos

```bash
# Ver status
manage-docker.bat status

# Ver logs
manage-docker.bat logs

# Parar tudo
manage-docker.bat stop

# Limpar tudo
manage-docker.bat clean

# Terminal da API
manage-docker.bat shell-api

# Terminal do PostgreSQL
manage-docker.bat shell-db
```

## ✅ Pronto!

Sua API está rodando em Docker e pronta para desenvolvimento!

Próximo: Consulte [DOCKER.md](DOCKER.md) para mais informações detalhadas.
