import express from "express"
import cors from "cors"
import http from "http"                  
import { initSocket } from "./socket.js" 

import connectMongoDB from "./config/mongoDB.config.js"
import ENVIRONMENT from "./config/environment.config.js"
import auth_router from "./routes/auth.route.js"
import contact_router from "./routes/contact.route.js"
import user_router from "./routes/user.route.js"
import chat_router from "./routes/chat.route.js"
import message_router from "./routes/message.route.js"
import authMiddleware from "./middleware/auth.middleware.js"

// ================== CONFIGURACIÓN INICIAL ==================
connectMongoDB()
const app = express()

// ================== MIDDLEWARES GLOBALES ==================
app.use(
    cors({
        origin: ENVIRONMENT.URL_FRONT,
        credentials: true,
    })
)

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true")
    next()
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ================== RUTAS PÚBLICAS ==================
app.get("/api/status", (req, res) => {
    res.send({ ok: true, message: "Esto está funcionando" })
})

app.get("/api/ping", (req, res) => {
    res.send({ ok: true, message: "pong" })
})

// Rutas de autenticación
app.use("/api/auth", auth_router)

// ================== RUTAS PROTEGIDAS ==================
app.get("/ruta-protegida", authMiddleware, (req, res) => {
    console.log(req.user)
    res.send({ ok: true })
})


app.use((req, res, next) => {
    console.log(req.method, req.originalUrl)
    next()
})

// Rutas de usuarios
app.use("/api/users", user_router)

// Rutas de contactos
app.use("/api/contacts", contact_router)

// Rutas de chats
app.use("/api/chats", chat_router)

// Rutas de mensajes
app.use("/api/messages", message_router)


// ================== SERVIDOR HTTP + SOCKET ==================
const server = http.createServer(app)  // servidor base
initSocket(server)                     // inicializa socket.io sobre ese server


// ================== SERVIDOR ESCUCHANDO ==================
server.listen(ENVIRONMENT.PORT, () => {
    console.log(`Servidor corriendo en ${ENVIRONMENT.URL_API}`)
})