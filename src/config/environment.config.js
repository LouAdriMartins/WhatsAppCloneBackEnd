import dotenv from 'dotenv'
//Carga todas las variables de entorno dentro de process.env
dotenv.config()


//Creamos una constante de facil acceso a mis variables de entorno
const ENVIRONMENT = {
    MONGO_DB_CONNECTION_STRING: process.env.MONGO_DB_CONNECTION_STRING,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    GMAIL_USER: process.env.GMAIL_USER,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    URL_API: process.env.URL_API,
    PORT: process.env.PORT,
    URL_FRONT: process.env.URL_FRONT,
    BREVO_EMAIL: process.env.BREVO_EMAIL,
    BREVO_API_KEY: process.env.BREVO_API_KEY
}

export default ENVIRONMENT