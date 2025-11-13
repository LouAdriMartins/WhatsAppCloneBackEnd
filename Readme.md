# Final – Backend

Profs: Matías Giménez – Lautaro Miceli
Estudiante: Lourdes Adriana Martins Rodríguez

# Desafío de creación de WhatsApp Clone – Documentación del Backend

Este proyecto consiste en el desarrollo del backend para un clon funcional de WhatsApp Web utilizando Node.js, Express, MongoDB, JWT y Socket.IO.

El foco se puso en construir una API robusta, modular, limpia y fácil de extender, siguiendo buenas prácticas de arquitectura, validación, seguridad y comunicación en tiempo real.

## Tecnologías utilizadas
- Node.js + Express
Base del servidor y routing HTTP.

- Middlewares 
Para autenticación, manejo de errores, validaciones y subida de archivos.

- MongoDB + Mongoose
Base de datos para almacenar las tablas desarrolladas.

- JSON Web Tokens (JWT)
Empleado para: Login seguro, persistencia de sesión, autorización en todos los endpoints privados, protección del sistema contra accesos no autorizados.

- Socket.IO
Proporciona comunicación en tiempo real para: Envío de mensajes instantáneo, estados de mensaje (sent / delivered / read), eliminar mensajes (soft delete + hard delete), notificaciones de nuevos chats, sincronización entre usuarios conectados

- Bcrypt
Para hashear contraseñas con salt aleatorio.

- Multer
Usado para subir y almacenar fotos de perfil del usuario.

- Dotenv
Para manejo seguro de variables de entorno (PORT, MONGO_URI, JWT_SECRET).

## Conclusión

Este backend constituye una API completa y funcional para un clon realista de WhatsApp Web. Incluye autenticación segura, gestión de contactos, mensajes, chats, fotos de perfil y comunicación en tiempo real mediante eventos sincronizados.

La arquitectura modular permite: alta escalabilidad mantenimiento sencillo posibilidad de agregar grupos, multimedia o llamadas con WebRTC en el futuro.

Algunas de las rutas fueron probadas haciendo uso de postman, el archivo se puede encontrar en: API_WS.postman_collection.json