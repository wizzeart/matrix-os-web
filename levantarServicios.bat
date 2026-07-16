@echo off
echo Iniciando Matrix OS - Terminal OS Environment...
echo ==================================================
docker-compose up -d --build
echo ==================================================
echo MATR1X OS STARTED.
echo Frontend (Vite): http://localhost:3000
echo Backend (PHP API): http://localhost:8080
echo RabbitMQ UI: http://localhost:15672
pause
