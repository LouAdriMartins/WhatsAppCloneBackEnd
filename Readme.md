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

## Ejemplo de .env usado:
MONGO_DB_CONNECTION_STRING=mongodb+srv://WhatsAppClone:xxxxxxxxxxx@cluster0.fvdue4s.mongodb.net/WhatsAppClone
JWT_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
URL_API=https://whatsappclonebackend-4hmx.onrender.com
URL_FRONT=https://whatsappclonefrontend.onrender.com
CLOUDINARY_NAME=xxxxxxxxxxx
CLOUDINARY_KEY=xxxxxxxxxxx
CLOUDINARY_SECRET=xxxxxxxxxxx
BREVO_API_KEY=xxxxxxxxxxx
BREVO_EMAIL=lourdesadrianamartins0@gmail.com

El backend está desplegado en Render, y esta plataforma no permite conexiones SMTP salientes. Debido a esto, los correos enviados mediante Nodemailer + Gmail SMTP no llegaban, ya que:
- Render bloquea el protocolo SMTP por seguridad.
- Gmail también bloquea peticiones no seguras o provenientes de servidores desconocidos.

Para solucionar este problema, implementé Brevo como proveedor de correo, utilizando su API HTTP, que funciona correctamente en Render ya que no depende de SMTP. Esto implicó reemplazar el transporte de nodemailer por la librería oficial de Brevo: "@getbrevo/brevo"

## Conclusión

Este backend constituye una API completa y funcional para un clon realista de WhatsApp Web. Incluye autenticación segura, gestión de contactos, mensajes, chats, fotos de perfil y comunicación en tiempo real mediante eventos sincronizados.

La arquitectura modular permite: alta escalabilidad mantenimiento sencillo posibilidad de agregar grupos, multimedia o llamadas con WebRTC en el futuro.

Algunas de las rutas fueron probadas haciendo uso de postman, el archivo se puede encontrar en: API_WS.postman_collection.json