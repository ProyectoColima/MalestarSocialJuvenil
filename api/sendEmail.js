const nodemailer = require('nodemailer');

export default async function (req, res) {
  if (req.method === 'POST') {
    const { nombre, email, mensaje } = req.body;

    // Configuración del transporte de correo
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Cambia esto si usas otro servicio de correo
      auth: {
        user: process.env.EMAIL_USER, // Email que enviará los correos
        pass: process.env.EMAIL_PASS, // Contraseña del email
      },
    });

    try {
      await transporter.sendMail({
        from: email,
        to: process.env.EMAIL_TO, // Dirección a la que se enviará el correo
        subject: `Nuevo mensaje de contacto de ${nombre}`,
        text: mensaje,
        html: `<p><strong>Nombre:</strong> ${nombre}</p>
               <p><strong>Correo:</strong> ${email}</p>
               <p><strong>Mensaje:</strong> ${mensaje}</p>`,
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Error al enviar el correo' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Método no permitido' });
  }
}
