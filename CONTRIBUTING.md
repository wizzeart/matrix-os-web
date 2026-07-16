# Contributing to Matrix OS

¡Gracias por tu interés en contribuir a Matrix OS! Este documento te guiará a través del proceso de contribución.

## 📋 Código de Conducta

- Ser respetuoso e inclusivo
- Fomentar un ambiente colaborativo
- Aceptar críticas constructivas
- Enfocarse en lo que es mejor para la comunidad

## 🚀 Cómo Contribuir

### Reportar Bugs

Antes de reportar un bug, por favor:

1. Busca issues existentes
2. Verifica si el bug ya fue reportado
3. Usa las plantillas de issue cuando reportes

### Sugerir Features

1. Discute la feature en un issue primero
2. Explica el caso de uso claramente
3. Considera el impacto en la arquitectura

### Pull Requests

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'feat: add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📝 Convención de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types:
- `feat`: Nueva funcionalidad
- `fix`: Bug fix
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan código)
- `refactor`: Refactorización
- `test`: Agregar o actualizar tests
- `chore`: Cambios en build process o herramientas

### Ejemplos:
```
feat(auth): add JWT authentication
fix(terminal): resolve command parsing bug
docs(readme): update installation instructions
```

## 🏗️ Estándares de Código

### PHP
- Seguir PSR-12
- Type hinting obligatorio
- Docblocks para funciones y clases
- Máxima complejidad ciclomática: 10

### JavaScript
- ES2026+ features
- CamelCase para variables y funciones
- PascalCase para clases
- JSDoc para documentación

### General
- Nombres descriptivos
- Funciones pequeñas y enfocadas
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple, Stupid)

## 🧪 Testing

- Escribe tests para nuevas funcionalidades
- Asegura que todos los tests pasen
- Mantén coverage > 80%

## 📖 Documentación

- Actualiza README para cambios importantes
- Agrega JSDoc/PHPDoc para nuevas funciones
- Documenta cambios breaking en CHANGELOG

## 🔒 Seguridad

- Nunca commitees credenciales
- Usa variables de entorno
- Reporta vulnerabilidades de forma privada
- Sigue OWASP guidelines

## 🤝 Proceso de Review

1. Automated checks deben pasar
2. Al menos 1 approval requerido
3. Resuelve todos los comentarios
4. Mantén el PR actualizado

## 📌 Issues

Usa etiquetas:
- `bug`: Reporte de bug
- `enhancement`: Sugerencia de mejora
- `question`: Pregunta
- `documentation`: Mejora docs
- `good first issue`: Bueno para principiantes

## 🎯 Prioridades

1. **Critical**: Bugs que rompen el sistema
2. **High**: Features importantes o bugs mayores
3. **Medium**: Mejoras y bugs menores
4. **Low**: Nice-to-have features

## 📞 Contacto

Para preguntas o discusiones:
- Abre un issue para bugs/features
- Usa discussions para preguntas generales
- Email: maintainer@example.com

---

¡Nuevas contribuciones son siempre bienvenidas!
