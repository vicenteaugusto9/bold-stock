# ==========================================
# Estágio 1: Build e Compilação
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Gera os tipos do Prisma e compila o TypeScript para JavaScript
RUN npx prisma generate
RUN npm run build

# ==========================================
# Estágio 2: Ambiente de Execução (Runtime)
# ==========================================
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
# Instala apenas as dependências de produção para manter a imagem leve
RUN npm ci --omit=dev

# CORREÇÃO CRÍTICA: Traz a pasta dist compilação do Estágio 1
COPY --from=builder /app/dist ./dist

# Traz os artefatos e clientes gerados pelo Prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY prisma ./prisma

# Porta interna que a aplicação vai rodar dentro do container
EXPOSE 3333

# Monitoramento de saúde do container
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3333/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Comando padrão para iniciar a aplicação
CMD ["npm", "start"]