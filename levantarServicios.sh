#!/bin/bash

echo "Iniciando Matrix OS - Terminal OS Environment..."
echo "=================================================="

# 1. Comprobar si Docker esta corriendo
if ! docker info > /dev/null 2>&1; then
    echo "[!] Docker no esta en ejecucion."
    echo "Intentando iniciar el servicio de Docker..."
    
    # Intento generico para distribuciones Linux basadas en systemd
    if command -v systemctl > /dev/null 2>&1; then
        sudo systemctl start docker
    # Intento para macOS si tiene Docker Desktop en Applications
    elif [ -d "/Applications/Docker.app" ]; then
        open /Applications/Docker.app
    else
        echo "[ERROR] No se pudo iniciar Docker automaticamente. Por favor inícialo manualmente."
        exit 1
    fi

    # Esperar a que levante
    echo "Esperando a que el motor de Docker inicie..."
    while ! docker info > /dev/null 2>&1; do
        sleep 3
    done
    
    echo "[OK] Docker iniciado correctamente."
else
    echo "[OK] El motor de Docker ya se encuentra en ejecucion."
fi

echo ""
echo "=================================================="
echo "[SISTEMA] Desplegando el Motherboard de la Matrix..."
docker-compose up -d --build

echo "=================================================="
echo "MATR1X OS STARTED."
echo "Frontend (Vite): http://localhost:3000"
echo "Backend (PHP API): http://localhost:8080"
echo "RabbitMQ UI: http://localhost:15672"
echo ""
echo "Puedes ingresar la red navegando a: http://localhost:3000"
