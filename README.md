# MATRIX OS - NEXT GENERATION SOCIAL NETWORK

Bienvenido a la red social del futuro, diseñada exclusivamente para la élite técnica: programadores, hackers éticos, ingenieros y arquitectos de sistemas.

![Matrix OS](https://img.shields.io/badge/Matrix-OS-green?style=for-the-badge)
![PHP](https://img.shields.io/badge/PHP-8.3+-777BB4?style=for-the-badge&logo=php)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2026+-F7DF1E?style=for-the-badge&logo=javascript)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker)

## 🎯 Filosofía

No es una página web. Es un **Sistema Operativo Social** inmersivo estilo Cyberpunk/Matrix.
La interfaz principal es una **Terminal** que permite controlar todos los aspectos del sistema de 3 formas:

1. **Terminal** (CLI web interactiva)
2. **Interfaz visual** (ventanas, paneles, gráficos WebGL)
3. **Agente IA** (Copiloto integrado capaz de ejecutar comandos por ti basándose en contexto)

## 🏗️ Arquitectura

### Frontend
- **Vite** - Build tool y dev server
- **JavaScript ES2026+** - Últimas características del lenguaje
- **Canvas API & WebGL** - Efectos visuales Matrix, Glitch, CRT
- **Web Workers** - Procesamiento en paralelo
- **Service Workers** - Soporte offline
- **Web Components** - Arquitectura modular de componentes
- **Three.js** - Gráficos 3D y shaders

### Backend (DDD / CQRS / Hexagonal)
- **PHP 8.3+** - Clean Architecture
- **MariaDB 10.11** - Base de datos relacional
- **Redis** - Caché y colas en memoria
- **RabbitMQ** - Event bus y messaging
- **Ratchet** - WebSocket server para tiempo real
- **Nginx** - Reverse proxy y servidor web
- **Docker Compose** - Orquestación de contenedores

## 🚀 Quick Start

### Requisitos Previos
- Docker Desktop instalado y corriendo
- Docker Compose v2+
- Git

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/wizzeart/matrix-os-web.git
cd matrix-os-web
```

2. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

3. **Levantar servicios**

**En Windows:**
```cmd
levantarServicios.bat
```

**En Linux / Mac:**
```bash
chmod +x levantarServicios.sh
./levantarServicios.sh
```

## 🌐 Servicios Expuestos

- **Frontend OS**: `http://localhost:3000`
- **Backend API**: `http://localhost:8080`
- **WebSocket Server**: `ws://localhost:8081`
- **RabbitMQ Dashboard**: `http://localhost:15672` (matrix/matrix_password)
- **MariaDB**: `localhost:3306`
- **Redis**: `localhost:6379`

## 📁 Estructura del Proyecto

```
matrix-os-web/
├── backend/                 # Backend PHP (DDD/CQRS)
│   ├── src/
│   │   ├── Core/          # Core del sistema
│   │   └── Modules/       # Módulos de dominio
│   ├── bin/               # Scripts y workers
│   └── public/            # Entry point
├── frontend/              # Frontend JavaScript
│   ├── src/
│   │   ├── Components/   # Web Components
│   │   ├── Core/          # OS y WebSocket
│   │   ├── Graphics/      # WebGL y Shaders
│   │   └── Workers/       # Web Workers
│   └── public/            # Assets estáticos
├── docker/                # Configuraciones Docker
├── matrix-cli/           # CLI tool
└── docker-compose.yml    # Orquestación
```

## 🔒 Seguridad

- **Variables de entorno**: Nunca commitees `.env` files
- **Credenciales por defecto**: Cambiar en producción
- **CORS**: Configurar properly para producción
- **Autenticación**: Implementar JWT/OAuth2
- **HTTPS**: Usar SSL/TLS en producción

## 🛠️ Desarrollo

### Git Flujo de Trabajo (Atomic Commits)

Usa los scripts `push.bat` (Windows) o `push.sh` (Linux) para commits rápidos:
```cmd
push.bat "feat: implementado parser hexadecimal visual"
```

### Convención de Commits

- `feat:` Nueva funcionalidad
- `fix:` Bug fix
- `refactor:` Refactorización
- `chore:` Tareas de mantenimiento
- `docs:` Documentación
- `test:` Tests

### Testing

```bash
# Validar sintaxis PHP
php -l backend/public/index.php

# Validar sintaxis JavaScript
node --check frontend/src/main.js

# Validar configuración Docker
docker-compose config
```

## 📚 Módulos del Sistema

### Auth Module
- Autenticación de usuarios
- Gestión de sesiones
- Switch entre shells

### Terminal Module
- Comandos CLI interactivos
- Historial de comandos
- Integración WebSocket

### Channel Module
- Canales de comunicación
- Anotación de snippets
- Laboratorios efímeros

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'feat: Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autor

**wizzeart** - [GitHub](https://github.com/wizzeart)

## 🙏 Agradecimientos

- Comunidad de PHP
- Comunidad de JavaScript
- Proyectos open source que inspiraron este sistema
