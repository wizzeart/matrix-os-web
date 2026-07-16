@echo off
setlocal

echo Iniciando Matrix OS - Terminal OS Environment...
echo ==================================================

:: 1. Comprobar si Docker esta corriendo
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Docker no esta en ejecucion.
    echo Intentando iniciar Docker Desktop...
    
    if exist "C:\Program Files\Docker\Docker\Docker Desktop.exe" (
        start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    ) else (
        echo [ERROR] No se pudo encontrar Docker Desktop en la ruta por defecto.
        echo Por favor inicia Docker manualmente y vuelve a ejecutar este script.
        pause
        exit /b 1
    )

    :: Esperar hasta que Docker levante
    echo Esperando a que el motor de Docker inicie (esto puede tomar un minuto)...
    :waitForDocker
    timeout /t 5 /nobreak >nul
    docker info >nul 2>&1
    if %errorlevel% neq 0 goto waitForDocker
    
    echo [OK] Docker iniciado correctamente.
) else (
    echo [OK] El motor de Docker ya se encuentra en ejecucion.
)

echo.
echo ==================================================
echo [SISTEMA] Desplegando el Motherboard de la Matrix...
docker-compose up -d --build

echo ==================================================
echo MATR1X OS STARTED.
echo Frontend (Vite): http://localhost:3000
echo Backend (PHP API): http://localhost:8080
echo RabbitMQ UI: http://localhost:15672
echo.
echo Puedes ingresar la red navegando a: http://localhost:3000
echo.
pause
