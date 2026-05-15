#!/bin/bash

# Script para gerenciar Docker Compose com facilidade

if [ -z "$1" ]; then
    cat <<EOF

========================================
  Bold Stock Backend - Docker Manager
========================================

Uso: ./manage-docker.sh [comando]

Comandos disponíveis:
  start           - Inicia todos os serviços
  stop            - Para todos os serviços
  restart         - Reinicia todos os serviços
  rebuild         - Reconstrói imagens e inicia
  logs            - Mostra logs em tempo real
  migrate         - Executa migração do Prisma
  studio          - Inicia Prisma Studio
  shell-api       - Acessa terminal da API
  shell-db        - Acessa terminal do PostgreSQL
  status          - Mostra status dos containers
  clean           - Para e remove todos os containers/volumes

EOF
    exit 0
fi

case "$1" in
    start)
        echo "[*] Iniciando serviços..."
        docker-compose up -d
        echo "[+] Serviços iniciados!"
        sleep 3
        docker-compose ps
        ;;
    stop)
        echo "[*] Parando serviços..."
        docker-compose down
        echo "[+] Serviços parados!"
        ;;
    restart)
        echo "[*] Reiniciando serviços..."
        docker-compose restart
        echo "[+] Serviços reiniciados!"
        ;;
    rebuild)
        echo "[*] Reconstruindo imagens..."
        docker-compose up -d --build
        echo "[+] Imagens reconstruídas e serviços iniciados!"
        ;;
    logs)
        echo "[*] Mostrando logs (Ctrl+C para sair)..."
        docker-compose logs -f
        ;;
    migrate)
        echo "[*] Executando migração..."
        docker-compose exec api npm run migrate
        ;;
    studio)
        echo "[*] Iniciando Prisma Studio..."
        docker-compose --profile studio up -d prisma-studio
        echo "[+] Prisma Studio iniciado em http://localhost:5555"
        ;;
    shell-api)
        echo "[*] Acessando terminal da API..."
        docker-compose exec api sh
        ;;
    shell-db)
        echo "[*] Acessando terminal do PostgreSQL..."
        docker-compose exec db psql -U postgres -d bold_stock
        ;;
    status)
        echo "[*] Status dos containers:"
        docker-compose ps
        ;;
    clean)
        echo "[*] Limpando containers e volumes..."
        docker-compose down -v
        echo "[+] Limpeza concluída!"
        ;;
    *)
        echo "Comando não reconhecido: $1"
        echo "Execute: ./manage-docker.sh"
        exit 1
        ;;
esac
