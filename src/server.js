import express from "express"
import cors from "cors"
import connectMongoDB from "./config/mongoDB.config.js"
import ENVIRONMENT from "./config/environment.config.js"
import auth_router from "./routes/auth.route.js"
import contact_router from "./routes/contact.route.js"
import user_router from "./routes/user.route.js"
import workspace_router from "./routes/workspace.route.js"
import authMiddleware from "./middleware/auth.middleware.js"

// ================== CONFIGURACIÓN INICIAL ==================
connectMongoDB()

const app = express()

// ================== MIDDLEWARES GLOBALES ==================
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ================== RUTAS PÚBLICAS ==================
app.get("/api/status", (req, res) => {
    res.send({ ok: true, message: "Esto está funcionando" })
})

app.get("/api/ping", (req, res) => {
    res.send({ ok: true, message: "pong" })
})

// Rutas de autenticación (registro/login/verificación)
app.use("/api/auth", auth_router)

// ================== RUTAS PROTEGIDAS ==================
app.get("/ruta-protegida", authMiddleware, (req, res) => {
    console.log(req.user)
    res.send({ ok: true })
})

// Rutas de usuarios
app.use("/api/users", user_router)

// Rutas de contactos
app.use("/api/contacts", contact_router)

// Rutas de workspaces
app.use("/api/workspaces", workspace_router)

// ================== SERVIDOR ==================
app.listen(ENVIRONMENT.PORT, () => {
    console.log(`Servidor corriendo en ${ENVIRONMENT.URL_API}`)
})
