# MATRIX OS - NEXT GENERATION SOCIAL NETWORK

Bienvenido a la red social del futuro, diseñada exclusivamente para la élite técnica: programadores, hackers éticos, ingenieros y arquitectos de sistemas.

## Filosofía
No es una página web. Es un Sistema Operativo Social inmersivo estilo Cyberpunk/Matrix.
La interfaz principal es una **Terminal** que permite controlar todos los aspectos del sistema de 3 formas:
1. Terminal (CLI web interactiva)
2. Interfaz visual (ventanas, paneles, gráficos WebGL)
3. Agente IA (Copiloto integrado capaz de ejecutar comandos por ti basándose en contexto)

## Stack Tecnológico

**Frontend**:
- Vite, JavaScript (ES2026+), CSS Layers
- Canvas API, WebGL, Shaders (Efectos Matrix, Glitch, CRT)
- Web Workers & Service Workers

**Backend (Modular / DDD / CQRS)**:
- PHP 8.4+ (Clean Architecture, Hexagonal)
- MariaDB (Relacional)
- Redis (Caché y colas en memoria)
- RabbitMQ (Events y Messaging)
- Docker & Nginx

## Levantar el entorno local

Se ha diseñado un entorno Dockerizado completamente funcional.
Para levantar todo el ecosistema (Frontend, Backend, DB, Colas):

### En Windows
Ejecuta el archivo batch en la raíz:
```cmd
levantarServicios.bat
```

### En Linux / Mac
```bash
chmod +x levantarServicios.sh
./levantarServicios.sh
```

## Servicios Expuestos
- **Frontend OS**: `http://localhost:3000`
- **Backend API**: `http://localhost:8080`
- **RabbitMQ Dashboard**: `http://localhost:15672` (matrix/matrix_password)

## Git Flujo de Trabajo (Atomic Commits)
Usa los scripts `push.bat` (Windows) o `push.sh` (Linux) para realizar commits rápidos automatizados:
```cmd
push.bat "feat: implementado parser hexadecimal visual"
```
