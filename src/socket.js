import { Server } from "socket.io"

let io = null

export function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    })

    io.on("connection", (socket) => {
        console.log("Usuario conectado:", socket.id)
        // El front envía el userId en la conexión
        const userId = socket.handshake.query.userId
        if (userId) {
            socket.userId = userId
            console.log("Usuario autenticado en socket:", userId)
        }

        /* ============================================================
            Unirse a la room de un chat
        ============================================================ */
        socket.on("join-room", (chatId) => {
            if (!chatId) return
            socket.join(chatId)
            console.log(`Usuario ${socket.userId} entró al chat/room: ${chatId}`)
        })

        /* ============================================================
            Usuario desconectado
        ============================================================ */
        socket.on("disconnect", () => {
            console.log("Usuario desconectado:", socket.id)
        })
    })

    console.log("Socket.io inicializado correctamente")
}

export function getIO() {
    if (!io) throw new Error("Socket.io no inicializado")
    return io
}
