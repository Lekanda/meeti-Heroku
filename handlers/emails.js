const nodemailer = require('nodemailer');
const emailConfig = require('../config/emails');
// FILE SISTEM(fs) = Para acceder a los archivos y sus contenidos.Ya existe en NODEJS
const fs = require('fs');
const util = require('util');// Es parte de NODEJS
const ejs = require('ejs');

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass
    }
});

exports.enviarEmail = async(opciones) => {
    console.log(opciones);
    
    // leer el archivo para el mail
    const archivo = __dirname + `/../views/emails/${opciones.archivo}.ejs`;

    // compilarlo
    const compilado = ejs.compile(fs.readFileSync(archivo, 'utf8'));

    // crear el HTML
    const html = compilado({ url: opciones.url });

    // configurar las opciones del email
    const opcionesEmail = {
        from: 'Meeti <no-reply@meeti.com>',
        to: opciones.usuario.email,
        subject: opciones.subject,
        html
    }

    // Enviar el eMail
    const sendEmail = util.promisify(transport.sendMail, transport);
    return sendEmail.call(transport, opcionesEmail);
}
