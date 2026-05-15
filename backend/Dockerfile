# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# ESSENCIAL: Gerar tipos e compilar ANTES de fechar este estágio
RUN npx prisma generate
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
# Omit dev dependencies para manter a imagem leve para sua PME
RUN npm ci --omit=dev

# Agora a pasta /app/dist existe e pode ser copiada
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/generated/prisma ./src/generated/prisma
COPY prisma ./prisma

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# CMD é sempre a última instrução
CMD ["npm", "start"]