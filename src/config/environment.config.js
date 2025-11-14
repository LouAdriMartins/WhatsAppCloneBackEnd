import dotenv from 'dotenv'
//Carga todas las variables de entorno dentro de process.env
dotenv.config()


//Creamos una constante de facil acceso a mis variables de entorno
const ENVIRONMENT = {
    PORT: process.env.PORT,
    MONGO_DB_CONNECTION_STRING: process.env.MONGO_DB_CONNECTION_STRING,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    URL_API: process.env.URL_API,
    URL_FRONT: process.env.URL_FRONT,
    BREVO_USER: process.env.BREVO_USER,
    BREVO_EMAIL: process.env.BREVO_EMAIL,
    BREVO_SMTP_KEY: process.env.BREVO_SMTP_KEY
}

export default ENVIRONMENT