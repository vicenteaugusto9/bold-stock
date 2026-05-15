@echo off
REM Script para gerenciar Docker Compose com facilidade

setlocal enabledelayedexpansion

if "%1%"=="" (
    echo.
    echo ========================================
    echo   Bold Stock Backend - Docker Manager
    echo ========================================
    echo.
    echo Uso: manage-docker.bat [comando]
    echo.
    echo Comandos disponiveis:
    echo   start           - Inicia todos os servicos
    echo   stop            - Para todos os servicos
    echo   restart         - Reinicia todos os servicos
    echo   rebuild         - Reconstroi imagens e inicia
    echo   logs            - Mostra logs em tempo real
    echo   migrate         - Executa migracao do Prisma
    echo   studio          - Inicia Prisma Studio
    echo   shell-api       - Acessa terminal da API
    echo   shell-db        - Acessa terminal do PostgreSQL
    echo   status          - Mostra status dos containers
    echo   clean           - Para e remove todos os containers/volumes
    echo.
    goto end
)

if "%1%"=="start" (
    echo [*] Iniciando servicos...
    docker-compose up -d
    echo [+] Servicos iniciados!
    timeout /t 3
    docker-compose ps
    goto end
)

if "%1%"=="stop" (
    echo [*] Parando servicos...
    docker-compose down
    echo [+] Servicos parados!
    goto end
)

if "%1%"=="restart" (
    echo [*] Reiniciando servicos...
    docker-compose restart
    echo [+] Servicos reiniciados!
    goto end
)

if "%1%"=="rebuild" (
    echo [*] Reconstrindo imagens...
    docker-compose up -d --build
    echo [+] Imagens reconstruidas e servicos iniciados!
    goto end
)

if "%1%"=="logs" (
    echo [*] Mostrando logs (Ctrl+C para sair)...
    docker-compose logs -f
    goto end
)

if "%1%"=="migrate" (
    echo [*] Executando migracao...
    docker-compose exec api npm run migrate
    goto end
)

if "%1%"=="studio" (
    echo [*] Iniciando Prisma Studio...
    docker-compose --profile studio up -d prisma-studio
    echo [+] Prisma Studio iniciado em http://localhost:5555
    goto end
)

if "%1%"=="shell-api" (
    echo [*] Acessando terminal da API...
    docker-compose exec api sh
    goto end
)

if "%1%"=="shell-db" (
    echo [*] Acessando terminal do PostgreSQL...
    docker-compose exec db psql -U postgres -d bold_stock
    goto end
)

if "%1%"=="status" (
    echo [*] Status dos containers:
    docker-compose ps
    goto end
)

if "%1%"=="clean" (
    echo [*] Limpando containers e volumes...
    docker-compose down -v
    echo [+] Limpeza concluida!
    goto end
)

echo Comando nao reconhecido: %1%
echo Execute: manage-docker.bat
goto end

:end
endlocal
