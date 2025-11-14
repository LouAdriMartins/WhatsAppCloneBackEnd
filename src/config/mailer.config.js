import nodemailer from 'nodemailer'
import ENVIRONMENT from './environment.config.js'

// const transporter = nodemailer.createTransport(
//     {
//         service: 'gmail',
//         auth: {
//             user: ENVIRONMENT.GMAIL_USER,
//             pass: ENVIRONMENT.GMAIL_PASSWORD
//         }
//     }
// )
// export default transporter

const transporter = nodemailer.createTransport(
    {
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
            user: ENVIRONMENT.BREVO_EMAIL,
            pass: ENVIRONMENT.BREVO_API_KEY
        }
    }
)
export default transporter